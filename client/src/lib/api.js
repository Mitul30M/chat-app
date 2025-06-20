import { HOST, REFRESH_TOKEN_ROUTE } from '@/utils/constants';
import axios from 'axios';
//axios wrapper to wrap each req
const api = axios.create({
    baseURL: HOST,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Axios request interceptor to add accessToken to every request
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Axios response interceptor to handle expired token
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const { data } = await axios.post(REFRESH_TOKEN_ROUTE, { refreshToken });

            localStorage.setItem('accessToken', data.tokens.accessToken);
            localStorage.setItem('refreshToken', data.tokens.refreshToken);

            originalRequest.headers['Authorization'] = `Bearer ${data.tokens.accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default api;
