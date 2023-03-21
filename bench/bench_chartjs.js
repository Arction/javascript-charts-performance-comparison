const BENCHMARK_IMPLEMENTATION = (() => {
  const beforeStart = () => {
    return new Promise(async (resolve, reject) => {
      const stylesheets = [];
      for (const stylesheet of stylesheets) {
        const domStylesheet = document.createElement("link");
        domStylesheet.rel = "stylesheet";
        domStylesheet.type = "text/css";
        domStylesheet.href = stylesheet;
        document.body.append(domStylesheet);
        await new Promise((resolve, reject) => {
          domStylesheet.onload = resolve;
        });
      }
      const scripts = [
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.2.1/chart.umd.js",
      ];
      for (const script of scripts) {
        const libScript = document.createElement("script");
        libScript.src = script;
        document.body.append(libScript);
        await new Promise((resolve, reject) => {
          libScript.onload = resolve;
        });
      }
      resolve();
    });
  };

  let totalDataPoints = 0;
  let existingDataPoints = 0;
  let data;
  let chart;

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData[0].length;
      existingDataPoints = totalDataPoints;
      data = initialData;

      const container = document.getElementById("chart");
      const canvas = document.createElement("canvas");
      container.append(canvas);
      chart = new Chart(canvas, {
        data: {
          datasets: initialData.map((xyPoints) => ({
            data: xyPoints,
            type: "line",
            borderWidth: BENCHMARK_CONFIG.strokeThickness,
            radius: 0,
          })),
        },
        options: {
          animation: false,
          maintainAspectRatio: false,
          parsing: false,
          spanGaps: true,
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
          scales: {
            x: {
              type: "linear",
            },
            y: {
              type: "linear",
            },
          },
        },
      });

      requestAnimationFrame(resolve);
    });
  };

  let tPreviousDataCleaning = 0;
  const appendData = (newData) => {
    return new Promise((resolve, reject) => {
      const tNow = window.performance.now();
      newDataPointsCount = newData[0].length;
      totalDataPoints += newDataPointsCount;
      existingDataPoints += newDataPointsCount;

      const doDataCleaning =
        BENCHMARK_CONFIG.mode === "append" &&
        tNow - tPreviousDataCleaning >=
          BENCHMARK_CONFIG.appendMinimumDataCleaningIntervalSeconds * 1000;
      tPreviousDataCleaning = doDataCleaning ? tNow : tPreviousDataCleaning;

      const keepDataPointsCount =
        BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds *
        BENCHMARK_CONFIG.appendNewSamplesPerSecond;
      const deleteDataPointsCount = doDataCleaning
        ? Math.max(existingDataPoints - keepDataPointsCount, 0)
        : 0;

      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        for (let i = 0; i < newDataPointsCount; i += 1) {
          data[iCh].push(newData[iCh][i]);
        }
        if (BENCHMARK_CONFIG.mode === "append") {
          data[iCh].splice(0, deleteDataPointsCount);
        }
        chart.data.datasets[iCh].data = data[iCh];
      }
      existingDataPoints -= deleteDataPointsCount;

      if (BENCHMARK_CONFIG.mode === "append") {
        chart.options.scales.x.min = totalDataPoints - keepDataPointsCount;
        chart.options.scales.x.max = totalDataPoints;
      }

      chart.update();

      requestAnimationFrame(resolve);
    });
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      chart.data.datasets.forEach((dataset, iCh) => {
        dataset.data = data[iCh];
      });
      chart.update();

      requestAnimationFrame(resolve);
    });
  };

  return {
    dataFormat: "xy-object-array",
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
