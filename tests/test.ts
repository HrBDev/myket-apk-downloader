import {defineExtensionSuite } from "./extension-suite.ts"

defineExtensionSuite("chrome", extensionPath => ({
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    headless: process.env.CHROME_HEADLESS !== "false",
    enableExtensions: [extensionPath],
    slowMo: 20,
    pipe: true,
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--font-render-hinting=none",
    ],
}))
