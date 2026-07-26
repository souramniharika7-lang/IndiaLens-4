import axiosInstance from '../axiosInstance';

export const getAll = () => axiosInstance.get('/countries');
export const getByCode = (code) => axiosInstance.get(`/countries/${code}`);
