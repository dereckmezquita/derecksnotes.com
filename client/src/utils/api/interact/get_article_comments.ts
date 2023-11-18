import { API_PREFIX } from '@constants/config';

const api_get_article_comments = async (
    slug: string,
    n?: number,
    page?: number,
    startDate?: string,
    endDate?: string
): Promise<any> => { 
    try {
        const queryParams = new URLSearchParams();
        if (n) queryParams.set('limit', n.toString());
        if (page) queryParams.set('page', page.toString());
        if (startDate) queryParams.set('startDate', startDate);
        if (endDate) queryParams.set('endDate', endDate);

        // Encode the slug
        const encodedSlug = encodeURIComponent(slug);

        // Construct URL with conditional query string
        const queryString = queryParams.toString();
        const url = `${API_PREFIX}/interact/get_article_comments?slug=${encodedSlug}` + (queryString ? `&${queryString}` : '');

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        // Check for an unsuccessful response
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong fetching the comments!');
        }

        return data;
    } catch (error) {
        console.error('Error fetching article comments:', error);
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