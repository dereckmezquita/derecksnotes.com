import resquest from 'supertest';
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
    }),
}));

describe('POST /auth/login Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let sessionCookie: string[] = [];

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // create a test user
        testUser = await User.create(userMock);
    });

    afterAll(async () => {
        // clean up
        await User.deleteOne({ _id: testUser._id });

        await dbConnector.disconnect();
    });

    it('should return 200 if login is successful', async () => {
        const response = await resquest(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: userMock.password });

        // save session cookie we will test this too
        sessionCookie = response.headers['set-cookie'];

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');

        // test session cookie
        expect(sessionCookie).toBeDefined();
    });
});