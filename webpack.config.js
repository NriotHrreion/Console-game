const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "main.js"
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: "Copyright (c) NriotHrreion "+ new Date().getFullYear(),
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            minify: {
                removeComments: false
            },
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin({
            extractComments: false
        })]
    },
    devtool: "source-map",
};
