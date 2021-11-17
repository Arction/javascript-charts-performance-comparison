const BENCHMARK_CONFIG = {
  // TODO: dvxchart, echart, uplot, zingchart, highhchart
  // "lcjs" | "scichart" | "plotly" | "amchart" | "anychart"
  library: "anychart",
  // "static" | "append" | "refresh"
  mode: "static",
  // In "static" or "refresh" mode, amount of data points per channel.
  channelDataPointsCount: 10000,
  channelsCount: 1,
  ticksEnabled: false,
  dataSource: 'data.json',
  strokeThickness: 1,
  // Max amount of data points to append in a single frame (total of all channels).
  maxChunkDataPoints: 1000000,
  // In "append" mode, interval of x axis as seconds.
  appendTimeDomainIntervalSeconds: 15,
  // In "append" mode, amount of samples pushed every second.
  appendNewSamplesPerSecond: 10000,
  // In "append" mode, the data that matches this many seconds is first appended into the chart to simulate as if the application had run for a long time.
  appendHistorySeconds: 10, 
  // In "refresh" mode, amount of refreshes every second.
  refreshRate: 10,
};
