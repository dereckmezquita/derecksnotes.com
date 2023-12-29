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
            body: JSON.stringify({
                id: id, // encodeURIComponent(id)
                judgement
            }),
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

export const api_judge_article = async (slug: string, judgement: 'like' | 'dislike') => {
    try {
        const response = await fetch(API_PREFIX + '/interact/judge_article', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slug,
                judgement
            }),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error occurred while judging.');
        }

        return data;
    } catch (err: any) {
        console.log(err);
    }
}

export const api_judge_comment = async (id: string, judgement: 'like' | 'dislike') => {
    try {
        const response = await fetch(API_PREFIX + '/interact/judge_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                judgement
            }),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error occurred while judging.');
        }

        return data;
    } catch (err: any) {
        console.log(err);
    }
}