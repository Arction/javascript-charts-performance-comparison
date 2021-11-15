const BENCHMARK_CONFIG = {
  // "lcjs" | "scichart"
  library: "lcjs",
  // "static" | "append" | "refresh"
  mode: "static",
  // In "static" or "refresh" mode, amount of data points per channel.
  channelDataPointsCount: 100000,
  channelsCount: 5,
  ticksEnabled: false,
  dataSource: 'data.json',
  strokeThickness: 1,
  // In "append" mode, interval of x axis.
  appendTimeDomainInterval: 50000,
  // In "append" mode, amount of samples pushed every second.
  appendNewSamplesPerSecond: 10000,
  // In "append" mode, the data that matches this many seconds is first appended into the chart to simulate as if the application had run for a long time.
  appendHistorySeconds: 30, 
  // In "refresh" mode, amount of refreshes every second.
  refreshRate: 10,
};
