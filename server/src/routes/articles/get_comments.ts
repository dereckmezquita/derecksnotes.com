import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { Db, ObjectId } from 'mongodb';
import { page } from '../../modules/db';

export const get_comments = Router();

export const init_get_comments = (db: Db) => {
    get_comments.post('/articles/get_comments', async (req: Request, res: Response) => {
        // ------------------------------------
        const { article, pageSize, nextToken } = req.body;

        console.log(`article: ${article}; pageSize: ${pageSize}; nextToken: ${nextToken}`);

        if (nextToken) {
            if (!ObjectId.isValid(nextToken)) {
                return sendRes(res, false, undefined, "Invalid value for nextToken");
            }
        }

        // ------------------------------------
        const collection = db.collection('article_comments');

        const { docs, nextID } = await page(collection, {
            article: article
        }, pageSize, new ObjectId(nextToken)) as { docs: UserComment[], nextID?: ObjectId };

        sendRes(res, true, { comments: docs, nextToken: nextID });
    });
}