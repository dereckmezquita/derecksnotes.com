import { API_PREFIX } from '@constants/config';

const api_get_article_comments = async (
    slug: string,
    n?: number,
    page?: number,
    startDate?: string,
    endDate?: string
): Promise<any> => { // TODO: update return type
    try {
        const limitParam = n ? `limit=${n}` : '';
        const pageParam = page ? `page=${page}` : '';
        const startDateParam = startDate ? `startDate=${startDate}` : '';
        const endDateParam = endDate ? `endDate=${endDate}` : '';
        const queryString = [limitParam, pageParam, startDateParam, endDateParam].filter(p => p).join('&');

        const response = await fetch(`${API_PREFIX}/interact/get_article_comments/${slug}?${queryString}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong fetching the comments!');
        }

        // console.log(JSON.stringify(data));

        return data;
    } catch (error) {
        throw error;
    }
};

export default api_get_article_comments;
/*
{
    "comments": [
        {
            "_id": "651a268152a74cbb77538a57",
            "childComments": [
                {
                    "_id": "651a268652a74cbb77538a60",
                    "childComments": [
                        {
                            "_id": "651a269552a74cbb77538a7a",
                            "childComments": [],
                            "parentComment": "651a268652a74cbb77538a60",
                            "reportTarget": null,
                            "mentions": [],
                            "slug": "chemistry_general-chemistry_a_acid",
                            "content": [
                                {
                                    "comment": "ccc",
                                    "_id": "651a269552a74cbb77538a7b",
                                    "createdAt": "2023-10-02T02:10:29.370Z",
                                    "updatedAt": "2023-10-02T02:10:29.370Z"
                                }
                            ],
                            "userId": "65150eaf09acd7d63838949b",
                            "judgement": {},
                            "deleted": false,
                            "createdAt": "2023-10-02T02:10:29.377Z",
                            "updatedAt": "2023-10-02T02:10:44.951Z",
                            "__v": 1,
                            "likesCount": 0,
                            "dislikesCount": 0,
                            "totalJudgement": 0,
                            "latestContent": {
                                "comment": "ccc",
                                "_id": "651a269552a74cbb77538a7b",
                                "createdAt": "2023-10-02T02:10:29.370Z",
                                "updatedAt": "2023-10-02T02:10:29.370Z"
                            },
                            "user": {
                                "_id": "65150eaf09acd7d63838949b",
                                "profilePhotos": [
                                    "optimised_dereck_2023-09-28-162359.jpg"
                                ],
                                "username": "dereck",
                                "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg",
                                "id": "65150eaf09acd7d63838949b"
                            },
                            "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg",
                            "id": "651a269552a74cbb77538a7a"
                        }
                    ],
                    "parentComment": "651a268152a74cbb77538a57",
                    "reportTarget": null,
                    "mentions": [],
                    "slug": "chemistry_general-chemistry_a_acid",
                    "content": [
                        {
                            "comment": "bbb",
                            "_id": "651a268652a74cbb77538a61",
                            "createdAt": "2023-10-02T02:10:14.873Z",
                            "updatedAt": "2023-10-02T02:10:14.873Z"
                        }
                    ],
                    "userId": "65150eaf09acd7d63838949b",
                    "judgement": {},
                    "deleted": false,
                    "createdAt": "2023-10-02T02:10:14.873Z",
                    "updatedAt": "2023-10-02T02:10:29.354Z",
                    "__v": 1,
                    "likesCount": 0,
                    "dislikesCount": 0,
                    "totalJudgement": 0,
                    "latestContent": {
                        "comment": "bbb",
                        "_id": "651a268652a74cbb77538a61",
                        "createdAt": "2023-10-02T02:10:14.873Z",
                        "updatedAt": "2023-10-02T02:10:14.873Z"
                    },
                    "user": {
                        "_id": "65150eaf09acd7d63838949b",
                        "profilePhotos": [
                            "optimised_dereck_2023-09-28-162359.jpg"
                        ],
                        "username": "dereck",
                        "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg",
                        "id": "65150eaf09acd7d63838949b"
                    },
                    "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg",
                    "id": "651a268652a74cbb77538a60"
                }
            ],
            "parentComment": null,
            "reportTarget": null,
            "mentions": [],
            "slug": "chemistry_general-chemistry_a_acid",
            "content": [
                {
                    "comment": "aaa",
                    "_id": "651a268152a74cbb77538a58",
                    "createdAt": "2023-10-02T02:10:09.459Z",
                    "updatedAt": "2023-10-02T02:10:09.459Z"
                }
            ],
            "userId": "65150eaf09acd7d63838949b",
            "judgement": {},
            "deleted": false,
            "createdAt": "2023-10-02T02:10:09.459Z",
            "updatedAt": "2023-10-02T02:10:14.865Z",
            "__v": 1,
            "likesCount": 0,
            "dislikesCount": 0,
            "totalJudgement": 0,
            "latestContent": {
                "comment": "aaa",
                "_id": "651a268152a74cbb77538a58",
                "createdAt": "2023-10-02T02:10:09.459Z",
                "updatedAt": "2023-10-02T02:10:09.459Z"
            },
            "user": {
                "_id": "65150eaf09acd7d63838949b",
                "profilePhotos": [
                    "optimised_dereck_2023-09-28-162359.jpg"
                ],
                "username": "dereck",
                "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg",
                "id": "65150eaf09acd7d63838949b"
            },
            "latestProfilePhoto": "optimised_dereck_2023-09-28-162359.jpg",
            "id": "651a268152a74cbb77538a57"
        }
    ],
    "hasMore": false
}
*/