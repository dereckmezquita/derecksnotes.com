import {renderEJS} from './renderEJS';
import {resolve} from 'path';
import {readFileSync, writeFileSync} from 'fs';
const dateFormat = require('date-format');

const defaultMetadata = {
    "siteSection": "",
    "fileName": "",
    "author": "Dereck de Mezquita",
    "articleTitle": "",
    "image": "",
    "slogan": "",
    "summary": "",
    "categories": []
}

const sections = ['blog', 'courses', 'exercises'];
const categories = ['cat1', 'cat2', 'cat3', 'cat4'];

const date = dateFormat.asString('yyyyMMdd', new Date());
const time = dateFormat.asString('hh:mm', new Date());

console.log(date, time);

// const metadata = JSON.parse(readFileSync(resolve(__dirname, 'metadata.json')).toString());

// if(sections.indexOf(metadata['siteSection']) === -1) exitWithError("Invalid siteSection!");

// for (let category of metadata['categories']) {
//     if(categories.indexOf(category) === -1) exitWithError(`Category '${category}' is invalid!`);
// }

// if(metadata['retroDate']['year'] !== 0) {

// }

// function exitWithError(errorMsg: string) {
//     console.error(errorMsg);
//     process.exit(1);
// }