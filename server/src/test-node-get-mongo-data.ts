// import { MongoClient } from 'mongodb';
// import { readFileSync } from 'fs';
// import { page } from './modules/db';

// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);

// (async () => {
//     await client.connect();

//     console.log('Connected successfully to server');

//     const db = client.db('testdb');
//     const collection = db.collection('pagetest');

//     const latest = await collection.find({}, { projection: { _id: 1, articleTitle: 1 }, sort: { date: -1 } });

//     const { docs, nextID } = await page(collection, {}, { projection: { _id: 1, number: 1 } }, 5);
//     const { docs: docs2, nextID: nextID2 } = await page(collection, {}, { projection: { _id: 0, number: 1 } }, 5, nextID);

//     console.log(docs, nextID);
//     console.log(docs2);

//     await client.close();
// })();
