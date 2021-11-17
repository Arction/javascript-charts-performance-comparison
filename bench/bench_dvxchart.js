const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise(async (resolve, reject) => {
      const stylesheets = [
        "lib/dvxCharts.chart.min.css",
        "lib/dvxCharts.chart.min.css"
      ]
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
        "lib/dvxCharts.chart.min.js",
      ]
      for (const script of scripts) {
        const libScript = document.createElement('script')
        libScript.src = script
        document.body.append(libScript)
        await new Promise((resolve, reject) => {
          libScript.onload = resolve
        })
      }
      if (! ('dvxCharts' in window)) {
        // Library has to be manually downloaded and put into `lib` folder.
        alert(`Library not found, refer to README Required dependencies on required files for this library.`)
      }
      resolve()
    });
  };

  let totalDataPoints = 0
  let existingDataPoints = 0
  let data
  let chart
  let state
  
  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData[0].length
      existingDataPoints = totalDataPoints
      data = initialData
      
      state = {
        axes: [
          {
            type: 'linear',
            location: 'bottom',
            zoomEnabled: true,
          },
        ],
        series: new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iChannel) => ({
            title: `Channel #${iChannel + 1}`,
            type: 'line',
            data: data[iChannel],
            markers: null,
            class: 'mySeries',
          })),
      };
      chart = new dvxCharts.Chart(state);
      chart.write('chart');

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
        for (let i = 0; i < deleteDataPointsCount; i += 1) {
          data[iCh].shift()
        }
      }
      existingDataPoints -= deleteDataPointsCount
      chart.setState(state);

      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      state.series.forEach((series, iCh) => {
        series.data = data[iCh]
      })
      chart.setState(state)

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
