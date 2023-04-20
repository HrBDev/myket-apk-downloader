const puppeteer = require("puppeteer-core")
const { join } = require("path")
const { expect, assert } = require("chai")

let browserPage = null
let browser = null

describe("Extension Integration Testing", function () {
	this.timeout(25000) // wait for browser to open
	before(async () => await setup())

	describe("App Page", async function () {
		it("Check for a valid url", async function () {
			const inputElement = await browserPage.waitForSelector(
				"body > div.container > section:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a",
			)
			assert.ok(inputElement)
			await browserPage.waitForTimeout(5000)
			expect(await inputElement.evaluate(el => el.href)).match(
				RegExp("^https:\\/\\/cdn[0-9]?[0-9]?[0-9]?\\.myket\\.ir"),
			)
		})
	})

	after(async () => await browser.close())
})

async function setup() {
	let extensionPath = join(__dirname, "..", "dist")
	console.log(extensionPath)
	browser = await puppeteer.launch({
		executablePath: process.env.PUPPETEER_EXEC_PATH,
		headless: false,
		args: [
			'--no-sandbox',
			`--disable-extensions-except=${extensionPath}`,
			`--load-extension=${extensionPath}`,
		],
	})

	browserPage = await browser.newPage()
	await browserPage.goto("https://myket.ir/app/com.sibche.aspardproject.app")
}
