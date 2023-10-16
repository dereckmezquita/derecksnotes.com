import { API_PREFIX } from "@constants/config";

const api_get_user_public_info = async (username: string): Promise<any> => {
    try {
        const response = await fetch(`${API_PREFIX}/interact/get_user_public_info/${username}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong fetching the user public profile!');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export default api_get_user_public_info;