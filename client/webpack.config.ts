
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

// ----------------------------
import { makePlugins } from './helpers/plugins';
import { createEntriesPlugins } from './helpers/sections';

const plugins: Object[] = makePlugins([
    {
        filename: "index.html",
        template: "index.ejs",
        chunks: ["general_bundle", "styles", "request_cards"]
    },
    ...createEntriesPlugins("blog", [
        "general_bundle",
        "styles",
        "article_bundle"
    ]) as any,
    {
        filename: "courses.html",
        template: "courses.ejs",
        chunks: ["general_bundle", "styles", "request_cards"]
    },
    ...createEntriesPlugins("courses", [
        "general_bundle",
        "styles",
        "article_bundle"
    ]) as any,
    {
        filename: "exercises.html",
        template: "exercises.ejs",
        chunks: ["general_bundle", "styles", "request_cards"]
    },
    ...createEntriesPlugins("exercises", [
        "general_bundle",
        "styles",
        "article_bundle"
    ]) as any,
    {
        filename: "tools.html",
        template: "tools.ejs",
        chunks: ["general_bundle", "styles", "request_cards"]
    },
    ...createEntriesPlugins("tools", [
        "general_bundle",
        "styles",
        "article_bundle"
    ]) as any,
    ...createEntriesPlugins("dictionaries", [
        "general_bundle",
        "styles",
        "dictionary_bundle"
    ]) as any
]);

module.exports = {
    mode: "development",
    entry: {
        // ----------------------------
        // ----------------------------
        // scripts
        general_bundle: path.resolve(__dirname, 'src/ts/general_bundle.ts'),
        article_bundle: path.resolve(__dirname, 'src/ts/article_bundle.ts'),
        dictionary_bundle: path.resolve(__dirname, 'src/ts/dictionary_bundle.ts'),
        // ----------------------------
        request_cards: path.resolve(__dirname, 'src/ts/modules/request_cards.ts'),
        request_definitions: path.resolve(__dirname, 'src/ts/modules/request_definitions.ts'),
        // ----------------------------
        // ----------------------------
        pre_processing_dictionary: path.resolve(__dirname, 'src/ts/pre_processing_dictionary.ts'),
        // ----------------------------
        // ----------------------------
        // styles
        styles: path.resolve(__dirname, 'src/scss/index.scss'),
        // ----------------------------
        // ----------------------------
        // libraries
        // mathjax: path.resolve(__dirname, 'src/libraries/mathjax.js'),
        // ----------------------------
        // ----------------------------
        // development scripts
        test: path.resolve(__dirname, 'src/ts/test.ts')
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
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve("stream-browserify")
        }
    },
    output: {
        filename: 'js/[contenthash].js', // temp during dev
        path: path.resolve(__dirname, 'public'),
        clean: true
    },
    plugins: [
        ...plugins,
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({ filename: "css/[contenthash].css" }), // temp during dev
        new CopyPlugin({
            patterns: [
                { // https://stackoverflow.com/questions/45036810/webpack-copying-files-from-source-to-public-using-copywebpackplugin
                    context: './src/',
                    from: "./**/*\.(ico|pdf|png|svg|jpg|jpeg|gif|mov)",
                    to: "./",
                    noErrorOnMissing: true
                }
            ]
        })
        // ,
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             context: './src/',
        //             from: "./libraries/mathjax.js",
        //             to: "./libraries/mathjax.js",
        //             noErrorOnMissing: true
        //         }
        //     ]
        // })
    ]
}
