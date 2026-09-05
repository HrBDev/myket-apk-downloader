import { launch } from "puppeteer"
import type { Browser, Page } from "puppeteer"
import { mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { expect } from "chai"

const extensionPath = fileURLToPath(new URL("../dist/firefox/", import.meta.url))
const artifactPath = fileURLToPath(new URL("../.cache/firefox-e2e/", import.meta.url))

describe("Firefox extension integration testing", function () {
    this.timeout(150000)

    let browser: Browser | undefined
    let page: Page | undefined
    const diagnostics: string[] = []

    before(async function () {
        browser = await launch({
            browser: "firefox",
            executablePath: process.env.FIREFOX_EXEC_PATH,
            headless: process.env.FIREFOX_HEADLESS !== "false",
            defaultViewport: { width: 1280, height: 720 },
        })
        // Install the actual Firefox build into Puppeteer's temporary profile.
        // Do this before navigation so Firefox injects its content script normally.
        const extensionId = await browser.installExtension(extensionPath)
        expect(extensionId).to.be.a("string").and.not.empty
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
        if (!page) throw new Error("Firefox page was not created")
        await page.goto("https://myket.ir/app/com.sibche.aspardproject.app", {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        })
        // Wait for the extension's async API calls, not a fixed sleep.
        const result = await page.waitForFunction(() => {
            const button = document.querySelector<HTMLAnchorElement>("a.btn-download")
            return button && /^https:\/\/.{3}-data-\d+\.myket\.ir\//.test(button.href)
                ? button.href
                : false
        }, { timeout: 60000 })
        expect(await result.jsonValue()).to.match(/^https:\/\/.{3}-data-\d+\.myket\.ir\//)
        await result.dispose()
    })

    afterEach(async function () {
        if (this.currentTest?.state !== "failed" || !page) return
        console.error("Firefox diagnostics:", diagnostics.join("\n"))
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
