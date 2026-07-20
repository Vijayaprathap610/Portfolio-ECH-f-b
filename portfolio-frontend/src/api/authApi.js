import axiosInstance from "./axiosInstance";

export const adminLogin = (credentials) =>
    axiosInstance.post('/api/auth/admin/login', credentials);

export const getAdminMe = () =>
    axiosInstance.get('/api/auth/admin/me');

export const adminLogout = () =>
    axiosInstance.post('/api/auth/admin/logout');