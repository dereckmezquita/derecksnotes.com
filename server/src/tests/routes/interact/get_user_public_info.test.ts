import request from 'supertest';
import { SetUp, app, redisClient } from '../../../index';  // Importing app

import { API_PREFIX } from '@utils/constants';
import { NoOpDBConnector, InMemoryDBConnector } from '@utils/DatabaseConnector';

// Mock User.findOne to return a specific object
jest.mock('@models/User', () => ({
    findOne: jest.fn(() => {
        return {
            username: 'dereck',
            latestProfilePhoto: 'optimised_dereck_2023-09-28-162359.jpg',
            profilePhotos: ['optimised_dereck_2023-09-28-162359.jpg'],
            toObject: jest.fn().mockReturnValue({
                username: 'dereck',
                latestProfilePhoto: 'optimised_dereck_2023-09-28-162359.jpg',
                profilePhotos: ['optimised_dereck_2023-09-28-162359.jpg'],
            }),
        }
    }),
}));



describe('Get User Public Info Route', () => {
    let dbConnector: InMemoryDBConnector;

    // Set up before running tests
    beforeAll(async () => {
        // const dbConnector = new NoOpDBConnector();
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);
    });

    // Clean up after tests are done
    afterAll(async () => {
        await dbConnector.disconnect();
        await redisClient.disconnect();
    });

    it('should return user public info', async () => {
        const response = await request(app)
            .get(API_PREFIX + '/interact/get_user_public_info/dereck');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            username: 'dereck',
            latestProfilePhoto: 'optimised_dereck_2023-09-28-162359.jpg',
            profilePhotos: ['optimised_dereck_2023-09-28-162359.jpg'],
        });
    });
});
