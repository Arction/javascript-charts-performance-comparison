const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise((resolve, reject) => {
      const libScript = document.createElement("script");
      libScript.src = "https://cdn.anychart.com/releases/8.9.0/js/anychart-bundle.min.js";
      document.body.append(libScript);

      libScript.onload = () => {
        anychart.onDocumentReady(resolve)
      }
    });
  };

  let totalDataPoints = 0
  let existingDataPoints = 0
  let chart;
  let series;

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData.length
      existingDataPoints = totalDataPoints

      table = anychart.data.table();
      chart = anychart.stock();

      // rework texts to show point index instead of dateTime
      chart.scroller().xAxis().labels().format('{%tickValue}');
      chart.scroller().xAxis().minorLabels().format('{%tickValue}');
      chart.plot(0).xAxis().labels().format('{%tickValue}');
      chart.plot(0).xAxis().minorLabels().format('{%tickValue}');
      chart.plot(0).crosshair().xLabel().format('{%tickValue}');
      chart.tooltip().titleFormat('{%x}');

      // create series
      series = new Array(BENCHMARK_CONFIG.channelsCount)
        .fill(0)
        .map((_, iChannel) => {
          const mapping = table.mapAs();
          mapping.addField('value', iChannel + 1);
          const nSeries = chart.plot(0).line(mapping);
          return nSeries;
        });

      table.addData(initialData, false)
      
      if (!BENCHMARK_CONFIG.ticksEnabled) {
        // TODO IMMEDIATE: How to hide ticks ?
      }

      chart.container('chart').draw();
      requestAnimationFrame(resolve);
    });
  };

  const appendData = (data) => {
    return new Promise((resolve, reject) => {
      newDataPointsCount = data.length
      totalDataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount

      table.addData(data, false)
      
      // Drop out of range data points to keep application running forever (this is a must for real-time data monitoring use cases!)
      if (BENCHMARK_CONFIG.mode === 'append') {
        const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
        const deleteDataPointsCount = (existingDataPoints) - keepDataPointsCount
        if (deleteDataPointsCount > 0) {
          for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
            if (deleteDataPointsCount === 1) {
              // Shift is faster than splice
            } else {
            }
          }
          existingDataPoints -= deleteDataPointsCount
        }

        // TODO IMMEDIATE: How to set X axis view ???
        // chart.xScale().minimum = totalDataPoints - BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
        
      }

      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      // Based on https://github.com/AnyChart/AnyChart-AngularJS-v1.x/issues/1
      chart.plot(0).removeAllSeries()
      series = new Array(BENCHMARK_CONFIG.channelsCount)
        .fill(0)
        .map((_, iChannel) => {
          const mapping = table.mapAs();
          mapping.addField('value', iChannel + 1);
          const nSeries = chart.plot(0).line(mapping);
          return nSeries;
        });

      table.addData(data, false)

      requestAnimationFrame(resolve)
    })
  }

  return {
    dataFormat: 'xyyy-array',
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
