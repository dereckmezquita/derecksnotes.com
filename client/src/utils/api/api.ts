import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    '/api/v1/auth/refresh',
                    {},
                    { withCredentials: true }
                );
                return api(originalRequest);
            } catch {
                // Refresh failed, user needs to login again
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export { api };
