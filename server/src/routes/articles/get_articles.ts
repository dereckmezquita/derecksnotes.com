import { Router } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient, ObjectId } from 'mongodb';
import { page } from '../../modules/db';

export const get_articles = Router();

export const init_get_articles = (client: MongoClient) => {
    get_articles.post('/articles/get_articles', async (req, res) => {
        const { section, pageSize, nextToken } = req.body;

        if (typeof section !== 'string') return sendRes(res, false, undefined, "Invalid type for section");
        if (typeof pageSize !== 'number') return sendRes(res, false, undefined, "Invalid type for pageSize");
        if (pageSize > 30 || pageSize < 1) return sendRes(res, false, undefined, "Invalid size for pageSize");
        if (typeof nextToken !== 'string' && typeof nextToken !== 'undefined') return sendRes(res, false, undefined, "Invalid type for nextToken");

        if (nextToken) {
            if (!ObjectId.isValid(nextToken)) {
                return sendRes(res, false, undefined, "Invalid value for nextToken");
            }
        }

        // query mongo database for articles and send back to client
        const db = client.db('articles');
        const collection = db.collection("metadata");

        // return all articles which match siteSection and published is true
        const { docs, nextID } = await page(collection, {
            siteSection: section,
            published: true
        }, pageSize, new ObjectId(nextToken));

        sendRes(res, true, { articles: docs, nextToken: nextID });
    });
}