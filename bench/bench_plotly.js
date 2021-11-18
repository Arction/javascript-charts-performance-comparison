/**
 * NOTE: Plotly.JS isn't fully applicable to the test application.
 * Current issue is that the data doesn't actually scroll (X axis always displays same values),
 * this could be a serious deal breaker in a realistic real-time monitoring use case.
 * 
 * While the X axis could be scrolled programmatically, it wouldn't work because of how Plotly.JS data modification is handled.
 * In real-time monitoring, old data data points have to be dropped in order for the application to run forever. However, in case of Plotly.JS
 * this doesn't work because data points do not have X values. When old values are dropped, the other data points would shift back along the X axis.
 */

const BENCHMARK_IMPLEMENTATION = (() => {
  let plotData;

  const beforeStart = () => {
    return new Promise((resolve, reject) => {
      const libScript = document.createElement("script");
      libScript.onload = () => resolve();
      libScript.src = "https://cdn.plot.ly/plotly-latest.min.js";
      document.body.append(libScript);
    });
  };

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData[0].length
      existingDataPoints = totalDataPoints
      plotData = new Array(BENCHMARK_CONFIG.channelsCount)
        .fill(0)
        .map((_, iChannel) => ({
          y: initialData[iChannel],
          mode: 'lines',
          line: {
            width: BENCHMARK_CONFIG.strokeThickness,
          },
        }))

      Plotly.plot('chart', plotData, {
        xaxis: BENCHMARK_CONFIG.mode !== 'append' ? {
          range: [0, BENCHMARK_CONFIG.channelDataPointsCount]
        } : {
          autorange: true
        },
      });

      if (!BENCHMARK_CONFIG.ticksEnabled) {
        // TODO IMMEDIATE: How to hide ticks ?
      }

      requestAnimationFrame(resolve);
    });
  };

  let totalDataPoints = 0
  let existingDataPoints = 0
  const appendData = (data) => {
    return new Promise((resolve, reject) => {
      newDataPointsCount = data[0].length
      totalDataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount

      Plotly.extendTraces(
        'chart',
        {
          y: data,
        },
        new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iChannel) => iChannel)
      );

      // Drop out of range data points to keep application running forever (this is a must for real-time data monitoring use cases!)
      if (BENCHMARK_CONFIG.mode === 'append') {
        const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
        const deleteDataPointsCount = (existingDataPoints) - keepDataPointsCount
        if (deleteDataPointsCount > 0) {
          for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
            if (deleteDataPointsCount === 1) {
              // Shift is faster than splice
              plotData[iCh].y.shift()
            } else {
              plotData[iCh].y.splice(0, deleteDataPointsCount)
            }
          }
          existingDataPoints -= deleteDataPointsCount
        }
      }

      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < BENCHMARK_CONFIG.channelsCount; i += 1) {
        plotData[i].y = data[i]
      }
      Plotly.redraw('chart')

      requestAnimationFrame(resolve)
    })
  }

  return {
    dataFormat: 'y-array',
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
