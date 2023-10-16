import { MongoClient } from "mongodb";

const url: string = "mongodb://127.0.0.1:27017";
const client: MongoClient = new MongoClient(url);

async function main(): Promise<void> {
    await client.connect();

    console.log("Connected successfully to server");

    const db = client.db("derecksnotes_test");
    const collection = db.collection("user_accounts");

    const user = await collection.findOne({ username: "dereckmezquita" });

    console.log(user);

    await client.close();
}

main().catch(console.error);