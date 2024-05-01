import request from 'supertest';
import { SetUp, app } from '../../../index'; // Replace with your actual app import
import { InMemoryDBConnector } from '@utils/DatabaseConnector';
import { API_PREFIX } from '@utils/constants';
import User, { UserDocument } from '@models/User';
import Comment, { CommentDocument } from '@models/Comment';

import { userMock } from '../../mocks/user';
import { generateCommentObj } from '../../mocks/comment';

describe('POST /get_comments_threads_by_id Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let sessionCookie: string;
    let comments: CommentDocument[] = [];

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // Create a test user and log them in
        testUser = await User.create(userMock);
        const loginResponse = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: userMock.password });

        sessionCookie = loginResponse.headers['set-cookie'];

        // Create comments for the test
        const commentPromises = Array.from({ length: 5 }, (_, i) => {
            return Comment.create(
                generateCommentObj(testUser._id, `Comment ${i + 1}`)
            );
        });

        comments = await Promise.all(commentPromises);
    });

    afterAll(async () => {
        await User.deleteOne({ _id: testUser._id });
        await Comment.deleteMany({});
        await dbConnector.disconnect();
    });

    it('should return comments based on provided IDs', async () => {
        const commentIds = comments.map((comment) => comment._id.toString());

        const response = await request(app)
            .post(API_PREFIX + `/interact/get_comments_threads_by_id`)
            .set('Cookie', sessionCookie)
            .send({ commentIds });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('comments');
        expect(response.body.comments.length).toBe(commentIds.length);

        response.body.comments.forEach((comment: any) => {
            expect(commentIds).toContain(comment._id);
            expect(comment).toHaveProperty('userId');
            expect(comment).toHaveProperty('content');
            expect(comment).toHaveProperty('user');
            expect(comment.user).toHaveProperty('profilePhotos');
            expect(comment.user).toHaveProperty('username');
        });
    });

    it('should return 400 if commentIds is not an array', async () => {
        const response = await request(app)
            .post(API_PREFIX + `/interact/get_comments_threads_by_id`)
            .set('Cookie', sessionCookie)
            .send({ commentIds: 'not-an-array' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'message',
            'commentIds must be an array of strings.'
        );
    });

    // Add more test cases for pagination, date filtering, etc.
});
