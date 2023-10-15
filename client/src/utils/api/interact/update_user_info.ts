import { API_PREFIX } from "@constants/config";

const api_update_user_info = async (obj: {
    username?: string,
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    geolocationId?: string
}): Promise<{ message: string }> => {
    try {
        // check that at least one update parameter is provided
        if (!(obj.username || obj.email || obj.password || obj.firstName || obj.lastName || obj.geolocationId)) {
            throw new Error("At least one update parameter must be provided.");
        }

        const options: any = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj),
            credentials: 'include',
        };

        const response = await fetch(API_PREFIX + '/interact/update_user_info', options);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong during the user update!');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export default api_update_user_info;