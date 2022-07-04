
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const templateFolder = '../src/';

interface PluginConfig {
    filename: string;
    template: string;
    chunks?: string[];
    inject?: boolean;
}

export const makePlugins = (configs: PluginConfig[]): Object[] => {
    const plugins: Object[] = [];

    configs.forEach(v => {
        const temp = v.template;

        v.template = path.resolve(__dirname, `${templateFolder}${temp}`),
        plugins.push(new HtmlWebpackPlugin(v));
    });

    return plugins;
}
