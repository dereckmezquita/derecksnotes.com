import { MongoClient } from "mongodb";

const url: string = 'mongodb://127.0.0.1:27017';
const client: MongoClient = new MongoClient(url);

async function updatePhoto(): Promise<void> {
    await client.connect();

    console.log('Connected successfully to server');

    const db = client.db('users');
    const collection = db.collection('accounts');

    const updateResult = await collection.updateOne(
        { "email.address": "dereck@demezquita.com" },
        { $set: { "profilePhoto": "dereckmezquita.jpg" } }
    );

    console.log(`Updated ${updateResult.modifiedCount} documents successfully! :3`);

    const user = await collection.findOne({ "email.address": "dereck@demezquita.com" });

    console.log(user);

    await client.close();
}

updatePhoto().catch(console.error);