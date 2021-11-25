
const url = new URL(document.URL)
const target = url.searchParams.get('target')

if (!target) {
    const targets = ['static-small', 'static-large', 'append', 'refresh']
    const div = document.createElement('div')
    div.style.display = 'flex'
    div.style.flexDirection = 'column'
    targets.forEach((target) => {
        const link = document.createElement('a')
        link.href = `?target=${target}`
        link.innerHTML = target
        div.append(link)
    })
    document.body.append(div)
} else {
    const {
      lightningChart,
      AxisTickStrategies,
      SolidFill,
      emptyLine,
      UIOrigins,
      LinearGradientFill,
      ColorHEX,
      UIElementBuilders,
      UILayoutBuilders,
      UIBackgrounds,
      Themes,
      ImageFill,
      ImageFitMode,
      emptyFill,
      ColorRGBA,
    } = lcjs;

    // ----- REFRESHING -----
    let data

    if (target === 'static-small') {
        data = {
            chartTitle: 'Line Chart Speed Comparison 1 Million Data Points',
            categoryAxisTitle: 'JavaScript Chart Library',
            valueAxisTitle: '',
            values: [
                { 
                    name: 'LightningChart JS', 
                    values: [
                        { value: 1, label: '180 ms' },
                    ]
                },
                {
                    name: 'Hardware accelerated competitor A', values: [
                        { value: 180 / 368, label: '368 ms' }
                    ]
                },
                {
                    name: 'Competitor B', values: [
                        { value: 180 / 1045, label: '1045 ms' }
                    ]
                },
                {
                    name: 'Competitor C', values: [
                        { value: 180 / 646, label: '646 ms', warning: true }
                    ]
                },
                {
                    name: 'Hardware accelerated competitor D', values: [
                        { value: 180 / 521, label: '521 ms' }
                    ]
                },
                {
                    name: 'Competitor E', values: [
                        { value: 180 / 148, label: '148 ms' }
                    ]
                },
                {
                    name: 'Competitor F', values: [
                        { value: 180 / 598, label: '598 ms' }
                    ]
                },
                {
                    name: 'Competitor G', values: [
                        { value: 180 / 922, label: '922 ms' }
                    ]
                },
                {
                    name: 'Competitor H', values: [
                        { value: 180 / 520, label: '520 ms' }
                    ]
                },
                {
                    name: 'Competitor I', values: [
                        { value: 180 / 8701, label: '8701 ms' }
                    ]
                },
                {
                    name: 'Competitor J', values: [
                        { value: 180 / 1192, label: '1192 ms' }
                    ]
                },
                {
                    name: 'Competitor K', values: [
                        { value: 180 / 42658, label: '42658 ms' }
                    ]
                },
            ]
          }
    }

    if (target === 'static-large') {
        data = {
            chartTitle: 'Line Chart Speed Comparison 10 Million Data Points',
            categoryAxisTitle: 'JavaScript Chart Library',
            valueAxisTitle: '',
            values: [
              { name: 'LightningChart JS', values: [
                  { value: 1, label: '1246 ms' },
              ] },
              {
                  name: 'Hardware accelerated competitor A', values: [
                      { value: 1246 / 3305, label: '3305 ms' }
                  ]
              },
              {
                  name: 'Competitor B', values: [
                      { value: 1246 / 11947, label: '11947 ms' }
                  ]
              },
              {
                  name: 'Competitor C', values: [
                      { value: 1246 / 3868, label: '3868 ms', warning: true }
                  ]
              },
              {
                  name: 'Hardware accelerated competitor D', values: [
                      { value: 1246 / 28554, label: '28554 ms' }
                  ]
              },
              {
                  name: 'Competitor E', values: [
                      { value: 1246 / 2824, label: '2824 ms' }
                  ]
              },
              {
                  name: 'Competitor F', values: [
                      { value: 1246 / 33754, label: '33754 ms' }
                  ]
              },
              {
                  name: 'Competitor G', values: [
                      { value: 1246 / 42201, label: '42201 ms' }
                  ]
              },
              {
                  name: 'Competitor H', values: [
                      { value: 1246 / 45342, label: '45342 ms' }
                  ]
              },
              {
                  name: 'Competitor I', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' }
                  ]
              },
              {
                  name: 'Competitor J', values: [
                      { value: 1246 / 56169, label: '56169 ms' }
                  ]
              },
              {
                  name: 'Competitor K', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' }
                  ]
              },
            ]
          }
    }

    if (target === 'refresh') {
        data = {
            chartTitle: 'Refreshing Line Chart Performance Comparison (1 M data points, 10 Hz refresh rate)',
            categoryAxisTitle: 'JavaScript Chart Library',
            valueAxisTitle: '',
            values: [
              { name: 'LightningChart JS', values: [
                  // NOTE: FPS measurements over refresh rate (10) are clamped.
                  { value: Math.min(10, 42.4), label: 'FPS: 10.0' },
                  { value: 100 - 57.6, label: 'CPU: 57.6%' }
              ] },
              {
                  name: 'Hardware accelerated competitor A', values: [
                      { value: Math.min(10, 14), label: 'FPS: 14.0' },
                      { value: 100 - 93.6, label: 'CPU: 93.6%' }
                  ]
              },
              {
                  name: 'Competitor B', values: [
                      { value: Math.min(10, 0.9), label: 'FPS: 0.9' },
                      { value: 100 - 100.0, label: 'CPU: 100.0%' }
                  ]
              },
              {
                  name: 'Competitor C', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                    { value: -1, label: 'FAIL', color: '#ff0000' }
                  ]
              },
              {
                  name: 'Hardware accelerated competitor D', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                    { value: -1, label: 'FAIL', color: '#ff0000' }
                  ]
              },
              {
                  name: 'Competitor B', values: [
                      { value: Math.min(10, 0.9), label: 'FPS: 0.9' },
                      { value: 100 - 100.0, label: 'CPU: 100.0%' }
                  ]
              },
              {
                  name: 'Competitor E', values: [
                      { value: Math.min(10, 25), label: 'FPS: 25.0' },
                      { value: 100 - 94.4, label: 'CPU: 94.4%' }
                  ]
              },
              {
                  name: 'Competitor F', values: [
                      { value: Math.min(10, 1.3), label: 'FPS: 1.3' },
                      { value: 100 - 100, label: 'CPU: 100.0%' }
                  ]
              },
              {
                  name: 'Competitor G', values: [
                      { value: Math.min(10, 0.4), label: 'FPS: 0.4' },
                      { value: 100 - 100, label: 'CPU: 100.0%' }
                  ]
              },
              {
                  name: 'Competitor H', values: [
                      { value: Math.min(10, 2.3), label: 'FPS: 2.3' },
                      { value: 100 - 100, label: 'CPU: 100.0%' }
                  ]
              },
              {
                  name: 'Competitor I', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                    { value: -1, label: 'FAIL', color: '#ff0000' }
                  ]
              },
              {
                  name: 'Competitor J', values: [
                      { value: Math.min(10, 0.7), label: 'FPS: 0.7' },
                      { value: 100 - 100, label: 'CPU: 100.0%' }
                  ]
              },
              {
                  name: 'Competitor K', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                    { value: -1, label: 'FAIL', color: '#ff0000' }
                  ]
              },
            ]
          }
    }

    // ----- APPENDING -----
    if (target === 'append') {
        data = {
            chartTitle: 'Appending Surface Chart Performance Comparison (sample size = 500, stream rate 200 Hz)',
            categoryAxisTitle: 'JavaScript Chart Library',
            valueAxisTitle: '',
            values: [
              { name: 'LightningChart JS', values: [
                  { value: 60.0, label: 'FPS: 60.0' },
                  { value: 100 - 7.5, label: 'CPU: 7.5%' }
              ] },
              {
                  name: 'Hardware accelerated competitor A', values: [
                      { value: 5.8, label: 'FPS: 5.8' },
                      { value: 100 - 100.0, label: 'CPU: 100.0%' }
                  ]
              },
              {
                  name: 'Competitor B', values: [
                      { value: 0.7, label: 'FPS: 0.7' },
                      { value: 100 - 100.0, label: 'CPU: 100.0%' }
                  ]
              },
              {
                  name: 'Competitor C', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                    { value: -1, label: 'FAIL', color: '#ff0000' }
                  ]
              }
            ]
          }
    }

    data.values = data.values.sort((a, b) => b.values[0].value - a.values[0].value)

    const chart = lightningChart()
        .ChartXY({theme: Themes.darkGold})
        .setTitle(data.chartTitle)

    const axisX = chart.getDefaultAxisX()
      .setTitle(data.categoryAxisTitle)
      .setTickStrategy(AxisTickStrategies.Empty)

      const legend = chart.addUIElement(UILayoutBuilders.Column)
        .setPosition({x: 100, y: 60})
        .setOrigin(UIOrigins.RightTop)
        .setMargin(16)
        .setPadding(8)

    const fillStyles = new Array(data.values.length).fill(0).map((_, i) => chart.getTheme().seriesFillStyle(i))

    const valuesCount = data.values.reduce((prev, cur) => Math.max(prev, cur.values.length), 0)
    const yValuesMax = new Array(valuesCount).fill(0).map((_, i) => 
        data.values.reduce((prev, cur) => Math.max(prev, cur.values[i].value), 0)
    )

    const axesY = new Array(valuesCount).fill(0).map((_, i) => {
        if (i === 0) return chart.getDefaultAxisY()
            .setTitle(data.valueAxisTitle)
            .setTickStrategy(AxisTickStrategies.Empty)
        else
            return chart.addAxisY()
                .setTickStrategy(AxisTickStrategies.Empty)
                .setStrokeStyle(emptyLine)
    })

    const rectSeriesList = axesY.map((axisY) => chart.addRectangleSeries({yAxis: axisY}))
    let x = 1
    data.values.forEach((category, iCategory) => {
        const { name, values } = category
        const xCategoryStart = x
        const color = fillStyles[iCategory].getColor()
        const entry = legend.addElement(UIElementBuilders.CheckBox)
            .setButtonOnFillStyle(new SolidFill({color}))
            .setOn(true)
            .setText(name)
            .setTextFont((font) => font.setSize(18))
        values.forEach((valueItem, i) => {
            const { value, label, warning } = valueItem
            const xBarStart = x
            x += 1
            const xBarEnd = x
            if (i < values.length - 1) { 
                x += 0.2
            }
            const xBarCenter = (xBarStart + xBarEnd) / 2
            const rectSeries = rectSeriesList[i]
            const valueMin = Math.max(value, yValuesMax[i] * .01)
            if (value !== -1) {
                const bar = rectSeries.add({
                    x1: xBarStart,
                    x2: xBarEnd,
                    y1: 0,
                    y2: valueMin,
                })
                bar.setFillStyle(new LinearGradientFill({
                    stops: [
                        {offset: 0, color: color.setA(60)},
                        {offset: 1, color}
                    ]
                }))
            }
            const uiLabel = chart.addUIElement(UIElementBuilders.TextBox.setBackground(UIBackgrounds.None), { x: axisX, y: axesY[i] })
                .setText(label)
                .setOrigin(UIOrigins.CenterBottom)
                .setMargin({bottom: 6})
                .setPosition({ x: xBarCenter, y: valueMin })
            if (valueItem.color) {
                uiLabel
                    .setTextFillStyle(new SolidFill({color: ColorHEX(valueItem.color)}))
                    .setTextFont((font) => font.setWeight('bold'))
            }
            
            if (warning) {
                const warningImg = new Image()
                warningImg.src = 'analysis/warning.png'
                warningImg.addEventListener('load', e => {
                    const imgSize = { x: warningImg.width, y: warningImg.height }
                    const imgAspectRatio = imgSize.y / imgSize.x
                    const iconSizePx = { x: 64, y: 64 * imgAspectRatio }
                    const uiIcon = chart.addUIElement(UIElementBuilders.TextBox, { x: axisX, y: axesY[i] })
                        .setPosition({ x: xBarCenter, y: valueMin })
                        .setOrigin(UIOrigins.CenterBottom)
                        .setTextFillStyle(emptyFill)
                        .setMargin({ bottom: 40 })
                        .setPadding({ left: iconSizePx.x, top: iconSizePx.y })
                        .setBackground(background => background
                            .setStrokeStyle(emptyLine)
                            .setFillStyle(new ImageFill({
                                source: warningImg,
                                fitMode: ImageFitMode.Fit,
                            }))
                        )
                })
            }
        })
        const xCategoryEnd = x
        const xCategoryCenter = (xCategoryStart + xCategoryEnd) / 2
        axisX.addCustomTick(UIElementBuilders.AxisTick)
            .setValue(xCategoryCenter)
            .setTextFormatter(_ => name)
            .setGridStrokeStyle(emptyLine)

        if (iCategory < data.values.length - 1) {
            x += 1
        }
    })
    x += 1
    axisX.setInterval(0, x, false, true)
    axesY.forEach((axisY, i) => axisY.setInterval(0, yValuesMax[i] * 1.1, false, true))

    legend.dispose()

    // ;(async () => {
    //     const libs = [
    //         'lcjs-v.3.3.0',
    //         'plotly',
    //         'scichart'
    //     ]
    //     const dataSets = await Promise.all(libs.map(lib => 
    //         fetch(`benchmarks/${target}_pc_${lib}.json`)
    //             .then(r => r.json())
    //             .then(r => r.filter(item => ! item._TEMPLATE))
    //     ))
    //     console.log(dataSets)
    // })();
}
