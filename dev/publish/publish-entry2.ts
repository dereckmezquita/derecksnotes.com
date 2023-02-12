import { MongoClient, Collection } from 'mongodb';
import readline from 'readline';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { parse } from 'path';
import cheerio from 'cheerio';
import 'colors';
import df from 'date-format';

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sections = ['blog', 'courses', 'exercises', 'references', 'tools', 'art'];
const subSection = ["biography", "biology", "biology-wet-lab", "cheat-sheets", "cheet-sheets", "chemistry", "mathematics"]
const categories = ['programming', 'biology', 'science', 'computer science', 'history', 'art', 'technology', 'business', 'music', 'literature', 'philosophy', 'mathematics', 'travel'];
const defaultAuthor = "Dereck de Mezquita";
const defaultDate = df.asString('yyyy-MM-dd', new Date());

type EntryDoc = {
    siteSection: string;
    subSection: string | null;
    fileName: string;
    author: string;
    articleTitle: string;
    image: string;
    slogan: string;
    summary: string;
    categories: string[];
    published: boolean;
    date: Date;
};

async function askQuestion(question: string, defaultAnswer: string = ''): Promise<string> {
    return new Promise((resolve) => {
        rl.question(`${question} [${defaultAnswer.cyan}]: `, (answer) => {
            if (answer === '' && defaultAnswer === '') {
                askQuestion(question).then((res) => {
                    resolve(res);
                });

                return;
            }

            if (answer === '' && defaultAnswer) answer = defaultAnswer;

            resolve(answer);
        });
    });
}

async function buildEntryDoc(entryName: string, section: string): Promise<EntryDoc> {
    const entryFile = `${entryName}.ejs`;
    // const entryString = readFileSync(`../../client/src/blog/${entryFile}`).toString();
    const entryString = readFileSync(`../../client/src/${section}/${entryFile}`).toString();

    const $ = cheerio.load(entryString);
    const title = $('article h1').first().text().trim();
    const summary = $('article p').first().text().trim();

    const entryDoc: EntryDoc = {
        siteSection: '',
        subSection: null,
        fileName: '',
        author: '',
        articleTitle: '',
        image: '',
        slogan: '',
        summary: '',
        categories: [],
        published: true,
        date: new Date(),
    };

    console.log(`Title: ${title.green}`);
    console.log(`Summary: ${summary.green}`);

    entryDoc.articleTitle = title;
    entryDoc.summary = summary;
    entryDoc.fileName = `${entryName}.html`;

    entryDoc.siteSection = await askQuestion('Site Section');

    if (!sections.includes(entryDoc.siteSection)) {
        console.error(`${entryDoc.siteSection} is not a valid section!`);
        return Promise.reject(new Error(`Invalid section: ${entryDoc.siteSection}`));
    }

    entryDoc.subSection = await askQuestion('Sub Section (leave blank if none)');

    // subsection is allows to be null or a string
    // if subsection does not equal null or is not included in the subSection array
    if (entryDoc.subSection !== null && !subSection.includes(entryDoc.subSection)) {
        console.error(`${entryDoc.subSection} is not a valid subsection!`);
        return Promise.reject(new Error(`Invalid subsection: ${entryDoc.subSection}`));
    }

    entryDoc.author = await askQuestion('Author', defaultAuthor);
    entryDoc.image = await askQuestion('Image');
    entryDoc.slogan = await askQuestion('Slogan');

    // print to the user the categories they can choose from with colors
    console.log(`Categories to choose from: ${categories.join(', ').yellow}`);
    entryDoc.categories = (await askQuestion('Categories (cat1,cat2,cat3)')).split(',');

    for (const category of entryDoc.categories) {
        if (!categories.includes(category)) {
            console.error(`${category} is not a valid category!`);
            return Promise.reject(new Error(`Invalid category: ${category}`));
        }
    }

    // tell the user the expected date format
    console.log(`Date format: ${'yyyy-MM-dd'.yellow}`);
    const dateStr = await askQuestion('Retro Date', defaultDate);
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateStr}`);
        return Promise.reject(new Error(`Invalid date: ${dateStr}`));
    }

    entryDoc.date = date;

    // console.log(entryDoc);
    console.log(JSON.stringify(entryDoc, null, 3).green);

    const looksGood = await askQuestion('Does this look good?', 'y');

    if (looksGood === 'y') return entryDoc;

    return Promise.reject(new Error('Cancelled by user'));
}

async function main(client: MongoClient, section: string) {
    console.log(`Building entries for ${section}...`.green)

    try {
        await client.connect();

        const db = client.db('entries');
        const collection: Collection<EntryDoc> = db.collection('metadata');

        const savedFiles: string[] = await collection.distinct('fileName');

        // let entries = readdirSync('./entry');
        // let entries = readdirSync(`../../client/src/blog/${section}`);
        // this should only scan for files (ignore directories!!!)
        let entries: string[] = readdirSync(`../../client/src/${section}`);

        for (const entry of entries) {
            // if it is a directory, skip it
            if (lstatSync(`../../client/src/${section}/${entry}`).isDirectory()) continue;
            // if (entry.indexOf('.') === -1) continue;

            console.log(`${section}: checking if ${entry} is in the database...`)

            const entryName = parse(entry).name;
            const fileName = `${entryName}.html`;

            if (!savedFiles.includes(fileName)) {
                // if the entry is not in the database, build the entry doc and insert it
                console.log(`Entry not found in database: ${entryName} building...`)

                const entryDoc = await buildEntryDoc(entryName, section);

                const insertResult = await collection.insertOne(entryDoc);

                console.log(`Successfully inserted ${entryDoc.fileName} into the database:`, insertResult);
            } else {
                console.log(`${entryName} is already in the database!`);
            }
        }

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

// run main over the different sections
const promises = sections.map((section) => {
    return main(client, section).catch((error) => {
        console.error(error);
        process.exit(1);
    });
});

Promise.all(promises)
    .finally(() => {
        rl.close();
        console.log("All documents are already in the database at the moment.");
        process.exit(0);
    })
    .then(() => {
        client.close();
    });
