const BENCHMARK_IMPLEMENTATION = (() => {
  const beforeStart = () => {
    return new Promise(async (resolve, reject) => {
      const stylesheets = [
        "//cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.css",
      ];
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
        "//cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.js",
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
  let g;

  const loadChart = (initialData) => {
    return new Promise((resolve, reject) => {
      totalDataPoints = initialData.length;
      existingDataPoints = totalDataPoints;
      data = initialData;

      g = new Dygraph(document.getElementById("chart"), data, {
        drawPoints: false,
        showRoller: false,
        strokeWidth: BENCHMARK_CONFIG.strokeThickness,
        labels: [
          "Time domain",
          ...new Array(BENCHMARK_CONFIG.channelsCount)
            .fill(0)
            .map((_, iChannel) => `Channel #${iChannel + 1}`),
        ],
      });

      if (!BENCHMARK_CONFIG.ticksEnabled) {
        // TODO IMMEDIATE: How to hide ticks ?
      }

      requestAnimationFrame(resolve);
    });
  };

  let tPreviousDataCleaning = 0;
  const appendData = (newData) => {
    return new Promise((resolve, reject) => {
      const tNow = window.performance.now();
      const newDataPointsCount = newData.length;
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

      for (let i = 0; i < newDataPointsCount; i += 1) {
        data.push(newData[i]);
      }
      if (BENCHMARK_CONFIG.mode === "append") {
        data.splice(0, deleteDataPointsCount);
        existingDataPoints -= deleteDataPointsCount;
      }

      g.updateOptions({ file: data });

      requestAnimationFrame(resolve);
    });
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      g.updateOptions({ file: data });

      requestAnimationFrame(resolve);
    });
  };

  return {
    dataFormat: "xyyy-array",
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
