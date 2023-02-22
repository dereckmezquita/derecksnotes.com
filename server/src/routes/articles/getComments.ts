import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient, ObjectId } from 'mongodb';
import { page } from '../../modules/db';

export const getComments = Router();

export const initGetComments = (client: MongoClient) => {
    getComments.post('/articles/get_comments', async (req: Request, res: Response) => {
        // ------------------------------------
        const { article, pageSize, nextToken } = req.body;

        console.log(`article: ${article}; pageSize: ${pageSize}; nextToken: ${nextToken}`);

        if (nextToken) {
            if (!ObjectId.isValid(nextToken)) {
                return sendRes(res, false, undefined, "Invalid value for nextToken");
            }
        }

        // ------------------------------------
        const db = client.db('articles');
        const collection = db.collection('comments');

        const { docs, nextID } = await page(collection, {
            article: article
        }, pageSize, new ObjectId(nextToken)) as { docs: UserComment[], nextID?: ObjectId };

        sendRes(res, true, { comments: docs, nextToken: nextID });
    });
}