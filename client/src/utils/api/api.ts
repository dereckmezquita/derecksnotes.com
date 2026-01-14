import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Simple error passthrough - no refresh logic needed with session-based auth
// 401 errors are handled by AuthContext which redirects to login
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export { api };
