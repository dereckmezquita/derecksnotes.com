import { API_PREFIX } from '@constants/config';

const api_register = async (email: string, username: string, password: string) => {
    try {
        const response = await fetch(API_PREFIX + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
            credentials: 'include',
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

export default api_register;