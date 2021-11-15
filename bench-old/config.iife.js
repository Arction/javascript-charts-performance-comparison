var A = {
  channelsCount: 1,
  channelDataPointsPerSecond: 1000,
  timeDomainInterval: 10000,
  strokeThickness: 2,
  dataSource: 'data.json'
};

var B = {
  channelsCount: 1,
  channelDataPointsPerSecond: 10000,
  timeDomainInterval: 100000,
  strokeThickness: 2,
  dataSource: 'data.json'
};

var C = {
  channelsCount: 10,
  channelDataPointsPerSecond: 10000,
  timeDomainInterval: 100000,
  strokeThickness: 2,
  dataSource: 'data.json'
};

var D = {
  channelsCount: 10,
  channelDataPointsPerSecond: 100000,
  timeDomainInterval: 1000000,
  strokeThickness: 2,
  dataSource: 'data.json'
};

var E = {
  channelsCount: 20,
  channelDataPointsPerSecond: 100000,
  timeDomainInterval: 1000000,
  strokeThickness: 2,
  dataSource: 'data.json'
};

var BENCHMARK_CONFIG = (function (t) {
  'use strict';
  return {...D, refreshData: false, scrollData: true}
})();
