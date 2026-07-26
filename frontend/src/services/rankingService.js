import axiosInstance from '../axiosInstance';

export const getAll = (params = {}) => axiosInstance.get('/rankings', { params });
export const getHistorical = (indicatorId, countryId) =>
  axiosInstance.get(`/rankings/historical/${indicatorId}/${countryId}`);
