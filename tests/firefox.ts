import {defineExtensionSuite } from "./extension-suite.ts"

defineExtensionSuite("firefox", () => ({
    executablePath: process.env.FIREFOX_EXEC_PATH,
    headless: process.env.FIREFOX_HEADLESS !== "false",
}))
