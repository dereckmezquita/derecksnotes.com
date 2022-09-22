
import fs from 'fs';

const files: string[] = fs.readdirSync('./articles');

// read each file as a string
const articles: string[] = files.map(file => {
    const content: string = fs.readFileSync(`./articles/${file}`, 'utf8')
    // regex match script with newlines tags and return the content between them
    const script: string = content.match(/<script>([\s\S]*)<\/script>/)[1]
    // const script: string = content.match(/<script.*?>(.*?)<\/script>/g)![0];
});

console.log(articles[0]);
