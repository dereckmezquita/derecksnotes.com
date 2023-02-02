import { Router } from 'express';
import { sendRes } from '../helpers';
import { MongoClient } from 'mongodb';

export const postTesty = Router();

export const initTesty = (client: MongoClient) => {
    // post request for getting entries for index page
    // allows to request entries for page blog, courses, etc and number of posts
    // will listen for request for more entries
    postTesty.post('/testy', (req, res) => {
        const {username, data} = req.body;

        if(!username || !data) {
            console.log("Retard");
            return;
        }
        // I can take data and directly pass it to argon2 - should have no issue with just raw strings
        const hash = Buffer.from(data, 'binary'); // .toString("hex")

        sendRes(res, true);
    });
}