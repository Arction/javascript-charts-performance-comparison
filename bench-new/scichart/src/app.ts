import { SciChartSurface } from "scichart";
import { CursorModifier } from 'scichart/Charting/ChartModifiers/CursorModifier';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { NumberRange } from "scichart/Core/NumberRange";
import { EAutoRange } from 'scichart/types/AutoRange';
import { TSciChart } from "scichart/types/TSciChart";

declare let BENCHMARK_CONFIG: {
  library: "scichart",
  mode: "static" | "append" | "refresh",
  channelDataPointsCount: number,
  channelsCount: number,
  ticksEnabled: boolean,
  appendTimeDomainInterval: number,
  appendNewSamplesPerSecond: number,
  refreshRate: number,
  strokeThickness: number
}

;(window as any).BENCHMARK_IMPLEMENTATION_SCICHART = (() => {
  
  // Code based on https://demo.scichart.com/performance/javascript-chart-load-500-series-by-500-points
  // and https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html

  let sciChartSurface: SciChartSurface
  let wasmContext: TSciChart
  let channels: Array<{dataSeries: XyDataSeries, rendSeries: FastLineRenderableSeries}>
  let xAxis: NumericAxis

  const loadChart = (initialData) => {
    return new Promise<void>(async (resolve, reject) => {
      
        const RUNTIME_LICENSE_KEY = "bszJo3nCP3GpLQJTzG4EBX4icSGVJci4mI/jg1vylxEHQAvvay6tF66llQqf2Sm8jbeekkMSL8lGG1azFSiK+bu4/Sm/ss6ZvTscd+dVK+T+Hc5/0VI+pXbxX8hiYVjYzBXehepLw6+nyAreNw8rL8/9BkP2L+Cpxk+WmHC6gHbr6IwYpCMzM84l0NrcJL2aW8KRMfJbdJ7qANlsAn9VciMpgyrELYnKEWWw0TihqpaZoDyHL1xx9M4aW7wC2tjKDdB8cRoP3IEi3bqXeFbheQEpC33A4X3zY4BDmH+6YnYLWb2yRbDmT8R791YmFU/lcumIDRXIiKpB9SfYF50I/DznsJ0J4uv5ZpbIrjDu7f1NZNY9yyRT66eASGkW6dzvP9dywp6Gg/vsCj+nZcHppVoN5XlCPiFTMywF6HYXEvXa1IAwBrPkRD0JVemfssjVEazxb40Jy1cmuo/70sIPYG5FaJJHJAiawY6JbUtb4WHmVcIMHEsA6+htGPTTBHmjstSeX9c102XVzSIBdBQSMr7pZqpp885uSBSv/LGYi4ZWG9nrqnrOegz2Mgan86kQ";
        SciChartSurface.setRuntimeLicenseKey(RUNTIME_LICENSE_KEY);
        const sciChart = await SciChartSurface.create('chart');
        sciChartSurface = sciChart.sciChartSurface
        wasmContext = sciChart.wasmContext

        xAxis = new NumericAxis(wasmContext);
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

        sciChartSurface.rendered.subscribe(() => {
          resolve()
        })
    });
  };

  let dataPoints = 0
  let existingDataPoints = 0
  const appendData = (data) => {
    const newDataPointsCount = data[0][0].length
    channels.forEach((ch, iChannel) => {
      ch.dataSeries.appendRange(
        data[iChannel][0],
        data[iChannel][1]
      );

      const keepDataPointsCount = BENCHMARK_CONFIG.appendTimeDomainInterval
      const deleteDataPointsCount = existingDataPoints - keepDataPointsCount
      if (deleteDataPointsCount > 0) {
        ch.dataSeries.removeRange(0, deleteDataPointsCount)
        existingDataPoints -= deleteDataPointsCount
      }
    });
    dataPoints += newDataPointsCount
    existingDataPoints += newDataPointsCount
    sciChartSurface.zoomExtentsY()
    xAxis.visibleRange = new NumberRange(
      dataPoints - BENCHMARK_CONFIG.appendTimeDomainInterval,
      dataPoints
    );
  };

  const refreshData = (data) => {
    channels.forEach((ch, iChannel) => {
      ch.dataSeries.clear()
      ch.dataSeries.appendRange(data[iChannel][0], data[iChannel][1])
    })
  }

  return {
    dataFormat: 'individual-xy-lists',
    loadChart,
    appendData,
    refreshData,
  };
})();
