import { Router } from 'express';
import { sendRes } from '../helpers';
import { MongoClient, ObjectId } from 'mongodb';
import { page } from '../db';

export const getEntries = Router();

const _ = undefined;

export const initGetEntries = (client: MongoClient) => {
    // post request for getting entries for index page
    // allows to request entries for page blog, courses, etc and number of posts
    // will listen for request for more entries
    getEntries.post('/getEntries', (req, res) => {
        const { section, pageSize, nextToken } = req.body;

        const sections = ['blog', 'courses', 'exercises'];

        if (typeof section !== 'string') return sendRes(res, false, _, "Invalid type for section");
        // if (!sections.includes(section)) return sendRes(res, false, _, "Invalid value for section");
        if (typeof pageSize !== 'number') return sendRes(res, false, _, "Invalid type for pageSize");
        if (pageSize > 30 || pageSize < 1) return sendRes(res, false, _, "Invalid size for pageSize");
        if (typeof nextToken !== 'string' && typeof nextToken !== 'undefined') return sendRes(res, false, _, "Invalid type for nextToken");

        if (nextToken) {
            if (!ObjectId.isValid(nextToken)) {
                return sendRes(res, false, _, "Invalid value for nextToken");
            }
        }

        // query mongo database for entries and send back to client
        (async () => {
            const db = client.db('entries');
            const collection = db.collection("metadata");

            // get entries from db; if section is dictionaries dont filter by section and return 10 most recent entries
            // const { docs, nextID } = await page(collection, section === 'dictionaries' ? {} : { section: section }, pageSize, new ObjectId(nextToken));

            // const { docs, nextID } = await page(collection, {
            //     siteSection: section === "any" ? { $exists: true } : section
            // }, pageSize, new ObjectId(nextToken));

            const { docs, nextID } = await page(collection, { siteSection: section }, pageSize, new ObjectId(nextToken));
            

            sendRes(res, true, { entries: docs, nextToken: nextID});
        })();
    });
}