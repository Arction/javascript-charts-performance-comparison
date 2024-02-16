// NOTE: Only to allow running test apps directly in browser, outside Puppeteer
window.testSetup =
    window.testSetup ||
    (() =>
        new Promise((resolve) => {
            window.testReadyToBegin = () => {
                window.testStart = window.performance.now()
                window.testPerform()
                console.log('start')
            }
            window.loadingTestFinished = (tStart, tNow) => {
                console.log('loading test', tNow - tStart)
            }
            resolve({
                windowWidth: 2000,
                windowHeight: 1000,
                repeatCount: 1,
                channels: 10,
                dataSetSize: 10_000_000,
                appendPointsPerSecond: 10_000,
                appendTestDurationMs: 0,
            })
        }))
