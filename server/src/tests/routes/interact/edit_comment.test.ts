import request from 'supertest';
import { SetUp, app } from '../../../index';
import { InMemoryDBConnector } from '@utils/DatabaseConnector';
import { API_PREFIX } from '@utils/constants';
import User, { UserDocument } from '@models/User';
import Comment from '@models/Comment';

import { userMock } from '../../mocks/user';
import mongoose from 'mongoose';

// TODO: implement goelocate for this end point

describe('PATCH /interact/edit_comment Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let sessionCookie: string;

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // Create a test user and log them in
        testUser = await User.create(userMock);
        const loginResponse = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: userMock.password });

        sessionCookie = loginResponse.headers['set-cookie'];
    });

    afterAll(async () => {
        // Clean up
        await User.deleteOne({ username: userMock.username });
        await Comment.deleteMany({});
        await dbConnector.disconnect();
    });

    it('should successfully create a new comment and edit the comment', async () => {
        const originalComment = await Comment.create({
            content: [{ comment: 'This is a test comment' }],
            slug: 'test_slug',
            userId: testUser._id.toString()
        });

        const response = await request(app)
            .patch(API_PREFIX + '/interact/edit_comment')
            .set('Cookie', sessionCookie)
            .send({
                commentId: originalComment._id.toString(),
                content: 'This is an edited comment'
            });

        expect(response.status).toBe(200);
        expect(response.body.latestContent.comment).toBe(
            'This is an edited comment'
        );
    });
});
