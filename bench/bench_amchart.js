const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise(async (resolve, reject) => {
      const scripts = [
        "https://cdn.amcharts.com/lib/4/core.js",
        "https://cdn.amcharts.com/lib/4/charts.js",
        "https://cdn.amcharts.com/lib/4/themes/animated.js",
      ]
      for (const script of scripts) {
        const libScript = document.createElement('script')
        libScript.src = script
        document.body.append(libScript)
        await new Promise((resolve, reject) => {
          libScript.onload = resolve
        })
      }
      resolve()
    });
  };

  let chart;
  let series;
  let timeAxis;

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData[0].length
      existingDataPoints = totalDataPoints
      
      am4core.ready(function () {});
      chart = am4core.create('chart', am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0;
      chart.padding(0, 0, 0, 0);
      chart.zoomOutButton.disabled = true;

      if (!BENCHMARK_CONFIG.ticksEnabled) {
        // TODO IMMEDIATE: How to hide ticks ?
      }

      timeAxis = chart.xAxes.push(new am4charts.ValueAxis());

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.strictMinMax = true
      // NOTE: Actually this should be automatically calculated by the library to be fair to the performance comparison.
      // However, I can't seem to find how to accomplish that ...
      valueAxis.min = 0
      valueAxis.max = BENCHMARK_CONFIG.channelsCount

      series = new Array(BENCHMARK_CONFIG.channelsCount)
        .fill(0)
        .map((_, iChannel) => {
          var nSeries = chart.series.push(new am4charts.LineSeries());
          nSeries.dataFields.valueX = 'x';
          nSeries.dataFields.valueY = 'y';
          nSeries.addData(initialData[iChannel])
          return nSeries;
        });
        
      chart.events.on('ready', () => {
        resolve();
      });
    });
  };

  let totalDataPoints = 0
  let existingDataPoints = 0
  let tPreviousDataCleaning = 0
  const appendData = (data, simulateHistory) => {
    return new Promise((resolve, reject) => {
      const tNow = window.performance.now()
      newDataPointsCount = data[0].length
      totalDataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount

      const doDataCleaning = (BENCHMARK_CONFIG.mode === 'append' && tNow - tPreviousDataCleaning >= BENCHMARK_CONFIG.appendMinimumDataCleaningIntervalSeconds * 1000) || simulateHistory
      tPreviousDataCleaning = doDataCleaning ? tNow : tPreviousDataCleaning

      // Drop out of range data points to keep application running forever (this is a must for real-time data monitoring use cases!)
      if (BENCHMARK_CONFIG.mode === 'append') {
        // Add new points and drop old points.
        const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
        const deleteDataPointsCount = doDataCleaning ? Math.max((existingDataPoints) - keepDataPointsCount, 0) : 0
        series.forEach((series, iCh) => {
          series.addData(data[iCh], deleteDataPointsCount)
        })
        existingDataPoints -= deleteDataPointsCount

        timeAxis.scrictMinMax = true;
        timeAxis.min = totalDataPoints - BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond;
        timeAxis.max = totalDataPoints;

      } else {
        // Just add points
        series.forEach((series, iCh) => {
          series.addData(data[iCh])
        })
      }

      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      series.forEach((series, iCh) => {
        series.addData(data[iCh], totalDataPoints)
      })

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
