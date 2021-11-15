import { SciChartSurface } from 'scichart';
import { CursorModifier } from 'scichart/Charting/ChartModifiers/CursorModifier';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { EAutoRange } from 'scichart/types/AutoRange';

let testStopped = false;

const url = document.URL;
var BENCHMARK_CONFIG;
try {
  const configArg = url.match(/\?config=(.*)/)[1];
  console.log(configArg);
  BENCHMARK_CONFIG = JSON.parse(decodeURI(configArg));
  console.log('read config from URL');
} catch (e) {
  console.error(`error reading config from url ${e.message}`);
}
if (!BENCHMARK_CONFIG) throw new Error('no config');

const prepareData = (packedData) => {
  // Map ECG y data into n channels on same X and Y Axis (offset channels Y coordinate).
  // ECG data is in range [0, 1].
  // Each channel data is tuple of X, Y values (separate arrays).
  return new Array(BENCHMARK_CONFIG.channelsCount)
    .fill(undefined)
    .map((_, iChannel) => [
      packedData.map((y, iSample) => iSample),
      packedData.map(
        (y, iSample) =>
          y + (BENCHMARK_CONFIG.channelsCount - (iChannel + 1)) * 1
      ),
    ]);
};

const createChart = async (sourceData) => {
  // Runtime license key is required for deploying trial build.
  const RUNTIME_LICENSE_KEY = '';

  SciChartSurface.setRuntimeLicenseKey(RUNTIME_LICENSE_KEY);

  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    `chart`
  );

  const xAxis = new NumericAxis(wasmContext);
  xAxis.visibleRange = new NumberRange(0, BENCHMARK_CONFIG.timeDomainInterval);
  const yAxis = new NumericAxis(wasmContext);
  yAxis.autoRange = EAutoRange.Always;
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

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

  const channels = new Array(BENCHMARK_CONFIG.channelsCount)
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

  let iDataPoint = 0;
  const addNDataPoints = (n) => {
    if (n === 0) return;
    const dataPoints = new Array(BENCHMARK_CONFIG.channelsCount)
      .fill(0)
      .map((_) => [[], []]);
    for (let iNewDataPoint = 0; iNewDataPoint < n; iNewDataPoint += 1) {
      const iDataPointSource = iDataPoint % sourceData[0][0].length;
      for (let iCh = 0; iCh < BENCHMARK_CONFIG.channelsCount; iCh += 1) {
        const y = sourceData[iCh][1][iDataPointSource];
        dataPoints[iCh][0][iNewDataPoint] = iDataPoint;
        dataPoints[iCh][1][iNewDataPoint] = y;
      }
      iDataPoint += 1;
    }
    channels.forEach((ch, iChannel) => {
      ch.dataSeries.appendRange(
        dataPoints[iChannel][0],
        dataPoints[iChannel][1]
      );
    });
    xAxis.visibleRange = new NumberRange(
      iDataPoint - BENCHMARK_CONFIG.timeDomainInterval,
      iDataPoint
    );
  };

  return {
    renderInitialData: () => {
      return new Promise((resolve) => {
        addNDataPoints(BENCHMARK_CONFIG.timeDomainInterval);
        requestAnimationFrame(resolve);
      });
    },
    streamData: () => {
      let tPrev = performance.now();
      let newDataModulus = 0;
      const streamData = () => {
        const tNow = performance.now();
        const tDelta = tNow - tPrev;
        let newDataPointsCount =
          BENCHMARK_CONFIG.channelDataPointsPerSecond * (tDelta / 1000) +
          newDataModulus;
        newDataModulus = newDataPointsCount % 1;
        newDataPointsCount = Math.floor(newDataPointsCount);
        addNDataPoints(newDataPointsCount);
        tPrev = tNow;
        if (!testStopped) {
          requestAnimationFrame(streamData);
        }
      };
      streamData();
    },
  };
};

