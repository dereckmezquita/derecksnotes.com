import { MongoClient } from "mongodb";

const url: string = 'mongodb://127.0.0.1:27017';
const client: MongoClient = new MongoClient(url);

async function main(client: MongoClient) {
    await client.connect();

    const db = client.db('entries');
    const collection = db.collection('metadata');

    // we want to add one property to all entries
    // commentsOn: boolean set to true on all of them
    await collection.updateMany({}, { $set: { commentsOn: true } });

    // let's console log the first 10 entries
    const cursor = collection.find({}).limit(10);
    await cursor.forEach((doc) => {
        console.log(doc);
    });

    // done
    client.close();
}

main(client).catch((error) => {
    console.error(error);
    process.exit(1);
});