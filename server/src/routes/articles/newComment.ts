import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';
import { userCommentCheck } from '../../modules/validators';
import crypto from 'crypto';
import sanitizeHtml from 'sanitize-html';

export const postComment = Router();

export const initComment = (client: MongoClient) => {
    postComment.post('/articles/new_comment', async (req: Request, res: Response) => {
        // check if the user is logged in and has an active session
        if (!((req.session as SessionDataRes).authenticated)) {
            return sendRes(res, false, null, 'You must be logged in to comment.');
        }

        const cookie = (req.session as SessionDataRes).user as UserCookie;

        // check if the user object exists in the session
        if (!cookie) return sendRes(res, false, null, 'User not found in session; please login.');

        // user info stored in cookie
        const email: string = cookie.email;
        const username: string = cookie.username;
        const profilePhoto: string | undefined = cookie.profilePhoto;

        // ------------------------------------
        const { comment, datetime, article, replyToId } = req.body;

        console.log(`comment: ${comment}; datetime: ${datetime}; article: ${article}; replyToId: ${replyToId}`);

        // check that the comment is not empty and alphanumeric
        const check: { success: boolean, error?: string } = userCommentCheck(comment);
        if (!check.success) return sendRes(res, false, null, check.error);

        const allowedTags: string[] = [
            "h1", "h2", "h3", "span", "strong", "p", "em", "a",
            "sub", "sup", "blockquote", "figcaption", "figure",
            "li", "ol", "ul", "pre", "br",
            "table", "tbody", "td", "tfoot", "th", "thead", "tr"
        ]

        // pre-process the comment a little
        let processedComment: string = sanitizeHtml(comment, {
            allowedTags: allowedTags,
            allowedAttributes: {
                'a': ['href']
            },
            allowedIframeHostnames: ['www.youtube.com']
        });

        processedComment = processedComment.trim().replace(/[\r\n]+/g, '\n'); //.replace(/[\r\n]{3,}/g, '\n\n');

        // check that the datetime provided is not greater than or less than 30 seconds from the current time
        const now: Date = new Date();

        // received datetime is in: "2023-02-19T05:44:46.861Z"
        // convert to Date object
        const receivedDatetime: Date = new Date(datetime);

        const timediff = Math.floor(Math.abs(now.getTime() - receivedDatetime.getTime()) / 1000);

        if (timediff > 30) return sendRes(res, false, null, 'The datetime provided is not valid.');

        // ------------------------------------
        const db = client.db('articles');
        const commentsDB = db.collection('comments');

        // get the user's current IP address
        const ip_address = req.headers['x-forwarded-for'] as string;

        // create comment id from article + username + datetime then hash it
        const comment_id: string = crypto.createHash('sha256')
            .update(`${article}_${username}_${receivedDatetime.getTime()}`)
            .digest('hex');

        // insert the comment into the database
        let insertResult;
        if (replyToId) {
            const replyComment: UserComment = {
                comment_id: comment_id,
                replies_to_this: [],
                replies_to_that: replyToId,
                article: article,
                comment: processedComment,
                commentInfo: {
                    datetime: receivedDatetime,
                    likes: 0,
                    dislikes: 0
                },
                userInfo: {
                    email: email,
                    username: username,
                    profilePhoto: profilePhoto,
                    ip_address: ip_address
                }
            };

            // find the comment that the reply is being made to and insert the id of the reply
            insertResult = await commentsDB.updateOne(
                { comment_id: replyToId },
                { $push: { replies_to_this: comment_id } }
            );

            console.log(`update comment replies_to_this: ${JSON.stringify(insertResult)}`);
            // insert the reply into the database
            insertResult = await commentsDB.insertOne(replyComment);
            console.log(`insert reply: ${JSON.stringify(insertResult)}`);
        } else {
            // create a comment_id
            const comment_id: string = `${article}_${username}_${receivedDatetime.getTime()}`;

            // if comment is not a reply
            const newComment: UserComment = {
                comment_id: comment_id,
                replies_to_this: [],
                replies_to_that: undefined,
                article: article,
                comment: processedComment,
                commentInfo: {
                    datetime: receivedDatetime,
                    likes: 0,
                    dislikes: 0
                },
                userInfo: {
                    email: email,
                    username: username,
                    profilePhoto: profilePhoto,
                    ip_address: ip_address
                }
            };

            // insert the comment into the database
            insertResult = await commentsDB.insertOne(newComment);
            console.log(`insert comment: ${JSON.stringify(insertResult)}`);
        }

        return sendRes(res, true, 'Comment successfully added.');
    });
}