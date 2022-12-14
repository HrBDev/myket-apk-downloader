const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")
module.exports = {
    mode: "production",
    entry: {
        injectScript: path.resolve(__dirname, "..", "src", "injectScript.ts")
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
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
        new webpack.DefinePlugin({
            Auth: JSON.stringify("")
        }),
    ],
    optimization: {
        minimize: true
    }
}