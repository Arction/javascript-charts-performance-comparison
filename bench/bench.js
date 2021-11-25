(async () => {
  console.log("start benchmark");
  console.log(BENCHMARK_CONFIG);

  const promiseTestData1 = fetch(BENCHMARK_CONFIG.dataSource)
    .then(r => r.json())

  const promiseBenchmarkImplementation = new Promise((resolve, reject) => {
    const benchScriptName = `./bench_${BENCHMARK_CONFIG.library}.js`;
    const benchScript = document.createElement("script");
    benchScript.onload = resolve;
    benchScript.src = benchScriptName;
    document.body.append(benchScript);
  });

  const [testData1YValues] = await Promise.all([
    promiseTestData1,
    promiseBenchmarkImplementation,
  ]);

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
          requestAnimationFrame(recordFrame);
        };
        requestAnimationFrame(recordFrame);
        setInterval(() => console.log(`FPS: ${fps.toFixed(1)}`), 5000);
        setInterval(() => {
          console.log(`Reset FPS counter`)
          fpsMonitoringStart = Date.now()
          frames = 0
          fps = 0
        }, 10000)
      }, fpsMonitoringDelay);
    }

    if (BENCHMARK_CONFIG.mode === "append") {
      console.log(`appending history data ${BENCHMARK_CONFIG.appendHistorySeconds}s ...`)
      while (dataPoints < BENCHMARK_CONFIG.appendHistorySeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond) {
        const addDataPointsCount = Math.min(BENCHMARK_CONFIG.maxChunkDataPoints / BENCHMARK_CONFIG.channelsCount, BENCHMARK_CONFIG.appendHistorySeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond - dataPoints)
        console.log(`\t${(dataPoints+addDataPointsCount)} / ${BENCHMARK_CONFIG.appendHistorySeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond} data points`)
        BENCHMARK_IMPLEMENTATION.appendData(packNDataPoints(addDataPointsCount, testData1YValues));
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
      const dataSet1YValues = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_, iCh) => 
        new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) =>
          testData1YValues[i % testData1YValues.length] + iCh
        )
      )
      const dataSet1 = getDataInFormat(dataSet1YValues, 0, BENCHMARK_IMPLEMENTATION.dataFormat)
      const dataSet2YValues = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_, iCh) => 
        new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) =>
          testData1YValues[i % testData1YValues.length] + iCh + Math.random() * 0.05
        )
      )
      const dataSet2 = getDataInFormat(dataSet2YValues, 0, BENCHMARK_IMPLEMENTATION.dataFormat)
      
      initiateFPSMonitoring()
      let tPrev = window.performance.now()
      let iDataSet = 0
      const onEveryFrame = () => {
        const tNow = window.performance.now()
        const tDelta = tNow - tPrev
        if (tDelta >= 1000 / BENCHMARK_CONFIG.refreshRate) {
          iDataSet = (iDataSet + 1) % 2
          const dataSet = iDataSet === 0 ? dataSet1 : dataSet2
          BENCHMARK_IMPLEMENTATION.refreshData(dataSet)
          tPrev = tNow
        }
        requestAnimationFrame(onEveryFrame)
      }
      onEveryFrame()
    }
  });
})();

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
