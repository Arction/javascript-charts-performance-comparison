// Common JS script that operates the performance benchmark for ALL test targets.

// Same code for all chart libraries.
console.log(BENCHMARK_CONFIG);
const wait = document.getElementById("wait");

(async () => {
  wait.textContent = "Fetching data.json ...";
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const {srcData, dataSet2} = await fetch(BENCHMARK_CONFIG.dataSource)
    .then(r => r.json())
    .then(data => {
      if (window.Test.format === 'xy-object-array') {
        const srcData = new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iCh) => 
            data.map((ySrc, iDp) => ({
              x: iDp,
              y: iCh + ySrc
            }))
          )
        const dataSet2 = new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iCh) => 
            data.map((ySrc, iDp) => ({
              x: iDp,
              y: iCh + ySrc + Math.random() * 0.2
            }))
          )
        return {srcData, dataSet2}
      } else if (window.Test.format === 'y-array') {
        const srcData = new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iCh) => 
            data.map((ySrc, iDp) => (
              iCh + ySrc
            ))
          )
        const dataSet2 = new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iCh) => 
            data.map((ySrc, iDp) => (
              iCh + ySrc + Math.random() * 0.2
            ))
          )
        return {srcData, dataSet2}
      } else {
        throw new Error('unknown format ' +window.Test.format)
      }
    })

  let iDataPoint = 0;
  const addNDataPoints = (n) => {
    const dataPoints = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_) => []);
    if (window.Test.format === 'xy-object-array') {
      for (let iNewDataPoint = 0; iNewDataPoint < n; iNewDataPoint += 1) {
        const iDataPointSource = iDataPoint % srcData[0].length;
        for (let iCh = 0; iCh < srcData.length; iCh += 1) {
          const y = srcData[iCh][iDataPointSource].y;
          dataPoints[iCh][iNewDataPoint] = { x: iDataPoint, y };
        }
        iDataPoint += 1;
      }
    } else if (window.Test.format === 'y-array') {
      for (let iNewDataPoint = 0; iNewDataPoint < n; iNewDataPoint += 1) {
        const iDataPointSource = iDataPoint % srcData[0].length;
        for (let iCh = 0; iCh < srcData.length; iCh += 1) {
          const y = srcData[iCh][iDataPointSource];
          dataPoints[iCh][iNewDataPoint] = y;
        }
        iDataPoint += 1;
      }
    } else {
      throw new Error('unidentified format ' + window.Test.format)
    }
    window.Test.appendData(dataPoints)
  };

  wait.textContent = "Waiting for chart ...";
  await new Promise((resolve) => requestAnimationFrame(resolve));
  console.log(window.Test);

  wait.textContent = "Rendering initial data ...";
  await new Promise((resolve) => requestAnimationFrame(resolve));

  let tStart = Date.now();
  await window.Test.createChart();
  addNDataPoints(BENCHMARK_CONFIG.timeDomainInterval)
  
  wait.textContent = "";

  if (BENCHMARK_CONFIG.refreshData) {
    // Keep refreshing displayed data set every frame.
    let iDataset = 0;
    const refresh = () => {
      iDataset = (iDataset + 1) % 2;
      window.Test.setData(iDataset === 0 ? srcData : dataSet2);
      requestAnimationFrame(refresh);
    };
    requestAnimationFrame(refresh);
  }

  if (BENCHMARK_CONFIG.scrollData) {
    let tPrev = performance.now();
    let newDataModulus = 0;
    const streamData = () => {
      const tNow = performance.now();
      const tDelta = tNow - tPrev;
      let newDataPointsCount =
        BENCHMARK_CONFIG.channelDataPointsPerSecond * (tDelta / 1000) +
        newDataModulus;
      newDataModulus = newDataPointsCount % 1;
      newDataPointsCount = Math.floor(newDataPointsCount);
      addNDataPoints(newDataPointsCount);
      tPrev = tNow;
      // if (!testStopped) {
        requestAnimationFrame(streamData);
      // }
    };
    streamData();
  }

  requestAnimationFrame(() => {
    const tAfter = Date.now();
    console.log(`initial render`, (tAfter - tStart).toFixed(1), "ms");

    setTimeout(() => {
      tStart = Date.now();
      let frames = 0;
      let fps;
      const recordFrame = () => {
        frames++;
        const tNow = Date.now();
        fps = 1000 / ((tNow - tStart) / frames);
        requestAnimationFrame(recordFrame);
      };
      requestAnimationFrame(recordFrame);
      setInterval(() => console.log(`FPS: ${fps.toFixed(1)}`), 1000);
    }, 2000);
  });
})();
