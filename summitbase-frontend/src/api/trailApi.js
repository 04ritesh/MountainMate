import api from './authApi';

export const getAllTrails = () => api.get('/trails');
export const getTrailById = (id) => api.get(`/trails/${id}`);
export const createTrail = (data) => api.post('/trails', data);
export const updateTrail = (id, data) => api.put(`/trails/${id}`, data);
export const deleteTrail = (id) => api.delete(`/trails/${id}`);
export const uploadTrailPhoto = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/trails/${id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const getTrailsByDifficulty = (difficulty) => api.get(`/trails/difficulty/${difficulty}`);
export const getTrailsByType = (type) => api.get(`/trails/type/${type}`);
export const searchTrails = (location) => api.get(`/trails/search?location=${location}`);
export const getNearbyTrails = (lat, lng, radius = 50) =>
  api.get(`/trails/nearby?lat=${lat}&lng=${lng}&radiusKm=${radius}`);