Public comparison of LightningChart® JS performance against other JavaScript charting libraries in visualizing a realtime multichannel ECG chart:

![Multichannel ECG Chart](multichannel-ecg-chart.png "5 channel ECG Chart visualized with LightningChart® JS")

The following chart libraries were tested:
- [LightningChart® JS](https://www.arction.com/lightningchart-ultimate-sdk)
- [Highcharts](https://www.highcharts.com/)
- [SciChart](https://www.scichart.com/javascript-chart-features/)
- [Anychart](https://www.anychart.com/)
- [amCharts](https://www.amcharts.com/)
- [ECharts](http://echarts.apache.org/en/index.html)
- [DvxCharts](https://www.dvxcharts.com/)
- [Dygraphs](https://dygraphs.com/)
- [Canvas.js](https://canvasjs.com/)
- [μPlot](https://github.com/leeoniya/uPlot)
- [Plotly.js](https://plotly.com/javascript/)

Competitor results are kept unidentified (for example, "Competitor A").

## Benchmarks

Below you can find an overview of library performance in a streaming application by visualizing *refresh rate* (frames per second).
- Higher bar corresponds to smoother performance.
- Orange bar color means stuttering is visible to human eye.
- Red bar color means stuttering is constant and feels laggy, or even unusable.

### PC

- Date: 05.05.2021
- OS: Windows 10
- Browser: Google Chrome v90.0.4430.93
- CPU: AMD Ryzen 5 2600
- GPU: NVIDIA GeForce GTX 1050 Ti
- RAM: 8 GB

![FPS visualization PC](fpsVisualization-pc.png "FPS visualization (PC)")

Full benchmarks data can be found [here](https://github.com/Arction/performance-comparison-multilinechart/blob/main/bench/benchmarks_pc.csv).

### Laptop

- Date: 05.05.2021
- OS: Windows 10
- Browser: Google Chrome v90.0.4430.93
- CPU: Intel Core i7-8550U CPU 1,80 GHz
- GPU: Intel UHD Graphics 620
- RAM: 8 GB

![FPS visualization laptop](fpsVisualization-laptop.png "FPS visualization (Laptop)")

Full benchmarks data can be found [here](https://github.com/Arction/performance-comparison-multilinechart/blob/main/bench/benchmarks_laptop.csv).

### High end PC

- Date: 05.05.2021
- OS: Windows 10
- Browser: Google Chrome v90.0.4430.93
- CPU: Ryzen 9 5900X
- GPU: RTX 3080
- RAM: 16 GB

![FPS visualization high end PC](fpsVisualization-high-end-pc.png "FPS visualization (High end PC)")

Full benchmarks data can be found [here](https://github.com/Arction/performance-comparison-multilinechart/blob/main/bench/benchmarks_high-end-pc.csv).

## Results analysis

All of the included chart libraries proved to be capable of visualizing the realtime multichannel ECG chart.
Increasing the amount of channels and data streaming rate eventually leads to FPS dropping and more and more time spent in updating the chart.
When FPS drops below ~30...40, the stuttering becomes visible to user and the web page becomes uninteractive.

Most chart libraries were able to handle 1 ECG channel with a total of 1000 data points streamed in every second, and a 1 second time domain view.
After this threshold, most libraries performance plummets, except for LightningChart® JS, Competitor A and Competitor E.

Soon after, at 10 ECG channels with a total of 100 000 data points streamed in every second, and a total of 10 million data points visible on screen, LightningChart® JS was the only chart library that could still function with excellent FPS, and going even further to **total of 10 million data points streamed in every second** (on high end PC).

LightningChart® JS was able smoothly visualize, with over 40 FPS, data rates that are **90 x more than average of the competitors** in this test. 

## Downsampling

Some chart libraries are known to utilize internal downsampling of input data.
While this yields increased performance, it produces incorrect visualization which is unacceptable in any realistic application.

The following competitors have been tested and proven to utilize downsampling:

- Competitor C

![Competitor C spike data](spikeData-C.png "Competitor C spike data (incorrect visualization)")

Same data visualized *correctly* with LightningChart® JS:

![LightningChart® JS spike data](spikeData-lcjs.png "LightningChart® JS spike data")
