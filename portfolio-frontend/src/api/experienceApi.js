import axiosInstance from "./axiosInstance";

export const getExperience = () => axiosInstance.get('/api/experience');
export const getExperienceById = (id) => axiosInstance.get(`/api/experience/${id}`);
export const createExperience = (data) => axiosInstance.post('/api/experience', data);
export const updateExperience = (id, data) => axiosInstance.put(`/api/experience/${id}`, data);
export const deleteExperience = (id) => axiosInstance.delete(`/api/experience/${id}`);