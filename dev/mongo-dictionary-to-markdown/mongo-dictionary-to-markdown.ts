import fs from 'fs';
import path from 'path';

const dict = JSON.parse(fs.readFileSync(path.join(__dirname, 'dictionary_definitions.json'), 'utf8'));

console.log(dict);
