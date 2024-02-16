# Public comparison of LightningChart® JS performance against other JavaScript charting libraries.

LightningChart JS is a performance-oriented data visualization solution for JavaScript.
The purpose of this open-source repository is to display the performance differences between LightningChart JS and just about every viable alternative in JavaScript charting market.

This test suite covers **23**[\*](#on-which-basis-were-the-solutions-included-in-testing-selected) **different JavaScript-based data visualization solutions**:

-   [LightningChart® JS](https://lightningchart.com/js-charts/) (v5.1.0)
-   [Highcharts](https://www.highcharts.com/integrations/javascript/) (v11.2.0)
-   [amCharts](https://www.amcharts.com/javascript-charts/) (v5)
-   [Plotly](https://plotly.com/javascript/) (v2.27.0)
-   [Apache ECharts](https://echarts.apache.org/en/index.html) (v5.4.3)
-   [dvxCharts](https://www.dvxcharts.com/) (v5.1.0.0)
-   [SciChart.JS](https://www.scichart.com/javascript-chart-features/) (v3.2.516)
-   [Dygraphs](https://dygraphs.com/) (v2.2.1)
-   [CanvasJS](https://canvasjs.com/) (v1.8.0)
-   [ZingChart](https://www.zingchart.com/) (v2.9.13)
-   [C3.js](https://c3js.org/) (v0.7.20)
-   [Taucharts](https://taucharts.com/) (v2)
-   [Shield UI](https://www.shieldui.com/products/chart) (v1.7.45)
-   [μPlot](https://github.com/leeoniya/uPlot) (v1.6.27)
-   [AnyChart](https://www.anychart.com/) (v8.12.0)
-   [ApexCharts.js](https://apexcharts.com/) (v3.44.2)
-   [Google Charts](https://developers.google.com/chart) (April 2023 version)
-   [DevExtreme](https://js.devexpress.com/jQuery/) (v23.1.6)
-   [Chart.js](https://www.chartjs.org/) (v4.4.0)
-   [TOAST UI](https://ui.toast.com/tui-chart) (v4.6.1)
-   [FusionCharts (FusionTime)](https://www.fusioncharts.com/fusiontime) (v3.21.1)
-   [Smoothie Charts](http://smoothiecharts.org/) (v1.36.1)
-   [Epoch](https://epochjs.github.io/epoch/) (v0.8.4)

**3 different performance metrics**:

1. Data Loading Speed
2. Streaming Data Performance
3. Maximum Data Capacity

and **5 different use cases**:

1. Line charts
2. Scatter charts
3. Area charts
4. Step charts
5. Spline charts

Some important performance metrics are still outside the scope of this benchmark suite, such as: interactions performance (panning, zooming, changing time view, using cursor, etc.) and dynamic resize performance (resizing window).

## Disclaimer

Without context and numbers, users have a very difficult time understanding actual performance differences between solutions. Unfortunately, it is excessively common for products to be marketed with claims such as "Extreme Performance", or "5x More Performance". Yet, when comparing the same application it may perform very badly compared to another solution.

This is the very reason, why this project exists - to evolve from the empty claims to **proven, reproducable, numerical test results** and contribute to a clearer understanding of performance in this industry, guided by factual reporting. We do not claim any trademarks of competing companies mentioned, and all such trademarks are the property of their respective owners.

We have invested a lot of effort in implementing the 115 different test applications (23 libraries, 5 use cases for each). If you find any problems in our benchmark code, let us know by opening an issue in GitHub.

The test measurements are gathered using an automated benchmark script, which means that there can be no bias from:

-   Using different screen/monitor sizes (hardcoded test window size for all tests)
-   Human error in measurement (script does all measurements the same way)
-   Accumulating resource load (every benchmark is run in a fresh sandbox environment)

The performance comparison project is to be used only for **comparing** performance benchmarks within 1 run. The scores can't be reliably used for later analysis between different machines, hardware or product versions.

Competitor results are kept unidentified (for example, "Competitor A") to avoid any EULA infringements.

## Summary of results

-   On average, LightningChart JS loads data 4030 times faster than other data visualization solutions.
-   On average, LightningChart JS is 1511700 times more performant than other data visualization solutions when it comes to streaming data applications.
-   On average, LightningChart JS can display 15570 times larger data sets than other data visualization solutions.

## Data Loading Speed

How fast can each data visualization solution do a cold-start, load a static data set and display the data visualization on the screen? ([\*](#what-is-included-in-data-loading-speed-test-loadtimeseconds))

Data loading speed score is defined as

<!-- numChannels x dataPerCh / loadTimeSeconds -->

$$
\frac{{\text{numChannels} \times \text{dataPerCh}}}{{\text{loadTimeSeconds}}}
$$

In the below table you can see how other solutions Loading speed results fare against LightningChart JS.

| Solution          | Line Charts     | Scatter Charts  | Area Charts     | Spline Charts   | Step Charts     |
| :---------------- | :-------------- | :-------------- | :-------------- | :-------------- | :-------------- |
| LightningChart JS | Fastest         | Fastest         | Fastest         | Fastest         | Fastest         |
| Competitor D      | 4.9x slower     | 2.2x slower     | 11.4x slower    | 142.4x slower   | 4.2x slower     |
| Competitor E      | 1782.6x slower  | 867.8x slower   | 2492.9x slower  | 3785.8x slower  | 2793.3x slower  |
| Competitor G      | 4061.1x slower  | 5083.7x slower  | 6814.8x slower  | 7989.4x slower  | 6524.2x slower  |
| Competitor B      | 13802.3x slower | 10735.5x slower | 17496.1x slower | -               | 13703.0x slower |
| Competitor F      | 4824.8x slower  | 1999.8x slower  | 5251.3x slower  | 7442.1x slower  | 3932.8x slower  |
| Competitor H      | 1643.5x slower  | 510.3x slower   | 1740.3x slower  | 1806.2x slower  | 1742.0x slower  |
| Competitor J      | -               | 2325.6x slower  | 6614.5x slower  | -               | -               |
| Competitor A      | 2091.9x slower  | -               | 2427.3x slower  | 5074.0x slower  | 3254.9x slower  |
| Competitor C      | 695.0x slower   | -               | 105.6x slower   | 8192.8x slower  | 662.9x slower   |
| Competitor I      | 333.2x slower   | 321.5x slower   | 404.9x slower   | 1487.7x slower  | 30.4x slower    |
| Competitor K      | 363.1x slower   | -               | 829.0x slower   | 1439.5x slower  | 373.3x slower   |
| Competitor L      | 16730.6x slower | -               | 17221.1x slower | 16732.9x slower | 16660.0x slower |
| Competitor M      | 4689.8x slower  | 2450.2x slower  | 5590.9x slower  | 5883.9x slower  | -               |
| Competitor N      | 2295.4x slower  | 1682.6x slower  | 3065.7x slower  | 3423.9x slower  | 2490.2x slower  |
| Competitor O      | 28.7x slower    | 2204.7x slower  | 32.4x slower    | 3416.2x slower  | 1605.6x slower  |
| Competitor P      | 1099.4x slower  | 4451.3x slower  | 1823.1x slower  | 3530.2x slower  | 1877.1x slower  |
| Competitor Q      | -               | -               | -               | -               | -               |
| Competitor R      | 10320.0x slower | 4085.2x slower  | 13405.6x slower | 12090.6x slower | 10345.6x slower |
| Competitor S      | 2039.8x slower  | 2164.0x slower  | 2745.8x slower  | 2697.2x slower  | -               |
| Competitor T      | 169.6x slower   | 18.5x slower    | 193.2x slower   | 1770.4x slower  | 702.1x slower   |
| Competitor U      | 2955.8x slower  | 2605.7x slower  | 3454.3x slower  | 2973.9x slower  | 3347.7x slower  |

**On average, LightningChart JS loads data 4030 times faster than other data visualization solutions.**

[More information how these results were compiled](#more-information-about-data-loading-speed-results).

## Streaming Data Performance

How efficiently can each data visualization solution consume and display **streaming data** (data points coming in very small time intervals)?

Performance score is defined as

<!-- numChannels x newDataPerSecond x FPS -->

$$
\text{numChannels} \times \text{newDataPerSecond} \times \text{FPS}
$$

In the below table you can see how other solutions Performance results fare against LightningChart JS.

| Solution          | Line Charts    | Scatter Charts | Area Charts    | Spline Charts   | Step Charts     |
| :---------------- | :------------- | :------------- | :------------- | :-------------- | :-------------- |
| LightningChart JS | Best score     | Best score     | Best score     | Best score      | Best score      |
| Competitor D      | 500x worse     | 4.2x worse     | 1010x worse    | 16630x worse    | 340x worse      |
| Competitor E      | 345640x worse  | 3470x worse    | 413370x worse  | 388950x worse   | 430370x worse   |
| Competitor G      | 2716240x worse | 35980x worse   | 2943840x worse | 2915350x worse  | 2841440x worse  |
| Competitor B      | 6235020x worse | 112820x worse  | 6304780x worse | -               | 6255210x worse  |
| Competitor F      | 542610x worse  | 4380x worse    | 595640x worse  | 577580x worse   | 471740x worse   |
| Competitor H      | 432140x worse  | 2070x worse    | 495890x worse  | 539490x worse   | 373350x worse   |
| Competitor J      | -              | 2860x worse    | 390660x worse  | -               | -               |
| Competitor A      | 7911510x worse | -              | 6034390x worse | 15538910x worse | 15415210x worse |
| Competitor C      | 655120x worse  | -              | 671280x worse  | 684010x worse   | 665150x worse   |
| Competitor I      | 91720x worse   | 1150x worse    | 140520x worse  | 197900x worse   | 93760x worse    |
| Competitor K      | 78110x worse   | -              | 123770x worse  | 189920x worse   | 79590x worse    |
| Competitor L      | -              | -              | -              | -               | -               |
| Competitor M      | 1046960x worse | 12810x worse   | 1105470x worse | 1106820x worse  | -               |
| Competitor N      | 157190x worse  | 6190x worse    | 249630x worse  | 267310x worse   | 151570x worse   |
| Competitor O      | 165710x worse  | 24220x worse   | 379730x worse  | 559370x worse   | 160900x worse   |
| Competitor P      | 461930x worse  | 14410x worse   | 479390x worse  | 505390x worse   | 470230x worse   |
| Competitor Q      | 4990x worse    | -              | 82890x worse   | 100700x worse   | 5020x worse     |
| Competitor R      | 1688790x worse | 17230x worse   | 1830610x worse | 1768800x worse  | 1712910x worse  |
| Competitor S      | -              | -              | -              | -               | -               |
| Competitor T      | 87250x worse   | 280x worse     | 137820x worse  | 163430x worse   | 74020x worse    |
| Competitor U      | 6041910x worse | 82600x worse   | 7234200x worse | 10193390x worse | 6492710x worse  |

**On average, LightningChart JS is 1511700 times more performant than other data visualization solutions when it comes to streaming data applications.**

[More information how these results were compiled](#more-information-about-streaming-data-performance-results).

## Maximum Data Capacity

How large data sets can be visualized with each solution?
Scores are measured as number of data points across all channels.

In the below table you can see how other solutions data capacities fare against LightningChart JS.

| Solution          | Line Charts           | Scatter Charts        | Area Charts           | Spline Charts         | Step Charts           |
| :---------------- | :-------------------- | :-------------------- | :-------------------- | :-------------------- | :-------------------- |
| LightningChart JS | Largest data capacity | Largest data capacity | Largest data capacity | Largest data capacity | Largest data capacity |
| Competitor D      | 30.0x smaller         | 2.0x smaller          | 30.0x smaller         | 1500.0x smaller       | 30.0x smaller         |
| Competitor E      | 15000.0x smaller      | 100.0x smaller        | 15000.0x smaller      | 15000.0x smaller      | 1500.0x smaller       |
| Competitor G      | 15000.0x smaller      | 10000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      |
| Competitor B      | 15000.0x smaller      | 10000.0x smaller      | 15000.0x smaller      | -                     | 15000.0x smaller      |
| Competitor F      | 15000.0x smaller      | 1000.0x smaller       | 15000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      |
| Competitor H      | 1500.0x smaller       | 100.0x smaller        | 1500.0x smaller       | 1500.0x smaller       | 1500.0x smaller       |
| Competitor J      | -                     | 1000.0x smaller       | 15000.0x smaller      | -                     | -                     |
| Competitor A      | 15000.0x smaller      | -                     | 15000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      |
| Competitor C      | 15000.0x smaller      | -                     | 150.0x smaller        | 15000.0x smaller      | 15000.0x smaller      |
| Competitor I      | 1500.0x smaller       | 100.0x smaller        | 1500.0x smaller       | 1500.0x smaller       | 150.0x smaller        |
| Competitor K      | 1500.0x smaller       | -                     | 15000.0x smaller      | 1500.0x smaller       | 1500.0x smaller       |
| Competitor L      | 150000.0x smaller     | -                     | 150000.0x smaller     | 150000.0x smaller     | 150000.0x smaller     |
| Competitor M      | 15000.0x smaller      | 1000.0x smaller       | 15000.0x smaller      | 15000.0x smaller      | -                     |
| Competitor N      | 15000.0x smaller      | 1000.0x smaller       | 15000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      |
| Competitor O      | 30.0x smaller         | 1000.0x smaller       | 30.0x smaller         | 15000.0x smaller      | 15000.0x smaller      |
| Competitor P      | 15000.0x smaller      | 10000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      |
| Competitor Q      | 15000.0x smaller      | -                     | 15000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      |
| Competitor R      | 15000.0x smaller      | 10000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      |
| Competitor S      | 15000.0x smaller      | 1000.0x smaller       | 15000.0x smaller      | 15000.0x smaller      | -                     |
| Competitor T      | 1500.0x smaller       | 2.0x smaller          | 1500.0x smaller       | 15000.0x smaller      | 15000.0x smaller      |
| Competitor U      | 15000.0x smaller      | 1000.0x smaller       | 15000.0x smaller      | 15000.0x smaller      | 15000.0x smaller      |

**On average, LightningChart JS can display 15570 times larger data sets than other data visualization solutions.**

[More information how these results were compiled](#more-information-about-max-data-capacity-results).

## LightningChart JS Capabilities

These are the most impressive previously recorded feats with LightningChart JS.
Obviously, the achievable results differ based on hardware so we can't claim that everyone can reproduce these. The results in question were recorded with an relatively average desktop computer oriented for software development.

-   Maximum confirmed data set visualized as an interactive Line Chart: **1 500 million data points**
-   Massive data set with 10 million data points can be loaded and displayed in the blink of an eye: **0.29 seconds**
-   LightningChart JS can display 400 channels simultaneously with 1 000 Hz data stream rate per channel and 1 minute time window, adding up to a grand total of **24 million data points visible at every frame and updated at 60 FPS**.

## Clarifications

### On which basis were the solutions included in testing selected?

We have included almost every JavaScript-based data visualization library that we could find, as long as there was even small hints about active usage.

-   Both commercial and non-commercial libraries.
-   Open-source and closed source libraries.
-   Real-time oriented hardware accelerated libraries.
-   Almost 10 year old industry favorites.
-   Even small players, like `Epoch`.

### What is included in Data Loading Speed test "loadTimeSeconds"?

-   Setting up rendering frameworks, licenses and all steps that are required charts to be displayed.
-   All chart processing time between initiating the chart creation and displaying it, including chart method calls.
-   Any extra waiting time that is required before the chart is visible on the display.

### More information about Data Loading Speed results

For each solution and tested feature, the same test routine is executed.

1. First, find the approximate pain point (data set size) where the solution & feature combination starts to show visible delay in processing.

This is done by starting with small data set size, and steadily increasing it until the `loadTimeSeconds` measurement becomes higher than 3 seconds, but no higher than 10 seconds.
The tested data set sizes are always `[200, 1_000, 10_000, 100_000, 1_000_000, 5_000_000, 10_000_000, 50_000_000, 100_000_000, 150_000_000]`.
Number of channels is `10` always.

2. Repeat the test 5 times.

3. Use the median of measured `loadTimeSeconds` scores as the final value used for calculating the Data Loading Speed score.

$$
\frac{{\text{numChannels} \times \text{dataPerCh}}}{{\text{loadTimeSeconds}}}
$$

4. The final score indicates how fast the chart library can process and display data. This score can be compared between different charts linearly, even if they work with completely different data set sizes.

"-" result indicates that the particular combination of test type, solution and tested feature is not supported by the benchmark app. Full support table can be found [here](https://github.com/Arction/javascript-charts-performance-comparison/blob/main/supported.md).

> The Data Loading Speed benchmarks are only to be used for COMPARISON purposes!

The benchmarks are NOT a fair indication of "how fast solution X can load data".
The test is performed like this:

1. Create chart with all the data supplied immediately.
2. Wait for next animation frame.
3. Take a screenshot of the whole page using Puppeteer.

As you can see, taking the screenshot is extra loading time that is not necessary in normal use cases.
However, this is required to confirm that the chart is ready and still responsive.

This also doesn't necessarily mean that the chart is visible on the physical display - the Puppeteer screenshot can finish successfully with the chart properly displayed BEFORE it appears on the display. This seems to give some biased advantage to slower SVG/Canvas based charts.

### More information about Streaming Data Performance results

For each solution and tested feature, the same test routine is executed.

1. First, find the approximate pain point (data set size) where the solution & feature combination starts to clearly struggle.

This is done by starting with small data set size, and steadily increasing it until the `FPS` measurement drops below `55`.
The tested data set sizes are always `[200, 1_000, 10_000, 100_000, 1_000_000, 5_000_000, 10_000_000, 50_000_000, 100_000_000, 150_000_000]`.
Number of channels is `10` always. Stream rate is set to `1/10`th of the total displayed data count per channel.

2. Run the streaming performance test uninterrupted for 15 seconds, measuring FPS during the entire time. At test end, considering count of displayed frames and test duration, calculate FPS value used for calculating the Streaming Data Performance score.

$$
\text{numChannels} \times \text{newDataPerSecond} \times \text{FPS}
$$

3. The final score indicates how much incoming data the chart can handle in a scrolling update manner (display new data, roll old data out). The value combines both amount of incoming data as well as how well the chart is holding up (FPS).

"-" result indicates that the particular combination of test type, solution and tested feature is not supported by the benchmark app. Full support table can be found [here](https://github.com/Arction/javascript-charts-performance-comparison/blob/main/supported.md).

Frames are counted using `requestAnimationFrame`. This assumes that the chart does not delay displaying data updates in some asynchronous manner.

### More information about Max Data Capacity results

For each solution and tested feature, the same test routine is executed.

1. Find the highest amount of data points that the chart can successfully load. Test is timed out if it freezes out for 30 seconds.

This is done by starting with small data set size, and steadily increasing it until the chart can no longer perform the test.
The tested data set sizes are always `[200, 1_000, 10_000, 100_000, 1_000_000, 5_000_000, 10_000_000, 50_000_000, 100_000_000, 150_000_000]`.
Number of channels is `10` always.

"-" result indicates that the particular combination of test type, solution and tested feature is not supported by the benchmark app. Full support table can be found [here](https://github.com/Arction/javascript-charts-performance-comparison/blob/main/supported.md).

## Visualization errors

All visualization errors encountered during the tests are listed [here](https://github.com/Arction/javascript-charts-performance-comparison/blob/main/extra-info.md).

## Replicating performance test results

All benchmark code is open-source and found in this repository under `bench` folder.

You can run tests with commands `npm i` and `npm start`

The test can be configured by editing `bench/index.js` `config` variable.

Please remember:

-   Results are hardware specific. They can only be compared between measurements done with 1 same device.
-   While test measurements are recorded automatically, every single test run has to be manually verified
    -   If chart crashes or doesn't show completely then the measurement is not valid.
-   [Full disclaimer](#disclaimer)

Running all the tests according to the documented procedure takes around 4 hours, not counting writing down and analyzing the results.
