import { API_PREFIX } from "@constants/config";

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