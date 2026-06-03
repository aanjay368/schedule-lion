import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? '/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/refresh', '/users/current'];

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach((p) => {
        if (error) {
            p.reject(error);
        } else {
            p.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
        const url = originalRequest?.url ?? '';
        const isPublic = PUBLIC_ENDPOINTS.some((e) => url.includes(e));

        if (err.response?.status !== 401 || isPublic) {
            return Promise.reject(err);
        }

        if (originalRequest._retried) {
            window.location.href = '/login';
            return Promise.reject(err);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => api(originalRequest))
              .catch((e) => Promise.reject(e));
        }

        originalRequest._retried = true;
        isRefreshing = true;

        try {            
            await api.post('/auth/refresh');

            processQueue(null);

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
            window.location.href = '/login';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;