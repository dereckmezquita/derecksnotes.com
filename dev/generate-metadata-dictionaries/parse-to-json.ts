
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

const dictioary_path: string = '../../client/src/dictionaries/dictionary-biology.ejs';

// read the file with cheerio
const dictionary: string = fs.readFileSync(path.resolve(__dirname, dictioary_path), 'utf8');

// load the file with cheerio
const $ = cheerio.load(dictionary);

// get all li elements of class definition as an array of cheerio elements
const definitions = $('li.definition').toArray();

type Definition = {
    dictionary: string;
    category: string,
    dataSource: string,
    identifier: string,
    linksTo: string[],
    linkedFrom: string[]
    html: string
}

const dictionaryCategory: string = "biology";

let db_def: Definition[] = [];

// loop over each definition
for (let i = 0; i < definitions.length; i++) {
    let definition = definitions[i];

    // data-dictionary attribute of the definition
    const category: string = $(definition).attr('data-dictionary') as string;

    // data-src attribute of the definition
    const dataSource: string = $(definition).attr('data-src') as string;

    // from the first a element get the id attribute
    const identifier: string = $(definition).find('a').first().attr('id') as string;

    // get all a elements that do not have class definition and their href attributes
    let links = $(definition).find('a:not(.definition-word)');
    
    //  get all the href attributes of the a elements
    let linksTo: (string | undefined)[] = links.toArray().map((a) => {
        const link: string = $(a).attr('href') as string
        // if the link doesn't have a # then ignore it
        if (link.indexOf('#') === -1) {
            // return nothing
            return undefined;
        }

        return link.replace('#', '');
    });

    // remove all the undefined values from the array
    linksTo = linksTo.filter((link) => link !== undefined) as string[];

    // get all elements in the definition as a string of html
    let html = $(definition).html() as string;

    html = html.replace(/data-category=\".*\"[\s]+?/, "")
        .replace(/data-src=\".*\"[\s]+?/, "")
        .replace(/data-dictionary=\".*\"[\s]+?/, "")
        .trim();

    // push into definitions array
    db_def.push({
        dictionary: dictionaryCategory,
        category: category,
        dataSource: dataSource,
        identifier: identifier,
        linksTo: linksTo as string[],
        linkedFrom: [],
        html: html
    });
}

// create linked from array and push into db_def
// loop over every definition
for (let i = 0; i < db_def.length; i++) {
    // current definition
    const def1 = db_def[i];
    // loop over every definition this current definition links to
    for (let j = 0; j < def1.linksTo.length; j++) {
        // current link from def1
        const link = def1.linksTo[j];
        // loop over every definiton to check if it is linked from def1
        for (let k = 0; k < db_def.length; k++) {
            // check if the current definition is linked from def1 via link
            const def2 = db_def[k];
            if (def2.identifier === link) {
                def2.linkedFrom.push(def1.identifier);
            }
        }
    }

    // remove duplicates from linked from array and the links to array
    def1.linkedFrom = [...new Set(def1.linkedFrom)];
    def1.linksTo = [...new Set(def1.linksTo)];
}

// write to json file
fs.writeFileSync(path.resolve(__dirname, 'parsed-definitions.json'), JSON.stringify(db_def, null, 4));