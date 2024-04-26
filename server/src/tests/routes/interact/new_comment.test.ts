import request from 'supertest';
import { SetUp, app } from '../../../index';
import { InMemoryDBConnector } from '@utils/DatabaseConnector';
import { API_PREFIX } from '@utils/constants';
import User, { UserDocument } from '@models/User';
import Comment from '@models/Comment';

import { userMock } from '../../mocks/user';
import mongoose from 'mongoose';

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
    })
}));

jest.mock('@utils/constants', () => ({
    ...jest.requireActual('@utils/constants'),
    MAX_COMMENT_DEPTH: 2
}));

describe('POST /interact/new_comment Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let sessionCookie: string[] = [];

    const slug: string = encodeURIComponent('test_slug');

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

    it('should successfully create a new comment without a parent comment', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/interact/new_comment')
            .set('Cookie', sessionCookie)
            .send({ comment: 'This is a test comment', encodedSlug: slug });

        expect(response.status).toBe(201);
        expect(response.body.content[0].comment).toBe('This is a test comment');
        expect(response.body.slug).toBe('test_slug');
    });

    it('should successfully create a new comment with a parent comment', async () => {
        const parentComment = await Comment.create({
            content: [{ comment: 'This is a parent comment' }],
            slug: decodeURIComponent(slug),
            userId: testUser._id.toString()
        });

        const response = await request(app)
            .post(API_PREFIX + '/interact/new_comment')
            .set('Cookie', sessionCookie)
            .send({
                comment: 'This is a child comment',
                encodedSlug: slug,
                parentComment: parentComment._id.toString()
            });

        expect(response.status).toBe(201);
        expect(response.body.content[0].comment).toBe(
            'This is a child comment'
        );
        expect(response.body.parentComment).toBe(parentComment._id.toString());
    });

    it('should return 400 for missing comment or slug', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/interact/new_comment')
            .set('Cookie', sessionCookie)
            .send({ comment: 'Missing slug' });

        expect(response.status).toBe(400);
    });

    it('should return 400 for exceeding max comment depth', async () => {
        // Create a chain of comments to exceed MAX_COMMENT_DEPTH
        // You would need to actually create these comments in your DB

        const parentComment = await Comment.create({
            content: [{ comment: 'This is a parent comment' }],
            slug: decodeURIComponent(slug),
            userId: testUser._id.toString()
        });

        const childComment = await Comment.create({
            content: [{ comment: 'This is a child comment' }],
            slug: decodeURIComponent(slug),
            userId: testUser._id.toString(),
            parentComment: parentComment._id
        });

        const grandchildComment = await Comment.create({
            content: [{ comment: 'This is a grandchild comment' }],
            slug: decodeURIComponent(slug),
            userId: testUser._id.toString(),
            parentComment: childComment._id
        });

        const response = await request(app)
            .post(API_PREFIX + '/interact/new_comment')
            .set('Cookie', sessionCookie)
            .send({
                comment: 'This should fail',
                encodedSlug: slug,
                parentComment: grandchildComment._id.toString()
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Reply depth limit reached.');
    });

    it('should return 400 for non-existent parent comment', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .post(API_PREFIX + '/interact/new_comment')
            .set('Cookie', sessionCookie)
            .send({
                comment: 'This is a test comment',
                encodedSlug: slug,
                parentComment: nonExistentId
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Parent comment not found.');
    });
});
