const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const { DefinePlugin } = require("webpack")

module.exports = (env = {}) => {
    const apiSelector = env.apiSelector === true || env.apiSelector === "true"
    const copyAssets = (context, browser) => ({
        from: ".",
        to: `./${browser}`,
        context,
        globOptions: {
            ignore: apiSelector ? [] : ["**/options.html", "**/options.js"],
        },
        transform(content, absolutePath) {
            if (path.basename(absolutePath) !== "manifest.json") return content
            const manifest = JSON.parse(content.toString())
            const actionKey = browser === "chrome" ? "action" : "browser_action"
            if (apiSelector) {
                manifest[actionKey] = {
                    default_title: "Choose API Version",
                    default_popup: "options.html",
                }
            } else {
                delete manifest[actionKey]
            }
            return JSON.stringify(manifest, null, 4)
        },
    })

    return {
        mode: "production",
        entry: {
            "chrome/scripts/content-script": path.resolve(
                __dirname,
                "..",
                "src",
                "content-script.ts",
            ),
            "firefox/scripts/content-script": path.resolve(
                __dirname,
                "..",
                "src",
                "content-script.ts",
            ),
        },
        output: {
            path: path.join(__dirname, "../dist"),
            filename: "[name].js",
            // Remove stale selector assets when switching back to a release build.
            clean: { keep: asset => !/^(chrome|firefox)(\/|$)/.test(asset) },
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new DefinePlugin({
                __API_SELECTOR_ENABLED__: JSON.stringify(apiSelector),
            }),
            new CopyPlugin({
                patterns: [
                    copyAssets("public", "chrome"),
                    copyAssets("public_firefox", "firefox"),
                ],
            }),
        ],
        optimization: {
            minimize: false,
        },
    }
}
