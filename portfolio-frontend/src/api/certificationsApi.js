import axiosInstance from "./axiosInstance";

export const getCertifications = () => axiosInstance.get('/api/certifications');
export const getCertificationById = (id) => axiosInstance.get(`/api/certifications/${id}`);
export const createCertification = (formData) =>
    axiosInstance.post('/api/certifications', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCertification = (id, formData) =>
    axiosInstance.put(`/api/certifications/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCertification = (id) => axiosInstance.delete(`/api/certifications/${id}`);