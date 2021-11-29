requestAnimationFrame(async () => {
  console.log("start benchmark");
  console.log(BENCHMARK_CONFIG);

  const promiseTestDataSets = generateTestDataSets()

  const promiseBenchmarkImplementation = new Promise((resolve, reject) => {
    const benchScriptName = `./bench_${BENCHMARK_CONFIG.library}.js`;
    const benchScript = document.createElement("script");
    benchScript.onload = resolve;
    benchScript.src = benchScriptName;
    document.body.append(benchScript);
  });

  const [testDataSets] = await Promise.all([
    promiseTestDataSets,
    promiseBenchmarkImplementation,
  ]);
  const testData1YValues = testDataSets[0]

  console.log("benchmark ready");
  console.log(BENCHMARK_IMPLEMENTATION);

  console.log("beforeStart");
  await BENCHMARK_IMPLEMENTATION.beforeStart();

  console.log("waiting couple frames ...");
  for (let i = 0; i < 50; i += 1) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  let iDataPoint = 0;
  const packNDataPoints = (n) => {
    const yValuesChannels = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map(_ => [])
    const len = testData1YValues.length
    for (let i = 0; i < n; i += 1) {
      const ySrc = testData1YValues[(iDataPoint + i) % len]
      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        const y = ySrc + iCh
        yValuesChannels[iCh].push(y)
      }
    }
    const packedData = getDataInFormat(yValuesChannels, iDataPoint, BENCHMARK_IMPLEMENTATION.dataFormat)
    iDataPoint += n
    return packedData
  };

  requestAnimationFrame(async () => {
    console.log("loadChart");
    let dLoadup = 0
    let iteration = 0
    let dataPoints = 0
    const initialDataPointsCount = BENCHMARK_CONFIG.mode === 'append' ? 0 : BENCHMARK_CONFIG.channelDataPointsCount
    console.log("\ttotal data points: " + (initialDataPointsCount * BENCHMARK_CONFIG.channelsCount))
    do {
      const addDataPointsCount = Math.min(BENCHMARK_CONFIG.maxChunkDataPoints / BENCHMARK_CONFIG.channelsCount, initialDataPointsCount - dataPoints)
      const data = packNDataPoints(addDataPointsCount)
      console.log(`\tchunk ${iteration + 1} ${addDataPointsCount} data points (per channel) load up sum: ${(dLoadup).toFixed(1)}ms`)
      const tStart = window.performance.now()
      if (iteration === 0) {
        await BENCHMARK_IMPLEMENTATION.loadChart(data);
      } else {
        await BENCHMARK_IMPLEMENTATION.appendData(data)
      }
      const dIteration = window.performance.now() - tStart
      dLoadup += dIteration
      dataPoints += addDataPointsCount
      iteration += 1
    } while (dataPoints < initialDataPointsCount)

    console.log(`\t${dLoadup.toFixed(1)}ms`);

    const initiateFPSMonitoring = () => {
      // Setup FPS monitoring.
      const fpsMonitoringDelay = 5 * 1000
      console.log('FPS monitoring will begin after ' + (fpsMonitoringDelay/1000).toFixed(1) + ' seconds')
      setTimeout(() => {
        console.log(`FPS monitoring start`)
        let fpsMonitoringStart = Date.now();
        let frames = 0;
        let fps;
        const recordFrame = () => {
          frames++;
          const tNow = Date.now();
          fps = 1000 / ((tNow - fpsMonitoringStart) / frames);
          if (tNow - fpsMonitoringStart >= 12000) {
            console.log(`FPS: ${fps.toFixed(1)}`)
            fpsMonitoringStart = Date.now()
            frames = 0
            fps = 0
          }
          requestAnimationFrame(recordFrame);
        };
        requestAnimationFrame(recordFrame);
      }, fpsMonitoringDelay);
    }

    if (BENCHMARK_CONFIG.mode === "append") {
      console.log(`appending history data ${BENCHMARK_CONFIG.appendHistorySeconds}s ...`)
      while (dataPoints < BENCHMARK_CONFIG.appendHistorySeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond) {
        const addDataPointsCount = Math.min(BENCHMARK_CONFIG.maxChunkDataPoints / BENCHMARK_CONFIG.channelsCount, BENCHMARK_CONFIG.appendHistorySeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond - dataPoints)
        console.log(`\t${(dataPoints+addDataPointsCount)} / ${BENCHMARK_CONFIG.appendHistorySeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond} data points`)
        BENCHMARK_IMPLEMENTATION.appendData(packNDataPoints(addDataPointsCount, testData1YValues), true);
        await new Promise(resolve => setTimeout(resolve, 1000))
        dataPoints += addDataPointsCount
      }

      initiateFPSMonitoring()
      let tPrev = window.performance.now();
      let newDataModulus = 0;
      const onEveryFrame = () => {
        const tNow = window.performance.now();
        const tDelta = tNow - tPrev;
        let newSamplesCountFloat =
          BENCHMARK_CONFIG.appendNewSamplesPerSecond * (tDelta / 1000) +
          newDataModulus;
        const newSamplesCount = Math.floor(newSamplesCountFloat);

        if (newSamplesCount > 0) {
          BENCHMARK_IMPLEMENTATION.appendData(packNDataPoints(newSamplesCount, testData1YValues));
          tPrev = tNow;
          newDataModulus = newSamplesCountFloat % 1;
        }

        requestAnimationFrame(onEveryFrame);
      };
      onEveryFrame();
    }

    if (BENCHMARK_CONFIG.mode === "refresh") {
      const formattedDataFrames = testDataSets.map(dataSetYValues => 
        getDataInFormat(
          new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_, iCh) => 
            new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) => 
            dataSetYValues[i % dataSetYValues.length] + iCh
            )
          ),
          0,
          BENCHMARK_IMPLEMENTATION.dataFormat
        )  
      )

      initiateFPSMonitoring()

      let tStart = window.performance.now()
      let tPrevDataSet = -1
      const onEveryFrame = () => {
        const tNow = window.performance.now()
        const tAnimation = tNow - tStart
        const iDataSet = Math.round( tAnimation / (1000 / BENCHMARK_CONFIG.refreshRate) ) % testDataSets.length
        if (tPrevDataSet !== iDataSet) {
          tPrevDataSet = iDataSet
          const dataSet = formattedDataFrames[iDataSet]
          BENCHMARK_IMPLEMENTATION.refreshData(dataSet)
        }
        requestAnimationFrame(onEveryFrame)
      }
      onEveryFrame()

      // let tPrev = window.performance.now()
      // let iDataSet = 0
      // const onEveryFrame = () => {
      //   const tNow = window.performance.now()
      //   const tDelta = tNow - tPrev
      //   if (tDelta >= 1000 / BENCHMARK_CONFIG.refreshRate) {
      //     iDataSet = (iDataSet + 1) % 2
      //     const dataSet = iDataSet === 0 ? dataSet1 : dataSet2
      //     BENCHMARK_IMPLEMENTATION.refreshData(dataSet)
      //     tPrev = tNow
      //   }
      //   requestAnimationFrame(onEveryFrame)
      // }
      // onEveryFrame()
    }
  });
});

