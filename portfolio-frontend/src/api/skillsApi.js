import axiosInstance from "./axiosInstance";

export const getSkills = (params) => axiosInstance.get('/api/skills', { params });
export const getSkillById = (id) => axiosInstance.get(`/api/skills/${id}`);
export const createSkill = (data) => axiosInstance.post('/api/skills', data);
export const updateSkill = (id, data) => axiosInstance.put(`/api/skills/${id}`, data);
export const deleteSkill = (id) => axiosInstance.delete(`/api/skills/${id}`);
export const reorderSkills = (orderedIds) => axiosInstance.post('/api/skills/reorder', { orderedIds });
