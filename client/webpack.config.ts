
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

// ----------------------------
import { makePlugins } from './helpers/plugins';
import { createEntriesPlugins } from './helpers/sections';

const article_plugs: string[] = ["general_bundle", "styles", "article_bundle"];
const top_plugs: string[] = ["general_bundle", "styles", "top_level_bundle"];

const plugins: Object[] = makePlugins([
    {
        filename: "index.html",
        template: "index.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("blog", article_plugs) as any,
    {
        filename: "account.html",
        template: "account.ejs",
        chunks: ["general_bundle", "styles", "account_bundle"]
    },
    {
        filename: "courses.html",
        template: "courses.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("courses", article_plugs) as any,
    {
        filename: "exercises.html",
        template: "exercises.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("exercises", article_plugs) as any,
    {
        filename: "references.html",
        template: "references.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("references", article_plugs) as any,
    {
        filename: "tools.html",
        template: "tools.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("tools", article_plugs) as any,
    {
        filename: "art.html",
        template: "art.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("art", article_plugs) as any,
    ...createEntriesPlugins("dictionaries", article_plugs) as any
]);

module.exports = {
    // watch: true,
    mode: "development",
    entry: {
        // ----------------------------
        // scripts
        top_level_bundle: path.resolve(__dirname, 'src/ts/top_level_bundle.ts'), // get's cards
        general_bundle: path.resolve(__dirname, 'src/ts/general_bundle.ts'),
        article_bundle: path.resolve(__dirname, 'src/ts/article_bundle.ts'),
        account_bundle: path.resolve(__dirname, 'src/ts/account_bundle.ts'),
        // ----------------------------
        // styles
        styles: path.resolve(__dirname, 'src/scss/index.scss'),
        // ----------------------------
        // libraries
        // mathjax: path.resolve(__dirname, 'src/libraries/mathjax.js'),
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
            crypto: require.resolve('crypto-browserify'), // TODO: use subtle crypto
            stream: require.resolve("stream-browserify")
        }
    },
    output: {
        filename: 'js/[contenthash].js', // temp during dev
        // filename: 'js/[name].js',
        path: path.resolve(__dirname, 'public'),
        clean: true
    },
    plugins: [
        ...plugins,
        new FixStyleOnlyEntriesPlugin(),
        // new MiniCssExtractPlugin({ filename: "css/[name].css" }), // temp during dev
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
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/manifest.json", to: "./" }
            ]
        })
    ]
}
