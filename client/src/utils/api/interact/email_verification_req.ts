import { API_PREFIX } from "@constants/config";

// end point get's current user ID from session
const api_email_verification_req = async (email: string): Promise<any> => {
    try {
        const response = await fetch(
            `${API_PREFIX}/interact/email_verification_req?email=${encodeURIComponent(email)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send verification email. Please try again later.');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export default api_email_verification_req;