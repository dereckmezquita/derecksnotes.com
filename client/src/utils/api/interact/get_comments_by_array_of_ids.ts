import { API_PREFIX } from '@constants/config';

const api_get_comments_by_array_of_ids = async (
    commentIds: string[],
    n?: number,
    page?: number,
    startDate?: string,
    endDate?: string
): Promise<CommentInfoResponse> => {
    try {
        const limitParam = n ? `limit=${n}` : '';
        const pageParam = page ? `page=${page}` : '';
        const startDateParam = startDate ? `startDate=${startDate}` : '';
        const endDateParam = endDate ? `endDate=${endDate}` : '';
        const queryString = [limitParam, pageParam, startDateParam, endDateParam].filter(p => p).join('&');

        const response = await fetch(`${API_PREFIX}/interact/get_comments_by_array_of_ids?${queryString}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentIds })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong fetching the replies comments!');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export default api_get_comments_by_array_of_ids;
