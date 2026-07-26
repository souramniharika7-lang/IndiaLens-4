import axiosInstance from '../axiosInstance';

export const getAll = (params = {}) => axiosInstance.get('/indicators', { params });
export const getBySlug = (slug) => axiosInstance.get(`/indicators/${slug}`);
