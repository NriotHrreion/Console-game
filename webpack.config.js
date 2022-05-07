const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "main.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
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
            title: "控制台小游戏",
            favicon: "public/favicon.png",
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
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    devtool: "source-map",
};
