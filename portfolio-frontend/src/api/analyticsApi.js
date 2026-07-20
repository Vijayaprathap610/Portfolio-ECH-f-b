import axiosInstance from "./axiosInstance";

export const recordVisit = (page) => axiosInstance.post('/api/analytics/visit', { page });
export const getDashboardStats = () => axiosInstance.get('/api/analytics/dashboard');
export const getVisitorStats = (days = 30) =>
    axiosInstance.get('/api/analytics/visitors', { params: { days } });
export const getMonthlyActivity = () => axiosInstance.get('/api/analytics/monthly');