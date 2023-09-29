import { API_PREFIX } from '@constants/config';

const api_get_article_comments = async (slug: string, n?: number, page?: number, startDate?: string, endDate?: string) => {
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

        return data;
    } catch (error) {
        throw error;
    }
};

export default api_get_article_comments;