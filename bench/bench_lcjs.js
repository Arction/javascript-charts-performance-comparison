const BENCHMARK_IMPLEMENTATION = (() => {
  let chart, axes, seriesList;

  const beforeStart = () => {
    return new Promise((resolve, reject) => {
      const libScript = document.createElement("script");
      libScript.onload = () => resolve();
      libScript.src = "lib/lcjs.iife.js";
      document.body.append(libScript);
    });
  };

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      const { lightningChart, emptyFill, AxisTickStrategies, AxisScrollStrategies } = lcjs;

      chart = lightningChart().ChartXY({
        container: document.getElementById("chart"),
        disableAnimations: true,
      })
        .setTitleFillStyle(emptyFill);
        
      chart.getDefaultAxisY().setScrollStrategy(AxisScrollStrategies.expansion).setInterval(0, 1)

      axes = [
        chart.getDefaultAxisX(),
        chart.getDefaultAxisY()
      ];

      seriesList = new Array(BENCHMARK_CONFIG.channelsCount).fill(0).map((_, iChannel) => {
        const lineSeries = chart
          .addLineSeries({
            dataPattern: {
              pattern: 'ProgressiveX',
              regularProgressiveStep: true,
            }
          })
          .setName(`Channel #${iChannel + 1}`)
          .setDataCleaning({minDataPointCount: 1})
          .setStrokeStyle(stroke => stroke.setThickness(BENCHMARK_CONFIG.strokeThickness))
          .add(initialData[iChannel])
        return lineSeries
      });

      if (!BENCHMARK_CONFIG.ticksEnabled) {
        axes.forEach((axis) => axis.setTickStrategy(AxisTickStrategies.Empty));
      }

      if (BENCHMARK_CONFIG.mode === "append") {
        chart.getDefaultAxisX().setScrollStrategy(AxisScrollStrategies.progressive).setInterval(-BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond, 0)
      } else {
        chart.getDefaultAxisX().setInterval(0, BENCHMARK_CONFIG.channelDataPointsCount, false, true)
      }

      requestAnimationFrame(resolve);
    });
  };

  const appendData = (data) => {
    return new Promise((resolve, reject) => {
      seriesList.forEach((series, iChannel) => series.add(data[iChannel]))
      requestAnimationFrame(resolve)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      seriesList.forEach((series, iChannel) => series.clear().add(data[iChannel]))
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
