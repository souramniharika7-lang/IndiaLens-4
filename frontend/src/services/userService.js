import axiosInstance from '../axiosInstance';

export const getMe = () => axiosInstance.get('/users/me');
export const updateMe = (data) => axiosInstance.put('/users/me', data);
export const getFavorites = () => axiosInstance.get('/users/me/favorites');
export const addFavorite = (id) => axiosInstance.post(`/users/me/favorites/${id}`);
export const removeFavorite = (id) => axiosInstance.delete(`/users/me/favorites/${id}`);
export const getWatchlists = () => axiosInstance.get('/users/me/watchlists');
export const createWatchlist = (name) => axiosInstance.post('/users/me/watchlists', { name });
export const addToWatchlist = (name, id) => axiosInstance.post(`/users/me/watchlists/${name}/indicators/${id}`);
export const removeFromWatchlist = (name, id) => axiosInstance.delete(`/users/me/watchlists/${name}/indicators/${id}`);
