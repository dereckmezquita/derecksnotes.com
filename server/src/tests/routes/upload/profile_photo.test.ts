import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { SetUp, app } from '../../../index';  // Replace with your actual app import
import { InMemoryDBConnector } from '@utils/DatabaseConnector';
import { API_PREFIX, ROOT_DIR_CLIENT_UPLOADS } from '@utils/constants';
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

describe('POST /profile_photo Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let sessionCookie: string[] = [];
    // __dirname is same as this file's directory
    const filePath = path.join(__dirname, 'test-image.jpg');

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // Create a test user and log them in
        testUser = await User.create(userMock);
        const loginResponse = await request(app)
            .post(`${API_PREFIX}/auth/login`)
            .send({ username: userMock.username, password: userMock.password });

        sessionCookie = loginResponse.headers['set-cookie'];
    });

    afterAll(async () => {
        await User.deleteOne({ _id: testUser._id });
        await dbConnector.disconnect();
    });

    it('should upload and process the profile photo', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/upload/profile_photo`)
            .set('Cookie', sessionCookie)
            .attach('profileImage', fs.readFileSync(filePath), 'test_image.jpg');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Image uploaded, processed, and saved');
        expect(response.body).toHaveProperty('imageName');
    });

    it('should return 401 if user is not logged in', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/upload/profile_photo`)
            .attach('profileImage', fs.readFileSync(filePath), 'test_image.jpg');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Not logged in');
    });

    it('should return 400 if no file is uploaded', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/upload/profile_photo`)
            .set('Cookie', sessionCookie);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'No file uploaded!');
    });

    // Add more test cases for file size limit, file type, etc.
});
