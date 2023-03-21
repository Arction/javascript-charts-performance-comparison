Public comparison of LightningChart® JS performance against other JavaScript charting libraries in visualizing line charts:

Line charts are perhaps the most commonly used chart type in all fields of data visualization.
For testing their performance in different types of applications, we have identified 3 different application types of line charts:

1. **Static line chart**. An XY or Y data set is loaded and displayed as line chart.

![](pics/static.png)

2. **Refreshing line chart**. In this case, the data is dynamic changing every so often (_refresh rate_). Used in real-time monitoring / analysis.

https://user-images.githubusercontent.com/55391673/143553344-9c0a954b-81bd-4153-b774-f0374bb71747.mp4

3. **Appending surface chart**. Also dynamic data, but in this case the previous data is not cleared, instead just shifted out as new data is pushed in. Used in several fields with different real-time data sources.

https://user-images.githubusercontent.com/55391673/143553637-d2321cb0-e735-4786-a872-8ddcfd4aab07.mp4

This repository contains performance tests for these 3 application types.

The following chart libraries were tested:

- [LightningChart® JS v.3.3](https://www.arction.com/lightningchart-js/)
- [Highcharts 9.1.0](https://www.highcharts.com/)
- [SciChart JS v.2.0.2115](https://www.scichart.com/javascript-chart-features/)
- [Anychart 8.9.0](https://www.anychart.com/)
- [amCharts 4](https://www.amcharts.com/)
- [ECharts 5](http://echarts.apache.org/en/index.html)
- [DvxCharts 5.0.0.0](https://www.dvxcharts.com/)
- [Dygraphs 2.1.0](https://dygraphs.com/)
- [Canvas.js 3.2.16](https://canvasjs.com/)
- [μPlot 1.6.17](https://github.com/leeoniya/uPlot)
- [Plotly.js 1.58.4](https://plotly.com/javascript/)
- [ZingChart 2.9.3](https://www.zingchart.com/)
- [Chart.js 4.2.1](https://www.chartjs.org/docs/latest/) (bench application exists but results not updated, see [issue](https://github.com/Arction/javascript-charts-performance-comparison/issues/2))

The following chart libraries were suggested but not included:

- [DevExtreme](https://js.devexpress.com/) Based on SVG, this is not suitable for real-time data visualization.

Competitor results are kept unidentified (for example, "Competitor A").

## Disclaimer

We understand that from an users point of view any claims of performance can be easily falsified by "marketing sugar" - if you ask the creator, their own chart is always the best.

This is the very reason, why this project exists - to evolve from the empty claims to **proven, reproducable tests**.

We have gone the extra mile to implement all these 12 chart applications, so please utilize them - read more below how you can run and **prove** the tests on your machine.

## Benchmarks

All applications that were created to test performance are included in this repository, open-source (`bench/` folder).

See [Replicating performance benchmarks](#replicating-performance-benchmarks) section to learn more about replicating the results on your machine.

The later referenced benchmarks that are used for comparison breakdowns and analysis can be found in `bench/benchmarks`. These were measured on 25.11.2021, with an average office PC (Intel Core i7-7700K, 16 GB RAM, AMD Radeon R9 380).

## Static line chart performance comparison breakdown

In static data visualization, the most important **measurable** performance attribute is how fast the chart is displayed to the user. Another performance metric, which is not covered by this study is how well the user can interact with the produced chart.

We have selected a single test from the set of static performance tests. This test was the same for each library and it highlights the performance differences most effectively. Here are the results of 10 million data points static line chart test.

| JavaScript Chart Library          | Loading speed \* |
| :-------------------------------- | :--------------- |
| **LightningChart JS**             | **330 ms**       |
| Competitor E                      | 735 ms           |
| Hardware accelerated competitor A | 1300 ms          |
| Hardware accelerated competitor D | 3626 ms          |
| Competitor H                      | 3740 ms          |
| Competitor G                      | 7497 ms          |
| Competitor F                      | 9880 ms          |
| Competitor J                      | 10220 ms         |
| Competitor B                      | 11947 ms         |
| Competitor K                      | 42658 ms         |
| Competitor I                      | Fail             |
| Competitor C                      | 3472 ms \*\*     |

\* Average of measurements with Google Chrome and Mozilla Firefox browsers.

\*\* Chart library uses [down-sampling](#downsampling), the produced data visualization is clearly incorrect.

![](./bench/analysis/static.PNG)

From the bar chart above, we can see that LightningChart JS is the fastest JavaScript chart in visualizing 10 million data points, being ready **7.5x faster** than the average hardware accelerated chart and **65.7x faster** than the average non hardware accelerated chart.

This is a good place to explain what does the **"loading speed"** measurement include. You might run into various claims of JavaScript loading speed in the internet, but we believe that there is only one correct way to measure this.

> Loading speed is the time (seconds) which user has to wait for their chart to be visible on the web page.

Some inconsistencies to this statement which you might have to look out for:

- Setting up rendering frameworks and licenses, or any other steps which users have to do are included in loading time.
  - For example, some manufacturers have omitted the initialization time of graphics engines from loading time, which doesn't make any sense from the perspective of the user and provides false results.
- Loading speed includes any chart processing time between initiating the chart creation and displaying it.
  - We have also identified loading speed claims which disregarded the processing time of chart method calls, once again producing completely irrelevant performance measurements.
- In addition to this, loading speed **also includes any extra time that is required before the chart is visible**.
  - Most JavaScript chart libraries have some internal events which can be used to track when the chart is done with processing data - this however, by no chance means that the data is visible to the user.
- Some competitors also use "subsequent frame render time" as the claimed loading speed, which once again makes no sense from the users point of view.

## Refreshing line chart performance comparison breakdown

In refreshing chart applications, performance is measured as **refresh rate** (how fast data set can be refreshed, faster is better, unit is expressed as frequency Hz which means how many refreshes per every second) and **CPU usage** (% of processing power used, 0-100).

In web data visualization, the CPU usage measurement is perhaps the most important performance metric which can be measured. This is because almost exclusively all processing on a web page is run in a single process and multiple CPU cores can't be easily utilized. In practice, this means if your web page has a single component which uses CPU extensively it will **ruin the performance of the entire web page**.

> If your web page has a chart component which uses 100% of CPU, you can say goodbye to your good user experience.

We have selected a single test from the set of refreshing performance tests. This test was the same for each library and it highlights the performance differences most effectively.

Here are the results of refreshing (refresh rate = 10 Hz) line chart test with 1 million data points

| JavaScript Chart Library          | Actual refresh rate /s | CPU Usage (%) |
| :-------------------------------- | :--------------------- | :------------ |
| LightningChart JS                 | 10.0                   | **57.6 %**    |
| Hardware accelerated competitor A | 10.0                   | 93.6 %        |
| Competitor E                      | 10.0                   | 94.4 %        |
| Competitor H                      | 2.3                    | 100.0 %       |
| Competitor F                      | 1.3                    | 100.0 %       |
| Competitor B                      | 0.9                    | 100.0 %       |
| Competitor J                      | 0.7                    | 100.0 %       |
| Competitor G                      | 0.4                    | 100.0 %       |
| Competitor C                      | Fail                   | Fail          |
| Hardware accelerated competitor D | Fail                   | Fail          |
| Competitor I                      | Fail                   | Fail          |
| Competitor K                      | Fail                   | Fail          |

![](bench/analysis/refresh.PNG)

To help understand viewers to understand the effects of bad refresh rate and CPU usage measurements we have created a [YouTube video showcasing the charts](https://youtu.be/_KRkWBj2sso) mentioned here undertaking the refreshing line chart performance test (not necessarily with same parameters as the test case highlighted above!). In this video you can visible see how a low FPS looks on a web page, and respectively how a good FPS looks.

On average, LightningChart JS could process **14.2x** more data than non hardware accelerated charts and **9.1x** more data than other hardware accelerated charts.

| JavaScript Chart Library          | Max data process speed | Data points | Achieved refresh rate \* |
| :-------------------------------- | :--------------------- | :---------- | :----------------------- |
| LightningChart JS                 | **34 M/s**             | 8 000 000   | 4.3 Hz                   |
| Competitor E                      | 16 M/s                 | 4 000 000   | 4.0 Hz                   |
| Hardware accelerated competitor A | 7.4 M/s                | 2 000 000   | 3.7 Hz                   |
| Competitor H                      | 2.3 M/s                | 1 000 000   | 2.3 Hz                   |
| Competitor F                      | 1.3 M/s                | 1 000 000   | 1.3 Hz                   |
| Competitor B                      | 850 k/s                | 1 000 000   | 0.9 Hz                   |
| Competitor J                      | 700 k/s                | 1 000 000   | 0.7 Hz                   |
| Competitor G                      | 400 k/s                | 1 000 000   | 0.4 Hz                   |
| Competitor C                      | 39 k/s                 | 10 000      | 4.5 Hz                   |
| Hardware accelerated competitor D | 39 k/s                 | 10 000      | 3.9 Hz                   |
| Competitor I                      | 14 k/s                 | 10 000      | 1.4 Hz                   |
| Competitor K                      | None \*\*              |             |                          |

\* Average result of Google Chrome and Mozilla Firefox.

\*\* Even with minimal data amounts, chart was stuck in loading animation.

## Appending line chart performance comparison breakdown

Performance in appending chart applications is measured same way as in [refreshing applications](#refreshing-line-chart-performance-comparison-breakdown). However, generally refresh rates are much more frequent, usually capped around 60 FPS when the application is performing well.

We have selected a single test from the set of appending performance tests. This test was the same for each library and it highlights the performance differences most effectively. Here are the results of appending test with 10 channels, 10000 data points added every second (for each channel) and 15 seconds of displayed data history.

| JavaScript Chart Library          | Refresh rate (FPS) | CPU Usage (%) |
| :-------------------------------- | :----------------- | :------------ |
| LightningChart JS                 | **60**             | **21 %**      |
| Hardware accelerated competitor A | 13                 | 100 %         |
| Competitor E                      | 13                 | 100 %         |
| Competitor H                      | 1                  | 100 %         |
| Competitor F                      | Fail               | Fail          |
| Competitor B                      | Fail               | Fail          |
| Competitor J                      | Fail               | Fail          |
| Competitor G                      | Fail               | Fail          |
| Competitor C                      | Fail               | Fail          |
| Hardware accelerated competitor D | Fail               | Fail          |
| Competitor I                      | Fail               | Fail          |
| Competitor K                      | Fail               | Fail          |

![](bench/analysis/append.PNG)

As you can see from the amount of chart libraries which failed this test scenario, this is not a light weight test.

When compared to other hardware accelerated charts, LightningChart JS could process on average 19.8x more data while using 4.2x less CPU power and refreshing 4 times faster. Combining these factors, **LightningChart JS was 332.6 times more powerful than other hardware accelerated charts**.

| JavaScript Chart Library          | Incoming data per second | Refresh rate (FPS) \* | CPU usage (%) |
| :-------------------------------- | :----------------------- | :-------------------- | :------------ |
| LightningChart JS                 | 1 million                | **59.3**              | **23.7 %**    |
| Hardware accelerated competitor A | 100 thousand             | 13.1                  | 100.0 %       |
| Hardware accelerated competitor D | 1 thousand               | 16.9                  | 98.7 %        |

When compared to non hardware accelerated charts, LightningChart JS could process on average 18000x more data while using 4.1x less CPU power and refreshing 7 times faster. Combining these factors, **LightningChart JS was 516600 times more powerful than non hardware accelerated charts**.

| JavaScript Chart Library | Incoming data per second | Refresh rate (FPS) \* | CPU usage (%) |
| :----------------------- | :----------------------- | :-------------------- | :------------ |
| LightningChart JS        | 1 million                | **59.3**              | **23.7 %**    |
| Competitor E             | 100 thousand             | 13.2                  | 100.0 %       |
| Competitor H             | 10 thousand              | 10.6                  | 100.0 %       |
| Competitor F             | 10 thousand              | 10.1                  | 100.0 %       |
| Competitor C             | 10 thousand              | 9.4                   | 100.0 %       |
| Competitor B             | 10 thousand              | 4.3                   | 100.0 %       |
| Competitor G             | 10 thousand              | 8.5                   | 100.0 %       |
| Competitor J             | 10 thousand              | 4.4                   | 81.9 %        |
| Competitor I             | 1 thousand               | 10.8                  | 100.0 %       |
| Competitor K             | 1 thousand               | 4.3                   | 100.0 %       |

\* Average result of Google Chrome and Mozilla Firefox.

## LightningChart JS Line Chart Capabilities

As you might know, LightningChart JS utilizes hardware acceleration for its graphics. This results in three very particular performance properties:

- **Low CPU usage**
  - As you can see from both highlighted real-time performance scenarios, LightningChart JS is extremely efficient on CPU usage with stark contrast to other chart libraries.
- **High refresh rate**
  - In all highlighted real-time performance scenarios, LightningChart JS refreshes with the maximum required display rate.
- **Hardware scaling**
  - Perhaps something which is not talked about enough; hardware acceleration enables utilizing the power of device graphics processing units (GPU). As a result of this, LightningChart JS performance skyrockets when powerful hardware is used.

It is worth noting, that this is not as simple as "if something is hardware accelerated then it must perform well". There are large differences even between performance of hardware accelerated web charts.

**Let's see what happens when LightningChart JS is used with a powerful machine ...**

We performed a separate test iteration with a more powerful PC (Ryzen 9 5900X, 64GB RAM, RTX 3080) to see what is the maximum capability of LightningChart JS Line charts. Here's the results!

### Static line chart

- Maximum data set size: **500 million data points**
- Massive line chart with 100 million data points can be loaded in 6.5 seconds!

### Refreshing line chart

- **LightningChart JS officially enables real-time refreshing line data visualization**. From the performance results of older data visualization tools, it can be seen that they are simply not efficient enough with CPU usage to allow this kind of applications. Here is one performance test result we'd like to highlight:

| JavaScript chart library | Refresh rate (Hz) | Total data points per refresh | Achieved refresh rate (FPS) | CPU usage (%) |
| :----------------------- | :---------------- | :---------------------------- | :-------------------------- | :------------ |
| LightningChart JS        | 10                | 2 million                     | **10.0**                    | **31.0%**     |

In this test, a considerably large line chart data set is refreshed 10 times per second. Note, the CPU usage from LightningChart JS: **31.0 %**. This leaves plenty of power for the rest of the web page as well as something often forgotten before it is a problem: transferring the data to the data visualization application, as well as possible data analysis computations.

![](pics/refresh.gif)

### Appending line chart

- **LightningChart JS officially enables real-time appending line data visualization**. From the performance results of older data visualization tools, it can be seen that they are simply not efficient enough with CPU usage to allow this kind of applications.

**Why is this?**

Most importantly, this is due to design decisions - there is large variety in the data management methods of different JavaScript charts. In an appending line chart, we identify three main methods of interacting with data:

1. Specifying data set.

   - This is where data visualization starts, you supply the chart library with a data set and you get the visualization in response.

2. Appending new data on top of previously added data.

   - **A must have feature** for appending data applications, this allows efficient data updates when old data is not modified changed and just 1 or couple samples are added.
   - Very few JavaScript charts support this feature, which shows quite clearly in their appending performance.

3. Removing old data that is out of view.
   - In real-time monitoring applications it is quite common that applications can run for long times or even indefinitely. For this reason, it is **vital** to remove old data periodically.
   - We didn't find any JavaScript chart other than LightningChart JS which supports this out of the box. All responsibility of cleaning data is on the user, which generally results in low performance and a lot of extra work.

**How does LightningChart resolve this issue?**

From the start, LightningChart JS was designed to work in all real-time applications. For this reason, we our line series features set handles all the above mentioned processes internally, while user only has to push in new samples to append.

...and here is how it performs with a fast machine:

| JavaScript chart library | Channels count | Input frequency | Total new data points per second | Achieved refresh rate (FPS) | CPU usage (%) |
| :----------------------- | :------------- | :-------------- | :------------------------------- | :-------------------------- | :------------ |
| LightningChart JS        | 20             | 200 kHz         | 4 million                        | **128**                     | **50 %**      |

This is a seriously heavy application, with high amount of channels and extreme input frequency. In practice, this should cover any realistic need for real-time line data visualization applications, which are usually limited by input rate and total displayed data points count.

![](pics/append.gif)

## Errors in data visualization

Chart library performance is important, but producing correct visualizations is even more important. This section contains some cases where **incorrect** or _unexpected_ results were identified.

### Downsampling

Some chart libraries are known to utilize internal downsampling of input data.
While this yields increased performance, it produces incorrect visualization which is unacceptable in any realistic application.

The following competitors have been tested and proven to utilize downsampling:

- Competitor C

![Competitor C spike data](spikeData-C.png "Competitor C spike data (incorrect visualization)")

Same data visualized _correctly_ with LightningChart® JS:

![LightningChart® JS spike data](spikeData-lcjs.png "LightningChart® JS spike data")

### Other errors

With extremely dense data (100 μs resolution), competitor G produces incorrect visualization (curve looks like it is thicker than it should, or like there is a lot of _noise_). In this case, the Y value can't be accurately identified. Additionally, the visualized Y min/max range is out of the input data bounds (max Y is obviously drawn higher than 5.0).

![Competitor G noise visualization](issue0-G.png 'Competitor G "noise" error')

Same data visualized _correctly_ with LightningChart® JS:

![LightningChart® JS](issue0-LCJS.png "LightningChart® JS")

## End word

Read more about Lightning Chart JS performance why and how at our [web site](https://www.arction.com/high-performance-javascript-charts/).

To interact with LightningChart JS Line charts, please continue in our [Line chart examples gallery](https://www.arction.com/lightningchart-js-interactive-examples/search.html?t=line).

## Replicating performance benchmarks

The benchmark applications and all related resources can be found in `bench/` folder.

Please see [bench/README.md](bench/README.md) for development instructions.
