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

        let previousVote: "like" | "dislike" | undefined;
        if (user.metadata.commentsJudged) {
            previousVote = user.metadata.commentsJudged.find(judgement => judgement.comment_id === commentId)?.judgement;
        }


        let result;
        // update comment
        if (!previousVote) {
            // if the user has not voted on this comment, increment by 1
            // comment.metadata.likes; comment.metadata.dislikes
            result = await commentsDB.updateOne({ comment_id: commentId }, {
                $inc: {
                    [`metadata.${vote}s`]: 1
                }
            });

            if (!result.matchedCount) return sendRes(res, false, undefined, "Comment not found.");

            // add the new judgement to the user's metadata
            result = await usersDB.updateOne({ username: username }, {
                $push: {
                    "metadata.commentsJudged": {
                        comment_id: commentId,
                        judgement: vote
                    }
                }
            });

            if (!result.matchedCount) return sendRes(res, false, undefined, "User not found.");
        } else {
            if (previousVote === vote) {
                // if the previous vote was the same as the current vote, remove the vote
                result = await commentsDB.updateOne({ comment_id: commentId }, {
                    $inc: {
                        [`metadata.${vote}s`]: -1
                    }
                });

                if (!result.matchedCount) return sendRes(res, false, undefined, "Comment not found.");

                // remove the judgement from the user's metadata
                result = await usersDB.updateOne({ username: username }, {
                    $pull: {
                        "metadata.commentsJudged": {
                            comment_id: commentId
                        }
                    }
                });
            } else {
                // if the previous vote was different from the current vote, update the vote
                result = await commentsDB.updateOne({ comment_id: commentId }, {
                    $inc: {
                        [`metadata.${vote}s`]: 1,
                        [`metadata.${previousVote}s`]: -1
                    }
                })

                if (!result.matchedCount) return sendRes(res, false, undefined, "Comment not found.");

                // TODO: review and brainstorm - this must not scale well
                const idx = user.metadata.commentsJudged!.findIndex(judgement => judgement.comment_id === commentId);

                // for the user.metadata.commentsJudged array, find the comment and update the judgement
                result = await usersDB.updateOne({ username: username }, {
                    $set: {
                        [`metadata.commentsJudged.${idx}.judgement`]: vote
                    }
                })

                if (!result.matchedCount) return sendRes(res, false, undefined, "User not found.");
            }
        }

        // ------------------------------------
        // get and send back the updated likes and dislikes
        const comment = await commentsDB.findOne<UserComment>({ comment_id: commentId });

        if (!comment) return sendRes(res, false, undefined, "Comment not found.");

        sendRes(res, true, {
            likes: comment.metadata.likes,
            dislikes: comment.metadata.dislikes
        });
    });
}