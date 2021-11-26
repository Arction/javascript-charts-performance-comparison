const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise((resolve, reject) => {
      const libScript = document.createElement("script");
      libScript.onload = () => resolve();
      libScript.src = "https://canvasjs.com/assets/script/canvasjs.min.js";
      document.body.append(libScript);
    });
  };

  let totalDataPoints = 0
  let existingDataPoints = 0
  let chart

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData[0].length
      existingDataPoints = totalDataPoints
      data = initialData
      const plotData = new Array(BENCHMARK_CONFIG.channelsCount)
        .fill(0)
        .map((_, iChannel) => ({
          type: 'line',
          lineThickness: BENCHMARK_CONFIG.strokeThickness,
          dataPoints: initialData[iChannel],
        }));
      var options = {
        zoomEnabled: false,
        animationEnabled: false,
        data: plotData,
      };
      chart = new CanvasJS.Chart('chart', options);
      chart.render();
      requestAnimationFrame(resolve);
    });
  };

  let tPreviousDataCleaning = 0
  const appendData = (newData, simulateHistory) => {
    return new Promise((resolve, reject) => {
      const tNow = window.performance.now()
      newDataPointsCount = newData[0].length
      totalDataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount

      const doDataCleaning = (BENCHMARK_CONFIG.mode === 'append' && tNow - tPreviousDataCleaning >= BENCHMARK_CONFIG.appendMinimumDataCleaningIntervalSeconds * 1000) || simulateHistory
      tPreviousDataCleaning = doDataCleaning ? tNow : tPreviousDataCleaning

      const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
      const deleteDataPointsCount = doDataCleaning ? Math.max((existingDataPoints) - keepDataPointsCount, 0) : 0

      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        for (let i = 0; i < newDataPointsCount; i += 1) {
          data[iCh].push(newData[iCh][i])
        }
        if (BENCHMARK_CONFIG.mode === 'append') {
          for (let i = 0; i < deleteDataPointsCount; i += 1) {
            data[iCh].shift()
          }
        }
      }
      existingDataPoints -= deleteDataPointsCount
      chart.render();

      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        chart.options.data[iCh].dataPoints = data[iCh]
      }

      chart.render();
      requestAnimationFrame(resolve)
    })
  }

  return {
    dataFormat: 'xy-object-array',
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
