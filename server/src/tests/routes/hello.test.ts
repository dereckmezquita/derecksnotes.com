import request from 'supertest';
import { app, redisClient, SetUp } from '../../index';  // Importing app, redisClient, and SetUp
import { API_PREFIX } from '@utils/constants';
import { NoOpDBConnector } from '@utils/DatabaseConnector';

describe('Hello Route', () => {
    // Set up before running tests
    beforeAll(async () => {
        const dbConnector = new NoOpDBConnector();
        await SetUp(dbConnector);
    });

    // Clean up after tests are done
    afterAll(async () => {
        await redisClient.disconnect();
    });

    it('should return Hello World!', async () => {
        const response = await request(app)
            .get(API_PREFIX + '/hello');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World!');
    });
});