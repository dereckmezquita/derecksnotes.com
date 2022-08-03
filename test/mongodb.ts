import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'testdb';

// db.docs.createIndex({name: 1}) https://www.mongodb.com/docs/manual/indexes/
 
async function main() {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const col = db.collection('docs');

    const now = Date.now();

    const res = await col.findOne({name: "ddeaf3e38bcd"}, {projection: {}})

    const took = Date.now()-now;

    console.log(res);

    return `Done! Took ${Math.round(took)} ms`;
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());

// import { writeFileSync } from 'fs';
// import { randomBytes } from 'crypto';

// const docs: any[] = [];
// const tlds: string[] = ["com", "net", "org", "edu", "gov", "mil", "info", "biz"];

// for (let i = 0; i < 731000; i++) {
//     docs[i] = {
//         "name": randomBytes(6).toString('hex'),
//         "email": `${randomBytes(randInt(3, 10)).toString('hex')}@${randomBytes(randInt(3, 10)).toString('hex')}.${randTLD()}`,
//         "ssn": `${randInt(100, 999)}-${randInt(10, 99)}-${randInt(1000, 9999)}`,
//         "cell": `${randInt(100, 999)}-${randInt(100, 999)}-${randInt(1000, 9909)}`
//     };
// }

// writeFileSync("./fakeusers.json", JSON.stringify(docs, null, 2));
// console.log("Done wit generation");

// // inclusive on both ends
// function randInt(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function randTLD() {
//     return tlds[randInt(0, tlds.length-1)];
// }
