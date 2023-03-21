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
        type: 'line',
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

  let tPreviousDataCleaning = 0
  const appendData = (newData) => {
    return new Promise((resolve, reject) => {
      const tNow = window.performance.now()
      newDataPointsCount = newData[0].length
      totalDataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount
      const doDataCleaning = (BENCHMARK_CONFIG.mode === 'append' && tNow - tPreviousDataCleaning >= BENCHMARK_CONFIG.appendMinimumDataCleaningIntervalSeconds * 1000) 
      tPreviousDataCleaning = doDataCleaning ? tNow : tPreviousDataCleaning

      if (! doDataCleaning) {
        // Can use append API
        for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
          zingchart.exec('chart', 'appendseriesvalues', {
            plotindex: iCh,
            values: newData[iCh]
          })
        }

        // also have to track total data manually for data cleaning during other frames.
        for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
          for (let i = 0; i < newDataPointsCount; i += 1) {
            data[iCh].push(newData[iCh][i])
          }
        }

      } else {
        // Append API can't be used for this frame, because data has to be dropped and ZingChart has no such API.
        const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
        const deleteDataPointsCount = Math.max((existingDataPoints) - keepDataPointsCount, 0)
        for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
          for (let i = 0; i < newDataPointsCount; i += 1) {
            data[iCh].push(newData[iCh][i])
          }
          if (BENCHMARK_CONFIG.mode === 'append') {
            data[iCh].splice(0, deleteDataPointsCount)
          }
        }
        existingDataPoints -= deleteDataPointsCount
  
        for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
          zingchart.exec('chart', 'setseriesvalues', {
            plotindex: iCh,
            values: data[iCh]
          })
        }
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
