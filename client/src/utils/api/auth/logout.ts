const api_logout = async (): Promise<void> => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong during logout!');
        }

        return data;
    } catch (error: any) {
        throw error;
    }
}

export default api_logout;