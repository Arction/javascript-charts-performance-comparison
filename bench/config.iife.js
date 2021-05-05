var A = {
  channelsCount: 1,
  channelDataPointsPerSecond: 1000,
  timeDomainInterval: 1000,
  testDurationSeconds: 30,
  strokeThickness: 2,
  settleTimeMs: 3000,
  dataSource: 'data.json'
};

var B = {
  channelsCount: 1,
  channelDataPointsPerSecond: 10000,
  timeDomainInterval: 10000,
  testDurationSeconds: 30,
  strokeThickness: 2,
  settleTimeMs: 3000,
  dataSource: 'data.json'
};

var C = {
  channelsCount: 10,
  channelDataPointsPerSecond: 10000,
  timeDomainInterval: 10000,
  testDurationSeconds: 30,
  strokeThickness: 2,
  settleTimeMs: 3000,
  dataSource: 'data.json'
};

var D = {
  channelsCount: 10,
  channelDataPointsPerSecond: 100000,
  timeDomainInterval: 1000000,
  testDurationSeconds: 30,
  strokeThickness: 2,
  settleTimeMs: 3000,
  dataSource: 'data.json'
};

var E = {
  channelsCount: 20,
  channelDataPointsPerSecond: 100000,
  timeDomainInterval: 1000000,
  testDurationSeconds: 30,
  strokeThickness: 2,
  settleTimeMs: 3000,
  dataSource: 'data.json'
};

var BENCHMARK_CONFIG = (function (t) {
  'use strict';
  return A;
})();
