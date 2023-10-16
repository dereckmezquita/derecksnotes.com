import request from 'supertest';
import { SetUp, app } from '../../../index';
import { InMemoryDBConnector } from '@utils/DatabaseConnector';
import { API_PREFIX } from '@utils/constants';
import User, { UserDocument } from '@models/User';
import Comment from '@models/Comment';

import { userMock, userMock2 } from '../../mocks/user';

jest.mock('@utils/geoLocate', () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({
        ip: '127.0.0.1',
        country: 'United States',
        countryCode: 'US',
        flag: '🇺🇸',
        regionName: 'California',
        city: 'San Francisco',
        isp: 'ISP_NAME',
        org: 'ORG_NAME'
    }),
}));

describe('DELETE /interact/delete_comments Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let testUser2: UserDocument;
    let sessionCookie: string[] = [];
    let sessionCookie2: string[] = [];

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // Create a test user and log them in
        testUser = await User.create(userMock);
        const loginResponse = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: userMock.password });

        sessionCookie = loginResponse.headers['set-cookie'];

        testUser2 = await User.create(userMock2);
        const loginResponse2 = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock2.username, password: userMock2.password });

        sessionCookie2 = loginResponse2.headers['set-cookie'];
    });

    afterAll(async () => {
        // Clean up
        await User.deleteOne({ _id: testUser._id });
        await Comment.deleteMany({});
        await dbConnector.disconnect();
    });

    it('should delete a single comment', async () => {
        const parentComment = await Comment.create({
            content: [{ comment: 'This is a parent comment' }],
            slug: 'test_slug',
            userId: testUser._id.toString()
        });

        const commentIds = [parentComment._id];

        const response = await request(app)
            .delete(API_PREFIX + '/interact/delete_comments')
            .set('Cookie', sessionCookie)
            .send({ commentIds });

        expect(response.status).toBe(200);
        // {"comments":[{"_id":"6524434fe686e62105ddfc84","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"test_slug","content":[{"comment":"This is a parent comment","_id":"6524434fe686e62105ddfc85","createdAt":"2023-10-09T18:15:43.238Z","updatedAt":"2023-10-09T18:15:43.238Z"},{"comment":"[deleted]","_id":"6524434fe686e62105ddfc8c","createdAt":"2023-10-09T18:15:43.251Z","updatedAt":"2023-10-09T18:15:43.251Z"}],"userId":"6524434ee686e62105ddfc79","judgement":{},"deleted":true,"createdAt":"2023-10-09T18:15:43.239Z","updatedAt":"2023-10-09T18:15:43.251Z","__v":1,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"[deleted]","_id":"6524434fe686e62105ddfc8c","createdAt":"2023-10-09T18:15:43.251Z","updatedAt":"2023-10-09T18:15:43.251Z"},"user":{"_id":"6524434ee686e62105ddfc79","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"6524434ee686e62105ddfc79"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"6524434fe686e62105ddfc84"}],"hasMore":false}
        const body = response.body as { comments: CommentPopUserDTO[], hasMore: boolean };
        expect(body.comments.length).toBe(1);
        expect(body.comments[0]._id).toBe(parentComment._id.toString());
        expect(body.comments[0].deleted).toBe(true);
        expect(body.comments[0].latestContent!.comment).toBe('[deleted]');
    });

    it('should return 401 if the user does not own all comments', async () => {
        const parentComment = await Comment.create({
            content: [{ comment: 'This is a parent comment' }],
            slug: 'test_slug',
            userId: testUser._id.toString()
        });

        // delete_comments is protected by isAuthenticated middleware
        const childComment = await Comment.create({
            content: [{ comment: 'This is a parent comment' }],
            slug: 'test_slug',
            userId: testUser2._id.toString(),
        });

        const commentIds = [
            parentComment._id,
            childComment._id
        ];
        const response = await request(app)
            .delete(API_PREFIX + '/interact/delete_comments')
            .set('Cookie', sessionCookie)
            .send({ commentIds });

        expect(response.status).toBe(401);
        expect(response.body.message).toContain('You do not own these comments');
    });

    // TODO: consider the case of a user trying to delete a comment that doesn't exist
});