import { API_PREFIX } from "@constants/config";

// end point get's current user ID from session
const api_delete_comments = async (commentIds: string[]) => {
    try {
        const response = await fetch(API_PREFIX + '/interact/delete_comments', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentIds }),
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong while deleting the comment!');
        }

        // console.log(JSON.stringify(data));

        return data;
    } catch (error) {
        throw error;
    }
}

export default api_delete_comments;

/*
Client received:
{"comments":[{"_id":"651f76e2f0cf6928b3c2ff4b","childComments":[],"parentComment":null,"reportTarget":null,"mentions":[],"slug":"chemistry_general-chemistry_a_acid","content":[{"comment":"lll","_id":"651f76e2f0cf6928b3c2ff4c","createdAt":"2023-10-06T02:54:26.879Z","updatedAt":"2023-10-06T02:54:26.879Z"},{"comment":"[deleted]","_id":"651f8eac4c0a204990c13981","createdAt":"2023-10-06T04:35:56.269Z","updatedAt":"2023-10-06T04:35:56.269Z"}],"userId":{"_id":"65150eaf09acd7d63838949b","profilePhotos":["optimised_dereck_2023-09-28-162359.jpg","optimised_dereck_2023-10-04-024459.png"],"username":"dereck","latestProfilePhoto":"optimised_dereck_2023-10-04-024459.png","id":"65150eaf09acd7d63838949b"},"judgement":{},"deleted":true,"createdAt":"2023-10-06T02:54:26.879Z","updatedAt":"2023-10-06T04:35:56.270Z","__v":1,"likesCount":0,"dislikesCount":0,"totalJudgement":0,"latestContent":{"comment":"[deleted]","_id":"651f8eac4c0a204990c13981","createdAt":"2023-10-06T04:35:56.269Z","updatedAt":"2023-10-06T04:35:56.269Z"},"latestProfilePhoto":null,"id":"651f76e2f0cf6928b3c2ff4b"}],"hasMore":false}
*/