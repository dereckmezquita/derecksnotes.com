import HtmlWebpackPlugin from 'html-webpack-plugin';

console.log(typeof HtmlWebpackPlugin)

interface PluginConfig {
    filename: string;
    template: string;
    chunks?: string[];
}

const makePlugins = (configs: PluginConfig[]): Object[] => {
    const plugins: Object[] = [];

    configs.forEach(v => {
        plugins.push(new HtmlWebpackPlugin(v));
    });

    return plugins;
}

const pluggies = makePlugins([
    { filename: "boi.html", template: "boi.ejs", chunks: ['boi'] },
    { filename: "boi2.html", template: "boi2.ejs", chunks: ['boi2'] }
]);

console.log(pluggies);