import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { Db } from 'mongodb';
import { geoLocate } from '../../modules/geoLocate';

export const report_comment = Router();

export const init_report_comment = (db: Db) => {
    report_comment.post('/articles/report_comment', async (req: Request, res: Response) => {
        // ------------------------------------
        const session = req.session as SessionData;

        // check if the user is logged in and has an active session
        if (!session.authenticated) {
            return sendRes(res, false, null, 'You must be logged in to comment.');
        }

        const cookie = session.user as SessionCookie;

        // check if the user object exists in the session
        if (!cookie) return sendRes(res, false, null, 'User not found in session; please login.');

        // user info stored in cookie
        const email: string = cookie.email.address;
        const username: string = cookie.username;

        // ------------------------------------
        const { commentId, datetime, article } = (req.body as { commentId: string, datetime: string, article: string });

        // ------------------------------------
        // datetime provided not older than 30 seconds
        const now: Date = new Date();

        // received datetime format: "2023-02-19T05:44:46.861Z"
        const receivedDatetime: Date = new Date(datetime);

        const timediff = Math.floor(Math.abs(now.getTime() - receivedDatetime.getTime()) / 1000);

        if (timediff > 30) return sendRes(res, false, null, 'The datetime provided is not valid.');

        // ------------------------------------
        const reportsDB = db.collection('comment_reports');

        // check if the user has previously reported this comment
        await reportsDB.countDocuments({
            comment_id: commentId,
            'metadata.user.email': email
        }).then(async (count) => {
            if (count > 0) return sendRes(res, false, null, 'You have already reported this comment.');
        });

        // get the user's current IP address
        const ip_address = req.headers['x-forwarded-for'] as string;

        // ------------------------------------
        // create comment object; will be modified and inserted
        const newReport: UserCommentReport = {
            comment_id: commentId, 
            article: article,
            metadata: {
                user: {
                    email: email,
                    username: username
                },
                datetime: receivedDatetime,
                geo_location: {
                    ...await geoLocate(ip_address),
                    first_used: receivedDatetime,
                    last_used: receivedDatetime
                }
            }
        };

        // insert the comment into the database
        const insertResult = await reportsDB.insertOne(newReport);

        if (!insertResult.acknowledged) return sendRes(res, false, null, 'Error inserting report into database.');

        return sendRes(res, true, 'Report successfully added.');
    });
}