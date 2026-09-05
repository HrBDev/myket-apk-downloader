import { launch } from "puppeteer"
import type { Browser, LaunchOptions, Page } from "puppeteer"
import { mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { expect } from "chai"

export function defineExtensionSuite(
    browserName: "chrome" | "firefox",
    launchOptions: (extensionPath: string) => LaunchOptions,
) {
    const extensionPath = fileURLToPath(new URL(`../dist/${browserName}/`, import.meta.url))
    const artifactPath = fileURLToPath(new URL(`../.cache/${browserName}-e2e/`, import.meta.url))

    describe(`${browserName} extension integration testing`, function () {
        this.timeout(150000)

        let browser: Browser | undefined
        let page: Page | undefined
        const diagnostics: string[] = []

        before(async function () {
            browser = await launch({
                browser: browserName,
                defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 1 },
                ...launchOptions(extensionPath),
            })
            // Chrome loads via enableExtensions; Firefox installs after launch.
            if (browserName === "firefox") {
                const extensionId = await browser.installExtension(extensionPath)
                expect(extensionId).to.be.a("string").and.not.empty
            }
            page = await browser.newPage()
            page.on("pageerror", error => diagnostics.push(String(error)))
            page.on("console", message => {
                if (message.type() === "error") diagnostics.push(message.text())
            })
            page.on("requestfailed", request => {
                diagnostics.push(`${request.url()}: ${request.failure()?.errorText}`)
            })
        })

        it("replaces the download button with a Myket APK URL", async function () {
            if (!page) throw new Error(`${browserName} page was not created`)
            await page.goto("https://myket.ir/app/com.sibche.aspardproject.app", {
                waitUntil: "domcontentloaded",
                timeout: 60000,
            })
            const result = await page.waitForFunction(() => {
                const button = document.querySelector<HTMLAnchorElement>("a.btn-download")
                return button && /^https:\/\/.{3}-data-\d+\.myket\.ir\//.test(button.href)
                    ? button.href
                    : false
            }, { timeout: 60000 })
            try {
                expect(await result.jsonValue()).to.match(/^https:\/\/.{3}-data-\d+\.myket\.ir\//)
            } finally {
                await result.dispose()
            }
        })

        afterEach(async function () {
            if (this.currentTest?.state !== "failed" || !page) return
            console.error(`${browserName} diagnostics:`, diagnostics.join("\n"))
            console.error("Download button:", await page.evaluate(() => ({
                href: document.querySelector("a.btn-download")?.getAttribute("href"),
                text: document.getElementById("basebtn")?.textContent,
            })).catch(String))
            await mkdir(artifactPath, { recursive: true })
            await page.screenshot({ path: `${artifactPath}/failure.png` }).catch(console.error)
        })

        after(async function () {
            await browser?.close()
        })
    })
}
