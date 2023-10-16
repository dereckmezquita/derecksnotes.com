import fs from 'fs';
import path from 'path';

const mdx_string: string = fs.readFileSync(path.join(__dirname, 'all.mdx'), 'utf8');

const mdx_array: string[] = mdx_string.split('-:-:-:-:-:-:-:-:-');

// pop the last element which is an empty string
mdx_array.pop();

for (let mdx of mdx_array) {
    // fileName cannot be null we need to specify it to typescript
    const file_name: string = mdx.match(/fileName: '([^']+)'/)![1];
    // remove the fileName and delete the line where the fileName was
    mdx = mdx.replace(/\nfileName: '([^']+)'/, '').trim();

    mdx = mdx.trim();

    // write each file
    fs.writeFileSync(path.join(__dirname, '../../client/src/content/dictionaries/biology', file_name), mdx);
}
