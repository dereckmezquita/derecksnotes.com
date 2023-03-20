import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { Db, ObjectId } from 'mongodb';
import { page } from '../../modules/db';

export const get_comments = Router();

export const init_get_comments = (db: Db) => {
    get_comments.post('/articles/get_comments', async (req: Request, res: Response) => {
        // ------------------------------------
        const { article, pageSize, nextToken } = req.body;

        if (nextToken) {
            if (!ObjectId.isValid(nextToken)) {
                return sendRes(res, false, undefined, "Invalid value for nextToken");
            }
        }

        // ------------------------------------
        const collection = db.collection('article_comments');

        // get comments who replies_to_that is an array of length 0
        const { docs, nextID } = await page(collection, {
            article: article,
            replies_to_that: null
        }, pageSize, new ObjectId(nextToken)) as { docs: UserComment[], nextID?: ObjectId };

        // count number of top level comments on page
        const commentsCount: number = await collection.countDocuments({ article: article, replies_to_that: null });

        sendRes(res, true, { comments: docs, commentsCount: commentsCount, nextToken: nextID });
    });
}