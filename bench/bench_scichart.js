const BENCHMARK_IMPLEMENTATION = (() => {

  const beforeStart = () => {
    return new Promise((resolve, reject) => {
      const libScript = document.createElement("script");
      libScript.onload = () => resolve();
      libScript.src = "https://cdn.jsdelivr.net/npm/scichart@2.0.2115/_wasm/scichart.browser.js";
      document.body.append(libScript);
    });
  };

  const loadChart = (initialData) => {
    return new Promise(async (resolve, reject) => {
      const {
        SciChartSurface,
        NumericAxis,
        EAutoRange,
        CursorModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        MouseWheelZoomModifier,
        XyDataSeries,
        FastLineRenderableSeries,
        NumberRange,
      } = SciChart

      SciChartSurface.configure({
        dataUrl: "https://cdn.jsdelivr.net/npm/scichart@2.0.2115/_wasm/scichart2d.data",
        wasmUrl: "https://cdn.jsdelivr.net/npm/scichart@2.0.2115/_wasm/scichart2d.wasm"
      })

      const sciChart = await SciChartSurface.create('chart');
      sciChartSurface = sciChart.sciChartSurface
      wasmContext = sciChart.wasmContext

      xAxis = new NumericAxis(wasmContext);
      xAxis.axisTitle = 'time domain'
      if (BENCHMARK_CONFIG.mode !== 'append') {
        xAxis.visibleRange = new NumberRange(0, BENCHMARK_CONFIG.channelDataPointsCount)
      }
      const yAxis = new NumericAxis(wasmContext);
      yAxis.autoRange = EAutoRange.Always;
      sciChartSurface.xAxes.add(xAxis);
      sciChartSurface.yAxes.add(yAxis);
    
      if (!BENCHMARK_CONFIG.ticksEnabled) {
        xAxis.drawLabels = false
        yAxis.drawLabels = false
      }

      sciChartSurface.chartModifiers.add(
        new CursorModifier({
          crosshairStroke: 'red',
          crosshairStrokeThickness: 1,
          tooltipContainerBackground: 'green',
          tooltipTextStroke: 'white',
          showTooltip: true,
          axisLabelFill: 'green',
          axisLabelStroke: 'white',
        }),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
      );
    
      channels = new Array(BENCHMARK_CONFIG.channelsCount)
        .fill(undefined)
        .map((_, iChannel) => {
          const nDataSeries = new XyDataSeries(wasmContext);
          const nRendSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: nDataSeries,
            strokeThickness: BENCHMARK_CONFIG.strokeThickness,
            // stroke: "red",
          });
          sciChartSurface.renderableSeries.add(nRendSeries);
          return {
            dataSeries: nDataSeries,
            rendSeries: nRendSeries,
          };
        });

      channels.forEach((ch, iChannel) => {
        ch.dataSeries.appendRange(
          initialData[iChannel][0],
          initialData[iChannel][1]
        );
      });
      dataPoints = existingDataPoints = initialData[0][0].length

      const onRendered = () => {
        resolve(undefined)
        sciChartSurface.rendered.unsubscribe(onRendered)
      }
      sciChartSurface.rendered.subscribe(onRendered)

      requestAnimationFrame(resolve);
    });
  };

  let dataPoints = 0
  let existingDataPoints = 0
  let tPrevClean = window.performance.now()
  const appendData = (data) => {
    const {
      NumberRange
    } = SciChart

    return new Promise((resolve, reject) => {
      const newDataPointsCount = data[0][0].length
      const tNow = window.performance.now()
      const doDataCleaning = (tNow - tPrevClean) >= 1000
      tPrevClean = doDataCleaning ? tNow : tPrevClean

      channels.forEach((ch, iChannel) => {
        ch.dataSeries.appendRange(
          data[iChannel][0],
          data[iChannel][1]
        );

        if (BENCHMARK_CONFIG.mode === 'append' && doDataCleaning) {
          const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond
          const deleteDataPointsCount = (existingDataPoints + newDataPointsCount) - keepDataPointsCount
          if (deleteDataPointsCount > 0) {
            ch.dataSeries.removeRange(0, deleteDataPointsCount)
            existingDataPoints -= deleteDataPointsCount
          }
        }
      });

      dataPoints += newDataPointsCount
      existingDataPoints += newDataPointsCount
      sciChartSurface.zoomExtentsY()

      if (BENCHMARK_CONFIG.mode === 'append') {
        xAxis.visibleRange = new NumberRange(
          dataPoints - BENCHMARK_CONFIG.appendTimeDomainIntervalSeconds * BENCHMARK_CONFIG.appendNewSamplesPerSecond,
          dataPoints
        )
      }

      const onRendered = () => {
        resolve(undefined)
        sciChartSurface.rendered.unsubscribe(onRendered)
      }
      sciChartSurface.rendered.subscribe(onRendered)
    })
  };

  const refreshData = (data) => {
    return new Promise((resolve, reject) => {
      channels.forEach((ch, iChannel) => {
        ch.dataSeries.clear()
        ch.dataSeries.appendRange(data[iChannel][0], data[iChannel][1])
      })
      
      const onRendered = () => {
        resolve(undefined)
        sciChartSurface.rendered.unsubscribe(onRendered)
      }
      sciChartSurface.rendered.subscribe(onRendered)
    })
  }

  return {
    dataFormat: 'individual-xy-lists',
    beforeStart,
    loadChart,
    appendData,
    refreshData,
  };
})();
