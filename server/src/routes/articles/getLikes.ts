import { Router, Response } from 'express';
import { sendRes } from '../../modules/helpers';
import { MongoClient } from 'mongodb';

export const getLikes = Router();

export const initGetLikes = (client: MongoClient) => {
    getLikes.get('/articles/get_likes', (req, res) => {
        sendRes(res, true, {someKey: "Some value!"})
    });
}