
import { Router, Response } from 'express';
import { sendRes } from './helpers';

const _ = undefined;

export const router = Router();

router.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} @ ${req.url}`);
    next();
})

router.get('/getPost', (req, res) => {
    const postId = req.query.postId;

    if (typeof postId !== 'string') return sendRes(res, false, _, "Bad postId!");

    sendRes(res, true, { postId });
});

// ------------------------------
import { MongoClient } from 'mongodb';
import { page } from './db';

const client = new MongoClient('mongodb://localhost:27017');

// post request for getting entries for index page
// allows to request entries for page blog, courses, etc and number of posts
// will listen for request for more entries
router.post('/getEntries', (req, res) => {
    const { section, numEntries } = req.body;

    if (typeof section !== 'string' || typeof numEntries !== 'number') {
        return sendRes(res, false, undefined, "Bad request!");
    }

    // query mongo database for entries and send back to client
    (async () => {
        await client.connect();

        const db = client.db('entries');
        const collection = db.collection("metadata");

        // get entries full data from db who's section matches the request
        const { docs, nextID } = await page(collection, { }, { projection: { siteSection: section } }, numEntries);

        await client.close();

        sendRes(res, true, { entries: docs });
    })();
});