import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Simple in-memory cache for fast idempotent GET requests (SWR speedup)
const memoryCache = new Map();
const CACHE_TTL_MS = 20000; // 20s cache window

// ─── Request Interceptor — Attach Bearer Token ────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('elitecodehub_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Cache hit check for GET requests that don't explicitly bypass
        if (config.method === 'get' && !config.params?.noCache && !config.headers?.['x-skip-cache']) {
            const cacheKey = `${config.url}?${JSON.stringify(config.params || {})}`;
            const cachedEntry = memoryCache.get(cacheKey);
            if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
                config.adapter = () => Promise.resolve({
                    data: cachedEntry.data,
                    status: 200,
                    statusText: 'OK (Memory Cache)',
                    headers: cachedEntry.headers || {},
                    config,
                    request: {},
                });
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor — Cache GETs & Handle 401 Globally ─────────────
axiosInstance.interceptors.response.use(
    (response) => {
        // Store in cache if successful GET
        if (response.config.method === 'get' && response.status === 200) {
            const cacheKey = `${response.config.url}?${JSON.stringify(response.config.params || {})}`;
            memoryCache.set(cacheKey, {
                timestamp: Date.now(),
                data: response.data,
                headers: response.headers,
            });
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('elitecodehub_token');
            localStorage.removeItem('elitecodehub_admin');
            localStorage.removeItem('elitecodehub_user');
            if (window.location.pathname.startsWith('/admin') &&
                window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export const clearApiCache = () => {
    memoryCache.clear();
};

export default axiosInstance;
