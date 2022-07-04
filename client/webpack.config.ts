
const path = require('path');
import { makePlugins } from './helpers/plugins';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

const plugins = makePlugins([
    {
        filename: "index.html",
        template: "index.ejs",
        chunks: ["card_entries", "styles"],
        inject: true
    },
    {
        filename: "portfolio.html",
        template: "portfolio.ejs"
    },
    {
        filename: "courses.html",
        template: "courses.ejs"
    },
    {
        filename: "exercises.html",
        template: "exercises.ejs"
    },
    {
        filename: "tools.html",
        template: "tools.ejs"
    }
]);

module.exports = {
    mode: "development",
    entry: {
        bundle: path.resolve(__dirname, 'src/ts/index.ts'),
        card_entries: path.resolve(__dirname, 'src/ts/card_entries.ts'),
        styles: path.resolve(__dirname, 'src/scss/main.scss')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-webpack-loader',
                options: {
                    data: {
                        title: "Bruh"
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'js/[contenthash].js',
        path: path.resolve(__dirname, 'public'),
        clean: true
    },
    plugins: [
        ...plugins,
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({filename: "css/[contenthash].css"})
    ]
}