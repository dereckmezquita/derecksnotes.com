import { MongoClient } from "mongodb";

const url: string = 'mongodb://127.0.0.1:27017';
const client: MongoClient = new MongoClient(url);

async function updatePhoto(): Promise<void> {
    await client.connect();

    console.log('Connected successfully to server');

    const db = client.db('articles');
    const collection = db.collection('comments');

    const sampleComment = await collection.findOne();
    const datetime = sampleComment!.commentInfo.datetime;

    console.log(datetime.toISOString()); // NOTE: when we save new Date object to mongo; it maps to mongodb's Date type and when we get it back it's still a Date object
    console.log(typeof datetime);

    await client.close();
}

updatePhoto().catch(console.error);

