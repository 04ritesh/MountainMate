import api from './authApi';

export const getAllTrips = () => api.get('/trips');
export const getTripById = (id) => api.get(`/trips/${id}`);
export const getMyTrips = () => api.get('/trips/my');
export const getTripsByTrail = (trailId) => api.get(`/trips/trail/${trailId}`);
export const createTrip = (data) => api.post('/trips', data);
export const joinTrip = (tripId) => api.post(`/trips/${tripId}/members`);
export const updateRsvp = (tripId, status) => api.patch(`/trips/${tripId}/rsvp?status=${status}`);
export const updateTripStatus = (tripId, status) => api.patch(`/trips/${tripId}/status?status=${status}`);
export const removeMember = (tripId, userId) => api.delete(`/trips/${tripId}/members/${userId}`);