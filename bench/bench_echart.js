const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise(async (resolve, reject) => {
      const stylesheets = []
      for (const stylesheet of stylesheets) {
        const domStylesheet = document.createElement('link')
        domStylesheet.rel = 'stylesheet'
        domStylesheet.type = 'text/css'
        domStylesheet.href = stylesheet
        document.body.append(domStylesheet)
        await new Promise((resolve, reject) => {
          domStylesheet.onload = resolve
        })
      }
      const scripts = [
        "https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js",
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
  let chart
  let options
  
  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData[0].length
      existingDataPoints = totalDataPoints
      data = initialData

      const container = document.getElementById('chart');
      chart = echarts.init(container);
      options = {
        animation: false,
        title: {},
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'value',
        },
        series: new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iChannel) => ({
            name: `Channel #${iChannel}`,
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: { width: BENCHMARK_CONFIG.strokeThickness },
            emphasis: {
              lineStyle: { width: BENCHMARK_CONFIG.strokeThickness },
            },
            data: initialData[iChannel]
          })),
      };
      chart.setOption(options);

      if (!BENCHMARK_CONFIG.ticksEnabled) {
        // TODO IMMEDIATE: How to hide ticks ?
      }

      requestAnimationFrame(resolve)
    });
  };

  const appendData = (newData) => {
    return new Promise((resolve, reject) => {
      newDataPointsCount = newData[0].length
      totalDataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount

      const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
      const deleteDataPointsCount = Math.max((existingDataPoints) - keepDataPointsCount, 0)

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
      chart.setOption({
        series: new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_, iChannel) => ({
          data: data[iChannel]
        })),
        xAxis: {
          min: totalDataPoints - keepDataPointsCount,
          max: totalDataPoints
        }
      })

      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      
      chart.setOption({
        series: new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_, iChannel) => ({
          data: data[iChannel]
        }))
      })

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
