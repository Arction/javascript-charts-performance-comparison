const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise(async (resolve, reject) => {
      const scripts = [
        "https://code.highcharts.com/highcharts.js",
        "https://code.highcharts.com/modules/boost.js",
        "https://code.highcharts.com/modules/exporting.js",
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
  let options;

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData[0].length
      existingDataPoints = totalDataPoints
      
      Highcharts.setOptions({
        plotOptions: {
          line: {
            linecap: 'square',
            marker: {
              enabled: false,
            },
          },
          series: {
            animation: false,
          },
        },
      });

      options = {
        title: {
          text: '',
        },
        boost: {
          
        },
        xAxis: {
          min: 0,
          max: BENCHMARK_CONFIG.channelDataPointsCount
        },
        series: new Array(BENCHMARK_CONFIG.channelsCount)
          .fill(0)
          .map((_, iChannel) => ({
            data: initialData[iChannel],
            lineWidth: BENCHMARK_CONFIG.strokeThickness,
            boostThreshold: 1,
          })),
      }

      chart = Highcharts.chart('chart', options);

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

      // Drop out of range data points to keep application running forever (this is a must for real-time data monitoring use cases!)
      if (BENCHMARK_CONFIG.mode === 'append') {
        const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond

        // Based on https://www.highcharts.com/forum/viewtopic.php?t=41141 (best way to delete old points)
        for (let i = 0; i < newDataPointsCount; i += 1) {
          const shift = existingDataPoints > keepDataPointsCount
          for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
            chart.series[iCh].addPoint(data[iCh][i], false, shift)
          }
          if (! shift) {
            existingDataPoints += 1
          }
        }
      } else {
        // Just add new points.
        chart.series.forEach((series, iCh) => {
          for (let i = 0; i < newDataPointsCount; i += 1) {
            series.addPoint(data[iCh][i], false)
          }
        })
      }

      chart.xAxis[0].update({
        min: totalDataPoints - BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond,
        max: totalDataPoints,
      });
      

      chart.redraw();
      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      chart.series.forEach((series, iCh) => {
        series.setData(data[iCh])
      })

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
