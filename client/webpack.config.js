
const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ejs$/,
                loader: 'ejs-webpack-loader',
            }
        ]
    },
    entry: {
        bundle: path.resolve(__dirname, 'src/entries/entry.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename: "bruh.html",
        template: path.resolve(__dirname, 'src/index.ejs')
    })],
}
