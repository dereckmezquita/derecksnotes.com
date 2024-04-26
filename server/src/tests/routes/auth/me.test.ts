import request from 'supertest';
import { SetUp, app, redisClient } from '../../../index';
import { InMemoryDBConnector } from '@utils/DatabaseConnector';
import { API_PREFIX } from '@utils/constants';
import User, { UserDocument } from '@models/User';

import { userMock } from '../../mocks/user';

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

describe('GET /me Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let sessionCookie: string[] = [];

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // Create a test user
        testUser = await User.create(userMock);

        // Optionally, create some comments for this user
        // await Comment.create({ ... });

        // Simulate login to get the session cookie
        const loginResponse = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: userMock.password });

        expect(loginResponse.status).toBe(200);

        // Save the session cookie
        sessionCookie = loginResponse.headers['set-cookie'];
    });

    afterAll(async () => {
        // Clean up
        await User.deleteOne({ _id: testUser._id });
        // Optionally, delete comments created for this user
        // await Comment.deleteMany({ userId: testUser._id });

        await dbConnector.disconnect();
        // await redisClient.disconnect();
    });

    it('should return user info if logged in', async () => {
        const response = await request(app)
            .get(API_PREFIX + '/auth/me')
            .set('x-forwarded-for', '127.0.0.1') // Simulate an IP address
            .set('Cookie', sessionCookie); // Use the session cookie

        expect(response.status).toBe(200);
        expect(response.body.user.username).toBe(testUser.username);
        // Add more assertions based on what you expect in the response
    });

    it('should return 401 if not logged in', async () => {
        const response = await request(app)
            .get(API_PREFIX + '/auth/me')
            .set('x-forwarded-for', '127.0.0.1');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You need to be logged in.');
    });
});
