const fs = require('fs');

const src = 'pc';
// const src = 'laptop';

const data = JSON.parse(fs.readFileSync(`benchmarks_${src}.json`));

// * Identify all different configs *
const configs = [];
data.forEach((libResult) => {
  if (!libResult.benchmarks) return;
  libResult.benchmarks.forEach((benchmark) => {
    if (
      undefined ===
      configs.find(
        (config) =>
          config.channelsCount === benchmark.config.channelsCount &&
          config.channelDataPointsPerSecond ===
            benchmark.config.channelDataPointsPerSecond &&
          config.timeDomainInterval === benchmark.config.timeDomainInterval
      )
    ) {
      configs.push(benchmark.config);
    }
  });
});
console.log(configs.length, 'configs');

// * Identify all libraries *
const libraries = data.map((libResult) => libResult.library);

// * Group each config with every library benchmark for that config *
const grouped = configs.map((config) => {
  const benchmarks = [];
  data.forEach((libResult) => {
    let libBenchmark = undefined;
    if (libResult.benchmarks) {
      libResult.benchmarks.forEach((benchmark) => {
        if (
          config.channelsCount !== benchmark.config.channelsCount ||
          config.channelDataPointsPerSecond !==
            benchmark.config.channelDataPointsPerSecond ||
          config.timeDomainInterval !== benchmark.config.timeDomainInterval
        ) {
          return;
        }
        libBenchmark = benchmark;
      });
    }
    libBenchmark = libBenchmark || {
      fail: true,
    };
    benchmarks.push({
      ...libBenchmark,
      library: libResult.library,
    });
  });
  return {
    config,
    benchmarks,
  };
});

// * Write CSV *

let csv = '';
// Append UTF-8 BOM. https://stackoverflow.com/questions/27802123/utf-8-csv-encoding
// csv += String.fromCharCode(0xfeff);
const makeSafeForCSV = (s) => {
  if (typeof s === 'string') return s.replace(',', '.');
  return String(s);
};
const round = (num, n) => {
  if (n === 0) return Math.round(num);
  return Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
};
const newLine = '\r\n';
csv += newLine;

// Header.
csv +=
  'Test, Library, Initial render speed (ms), FPS avg, Frame time avg (ms), Timeout delay avg (ms), Heap size avg (MB)';
csv += newLine;

grouped.forEach((group, iGroup) => {
  const config = group.config;
  const testName = `${config.channelsCount}ch ${config.channelDataPointsPerSecond} dp/s`;
  group.benchmarks.forEach((benchmark) => {
    const fail = benchmark.fail === true;
    csv += makeSafeForCSV(testName);
    csv += ',';
    csv += makeSafeForCSV(benchmark.library.name);
    csv += ',';
    if (benchmark.loadupSpeedMs)
      csv += makeSafeForCSV(round(benchmark.loadupSpeedMs, 0));
    csv += ',';
    if (benchmark.fps && benchmark.fps.avg)
      csv += makeSafeForCSV(round(benchmark.fps.avg, 1));
    csv += ',';
    if (benchmark.frameTime && benchmark.frameTime.avg)
      csv += makeSafeForCSV(round(benchmark.frameTime.avg, 0));
    csv += ',';
    if (benchmark.timeout && benchmark.timeout.avg)
      csv += makeSafeForCSV(round(benchmark.timeout.avg, 0));
    csv += ',';
    if (benchmark.heapSize && benchmark.heapSize.avg)
      csv += makeSafeForCSV(
        round(benchmark.heapSize.avg / Math.pow(1000, 2), 0)
      );
    csv += newLine;
  });
});

fs.writeFileSync(`benchmarks_${src}.csv`, csv, 'utf8');
