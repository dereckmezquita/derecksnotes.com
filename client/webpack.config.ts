
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
        chunks: ["index", "styles", "request_entries"]
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
    },
    ...createEntriesPlugins("blog", ["index", "styles", "articles"]) as any,
    // ...createEntriesPlugins("courses") as any,
    // ...createEntriesPlugins("exercises") as any,
    // ...createEntriesPlugins("portfolio") as any,
    // ...createEntriesPlugins("tools") as any
    // sections of website
    ...createEntriesPlugins("dictionaries", [
        "index",
        "articles",
        "styles"
    ]) as any
]);

module.exports = {
    mode: "development",
    entry: {
        // ----------------------------
        // ----------------------------
        // scripts
        index: path.resolve(__dirname, 'src/ts/index.ts'),
        // inject get entries script
        request_entries: path.resolve(__dirname, 'src/ts/request_entries.ts'),
        // functionality scripts
        articles: path.resolve(__dirname, 'src/ts/articles.ts'), // includes all article prefixed scripts
        // separate article modules
        article_figures: path.resolve(__dirname, 'src/ts/modules/article_figures.ts'),
        article_foot_notes: path.resolve(__dirname, 'src/ts/modules/article_foot_notes.ts'),
        article_title: path.resolve(__dirname, 'src/ts/modules/article_title.ts'),
        article_word_count: path.resolve(__dirname, 'src/ts/modules/article_word_count.ts'),
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
        mathjax: path.resolve(__dirname, 'src/libraries/mathjax.js')
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
                    from: "./**/*\.(pdf|png|svg|jpg|jpeg|gif|mov)",
                    to: "./",
                    noErrorOnMissing: true
                }
            ]
        })
    ]
}
