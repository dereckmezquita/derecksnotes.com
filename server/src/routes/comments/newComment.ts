import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';
import { userCommentCheck } from '../../modules/validators';

export const postComment = Router();

export const initComment = (client: MongoClient) => {
    postComment.post('/comments/new_comment', async (req: Request, res: Response) => {
        // check if the user is logged in and has an active session
        if (!((req.session as SessionDataRes).authenticated)) {
            return sendRes(res, false, null, 'You must be logged in to access this end point.');
        }

        const cookie = (req.session as SessionDataRes).user as UserCookie;

        // check if the user object exists in the session
        if (!cookie) return sendRes(res, false, null, 'User not found in session.');

        // user info stored in cookie
        const email = cookie.email;
        const username = cookie.username;
        
        // ------------------------------------
        const { comment, datetime, article, replyToId } = req.body;

        console.log(`comment: ${comment}; datetime: ${datetime}; article: ${article}; replyToId: ${replyToId}`);

        // check that the comment is not empty and alphanumeric
        const check: { success: boolean, error?: string} = userCommentCheck(comment);

        if (!check.success) return sendRes(res, false, null, check.error);

        // check that the datetime provided is not greater than or less than 30 seconds from the current time
        const now: Date = new Date();

        // received datetime is in: "2023-02-19T05:44:46.861Z"
        // convert to Date object
        const receivedDatetime: Date = new Date(datetime);

        const diff = Math.abs(now.getTime() - receivedDatetime.getTime());
        const diffSeconds = Math.ceil(diff / 1000);

        if (diffSeconds > 30) return sendRes(res, false, null, 'The datetime provided is not valid.');

        // ------------------------------------
        const db = client.db('users');
        const collection = db.collection('comments');

        // insert the comment into the database
        let insertResult;
        if (replyToId) {
            const reply: CommentReply = {
                comment_id: replyToId,
                article,
                comment,
                username,
                datetime: receivedDatetime,
                likes: 0,
                dislikes: 0
            };

            console.log(`reply: ${JSON.stringify(reply)}`);

            // find the comment that the reply is being made to and insert the reply
            insertResult = await collection.updateOne(
                { "comments.comment_id": replyToId },
                { $push: { "comments.$.replies": reply } }
            );
        } else {
            // create a comment_id
            const new_comment_id: string = `${article}_${username}_${receivedDatetime.getTime()}`;
            
            // if comment is not a reply
            const newComment: UserComment = {
                comment_id: new_comment_id,
                article,
                comment,
                username,
                datetime: receivedDatetime,
                likes: 0,
                dislikes: 0,
                replies: []
            };

            // console.log(`newComment: ${JSON.stringify(newComment)}`);
            console.log(newComment)

            // insert the comment into the database
            insertResult = await collection.updateOne(
                { article },
                { $push: { comments: newComment } }
            );
        }

        console.log(`insertResult: ${JSON.stringify(insertResult)}`);

        return sendRes(res, true, 'Comment successfully added.');
    });
}

