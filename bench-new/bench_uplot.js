const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise(async (resolve, reject) => {
      const stylesheets = [
        "lib/uPlot.min.css",
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
        "lib/uPlot.iife.min.js",
      ]
      for (const script of scripts) {
        const libScript = document.createElement('script')
        libScript.src = script
        document.body.append(libScript)
        await new Promise((resolve, reject) => {
          libScript.onload = resolve
        })
      }

      if (! ('uPlot' in window)) {
        // Library has to be manually downloaded and put into `lib` folder.
        alert(`Library not found, refer to README Required dependencies on required files for this library.`)
      }
      resolve()
    });
  };

  let totalDataPoints = 0
  let existingDataPoints = 0
  let data
  let uplot

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData.length
      existingDataPoints = totalDataPoints
      data = initialData
      
      const opts = {
        width: window.innerWidth,
        height: window.innerHeight,
        series: [
          {},
          ...new Array(BENCHMARK_CONFIG.channelsCount)
            .fill(0)
            .map((_, iChannel) => ({
              stroke: 'red',
              width: BENCHMARK_CONFIG.strokeThickness,
            })),
        ],
        scales: {
          x: {
            // Numeric axis values instead of UNIX timestamp (default).
            time: false,
          },
        },
        legend: {
          show: false,
        },
      };
      console.log(initialData)
      uplot = new uPlot(opts, initialData, document.getElementById('chart'));

      if (!BENCHMARK_CONFIG.ticksEnabled) {
        // TODO IMMEDIATE: How to hide ticks ?
      }

      requestAnimationFrame(resolve)
    });
  };

  const appendData = (newData) => {
    return new Promise((resolve, reject) => {
      const newDataPointsCount = newData[0].length
      totalDataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount

      const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
      const deleteDataPointsCount = Math.max((existingDataPoints) - keepDataPointsCount, 0)

      for (let i = 0; i < BENCHMARK_CONFIG.channelsCount + 1; i += 1) {
        for (let i2 = 0; i2 < newDataPointsCount; i2 += 1) {
          data[i].push(newData[i][i2])
        }
        for (let i2 = 0; i2 < deleteDataPointsCount; i2 += 1) {
          data[i].shift()
        }
      }
    
      existingDataPoints -= deleteDataPointsCount
      uplot.setData(data);

      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      
      uplot.setData(data)

      requestAnimationFrame(resolve)
    })
  }

  return {
    dataFormat: 'individual-xyyy-arrays',
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
