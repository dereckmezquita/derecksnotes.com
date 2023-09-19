import { API_URL } from '@constants/misc';

const api_register = async (email: string, username: string, password: string) => {
    console.log("Sending Registration Data:", { email, username, password });

    try {
        const response = await fetch(`http://localhost:3001/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
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