
const path = require('path');
import { makePlugins } from './helpers/plugins';

import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
    mode: "development",
    entry: {
        bundle: path.resolve(__dirname, 'src/ts/index.ts'),
        card_entries: path.resolve(__dirname, 'src/ts/card_entries.ts')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-webpack-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public'),
        clean: true
    },
    plugins: makePlugins([
        {
            filename: "index.html",
            template: "index.ejs",
            chunks: ['card_entries']
        },
        {
            filename: "courses.html",
            template: "index.ejs"
        }
    ])
}
