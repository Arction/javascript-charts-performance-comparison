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
    const packedDataPoints = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_) => []);
    if (BENCHMARK_IMPLEMENTATION.dataFormat === 'xy-object-array') {
      for (let iNewDataPoint = 0; iNewDataPoint < n; iNewDataPoint += 1) {
        const iDataPointSource = iDataPoint % testData1YValues.length;
        const ySrc = testData1YValues[iDataPointSource];
        for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
          const y = ySrc + iCh
          packedDataPoints[iCh][iNewDataPoint] = { x: iDataPoint, y };
        }
        iDataPoint += 1;
      }
    } else if (BENCHMARK_IMPLEMENTATION.dataFormat === 'y-array') {
      for (let iNewDataPoint = 0; iNewDataPoint < n; iNewDataPoint += 1) {
        const iDataPointSource = iDataPoint % testData1YValues.length;
        const ySrc = testData1YValues[iDataPointSource];
        for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
          const y = iCh + ySrc
          packedDataPoints[iCh][iNewDataPoint] = y;
        }
        iDataPoint += 1;
      }
    } else if (BENCHMARK_IMPLEMENTATION.dataFormat === 'individual-xy-lists') {
      packedDataPoints.forEach((channel, i) => {
        channel.push([], [])
      })
      for (let iNewDataPoint = 0; iNewDataPoint < n; iNewDataPoint += 1) {
        const iDataPointSource = iDataPoint % testData1YValues.length;
        const ySrc = testData1YValues[iDataPointSource];
        for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
          const y = iCh + ySrc
          packedDataPoints[iCh][0].push(iDataPoint)
          packedDataPoints[iCh][1].push(y)
        }
        iDataPoint += 1;
      }
    } else {
      throw new Error('unidentified format ' + BENCHMARK_IMPLEMENTATION.dataFormat)
    }

    return packedDataPoints
  };
  
  const initialDataPointsCount = BENCHMARK_CONFIG.mode === 'append' ? 0 : BENCHMARK_CONFIG.channelDataPointsCount
  const initialData = packNDataPoints(initialDataPointsCount, testData1YValues)

  requestAnimationFrame(async () => {
    console.log("loadChart");
    const tStart = window.performance.now();
    await BENCHMARK_IMPLEMENTATION.loadChart(initialData);
    const tLoadup = window.performance.now() - tStart;
    console.log(`\t${tLoadup.toFixed(1)}ms`);

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
      let dataPoints = initialDataPointsCount
      while (dataPoints < BENCHMARK_CONFIG.appendHistorySeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond) {
        const addDataPointsCount = Math.min(1000 * 1000, BENCHMARK_CONFIG.appendHistorySeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond)
        BENCHMARK_IMPLEMENTATION.appendData(packNDataPoints(addDataPointsCount, testData1YValues));
        await new Promise(resolve => setTimeout(resolve, 1000))
        dataPoints += addDataPointsCount
        console.log(`\t${dataPoints} data points`)
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
      const dataSet1 = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_, iCh) => 
        BENCHMARK_IMPLEMENTATION.dataFormat === 'individual-xy-lists' ?
        [
          new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) => i),
          new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) => {
            const ySrc = testData1YValues[i % testData1YValues.length]
            const y = iCh + ySrc
            return y
          })
        ]
        :
        new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) => {
          const ySrc = testData1YValues[i % testData1YValues.length]
          const y = iCh + ySrc
          if (BENCHMARK_IMPLEMENTATION.dataFormat === 'xy-object-array') {
            return { x: i, y }
          } else if (BENCHMARK_IMPLEMENTATION.dataFormat === 'y-object-array') {
            return y
          } else {
            throw new Error('unidentified data format ' + BENCHMARK_IMPLEMENTATION.dataFormat)
          }
        })
      )
      const dataSet2 = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_, iCh) => 
      BENCHMARK_IMPLEMENTATION.dataFormat === 'individual-xy-lists' ?
        [
          new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) => i),
          new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) => {
            const ySrc = testData1YValues[i % testData1YValues.length]
            const y = iCh + ySrc + Math.random() * 0.05
            return y
          })
        ]
        :
        new Array(BENCHMARK_CONFIG.channelDataPointsCount).fill(0).map((_, i) => {
          const ySrc = testData1YValues[i % testData1YValues.length]
          const y = iCh + ySrc + Math.random() * 0.05
          if (BENCHMARK_IMPLEMENTATION.dataFormat === 'xy-object-array') {
            return { x: i, y }
          } else if (BENCHMARK_IMPLEMENTATION.dataFormat === 'y-object-array') {
            return y
          } else {
            throw new Error('unidentified data format ' + BENCHMARK_IMPLEMENTATION.dataFormat)
          }
        })
      )
        
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
