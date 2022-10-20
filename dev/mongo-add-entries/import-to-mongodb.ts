
// import via node to be able to create an iso date which is a special type and not storable in json

import { MongoClient } from 'mongodb';
import { readdirSync, readFileSync } from 'fs';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

//  json files in folder entries-metadata
const files: string[] = readdirSync('entries-metadata');

// read all metadata files into a single array
const metadata: any[] = [];

files.forEach((file) => {
    const data = readFileSync(`entries-metadata/${file}`, 'utf8');
    metadata.push(...JSON.parse(data));
});


// add all metadata entries to the database
for(const doc of metadata) {
    const retroDate = doc.retroDate;

    const isoDate = new Date(`${retroDate.year}-${retroDate.month}-${retroDate.day}`);

    delete doc.retroDate;

    doc.date = isoDate;
}

async function insert(): Promise<void> {
    await client.connect();

    console.log('Connected successfully to server');

    const db = client.db('entries');
    const collection = db.collection('metadata');

    const insertResult = await collection.insertMany(metadata);
    await client.close();

    console.log(`Inserted ${insertResult.insertedCount} documents successfully! :3`);
}

insert().catch(console.error);