import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const suites = { chrome: "tests/test.ts", firefox: "tests/firefox.ts" }
const selected = process.argv.slice(2)
const browsers = selected.length ? selected : Object.keys(suites)
if (browsers.some(browser => !Object.hasOwn(suites, browser))) {
    console.error("Usage: pnpm exec node tests/local.mjs [chrome|firefox]")
    process.exit(1)
}

const result = spawnSync(process.execPath, [
    fileURLToPath(import.meta.resolve("mocha/bin/mocha.js")),
    ...browsers.map(browser => suites[browser]),
], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    stdio: "inherit",
    env: { ...process.env, CHROME_HEADLESS: "false", FIREFOX_HEADLESS: "false" },
})
if (result.error) console.error(result.error)
process.exit(result.status ?? 1)
