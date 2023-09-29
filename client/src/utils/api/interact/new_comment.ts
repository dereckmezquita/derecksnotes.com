import { API_PREFIX } from '@constants/config';

const api_new_comment = async (content: string, slug: string, parentComment?: string) => {
    try {
        const response = await fetch(API_PREFIX + '/interact/new_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, slug, parentComment }),
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
