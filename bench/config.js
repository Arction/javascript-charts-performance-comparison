const BENCHMARK_CONFIG = {
  // "lcjs" | "scichart" | "plotly" | "amchart" | "anychart" | "highchart" | "zingchart" | "dvxchart" | "dygraph" | "uplot" | "echart" | "canvasjs" | "chartjs"
  library: "lcjs",
  // "static" | "append" | "refresh"
  mode: "static",
  // In "static" or "refresh" mode, amount of data points per channel.
  channelDataPointsCount: 100000,
  channelsCount: 10,
  ticksEnabled: true,
  dataSource: "data.json",
  strokeThickness: 1,
  // Max amount of data points to append in a single frame (total of all channels).
  maxChunkDataPoints: 10000000,
  // In "append" mode, interval of x axis as seconds.
  appendTimeDomainIntervalSeconds: 15,
  // In "append" mode, amount of samples pushed every second.
  appendNewSamplesPerSecond: 10000,
  // In "append" mode, the data that matches this many seconds is first appended into the chart to simulate as if the application had run for a long time.
  appendHistorySeconds: 15,
  // In "append" mode, old data that is not visible should be cleaned at least this often (if not controlled automatically).
  appendMinimumDataCleaningIntervalSeconds: 5,
  // In "refresh" mode, amount of refreshes every second.
  refreshRate: 60,
};
