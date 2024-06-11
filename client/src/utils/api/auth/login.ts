import { API_PREFIX } from '@constants/config';

const api_login = async (username: string, password: string) => {
    try {
        const response = await fetch(API_PREFIX + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(
                data.message || 'Something went wrong during login!'
            );
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export default api_login;
