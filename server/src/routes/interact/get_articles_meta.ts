import express, { Request, Response } from 'express';
import Article, { ArticleDocument } from '@models/Article';

const get_articles_meta = express.Router();

get_articles_meta.post('/get_articles_meta', async (req: Request, res: Response) => {
    try {
        const currentUser = req.session.userId;
        const slugs = req.body.slugs;

        if (!slugs || !Array.isArray(slugs)) {
            return res.status(400).json({ message: 'Slugs as a string[] is required.' });
        }

        const articles = await Article.find<ArticleDocument>({
            slug: { $in: slugs }
        }).exec();

        const articlesData = articles.reduce<ArticlesMapDTO>((acc, article) => {
            const obj = article.toObject({ virtuals: true });
            obj.likedByCurrentUser = obj.judgement?.get(currentUser) === 'like';
            delete obj.judgement; // save bandwith

            acc[article.slug] = obj; // Use the slug as the key
            return acc;
        }, {} as ArticlesMapDTO); // Initialize with the correct type


        res.status(200).json(articlesData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default get_articles_meta;