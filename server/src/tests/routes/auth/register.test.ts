import request from 'supertest';
import { SetUp, app, redisClient } from '../../../index';

import { API_PREFIX } from '@utils/constants';

// jest.mock('redis', () => {
//     const redisMock = require('redis-mock');
//     const originalCreateClient = redisMock.createClient;

//     redisMock.createClient = () => ({
//         ...originalCreateClient(),
//         connect: jest.fn().mockResolvedValue(undefined),
//         set: jest.fn().mockResolvedValue(undefined),
//         get: jest.fn().mockResolvedValue(undefined),
//     });

//     return redisMock;
// });

// jest.mock('@utils/geoLocate', () => ({
//     __esModule: true,
//     default: jest.fn().mockResolvedValue({
//         ip: '127.0.0.1',
//         country: 'United States',
//         countryCode: 'US',
//         flag: '🇺🇸',
//         regionName: 'California',
//         city: 'San Francisco',
//         isp: 'ISP_NAME',
//         org: 'ORG_NAME'
//     }),
// }));

describe('POST /auth/register', () => {
    beforeAll(async () => {
        await SetUp();
    });

    afterAll(async () => {
        // await redisClient.disconnect();
    });
    
    it('should successfully register a new user', async () => {
        const payload = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'testpassword',
        };

        const res = await request(app)
            .post(API_PREFIX + '/auth/register')
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User registered and logged in successfully');
    }, 5000);

    it('should fail if the user already exists', async () => {
        const payload = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'testpassword',
        };

        // First, register the user
        await request(app)
            .post(`${API_PREFIX}/auth/register`)
            .send(payload);

        // Try to register the same user again
        const res = await request(app)
            .post(`${API_PREFIX}/auth/register`)
            .send(payload);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User already exists.');
    }, 5000);
});