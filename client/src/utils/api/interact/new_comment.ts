import { API_PREFIX } from '@constants/config';

// end point get's current user ID from session
const api_new_comment = async (comment: string, slug: string, parentComment?: string) => {
    try {
        const payload = {
            comment,
            slug: encodeURIComponent(slug),
            parentComment
        }

        console.log(payload)

        const response = await fetch(API_PREFIX + '/interact/new_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong while posting the comment!');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export default api_new_comment;

/*
Server sent:
    {
    childComments: [],
    parentComment: null,
    reportTarget: null,
    mentions: [],
    slug: 'chemistry_general-chemistry_a_acid',
    content: [
        {
        comment: 'mmm',
        _id: new ObjectId("651f78994c0a204990c13782"),
        createdAt: 2023-10-06T03:01:45.483Z,
        updatedAt: 2023-10-06T03:01:45.483Z
        }
    ],
    userId: new ObjectId("65150eaf09acd7d63838949b"),
    judgement: Map(0) {},
    deleted: false,
    _id: new ObjectId("651f78994c0a204990c13781"),
    createdAt: 2023-10-06T03:01:45.483Z,
    updatedAt: 2023-10-06T03:01:45.483Z,
    __v: 0,
    likesCount: 0,
    dislikesCount: 0,
    totalJudgement: 0,
    latestContent: {
        comment: 'mmm',
        _id: new ObjectId("651f78994c0a204990c13782"),
        createdAt: 2023-10-06T03:01:45.483Z,
        updatedAt: 2023-10-06T03:01:45.483Z
    },
    user: {
        _id: new ObjectId("65150eaf09acd7d63838949b"),
        profilePhotos: [
        'optimised_dereck_2023-09-28-162359.jpg',
        'optimised_dereck_2023-10-04-024459.png'
        ],
        username: 'dereck',
        latestProfilePhoto: 'optimised_dereck_2023-10-04-024459.png',
        id: '65150eaf09acd7d63838949b'
    },
    latestProfilePhoto: 'optimised_dereck_2023-10-04-024459.png',
    id: '651f78994c0a204990c13781'
}
Client received:
{"childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"mmm","_id":"651f78994c0a204990c13782","createdAt":"2023-10-06T03:01:45.483Z","updatedAt":"2023-10-06T03:01:45.483Z"}],"userId":"65150eaf09acd7d63838949b","judgement":{},"deleted":false,"_id":"651f78994c0a204990c13781","createdAt":"2023-10-06T03:01:45.483Z","updatedAt":"2023-10-06T03:01:45.483Z","__v":0,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"mmm","_id":"651f78994c0a204990c13782","createdAt":"2023-10-06T03:01:45.483Z","updatedAt":"2023-10-06T03:01:45.483Z"},"user":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg","optimised_dereck_2023-10-04-024459.png"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-10-04-024459.png","id":"65150eaf09acd7d63838949b"},"latestProfilePhoto":"optimised_dereck_2023-10-04-024459.png","id":"651f78994c0a204990c13781"}
*/