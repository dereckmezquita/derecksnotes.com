import express from 'express';
import Comment, { CommentDocument } from '@models/Comment';

const get_article_comments = express.Router();

get_article_comments.get('/get_article_comments/:slug', async (req, res) => {
    const { slug } = req.params;
    const limit = Number(req.query.limit) || 50;
    const page = Number(req.query.page) || 1;
    const depth = Number(req.query.depth) || 1000; // max depth of child comments to populate
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    let dateFilter = {};
    if (startDate && endDate) {
        dateFilter = { "createdAt": { $gte: startDate, $lte: endDate } };
    } else if (startDate) {
        dateFilter = { "createdAt": { $gte: startDate } };
    } else if (endDate) {
        dateFilter = { "createdAt": { $lte: endDate } };
    }

    try {
        const skip = (page - 1) * limit;

        // Fetch comments based on the slug and paginate using skip and limit
        const comments = await getCommentsWithChildren(slug, limit, skip, dateFilter, depth);

        console.log(
            '\x1b[31m%s\x1b[0m------------------ Final result object ------------------\n',
            JSON.stringify(comments),
            '\x1b[0m'
        )

        const message: CommentInfoResponse = {
            comments: comments as any,
            total: totalCount,
            hasMore: false, // TODO: implement a pagination system for getting more top level comments
        }

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default get_article_comments;

let totalCount: number = 0; // count total number of comments including child comments

// use totalCount to count total number of comments including child comments
// this logic happens in the populateChildComments function in the for loop that calls populateChildComments
async function populateChildComments(comment: CommentDocument, maxDepth: number): Promise<CommentDocument> {
    if (comment.childComments && comment.childComments.length > 0) {
        comment = await Comment.populate(comment, {
            path: 'childComments',
            model: 'Comment'
        });

        console.log(
            '\x1b[32m%s\x1b[0m------------------ ChildComment populated ------------------\n',
            JSON.stringify(comment),
            '\x1b[0m'
        )

        // Deeply populate the child comments
        for (let i = 0; i < comment.childComments.length; i++) {
            comment.childComments[i] = await populateChildComments(comment.childComments[i] as CommentDocument, maxDepth - 1);

            // increment totalCount for each child comment
            totalCount++;
        }
    }
    // yellow console.log
    console.log(
        '\x1b[33m%s\x1b[0m------------------ before Child.toObject ------------------\n',
        JSON.stringify(comment),
        '\x1b[0m'
    )
    return comment.toObject({ virtuals: true });
}

async function getCommentsWithChildren(
    slug: string,
    limit: number,
    skip: number,
    dateFilter: {},
    maxDepth: number
): Promise<CommentDocument[]> {
    let topLevelComments = await Comment.find<CommentDocument>({
        slug: slug,
        parentComment: null,
        ...dateFilter
    })
        .skip(skip) // skip for getting next page
        .limit(limit); // limit for number of comments per page

    totalCount = topLevelComments.length;

    for (let i = 0; i < topLevelComments.length; i++) {
        topLevelComments[i] = await populateChildComments(topLevelComments[i], maxDepth);
    }

    // already populated and converted to object
    return topLevelComments;
}