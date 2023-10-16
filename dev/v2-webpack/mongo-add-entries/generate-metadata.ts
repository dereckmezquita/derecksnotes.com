
import fs from 'fs';
import path from 'path';

import cheerio from 'cheerio';

// list only files not directories
const files: string[] = fs.readdirSync(path.resolve(__dirname, './entries-to-parse'));

const siteSection: string = "references";
const subSection: string = "cheat-sheets";

const metadata: Object[] = [];

for (let file of files) {
    let fileName = file;
    // change extension from ejs to html
    fileName = file.replace('.ejs', '.html');

    // get date from file name
    const date = file.split('_')[0];
    // date is in format YYYYMMDD
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);

    // read the file as text
    const fileText = fs.readFileSync(path.resolve(__dirname, './entries-to-parse', file), 'utf8');

    // load the file text into cheerio
    const $ = cheerio.load(fileText);

    // get the title of the article get the first h1 tag
    const title: string = $('h1').first().text();

    // get the first paragraph inside of the article tags
    let firstParagraph: string = $('article p').first().text();
    // trim whitespace and new lines
    firstParagraph = firstParagraph.trim();

    // start shoving stuff into the metadata
    metadata.push({
        siteSection: siteSection,
        subSection: subSection,
        fileName: fileName,
        author: "Dereck de Mezquita",
        articleTitle: title,
        image: 0,
        slogan: "",
        summary: firstParagraph,
        retroDate: {
            year: +year,
            month: +month,
            day: +day
        },
        categories: [],
        published: true
    });
}

// save metadata
fs.writeFileSync(path.resolve(__dirname, `./${siteSection}-metadata.json`), JSON.stringify(metadata, null, 4));

console.log(metadata);