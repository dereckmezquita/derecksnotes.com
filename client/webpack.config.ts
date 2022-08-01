
import path from 'path';
import { makePlugins } from './helpers/plugins';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const plugins: Object[] = makePlugins([
    {
        filename: "index.html",
        template: "index.ejs",
        chunks: ["bundle", "card_entries", "styles"],
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
        mathjax: path.resolve(__dirname, 'src/libraries/mathjax.js'),
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
                    root: path.resolve(__dirname, 'public'),
                    data: {
                        title: "Bruh"
                    }
                }
            },
            // https://stackoverflow.com/questions/68634225/webpack-5-file-loader-generates-a-copy-of-fonts-with-hash-name
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: './fonts/[name][ext]'
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: './images/[name][ext]'
                }
            }
        ]
    },
    watch: true,
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
        new MiniCssExtractPlugin({ filename: "css/[contenthash].css" }),
        new CopyPlugin({
            patterns: [
                { // https://stackoverflow.com/questions/45036810/webpack-copying-files-from-source-to-public-using-copywebpackplugin
                    context: './src/',
                    from: "./**/*\.(png|svg|jpg|jpeg|gif)",
                    to: "./",
                    noErrorOnMissing: true
                }
            ]
        })
    ]
}
