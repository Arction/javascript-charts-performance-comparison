/* eslint-disable no-async-promise-executor */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'

const config = {
    windowWidth: 2000,
    windowHeight: 1000,
    repeatCount: 5,
    channels: 1,
    appendTestDurationMs: 5000,
    save: false,
    test: 'test-lcjs.html',
    dataSetSize: 100_000,
    feature: 'line',
    timeoutMs: 10000,
}

const browser = await puppeteer.launch({
    headless: false,
    args: [
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--override-plugin-power-saver-for-testing=never',
        '--disable-extensions-http-throttling',
        `--window-size=${config.windowWidth + 100},${config.windowHeight + 200}`,
    ],
    // defaultViewport: null,
    // NOTE: For debugging
    // slowMo: 500,
})

const median = (numbers) => {
    const len = numbers.length
    if (len % 2 === 1) {
        return numbers[Math.floor(len / 2)]
    }
    return (numbers[len / 2 - 1] + numbers[len / 2]) / 2
}

const runTest = (config) => {
    config.appendPointsPerSecond = config.appendPointsPerSecond !== undefined ? config.appendPointsPerSecond : (config.dataSetSize * 1) / 10

    return new Promise(async (resolve) => {
        const page = await browser.newPage()
        let timeout
        page.on('console', async (msg) => {
            const text = msg.text()
            if (msg.type() === 'error' && !(text.includes('404') || text.includes('ERR_CONNECTION_REFUSED'))) {
                console.error(`Error occurred: ${text}`)
                clearTimeout(timeout)
                resolve({ error: true })
                await page.close()
            }
        })
        await page.setViewport({
            width: config.windowWidth,
            height: config.windowHeight,
        })
        await page.evaluate(() => {
            window.moveTo(0, 0)
            window.resizeTo(screen.width, screen.height)
        })
        // await new Promise((resolve) => setTimeout(resolve, 10_000));
        await page.exposeFunction('error', async () => {
            console.log('error reported by bench app')
            resolve({ error: true })
            await page.close()
        })
        await page.exposeFunction('testSetup', () => config)
        await page.exposeFunction('testReadyToBegin', async () => {
            const metrics0 = await page.metrics()
            let metrics1
            let loadTimeSeconds
            let loadJSHeapUsedSize
            let loadScriptDurationSeconds
            let loadingTestFinished = false
            await page.exposeFunction('loadingTestFinished', async (testStart, testEnd) => {
                const tReceivedMessage = performance.now()
                // Take a full screen screenshot using puppeteer. This forces the on-going GPU process to unclog in order to read-back pixel data from the display.
                const buffer = await page.screenshot({
                    type: 'png',
                })
                const tAppUnclogged = performance.now()
                const loadingSpeedResultMs = testEnd - testStart + (tAppUnclogged - tReceivedMessage)
                clearTimeout(timeout)
                timeout = setTimeout(async () => {
                    console.log('timeout C')
                    resolve({ error: true })
                    await page.close()
                }, 5_000 + config.appendTestDurationMs)
                // NOTE: For debugging whether chart actually displayed the data
                // await page.screenshot({ path: 'screenshot.png', type: 'png' })
                metrics1 = await page.metrics()
                loadTimeSeconds = loadingSpeedResultMs / 1000
                loadJSHeapUsedSize = metrics1.JSHeapUsedSize - metrics0.JSHeapUsedSize
                loadScriptDurationSeconds = metrics1.ScriptDuration - metrics0.ScriptDuration

                // Confirm that the chart was visible in the screenshot by analysing the png.
                // We simply check that there is any non white pixel in the screenshot.
                // If some chart has any scenario where this might be the case even before the chart is visible, then those must be confirmed individually.
                const png = PNG.sync.read(buffer)
                let anyNonWhitePixel = false
                for (var y = 0; y < png.height; y++) {
                    for (var x = 0; x < png.width; x++) {
                        var i = (png.width * y + x) << 2
                        const r = png.data[i]
                        const g = png.data[i + 1]
                        const b = png.data[i + 2]
                        const a = png.data[i + 3]
                        if (r !== 255 || g !== 255 || b !== 255) {
                            anyNonWhitePixel = true
                            break
                        }
                    }
                    if (anyNonWhitePixel) break
                }
                if (!anyNonWhitePixel) {
                    console.log('screenshot is completely white')
                    resolve({ error: true })
                    await page.close()
                }
                loadingTestFinished = true
                // For manual confirmation via file
                fs.writeFileSync(`${config.test}.png`, PNG.sync.write(png))
            })
            await page.exposeFunction('appendTestFinished', async (timestamp, appendFPS) => {
                if (!loadingTestFinished) {
                    await new Promise((resolve) => setTimeout(resolve, 3000))
                }
                clearTimeout(timeout)
                const metrics2 = await page.metrics()
                const appendScriptDurationSeconds = metrics2.ScriptDuration - metrics1.ScriptDuration
                const appendJSHeapUsedSize = metrics2.JSHeapUsedSize - metrics1.JSHeapUsedSize
                await page.close()
                resolve({
                    loadTimeSeconds,
                    loadJSHeapUsedSize,
                    loadScriptDurationSeconds,
                    appendScriptDurationSeconds,
                    appendFPS,
                    appendJSHeapUsedSize,
                })
            })
            clearTimeout(timeout)
            timeout = setTimeout(async () => {
                console.log('timeout B')
                resolve({ error: true })
                await page.close()
            }, config.timeoutMs || 15_000)
            await page.evaluate(() => {
                requestAnimationFrame(() => {
                    window.testStart = window.performance.now()
                    window.testPerform()
                })
            })
        })
        timeout = setTimeout(async () => {
            console.log('timeout A')
            resolve({ error: true })
            await page.close()
        }, 60_000)
        await page.goto(`http://localhost:8080/${config.test}`)
    })
}

const results = []
for (let i = 0; i < config.repeatCount; i += 1) {
    const result = await runTest(config)
    console.log(`\t${i + 1}/${config.repeatCount}`, result)
    if (result.error) {
        continue
    }
    results.push(result)
}

if (results.length > 0) {
    const loadTimeSeconds = median(results.map((test) => test.loadTimeSeconds))
    const loadJSHeapUsedSize = median(results.map((test) => test.loadJSHeapUsedSize))
    const loadScriptDurationSeconds = median(results.map((test) => test.loadScriptDurationSeconds))
    const appendScriptDurationSeconds = median(results.map((test) => test.appendScriptDurationSeconds))
    const appendFPS = median(results.map((test) => test.appendFPS))
    const appendJSHeapUsedSize = median(results.map((test) => test.appendJSHeapUsedSize))

    const testResults = {
        loadTimeSeconds,
        loadJSHeapUsedSize,
        loadScriptDurationSeconds,
        appendScriptDurationSeconds,
        appendFPS,
        appendJSHeapUsedSize,
    }
    console.log(`MEDIAN SCORE:${JSON.stringify(testResults)}`)

    if (config.save) {
        let data = {}
        const filePath = path.resolve('data.json')
        if (fs.existsSync(filePath)) {
            data = JSON.parse(fs.readFileSync(filePath))
        }
        data[config.test] = data[config.test] || {}
        data[config.test][JSON.stringify(config)] = testResults
        fs.writeFileSync(filePath, JSON.stringify(data))
    }
}

await browser.close()
