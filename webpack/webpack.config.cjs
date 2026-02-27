const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    mode: "production",
    entry: {
        "content-script": path.resolve(__dirname, "..", "src", "content-script.ts")
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "scripts/[name].js"
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
                { from: ".", to: "./firefox", context: "public_firefox" },
                { from: "./scripts", to: "./chrome/scripts", context: "dist" },
                { from: "./scripts", to: "./firefox/scripts", context: "dist" }
            ]
        }),
    ],
    optimization: {
        minimize: false
    }
}
