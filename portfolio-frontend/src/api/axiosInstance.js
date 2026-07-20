import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor — Attach Bearer Token ────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('elitecodehub_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor — Handle 401 Globally ───────────────────────────
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear storage and redirect
            localStorage.removeItem('elitecodehub_token');
            localStorage.removeItem('elitecodehub_admin');
            if (window.location.pathname.startsWith('/admin') &&
                window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;