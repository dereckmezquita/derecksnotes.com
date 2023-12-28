import { API_PREFIX } from '@constants/config';

const api_get_articles_meta = async (
    slugs: string[]
): Promise<ArticleDTO[]> => {
    try {
        const response = await fetch(`${API_PREFIX}/interact/get_articles_meta`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ slugs })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong fetching article metadata!');
        }

        return data;
    } catch (error) {
        console.error('Error fetching article meta:', error);
        throw error;
    }
};

export default api_get_articles_meta;