import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';

import Comment, { CommentDocument } from '@models/Comment';
import isAuthenticated from '@utils/middleware/isAuthenticated';
import isVerified from '@utils/middleware/isVerified';
import { SessionData } from 'express-session';

const judge = Router();

judge.post('/judge_comment', isAuthenticated, isVerified, async (req: Request, res: Response) => {
    try {
        let { id, judgement } = req.body as JudgeDTO;
        const userId = (req.session as SessionData).userId;

        if (!id || !judgement) {
            return res.status(400).json({ message: "Comment ID and judgement are required." });
        }
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid comment ID." });
        }
    
        if (judgement !== 'like' && judgement !== 'dislike') {
            return res.status(400).json({ message: "Invalid judgement." });
        }

        const comment = await Comment.findById<CommentDocument>(id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        const judge = await comment.setJudgement(userId, judgement); // atomic operation; no need to save

        // count the new total number
        judge.toObject({ virtuals: true });

        res.status(200).json({ message: "Judgement successful.", totalJudgement: judge.totalJudgement });
    } catch (err) {
        res.status(500).json({ message: "Error judging comment.", error: err });
    }
});

import Article, { ArticleDocument } from '@models/Article';

judge.post('/judge_article', isAuthenticated, isVerified, async (req: Request, res: Response) => {
    try {
        let { id: slug, judgement } = req.body as JudgeDTO;
        const userId = (req.session as SessionData).userId;

        if (!slug || !judgement) {
            return res.status(400).json({ message: "Article slug and judgement are required." });
        }
    
        if (judgement !== 'like' && judgement !== 'dislike') {
            return res.status(400).json({ message: "Invalid judgement." });
        }

        const article = await Article.findOne<ArticleDocument>({ slug });

        if (!article) {
            return res.status(404).json({ message: "Article not found." });
        }

        const judge = await article.setJudgement(userId, judgement); // atomic operation; no need to save

        // count the new total number
        judge.toObject({ virtuals: true });

        res.status(200).json({ message: "Judgement successful.", totalJudgement: judge.totalJudgement });
    } catch (err) {
        res.status(500).json({ message: "Error judging article.", error: err });
    }
});

export default judge;