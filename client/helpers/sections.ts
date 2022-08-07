
import fs from 'fs';
import path from 'path';

export const createEntriesPlugins = (section: string, chunks: string[] = ["index", "set_entry_title", "styles", "word_count"]): Object[] => {
    const entries = fs.readdirSync(path.join("src", section))
        .filter(e => e.endsWith(".ejs"))

    const plugin: Object[] = [];

    for (const entry of entries) {
        plugin.push({
            filename: path.join(section, entry.replace(".ejs", ".html")),
            template: path.join(section, entry),
            chunks: chunks
        })
    }

    return plugin;
}
