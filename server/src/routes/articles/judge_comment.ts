import { Router, Request, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { Db } from 'mongodb';

export const judge_comment = Router();

export const init_judge_comment = (db: Db) => {
    judge_comment.post('/articles/judge_comment', async (req: Request, res: Response) => {
        // ------------------------------------
        const { commentId, vote } = req.body as { commentId: string, vote: "like" | "dislike" };

        if (vote !== "like" && vote !== "dislike") {
            return sendRes(res, false, undefined, "Invalid value for like or dislike");
        }

        // ------------------------------------
        const commentsDB = db.collection('article_comments');
        const usersDB = db.collection('user_accounts');

        // check if the user has previously voted on this comment
        // if not logged in return default user info
        const session = req.session as SessionData;
        if (!session.authenticated) {
            return sendRes(res, false, "You must be logged in to like/dislike comments.");
        }

        const cookie = (req.session as SessionData).user as SessionCookie;
        const username = cookie.username;

        const user = await usersDB.findOne<UserInfo>({ username: username });
        if (!user) return sendRes(res, false, "User not found.");

        let hasVoted = false;
        // check if the user has already voted on this comment
        if (user.metadata.commentsJudged) {
            hasVoted = user.metadata.commentsJudged.some((comment) => {
                return comment.comment_id === commentId;
            });
        }

        // update comment
        if (!hasVoted) {
            // if the user has not voted on this comment inc by 1
            await commentsDB.updateOne({ comment_id: commentId }, {
                $inc: {
                    [vote]: 1
                }
            });
        } else {
            // if the user has voted on this comment we are toggling the vote
            await commentsDB.updateOne({ comment_id: commentId }, {
                $inc: {
                    // increase by 1
                    [vote]: 1,
                    // decrease the other vote by 1
                    [vote === "like" ? "dislike" : "like"]: -1
                }
            });
        }

        sendRes(res, true, `Comment ${vote}d.`);
    });
}