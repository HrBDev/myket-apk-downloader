import puppeteer from "puppeteer"
import * as path from "path"
import * as url from "url"
import { expect, assert } from "chai"

let browser, browserPage

describe("Extension Integration Testing", function () {
	this.timeout(25000)

	before(async () => {
		const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
		const extensionPath = path.join(__dirname, "..", "dist")
		browser = await puppeteer.launch({
			executablePath: process.env.PUPPETEER_EXEC_PATH,
			headless: false,
			enableExtensions: [extensionPath],
			pipe: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--font-render-hinting=none",
			],
		})
		browserPage = await browser.newPage()
		await browserPage.goto(
			"https://myket.ir/app/com.sibche.aspardproject.app",
		)
	})

	it("Check for a valid url", async function () {
		const inputElement = await browserPage.waitForSelector("#mainInstall")
		assert.ok(inputElement)
		await new Promise(r => setTimeout(r, 5000))
		expect(await inputElement.evaluate(el => el.href)).match(
			/^https:\/\/.{3}-data-\d+\.myket\.ir/,
		)
	})

	after(async () => await browser.close())
})
