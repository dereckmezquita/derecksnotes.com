import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { Db, ObjectId } from 'mongodb';
import { page } from '../../modules/db';

export const get_comment_replies = Router();

export const init_get_comment_replies = (db: Db) => {
    get_comment_replies.post('/articles/get_comment_replies', async (req: Request, res: Response) => {
        // ------------------------------------
        const { commentId, pageSize, nextToken } = req.body;

        if (nextToken) {
            if (!ObjectId.isValid(nextToken)) {
                return sendRes(res, false, undefined, "Invalid value for nextToken");
            }
        }

        // ------------------------------------
        const collection = db.collection('article_comments');

        // get comments who replies_to_that has the commentId in it
        const { docs, nextID } = await page(collection, {
            replies_to_that: commentId
        }, pageSize, new ObjectId(nextToken)) as { docs: UserComment[], nextID?: ObjectId };

        sendRes(res, true, { comments: docs, nextToken: nextID });
    });
}