const wait = document.getElementById('wait');
wait.textContent = 'Fetching data.json ...';
fetch('data.json')
  .then((result) => result.json())
  .then(async (packedData) => {
    const data = prepareData(packedData);
    wait.textContent = 'Letting chart settle';
    const { renderInitialData, streamData } = await createChart(data);
    await new Promise((resolve) =>
      setTimeout(resolve, BENCHMARK_CONFIG.settleTimeMs)
    );

    // Measure initial render speed speed.
    wait.textContent = 'Rendering ...';
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    console.time('loadup');
    const heapSizeStart = performance.memory.usedJSHeapSize;
    let tStart = performance.now();
    let loadupSpeedMs = 0;

    await renderInitialData();
    wait.textContent = 'Ready! Streaming data ...';
    console.timeEnd('loadup');
    const heapSizeInitialRender = performance.memory.usedJSHeapSize;
    loadupSpeedMs = performance.now() - tStart;

    // Measure FPS and HEAP SIZE while streaming.
    streamData();
    tStart = performance.now();
    const fpsMeasurements = [];
    const frameTimeMeasurements = [];
    const heapSizeMeasurements = [];
    const timeoutMeasurements = [];
    (() => {
      let frames = 0;
      let tPrev = tStart;
      const recordFrame = () => {
        frames++;
        const tNow = performance.now();
        const fps = 1000 / ((tNow - tStart) / frames);
        const frameTime = tNow - tPrev;
        if (frames >= 5) {
          fpsMeasurements.push(fps);
          frameTimeMeasurements.push(frameTime);
        }
        if (!testStopped) {
          requestAnimationFrame(recordFrame);
        }
        tPrev = tNow;
      };
      requestAnimationFrame(recordFrame);
    })();
    (() => {
      let tPrev = tStart;
      const checkHeapSize = () => {
        const tNow = performance.now();
        if (tNow - tPrev > 500) {
          const heapSize = performance.memory.usedJSHeapSize;
          heapSizeMeasurements.push(heapSize);
          tPrev = tNow;
        }
        if (!testStopped) {
          requestAnimationFrame(checkHeapSize);
        }
      };
      checkHeapSize();
    })();
    (() => {
      let tPrev = tStart;
      const check = () => {
        const tNow = performance.now();
        timeoutMeasurements.push(tNow - tPrev);
        tPrev = tNow;
        if (!testStopped) {
          setTimeout(check);
        }
      };
      setTimeout(check);
    })();

    const checkOver = () => {
      const tNow = performance.now();
      if (tNow - tStart >= BENCHMARK_CONFIG.testDurationSeconds * 1000) {
        // Finish benchmark.
        testStopped = true;
        wait.textContent = 'Benchmark finished. See console for results';

        // Calculate min, max, avg, median from FPS and HEAP SIZE measurements.
        const getNumberArrayStats = (array) => {
          // https://stackoverflow.com/questions/45309447/calculating-median-javascript
          function median(values) {
            if (values.length === 0) return 0;
            values.sort((a, b) => a - b);
            const half = Math.floor(values.length / 2);
            if (values.length % 2) return values[half];
            return (values[half - 1] + values[half]) / 2.0;
          }
          return {
            min: array.reduce(
              (prev, cur) => Math.min(prev, cur),
              Number.MAX_SAFE_INTEGER
            ),
            max: array.reduce(
              (prev, cur) => Math.max(prev, cur),
              -Number.MAX_SAFE_INTEGER
            ),
            avg: array.reduce((prev, cur) => prev + cur, 0) / array.length,
            median: median(array),
          };
        };

        const fpsStats = getNumberArrayStats(fpsMeasurements);
        const heapSizeStats = getNumberArrayStats(heapSizeMeasurements);
        const timeoutStats = getNumberArrayStats(timeoutMeasurements);
        const frameTimeStats = getNumberArrayStats(frameTimeMeasurements);
        const benchmark = {
          config: BENCHMARK_CONFIG,
          timestamp: Date.now(),
          loadupSpeedMs: loadupSpeedMs,
          fps: fpsStats,
          heapSize: {
            ...heapSizeStats,
            before: heapSizeStart,
            afterInitialRender: heapSizeInitialRender,
          },
          timeout: timeoutStats,
          frameTime: frameTimeStats,
        };
        console.log(
          'BENCHMARK RESULTS\n',
          '-----------------\n',
          JSON.stringify(benchmark)
        );
      } else requestAnimationFrame(checkOver);
    };
    requestAnimationFrame(checkOver);
  });
