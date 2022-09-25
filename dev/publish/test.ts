
import cheerio from 'cheerio';
import fs from 'fs';

// list files in entry
const files = fs.readdirSync('entry');

// read each file
files.forEach((file) => {
    const data = fs.readFileSync(`entry/${file}`, 'utf8');
    const $ = cheerio.load(data);
    const h1 = $('h1').first().text();
    console.log(h1);
});
