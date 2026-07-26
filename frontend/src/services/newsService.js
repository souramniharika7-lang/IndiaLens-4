import axiosInstance from '../axiosInstance';

export const getAll = (params = {}) => axiosInstance.get('/news', { params });
export const getById = (id) => axiosInstance.get(`/news/${id}`);
