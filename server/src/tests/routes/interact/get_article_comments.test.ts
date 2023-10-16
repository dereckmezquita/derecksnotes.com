import request from 'supertest';
import { SetUp, app } from '../../../index';
import { InMemoryDBConnector } from '@utils/DatabaseConnector';
import { API_PREFIX } from '@utils/constants';
import User, { UserDocument } from '@models/User';
import Comment, { CommentDocument } from '@models/Comment';

import { userMock } from '../../mocks/user';
import { generateCommentObj } from '../../mocks/comment';

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

describe('GET /interact/get_article_comments/:slug Endpoint', () => {
    let dbConnector: InMemoryDBConnector;
    let testUser: UserDocument;
    let sessionCookie: string[] = [];
    let comments: CommentDocument[] = [];
    let replies: CommentDocument[] = [];

    // slugs are not full path after domain
    const slug: string = encodeURIComponent('test/post');

    beforeAll(async () => {
        dbConnector = new InMemoryDBConnector();
        await SetUp(dbConnector);

        // Create a test user and log them in
        testUser = await User.create(userMock);
        const loginResponse = await request(app)
            .post(API_PREFIX + '/auth/login')
            .send({ username: userMock.username, password: userMock.password });

        sessionCookie = loginResponse.headers['set-cookie'];

        // Create an article for the comments
        const commentPromises = "abc".split('').map(async (letter) => {
            const response = await request(app)
                .post(API_PREFIX + '/interact/new_comment')
                .set('Cookie', sessionCookie)
                .send({ comment: letter, encodedSlug: slug });

            return response.body;
        });

        comments = await Promise.all(commentPromises);

        // create replies for these comments
        const repliesPromises = comments.map(async (comment) => {
            const response = await request(app)
                .post(API_PREFIX + '/interact/new_comment')
                .set('Cookie', sessionCookie)
                .send({ comment: 'reply', encodedSlug: slug, parentComment: comment._id });

            return response.body;
        });

        replies = await Promise.all(repliesPromises);
    });

    afterAll(async () => {
        await User.deleteOne({ _id: testUser._id });
        await Comment.deleteMany({});
        await dbConnector.disconnect();
    });

    it('should return comments for a given article slug', async () => {
        const response = await request(app)
            .get(API_PREFIX + `/interact/get_article_comments/${slug}`)
            .set('Cookie', sessionCookie);

        const validateCommentTree = (comment: any, depth: number = 0) => {
            expect(comment).toHaveProperty('_id');
            expect(comment).toHaveProperty('userId');
            expect(comment).toHaveProperty('content');
            // ... add more validations

            // If the comment has child comments, validate them as well
            if (comment.childComments && Array.isArray(comment.childComments) && comment.childComments.length > 0) {
                comment.childComments.forEach((childComment: any) => {
                    validateCommentTree(childComment, depth + 1);
                });
            }
        };

        // console.log(JSON.stringify(response.body));

        expect(response.status).toBe(200);
        expect(response.body.comments.length).toBe(3);

        response.body.comments.forEach((comment: any) => {
            validateCommentTree(comment);
        });
    });

    // Add more test cases as needed
});

const example_comment_DTO = {
    "_id": "6524a49ab4aca3c5faca662e",
    "childComments": [],
    "parentComment": "6524a499b4aca3c5faca661b",
    "reportTarget": null,
    "mentions": [],
    "slug": "test",
    "content": [
        {
            "comment": "reply",
            "_id": "6524a49ab4aca3c5faca662f",
            "createdAt": "2023-10-10T01:10:50.017Z",
            "updatedAt": "2023-10-10T01:10:50.017Z"
        }
    ],
    "userId": "6524a499b4aca3c5faca6607",
    "judgement": {},
    "deleted": false,
    "createdAt": "2023-10-10T01:10:50.017Z",
    "updatedAt": "2023-10-10T01:10:50.017Z",
    "__v": 0,
    "likesCount": 0,
    "dislikesCount": 0,
    "totalJudgement": 0,
    "latestContent": {
        "comment": "reply",
        "_id": "6524a49ab4aca3c5faca662f",
        "createdAt": "2023-10-10T01:10:50.017Z",
        "updatedAt": "2023-10-10T01:10:50.017Z"
    },
    "user": {
        "_id": "6524a499b4aca3c5faca6607",
        "profilePhotos": [
            "optimised_dereck_2023-09-28-162359.jpg"
        ],
        "username": "dereck",
        "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg",
        "id": "6524a499b4aca3c5faca6607"
    },
    "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg",
    "id": "6524a49ab4aca3c5faca662e"
}

