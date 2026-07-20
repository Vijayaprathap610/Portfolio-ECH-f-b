import axiosInstance from "./axiosInstance";

export const getProjects = (params) => axiosInstance.get('/api/projects', { params });
export const getProjectById = (id) => axiosInstance.get(`/api/projects/${id}`);
export const getProjectCategories = () => axiosInstance.get('/api/projects/categories');

export const createProject = (formData) =>
    axiosInstance.post('/api/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const updateProject = (id, formData) =>
    axiosInstance.put(`/api/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const deleteProject = (id) => axiosInstance.delete(`/api/projects/${id}`);

export const deleteProjectImage = (id, imageUrl) =>
    axiosInstance.delete(`/api/projects/${id}/image`, { data: { imageUrl } });