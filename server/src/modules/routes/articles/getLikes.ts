import { Router, Response } from 'express';
import { sendRes } from '../../helpers';
import { MongoClient, ObjectId } from 'mongodb';

export const getLikes = Router();

export const initGetLikes = (client: MongoClient) => {
    // post request for getting entries for index page
    // allows to request entries for page blog, courses, etc and number of posts
    // will listen for request for more entries
    getLikes.get('/getLikes', (req, res) => {
        sendRes(res, true, {someKey: "Some value!"})
    });
}