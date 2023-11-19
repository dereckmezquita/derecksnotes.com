import { API_PREFIX } from "@constants/config";

const api_judge = async (type: 'article' | 'comment', id: string, judgement: string) => {
    const END_POINT: string = type === 'article' ?
        '/interact/judge_article' :
        '/interact/judge_comment';

    try {
        const response = await fetch(API_PREFIX + END_POINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, judgement }),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error occurred while judging.');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export default api_judge;