import ejs from 'ejs';
import { writeFileSync, readFileSync } from 'fs';
import { basename } from 'path';

export const renderEJS = (file: string, outFile: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        let compiled;
        let str: any;

        try {
            compiled = ejs.compile(readFileSync(file).toString(), { filename: basename(file) });
            str = compiled();
        } catch(err) {
            reject(err);
        }

        writeFileSync(outFile, str);
        resolve();
    });
}

renderEJS("./index.ejs", "index.html").then(() => {
    console.log("SUCCsess");
}).catch(console.error);