const getDataInFormat = (
  srcYValuesChannels,
  xStart,
  dataFormat
) => {
  if (dataFormat === 'xy-object-array') {
    return srcYValuesChannels.map(
      chYValues => chYValues.map((y, i) => ({ x: xStart + i, y }))
    )
  } else if (dataFormat === 'y-array') {
    return srcYValuesChannels
  } else if (dataFormat === 'individual-xy-lists') {
    const formattedData = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_) => []);
    formattedData.forEach((channel, iCh) => {
      channel.push([], [])
      srcYValuesChannels[iCh].forEach((y, i) => {
        channel[0].push(xStart + i)
        channel[1].push(y)
      })
    })
    return formattedData
  } else if (dataFormat === 'xyyy-array') {
    const formattedData = []
    srcYValuesChannels[0].forEach((_, i) => {
      const sample = [xStart + i]
      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        sample.push(srcYValuesChannels[iCh][i])
      }
      formattedData.push(sample)
    })
    return formattedData
  } else if (dataFormat === 'xy-tuple-array') {
    return srcYValuesChannels.map(
      chYValues => chYValues.map((y, i) => ([xStart + i, y]))
    )
  } else if (dataFormat === 'individual-xyyy-arrays') {
    const formattedData = [
      new Array(srcYValuesChannels[0].length).fill(0).map((_, i) => xStart + i)
    ]
    for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
      formattedData.push(
        srcYValuesChannels[iCh]
      )
    }
    return formattedData
  } else {
    throw new Error('unidentified format ' + dataFormat)
  }
}

const generateTestDataSets = async () => {

  if (BENCHMARK_CONFIG.mode === 'static') {
    return [
      await fetch(BENCHMARK_CONFIG.dataSource)
        .then(r => r.json())
    ]
  } else if (BENCHMARK_CONFIG.mode === 'append') {
    return [
      await fetch(BENCHMARK_CONFIG.dataSource)
        .then(r => r.json())
    ]
  }
  // Refreshing mode
  const data = []
  const SAMPLE_COUNT = 150
  const SAMPLE_SIZE = BENCHMARK_CONFIG.channelDataPointsCount
  for (let i = 0; i < SAMPLE_COUNT; i += 1) {
    const sample = []
    const amplitude = Math.cos(i * 2 * Math.PI / SAMPLE_COUNT)
    for (let x = 0; x < SAMPLE_SIZE; x += 1) {
      let y = Math.cos(i * 2 * Math.PI / SAMPLE_COUNT + 5 * x * Math.PI / SAMPLE_SIZE) * amplitude + Math.sin(x * 7.0 * Math.PI / SAMPLE_SIZE)
      y += Math.random() * 0.02
      sample.push(y)
    }
    data.push(sample)
  }
  return data
}
