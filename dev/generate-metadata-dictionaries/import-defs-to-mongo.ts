
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// reads definitions to an array
const definitions = JSON.parse(readFileSync('./parsed-definitions.json').toString());

// console.log(definitions);

(async () => {
    await client.connect();

    console.log('Connected successfully to server');

    const db = client.db('dictionaries');
    const collection = db.collection('definitions');

    const insertResult = await collection.insertMany(definitions);
    await client.close();

    console.log(`Inserted ${insertResult.insertedCount} documents successfully! :3`);
})();
