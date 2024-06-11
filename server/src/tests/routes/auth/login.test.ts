import request from 'supertest';
import { SetUp, app } from '../../../index';
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

describe('POST /auth/login Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let sessionCookie: string;

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // Create a test user
        testUser = await User.create(userMock);

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
        await dbConnector.disconnect();
    });

    it('should return 200 if login is successful', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: userMock.password });

        // Save session cookie; we will test this too
        sessionCookie = response.headers['set-cookie'];

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');

        // Test session cookie
        expect(sessionCookie).toBeDefined();
    });

    it('should return 401 for invalid username', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: 'invalidUsername', password: userMock.password });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid login credentials');
    });

    it('should return 401 for invalid password', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: 'invalidPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid login credentials');
    });

    it('should return 400 for missing username or password', async () => {
        const response = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username });

        expect(response.status).toBe(400); // Assuming your API returns 400 for bad requests
    });
});
