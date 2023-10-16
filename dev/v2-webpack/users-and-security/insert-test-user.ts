import { MongoClient } from 'mongodb';
import { createHash } from 'crypto';

import * as argon2 from 'argon2';

// all of this is done client side before sending to server
const encoder = new TextEncoder();
const decoder = new TextDecoder('ascii');
const salt = "derecks-notes";

const passBuff = encoder.encode("my-shit-password" + salt);
// const hashBuff = await crypto.subtle.digest('SHA-512', passBuff);
// createHash('sha512').update("my-shit-password" + salt).digest()
// use node's crypto library instead
const hashBuff = createHash('sha512').update(passBuff).digest();

const hashStr: string = decoder.decode(hashBuff);

const user_info = {
    firstName: "Dereck",
    lastName: "Mezquita",
    email: {
        address: "dereck@demezquita.com",
        verified: false,
        verificationToken: undefined
    },
    username: "dereckdemezquita",
    password: hashStr,
    userStatistics: {
        ip_addresses: [],
        last_login: new Date()
    }
}

// all of this is done server side on registration
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

async function insert(): Promise<void> {
    await client.connect();

    console.log('Connected successfully to server');

    const db = client.db('users');
    const collection = db.collection('accounts');

    // hash the hash with argon2 before insertion
    user_info.password = await argon2.hash(user_info.password, { type: argon2.argon2id, parallelism: 1 });

    const insertResult = await collection.insertOne(user_info);
    console.log(`Inserted ${insertResult} documents successfully! :3`);

    // find the user as a test
    const user = await collection.findOne({ "email.address": user_info.email.address });
    console.log(user);

    await client.close();
}

insert().catch(console.error);
