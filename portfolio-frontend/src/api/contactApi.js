import axiosInstance from "./axiosInstance";

export const submitContact = (data) => axiosInstance.post('/api/contact', data);
export const getMessages = (params) => axiosInstance.get('/api/contact', { params });
export const getMessageById = (id) => axiosInstance.get(`/api/contact/${id}`);
export const updateMessageStatus = (id, status, notes) =>
    axiosInstance.patch(`/api/contact/${id}/status`, { status, notes });
export const deleteMessage = (id) => axiosInstance.delete(`/api/contact/${id}`);