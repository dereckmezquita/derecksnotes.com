import { API_PREFIX } from '@constants/config';

const api_get_article_comments = async (slug: string, n: number, page: number = 1) => {
    try {
        const response = await fetch(`${API_PREFIX}/interact/article_comments/${slug}?limit=${n}&page=${page}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong fetching the comments!');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export default api_get_article_comments;