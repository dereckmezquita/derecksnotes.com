import { MongoClient } from 'mongodb';
import readline from 'readline';
import { readdirSync, readFileSync } from 'fs';
import { parse } from 'path';
import cheerio from 'cheerio';
import 'colors';
import df from 'date-format';

type EntryDoc = {
    siteSection: string;
    subSection: null | string;
    fileName: string;
    author: string;
    articleTitle: string;
    image: string;
    slogan: string;
    summary: string;
    categories: string[];
    published: boolean;
    date: Date;
}

const sections = ['blog', 'courses', 'exercises', 'references'];
const categories = ['programming', 'biology', 'science', 'computer science', 'history'];
const defaultAuthor = "Dereck de Mezquita";

const url = 'mongodb://127.0.0.1:27017';;
const client = new MongoClient(url);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function interrogate(question: string, defaultAns: string = ""): Promise<string> {
    return new Promise(resolve => {
        rl.question(`${question} [${defaultAns.cyan}]: `, ans => {
            if(ans === "" && defaultAns === "") {
                interrogate(question).then(ans2 => {
                    resolve(ans2);
                });

                return;
            }

            if(ans === "" && defaultAns) ans = defaultAns;

            return resolve(ans);
        });
    });
}

async function buildEntryDoc(entryName: string): Promise<EntryDoc> {
    const entryFile = `${entryName}.ejs`
    // const entryString = readFileSync(`../../client/src/blog/${entryFile}`).toString();
    const entryString = readFileSync(`./entry/${entryFile}`).toString();
    const $ = cheerio.load(entryString);
    const title = $('article h1').first().text().trim();
    const summary = $('article p').first().text().trim();

    let entryDoc: EntryDoc = {
        siteSection: "",
        subSection: null,
        fileName: "",
        author: "",
        articleTitle: "",
        image: "",
        slogan: "",
        summary: "",
        categories: [],
        published: true,
        date: new Date()
    };

    console.log(`Title: ${title.green}`);
    console.log(`Summary: ${summary.green}`);

    entryDoc.articleTitle = title;
    entryDoc.summary = summary;
    entryDoc.fileName = `${entryName}.html`

    entryDoc.siteSection = await interrogate("Site Section");

    if(!sections.includes(entryDoc.siteSection )) {
        console.error(`${entryDoc.siteSection} is not a valid section!`);
        process.exit(1);
    }

    entryDoc.subSection = await interrogate("Sub Section (leave blank if none)");

    entryDoc.author = await interrogate("Author", defaultAuthor);
    entryDoc.image = await interrogate("Image");
    entryDoc.slogan = await interrogate("Slogan");
    entryDoc.categories = (await interrogate("Categories (cat1,cat2,cat3)")).split(',');

    for(const category of entryDoc.categories) {
        if(!categories.includes(category)) {
            console.error(`${category} is not a valid category!`);
            process.exit(1);
        }
    }
    
    const retroDate = await interrogate("Retro Date", df.asString('yyyy-MM-dd', new Date()));

    const date = new Date(retroDate);

    if(date.toString() === "Invalid Date") {
        console.error("Invalid date!");
        process.exit(1);
    }

    entryDoc.date = date;

    console.log(entryDoc);

    const looksGood = await interrogate("Does this look good?", "y");

    if(looksGood === "y") return entryDoc;

    process.exit(1);
}

(async () => {
    await client.connect();

    const db = client.db('entries');
    const collection = db.collection('metadata');

    const titles: string[] = await collection.distinct('fileName');

    // let entries: string[] = readdirSync('../../client/src/blog');
    let entries: string[] = readdirSync('./entry');

    for(const entry of entries) {
        if(entry.indexOf('.') == -1) continue;

        const entryName = parse(entry).name;
        const fileName = `${entryName}.html`;

        if(!titles.includes(fileName)) {
            const entryDoc = await buildEntryDoc(entryName);

            const insertResults = await collection.insertOne(entryDoc);

            console.log(insertResults);

            console.log(`Successfully inserted ${entryDoc.fileName} into db!`);
        }
    }

    await client.close();
    rl.close();
})().catch(err => {
    console.error(err);
    process.exit(1);
});
