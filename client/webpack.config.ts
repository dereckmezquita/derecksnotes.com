
const path = require('path');
import { makePlugins } from './helpers/plugins';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const plugins = makePlugins([
    {
        filename: "index.html",
        template: "index.ejs",
        chunks: ["card_entries"]
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
                    {
                        loader: 'file-loader',
                        options: { outputPath: 'css/', name: '[name].min.css'}
                    },
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
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'public'),
        clean: true
    },
    plugins: [
        ...plugins
    ]
}
