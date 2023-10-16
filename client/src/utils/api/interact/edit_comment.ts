import { API_PREFIX } from "@constants/config";

// end point get's current user ID from session
const api_edit_comment = async (commentId: string, content: string): Promise<CommentPopUserDTO> => {
    try {
        const response = await fetch(API_PREFIX + '/interact/edit_comment', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId, content }),
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong while editing the comment!');
        }

        // console.log(JSON.stringify(data));

        return data;
    } catch (error) {
        throw error;
    }
}

export default api_edit_comment;