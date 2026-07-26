import axiosInstance from '../axiosInstance';

export const login = (email, password) => axiosInstance.post('/auth/login', { email, password });
export const register = (username, email, password) => axiosInstance.post('/auth/register', { username, email, password });
