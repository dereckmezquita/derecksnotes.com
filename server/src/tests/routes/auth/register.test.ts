import request from 'supertest';
import { SetUp, app, redisClient } from '../../../index';
import { InMemoryDBConnector } from '@utils/DatabaseConnector';

import { API_PREFIX } from '@utils/constants';

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

describe('Get User Public Info Route', () => {
    let dbConnector: InMemoryDBConnector;

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);
    });

    // Clean up after tests are done
    afterAll(async () => {
        await dbConnector.disconnect();
        // await redisClient.disconnect();
    });

    it('should return user public info', async () => {
        const payload = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'testpassword',
        };

        const res = await request(app)
            .post(API_PREFIX + '/auth/register')
            .set('Content-Type', 'application/json')
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User registered and logged in successfully');
    });

    it('should fail if the user already exists', async () => {
        const payload = {
            email: 'dereck@example.com',
            username: 'dereck',
            password: 'testpassword',
        };

        // First, register the user
        await request(app)
            .post(API_PREFIX + '/auth/register')
            .send(payload);

        // Try to register the same user again
        const res = await request(app)
            .post(API_PREFIX + '/auth/register')
            .send(payload);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User already exists.');
    });
});
