import axiosInstance from '../axiosInstance';

export const getGlobalInsights = () => axiosInstance.get('/ai/insights/global');
export const getCategoryInsights = (slug) => axiosInstance.get(`/ai/insights/category/${slug}`);
export const getIndicatorInsights = (slug) => axiosInstance.get(`/ai/insights/indicator/${slug}`);
