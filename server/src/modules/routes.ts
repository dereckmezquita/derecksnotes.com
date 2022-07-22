
import { Router, Response } from 'express';

const _ = undefined;

export const router = Router();

router.get('/getPost', (req, res) => {
    const postId = req.query.postId;

    if (typeof postId !== 'string') return sendRes(res, false, _, "Bad postId!");

    sendRes(res, true, { postId });
});

function sendRes(res: Response, success: boolean, data?: any, errorMsg?: string) {
    res.json({
        success: success,
        data: data,
        error: errorMsg
    });
}
