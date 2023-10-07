import request from 'supertest';
import { SetUp, app } from '../../../index';
import { InMemoryDBConnector } from '@utils/DatabaseConnector';
import { API_PREFIX } from '@utils/constants';
import User from '@models/User';

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
    }),
}));

describe('POST /auth/logout Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let sessionCookie: string[] = [];

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // Create a test user and log them in
        await User.create(userMock);
        const loginResponse = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: userMock.password });

        sessionCookie = loginResponse.headers['set-cookie'];
    });

    afterAll(async () => {
        // Clean up
        await User.deleteOne({ username: userMock.username });
        await dbConnector.disconnect();
    });

    it('should successfully log out a logged-in user', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/auth/logout')
            .set('Cookie', sessionCookie);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logout successful');
    });

    it('should clear the session cookie', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/auth/logout')
            .set('Cookie', sessionCookie);

        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        // Assuming 'sid' is your session ID cookie name
        expect(cookies[0]).toMatch(/sid=;/);
    });

    // Optional: Test for not logged-in user
    it('should handle logout for not logged-in user', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/auth/logout');

        // Define what behavior you expect when a user is not logged in
        // For example, you might still want to return a 200 status
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logout successful');
    });
});