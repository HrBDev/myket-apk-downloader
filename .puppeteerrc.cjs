const { join } = require("path")

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // Install test browsers explicitly; dependency installation needs no browsers.
    skipDownload: true,
    // Changes the cache location for Puppeteer.
    cacheDirectory: join(__dirname, ".cache", "puppeteer"),
}
