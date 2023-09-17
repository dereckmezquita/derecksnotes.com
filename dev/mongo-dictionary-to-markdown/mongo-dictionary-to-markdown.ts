import fs from 'fs';
import path from 'path';

interface MongoDefinition {
    _id: {
        $oid: string;
    };
    dictionary: string;
    category: string;
    dataSource: string;
    letter: string;
    identifier: string;
    linksTo: string[];
    linkedFrom: string[];
    html: string;
}

const dict: MongoDefinition[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'dictionary_definitions.json'), 'utf8'));

// I want to output each word to a separate file with extension .mdx
// I want each file to have a frontmatter like this:
// ---
// letter: 'a'
// word: 'Absorbance'
// dictionary: 'biology'
// category: 'ecology'
// dataSource: 'dereck'

// published: true

// linksTo: ['ingestion']
// linkedFrom: ['plate reader']
// ---

// our input json has an arrya of these
// {
//     "_id": {
//         "$oid": "6352159f0774c21f8f229be2"
//     },
//     "dictionary": "biology",
//     "category": "zoology",
//     "dataSource": "berkeley",
//     "letter": "a",
//     "identifier": "abdomen",
//     "linksTo": [],
//     "linkedFrom": [],
//     "html": "<a class=\"definition-word\" id=\"abdomen\">Abdomen</a> - Region of the body furthest from the mouth. In insects, the third body region behind the head and thorax."
// },
// for the html we want to
// 1. remove the first <a> tag that preceeds the hyphen - this is the word itself; we want to use this word to set the word in the frontmatter
// 2. convert it to markdown

// we want to create the filename from
// 1. the dictionary name
// 2. the category name
// 3. the letter
// 4. the word; for this use the word but remove any spaces and replace with hyphens

import { NodeHtmlMarkdown } from 'node-html-markdown'

const result: string[] = [];

for (const def of dict) {
    // check if it's an alpha character or if I will classify it in #
    // # is for numbers and symbols
    const isLetter: boolean = def.letter.match(/[a-z]/i) !== null;
    const letter: string = isLetter ? def.letter : '#';

    const file_name: string = `${def.dictionary}_${def.category}_${letter}_${def.identifier.replace(/\s|_/g, '-')}.mdx`;

    // console.log(file_name);

    // now we need to process the HTML
    // let's extract the word from the HTML this will be extracted from the first <a> tag that preceeds the hyphen
    // const match = def.html.match(/<a .*?>([^<]+)<\/a> \-/); // (/<a .*?>((?:<[^>]+>|[^<]+)*)<\/a> \-/)
    const word_anchor: string = def.html.split(/<\/a> -(\s?)/)[0]
        .replace(/class="definition-word" /g, '').
        replace(/<em>|<\/em>/g, '*')
        + '</a>';

    const defintion: string = def.html.split(/<\/a> -(\s?)/)[2];

    console.log(defintion);

    // console.log('\x1b[31m', def.html, '\x1b[0m');
    // console.log('\x1b[32m', html, '\x1b[0m');

    const mdx = NodeHtmlMarkdown.translate(defintion, {
        bulletMarker: '-',
        emDelimiter: '*',
        blockElements: ['div']
    }).replace(/%5F/g, '_'); // the parser is converting underscores to %5F so we need to convert them back

    // console.log('\x1b[34m', mdx, '\x1b[0m');

    // console.log('\x1b[33m', mdx, '\x1b[0m');

    // replace all linksTo and linkedFrom _ with -
    // def.linksTo = def.linksTo.map((link) => link.replace(/\s|_/g, '-'));
    // def.linkedFrom = def.linkedFrom.map((link) => link.replace(/\s|_/g, '-'));

    const frontmatter: string = `---
letter: '${letter}'
word: '${def.identifier.replace(/\s|_/g, '-')}'
dictionary: '${def.dictionary}'
category: '${def.category}'
dataSource: '${def.dataSource}'

published: true

linksTo: ['${def.linksTo.join("','")}']
linkedFrom: ['${def.linkedFrom.join("','")}']
---
`;

    result.push(frontmatter + '\n' + word_anchor + ' - ' + mdx + '\n\n\n-:-:-:-:-:-:-:-:-\n\n\n');
}

fs.writeFileSync(path.join(__dirname, 'all.mdx'), result.join(''));