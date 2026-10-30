import axiosInstance from './axiosInstance';

export const getProfile = () => axiosInstance.get('/api/profile');

export const getPortfolioBundle = () => axiosInstance.get('/api/profile/bundle');

export const updateProfile = (data) => axiosInstance.put('/api/profile', data);

export const updateProfilePhoto = (formData) =>
    axiosInstance.patch('/api/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const updateResume = (resumeUrl) =>
    axiosInstance.patch('/api/profile/resume', { resumeUrl });
