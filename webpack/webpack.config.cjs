const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    mode: "production",
    entry: {
        "chrome/scripts/content-script": path.resolve(__dirname, "..", "src", "content-script.ts"),
        "firefox/scripts/content-script": path.resolve(__dirname, "..", "src", "content-script.ts")
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: ".", to: "./chrome", context: "public" },
                { from: ".", to: "./firefox", context: "public_firefox" }
            ]
        }),
    ],
    optimization: {
        minimize: false
    }
}
