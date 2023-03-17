import { Router, Request, Response } from 'express';
import { generateHashID, sendRes } from '../../modules/helpers';
import { Db } from 'mongodb';
import { userCommentCheck, checkUsername } from '../../modules/validators';
import { geoLocate } from '../../modules/geoLocate';

import sanitizeHtml from 'sanitize-html';

export const new_comment = Router();

export const init_new_comment = (db: Db) => {
    new_comment.post('/articles/new_comment', async (req: Request, res: Response) => {
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
        const profilePhoto: string | undefined = cookie.profilePhoto;

        // ------------------------------------
        const { comment, datetime, article, mentions, replyToId } = (req.body as { comment: string, datetime: string, article: string, replyToId?: string, mentions: string[] });

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
        // ------------------------------------

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
        // process the comment and insert links to mentions
        // first check that each mention does in fact mention a real user in our database
        const usersDB = db.collection('user_accounts');

        // TODO: this is an attack point; user could send a request with a lot of mentions and crash the server
        // check each mention is a valid username if not valid
        for (let i = 0; i < mentions.length; i++) {
            console.log(`checking mention ${mentions[i]}`)
            const mentionCheck: { success: boolean, error?: string } = checkUsername(mentions[i]);

            // if not valid remove it from the mentions array
            if (!mentionCheck.success) {
                mentions.splice(i, 1);
                i--;
                continue;
            }

            const mentionedUser = await usersDB.findOne({ username: mentions[i] });
            console.log(await usersDB.findOne({ username: "dereckmezquita" }));

            console.log(`mentioned user: ${mentionedUser}`)

            // if we find the user in our database then we can insert a link to their profile
            if (mentionedUser) {
                const link = `<a class="username username-mention" href="/user/${mentions[i]}">@${mentions[i]}</a>`;
                console.log(`link: ${link}`)
                processedComment = processedComment.replace(`@${mentions[i]}`, link);
                console.log(`processed comment after adding link: ${processedComment}`)
            } else {
                // if we don't find the user in our database then we remove it from the mentions array
                mentions.splice(i, 1);
                i--;
            }
        }
        console.log(`mentions after processing: ${mentions}`)
        // ------------------------------------
        const commentsDB = db.collection('article_comments');

        // get the user's current IP address
        const ip_address = req.headers['x-forwarded-for'] as string;

        // create comment id from article + username + datetime then hash it
        const comment_id: string = generateHashID(`${article}_${username}_${receivedDatetime.getTime()}`)

        // ------------------------------------
        // create comment object; will be modified and inserted
        const newComment: UserComment = {
            comment_id: comment_id,
            replies_to_this: [], // 0 length array because we want to be able to push into it
            replies_to_that: undefined,
            mentions: mentions,
            article: article,
            comment: processedComment,
            metadata: {
                user: {
                    email: email,
                    username: username,
                    profilePhoto: profilePhoto
                },
                datetime: receivedDatetime,
                likes: 0,
                dislikes: 0,
                geo_location: {
                    ...await geoLocate(ip_address),
                    first_used: receivedDatetime,
                    last_used: receivedDatetime
                }
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