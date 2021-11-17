const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise(async (resolve, reject) => {
      const scripts = [
        "https://cdn.zingchart.com/zingchart.min.js",
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

  let totalDataPoints = 0
  let existingDataPoints = 0
  let data
  
  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData[0].length
      existingDataPoints = totalDataPoints
      data = initialData
      
      const myConfig = {
        //chart styling
        type: 'line',
        //real-time feed
        // refresh: {
        //   type: 'feed',
        //   transport: 'js',
        //   url: 'realTimeFeed()',
        //   // NOTE: Min supported refresh interval = 50ms, which means max FPS = 20
        //   interval: 50,
        //   maxTicks: BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendHistorySeconds,
        //   resetTimeout: BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendHistorySeconds,
        //   adjustScale: true,
        //   preserveData: false,
        // },
        // 'scale-x': {
        //   'min-value': 0,
        //   'max-value': BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendHistorySeconds,
        // },
        plot: {
          lineWidth: BENCHMARK_CONFIG.strokeThickness,
          hoverState: {
            visible: false,
          },
          marker: {
            visible: false,
          },
        },
        series: new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iChannel) => ({
            'values': initialData[iChannel],
            'line-width': BENCHMARK_CONFIG.strokeThickness,
          })),
      };

      if (!BENCHMARK_CONFIG.ticksEnabled) {
        // TODO IMMEDIATE: How to hide ticks ?
      }

      zingchart.complete = () => {
        resolve();
      };

      zingchart.render({
        id: 'chart',
        data: myConfig,
        height: '100%',
        width: '100%',
      });

    });
  };

  const appendData = (newData) => {
    return new Promise((resolve, reject) => {
      newDataPointsCount = newData[0].length
      totalDataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount
      
      // NOTE: Zingchart has no API for dropping old data points.
      // For real-time monitoring, data has to be manipulated manually and append API can't be utilized.
      const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
      const deleteDataPointsCount = Math.max((existingDataPoints) - keepDataPointsCount, 0)
      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        for (let i = 0; i < newDataPointsCount; i += 1) {
          data[iCh].push(newData[iCh][i])
        }
        for (let i = 0; i < deleteDataPointsCount; i += 1) {
          data[iCh].shift()
        }
      }
      existingDataPoints -= deleteDataPointsCount

      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        zingchart.exec('chart', 'setseriesvalues', {
          plotindex: iCh,
          values: data[iCh]
        })
      }

      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      
      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        zingchart.exec('chart', 'setseriesvalues', {
          plotindex: iCh,
          values: data[iCh]
        })
      }

      requestAnimationFrame(resolve)
    })
  }

  return {
    dataFormat: 'xy-tuple-array',
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
