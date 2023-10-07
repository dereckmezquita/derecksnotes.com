import request from 'supertest';
import { SetUp, app, redisClient } from '../../../index';
import { InMemoryDBConnector } from '@utils/DatabaseConnector'
import { API_PREFIX } from '@utils/constants';
import User, { UserDocument } from '@models/User';

import { userMock } from 'src/tests/mocks/user';

describe('Get User Public Info Route', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        testUser = await User.create(userMock);
    });


    // Clean up after tests are done
    afterAll(async () => {
        await User.deleteOne({ _id: testUser._id });

        await dbConnector.disconnect();
        // await redisClient.disconnect();
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