/*
Example output from server:
{"comments":[{"_id":"652471a00c3f27ee468e9bed","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"test","content":[{"comment":"a","_id":"652471a00c3f27ee468e9bee","createdAt":"2023-10-09T21:33:20.985Z","updatedAt":"2023-10-09T21:33:20.985Z"}],"userId":"652471a00c3f27ee468e9be7","judgement":{},"deleted":false,"createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"a","_id":"652471a00c3f27ee468e9bee","createdAt":"2023-10-09T21:33:20.985Z","updatedAt":"2023-10-09T21:33:20.985Z"},"user":{"_id":"652471a00c3f27ee468e9be7","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9be7"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9bed"},{"_id":"652471a00c3f27ee468e9bef","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"test","content":[{"comment":"b","_id":"652471a00c3f27ee468e9bf0","createdAt":"2023-10-09T21:33:20.986Z","updatedAt":"2023-10-09T21:33:20.986Z"}],"userId":"652471a00c3f27ee468e9be7","judgement":{},"deleted":false,"createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"b","_id":"652471a00c3f27ee468e9bf0","createdAt":"2023-10-09T21:33:20.986Z","updatedAt":"2023-10-09T21:33:20.986Z"},"user":{"_id":"652471a00c3f27ee468e9be7","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9be7"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9bef"},{"_id":"652471a00c3f27ee468e9bf1","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"test","content":[{"comment":"c","_id":"652471a00c3f27ee468e9bf2","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"}],"userId":"652471a00c3f27ee468e9be7","judgement":{},"deleted":false,"createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"c","_id":"652471a00c3f27ee468e9bf2","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"},"user":{"_id":"652471a00c3f27ee468e9be7","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9be7"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9bf1"},{"_id":"652471a00c3f27ee468e9bf7","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"test","content":[{"comment":"f","_id":"652471a00c3f27ee468e9bf8","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"}],"userId":"652471a00c3f27ee468e9be7","judgement":{},"deleted":false,"createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"f","_id":"652471a00c3f27ee468e9bf8","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"},"user":{"_id":"652471a00c3f27ee468e9be7","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9be7"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9bf7"},{"_id":"652471a00c3f27ee468e9bf9","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"test","content":[{"comment":"g","_id":"652471a00c3f27ee468e9bfa","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"}],"userId":"652471a00c3f27ee468e9be7","judgement":{},"deleted":false,"createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"g","_id":"652471a00c3f27ee468e9bfa","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"},"user":{"_id":"652471a00c3f27ee468e9be7","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9be7"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9bf9"},{"_id":"652471a00c3f27ee468e9bf3","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"test","content":[{"comment":"d","_id":"652471a00c3f27ee468e9bf4","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"}],"userId":"652471a00c3f27ee468e9be7","judgement":{},"deleted":false,"createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"d","_id":"652471a00c3f27ee468e9bf4","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"},"user":{"_id":"652471a00c3f27ee468e9be7","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9be7"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9bf3"},{"_id":"652471a00c3f27ee468e9bf5","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"test","content":[{"comment":"e","_id":"652471a00c3f27ee468e9bf6","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"}],"userId":"652471a00c3f27ee468e9be7","judgement":{},"deleted":false,"createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"e","_id":"652471a00c3f27ee468e9bf6","createdAt":"2023-10-09T21:33:20.987Z","updatedAt":"2023-10-09T21:33:20.987Z"},"user":{"_id":"652471a00c3f27ee468e9be7","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9be7"},"latestProfilePhoto":"optimised_dereck_2023-09-28-162359.jpg","id":"652471a00c3f27ee468e9bf5"}],"hasMore":false}
*/