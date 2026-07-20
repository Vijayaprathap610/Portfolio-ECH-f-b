import axiosInstance from "./axiosInstance";

export const getTestimonials = () => axiosInstance.get('/api/testimonials');
export const getAllTestimonials = (params) => axiosInstance.get('/api/testimonials/admin/all', { params });
export const submitTestimonial = (data) => axiosInstance.post('/api/testimonials', data);
export const approveTestimonial = (id) => axiosInstance.patch(`/api/testimonials/${id}/approve`);
export const rejectTestimonial = (id, reason) =>
    axiosInstance.patch(`/api/testimonials/${id}/reject`, { reason });
export const deleteTestimonial = (id) => axiosInstance.delete(`/api/testimonials/${id}`);
export const updateTestimonial = (id, data) => axiosInstance.put(`/api/testimonials/${id}`, data);