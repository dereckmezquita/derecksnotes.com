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

        return data;
    } catch (error) {
        throw error;
    }
}

export default api_delete_comments;