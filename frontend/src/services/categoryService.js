import axiosInstance from '../axiosInstance';

export const getAll = () => axiosInstance.get('/categories');
export const getBySlug = (slug) => axiosInstance.get(`/categories/${slug}`);
