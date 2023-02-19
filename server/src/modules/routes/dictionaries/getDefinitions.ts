import { Router } from 'express';
import { sendRes } from '../../helpers';
import { MongoClient, ObjectId } from 'mongodb';
import { page } from '../../db';

export const getDefinitions = Router();

export const initGetDefinitions = (client: MongoClient) => {
    // a post request for getting data for dictionaries page
    // responds to requests for different dictionaries; results are filtered
    // will listen to request for more definitions
    getDefinitions.post('/getDefinitions', (req, res) => {
        const { dictionary, letter, pageSize, nextToken } = req.body;

        const dictionaries = ['biology', 'chemistry']

        if (typeof dictionary !== 'string') return sendRes(res, false, undefined, "Invalid type for dictionary");
        if (!dictionaries.includes(dictionary)) return sendRes(res, false, undefined, "Invalid value for dictionary");
        if (typeof letter !== 'string') return sendRes(res, false, undefined, "Invalid type for letter");
        if (typeof pageSize !== 'number') return sendRes(res, false, undefined, "Invalid type for pageSize");
        if (pageSize > 30 || pageSize < 1) return sendRes(res, false, undefined, "Invalid size for pageSize");
        if (typeof nextToken !== 'string' && typeof nextToken !== 'undefined') return sendRes(res, false, undefined, "Invalid type for nextToken");

        if (nextToken) {
            if (!ObjectId.isValid(nextToken)) {
                return sendRes(res, false, undefined, "Invalid value for nextToken");
            }
        }

        // query the mongo database for definitions and send them back to the client
        (async () => {
            const db = client.db('dictionaries');
            const collection = db.collection('definitions');

            // get the data which matches the request dictionary and letter
            // if letter is # then return all other symbols/numbers
            const { docs, nextID } = await page(collection, {
                dictionary: dictionary,
                letter: letter === '#' ? { $not: { $regex: /^[a-z]$/ } } : letter
            }, pageSize, new ObjectId(nextToken));

            sendRes(res, true, { definitions: docs, nextToken: nextID});
        })();
    });
}