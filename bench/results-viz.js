
const url = new URL(document.URL)
const target = url.searchParams.get('target')

if (!target) {
    const targets = ['static', 'append', 'refresh']
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

    if (target === 'static') {
        data = {
            chartTitle: 'Line Chart Speed Comparison 10 Million Data Points',
            categoryAxisTitle: 'JavaScript Chart Library',
            valueAxisTitle: '',
            values: [
              { name: 'LightningChart JS', values: [
                  { value: 1, label: '330 ms' },
              ] },
              {
                  name: 'Competitor A', values: [
                      { value: 330 / 1300, label: '1300 ms' }
                  ]
              },
              {
                  name: 'Competitor B', values: [
                      { value: 330 / 11947, label: '11947 ms' }
                  ]
              },
              {
                  name: 'Competitor C', values: [
                      { value: 330 / 3472, label: '3472 ms', warning: true }
                  ]
              },
              {
                  name: 'Competitor D', values: [
                      { value: 330 / 3626, label: '3626 ms' }
                  ]
              },
              {
                  name: 'Competitor E', values: [
                      { value: 330 / 735, label: '735 ms' }
                  ]
              },
              {
                  name: 'Competitor F', values: [
                      { value: 330 / 9880, label: '9880 ms' }
                  ]
              },
              {
                  name: 'Competitor G', values: [
                      { value: 330 / 7497, label: '7497 ms' }
                  ]
              },
              {
                  name: 'Competitor H', values: [
                      { value: 330 / 3740, label: '3740 ms' }
                  ]
              },
              {
                  name: 'Competitor I', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' }
                  ]
              },
              {
                  name: 'Competitor J', values: [
                      { value: 330 / 10220, label: '10220 ms' }
                  ]
              },
              {
                  name: 'Competitor K', values: [
                    { value: 330 / 42658, label: '42658 ms' }
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
              { 
                  name: 'LightningChart JS',
                  values: [
                    { value: 100 - 57.6, label: 'CPU: 57.6%' },
                    ]
                },
              {
                  name: 'Competitor A', values: [
                    { value: 100 - 93.6, label: 'CPU: 93.6%' },
                  ]
              },
              {
                  name: 'Competitor B', values: [
                    { value: 100 - 100.0, label: 'CPU: 100.0%', label2: 'FPS: 0.9', color2: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor C', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor D', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor E', values: [
                    { value: 100 - 94.4, label: 'CPU: 94.4%' },
                  ]
              },
              {
                  name: 'Competitor F', values: [
                    { value: 100 - 100, label: 'CPU: 100.0%', label2: 'FPS: 1.3', color2: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor G', values: [
                    { value: 100 - 100, label: 'CPU: 100.0%', label2: 'FPS: 0.4', color2: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor H', values: [
                    { value: 100 - 100, label: 'CPU: 100.0%', label2: 'FPS: 2.3', color2: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor I', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor J', values: [
                    { value: 100 - 100, label: 'CPU: 100.0%', label2: 'FPS: 0.7', color2: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor K', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
            ]
          }
    }

    // ----- APPENDING -----
    if (target === 'append') {
        data = {
            chartTitle: 'Appending Line Chart Performance Comparison (10 channels, 10 kHz, 15 s history)',
            categoryAxisTitle: 'JavaScript Chart Library',
            valueAxisTitle: '',
            values: [
              { 
                  name: 'LightningChart JS',
                  values: [
                    { value: 60, label: 'FPS: 60' },
                    { value: 100 - 21, label: 'CPU: 21%' },
                ]
              },
              {
                  name: 'Competitor A', values: [
                    { value: 13, label: 'FPS: 13' },
                    { value: 100 - 100, label: 'CPU: 100%' },
                  ]
              },
              {
                  name: 'Competitor B', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor C', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor D', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor E', values: [
                    { value: 13, label: 'FPS: 13' },
                    { value: 100 - 100, label: 'CPU: 100%' },
                  ]
              },
              {
                  name: 'Competitor F', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor G', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor H', values: [
                    { value: 1, label: 'FPS: 1' },
                    { value: 100 - 100, label: 'CPU: 100%' },
                  ]
              },
              {
                  name: 'Competitor I', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor J', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
              {
                  name: 'Competitor K', values: [
                    { value: -1, label: 'FAIL', color: '#ff0000' },
                  ]
              },
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
        data.values.reduce((prev, cur) => cur.values[i]? Math.max(prev, cur.values[i].value) : prev, 0)
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
            const { value, label, warning, label2, color2 } = valueItem
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

            const uiLayout = chart.addUIElement(UILayoutBuilders.Column.setBackground(UIBackgrounds.None), { x: axisX, y: axesY[i] })
                .setOrigin(UIOrigins.CenterBottom)
                .setMargin({bottom: 6})
                .setPosition({ x: xBarCenter, y: valueMin })

            const uiLabel = uiLayout.addElement(UIElementBuilders.TextBox)
                .setText(label)

            if (valueItem.color) {
                uiLabel
                    .setTextFillStyle(new SolidFill({color: ColorHEX(valueItem.color)}))
                    .setTextFont((font) => font.setWeight('bold'))
            }

            if (label2) {
                const uiLabel2 = uiLayout.addElement(UIElementBuilders.TextBox)
                    .setText(label2)
                if (color2) {
                    uiLabel2
                        .setTextFillStyle(new SolidFill({color: ColorHEX(color2)}))
                        .setTextFont((font) => font.setWeight('bold'))
                }
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
