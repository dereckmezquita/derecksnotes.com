import { API_PREFIX } from '@constants/config';

const api_me = async () => {
    try {
        const response = await fetch(API_PREFIX + '/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure session cookie is sent with the request
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export default api_me;
