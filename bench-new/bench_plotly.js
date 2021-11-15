const BENCHMARK_IMPLEMENTATION = (() => {
  let plotData;

  const beforeStart = () => {
    return new Promise((resolve, reject) => {
      const libScript = document.createElement("script");
      libScript.onload = () => resolve();
      libScript.src = "lib/plotly-2.4.2.min.js";
      document.body.append(libScript);
    });
  };

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      plotData = [
        {
          z: initialData,
          type: "surface",
        },
      ];

      const layout = {
        autosize: true,
        scene: {
          aspectmode: "manual",
          zaxis: {
            range: BENCHMARK_CONFIG.yAxisInterval,
          },
        },
      };
      Plotly.newPlot("chart", plotData, layout);

      if (!BENCHMARK_CONFIG.ticksEnabled) {
        // TODO IMMEDIATE: How to hide ticks ?
      }

      requestAnimationFrame(resolve);
    });
  };

  const appendData = (data) => {
    for (let i = 0; i < data.length; i += 1) {
      plotData[0]["z"].push(data[i]);
    }
    while (plotData[0]["z"].length > BENCHMARK_CONFIG.sampleHistory) {
      plotData[0]["z"].shift();
    }

    Plotly.redraw("chart");
  };

  const refreshData = (data) => {
    plotData[0].z = data
    Plotly.redraw("chart");
  }

  return {
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
