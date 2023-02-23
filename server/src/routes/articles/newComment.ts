import { Router, Request, Response } from 'express';
import { generateHashID, sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';
import { userCommentCheck } from '../../modules/validators';

import sanitizeHtml from 'sanitize-html';

export const postComment = Router();

export const initComment = (client: MongoClient) => {
    postComment.post('/articles/new_comment', async (req: Request, res: Response) => {
        // ------------------------------------
        const session = req.session as SessionDataRes;

        // check if the user is logged in and has an active session
        if (!session.authenticated) {
            return sendRes(res, false, null, 'You must be logged in to comment.');
        }

        const cookie = session.user as UserCookie;

        // check if the user object exists in the session
        if (!cookie) return sendRes(res, false, null, 'User not found in session; please login.');

        // user info stored in cookie
        const email: string = cookie.email;
        const username: string = cookie.username;
        const profilePhoto: string | undefined = cookie.profilePhoto;

        // ------------------------------------
        const { comment, datetime, article, replyToId } = (req.body as { comment: string, datetime: string, article: string, replyToId?: string });

        if (typeof comment !== "string") return sendRes(res, false, null, "Comment must be valid string.");
        
        // ------------------------------------
        // datetime provided not older than 30 seconds
        const now: Date = new Date();

        // received datetime format: "2023-02-19T05:44:46.861Z"
        const receivedDatetime: Date = new Date(datetime);

        const timediff = Math.floor(Math.abs(now.getTime() - receivedDatetime.getTime()) / 1000);

        if (timediff > 30) return sendRes(res, false, null, 'The datetime provided is not valid.');

        // ------------------------------------
        // check that the comment is not empty and alphanumeric
        const commentCheck: { success: boolean, error?: string } = userCommentCheck(comment);
        if (!commentCheck.success) return sendRes(res, false, null, commentCheck.error);

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
            allowedIframeHostnames: ['www.youtube.com'],
            disallowedTagsMode: 'recursiveEscape'
        });

        // processedComment = processedComment.trim().replace(/[\r\n]+/g, '\n'); //.replace(/[\r\n]{3,}/g, '\n\n');

        // ------------------------------------
        const db = client.db('articles');
        const commentsDB = db.collection('comments');

        // get the user's current IP address
        const ip_address = req.headers['x-forwarded-for'] as string;

        // create comment id from article + username + datetime then hash it
        const comment_id: string = generateHashID(`${article}_${username}_${receivedDatetime.getTime()}`)

        // ------------------------------------
        // create comment object; will be modified and inserted
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
        let insertResult;
        if (replyToId) {
            // this is a reply; set what comment it is replying to
            newComment.replies_to_that = replyToId;

            // this comment is a reply
            // find target comment and insert this comment ID
            insertResult = await commentsDB.updateOne(
                { comment_id: replyToId },
                { $push: { replies_to_this: comment_id } }
            );

            insertResult = await commentsDB.insertOne(newComment);
            console.log(`insert reply: ${JSON.stringify(insertResult)}`);
        } else {
            // this is not a reply
            newComment.replies_to_that = undefined;

            insertResult = await commentsDB.insertOne(newComment);
            console.log(`insert comment: ${JSON.stringify(insertResult)}`);
        }

        return sendRes(res, true, 'Comment successfully added.');
    });
}