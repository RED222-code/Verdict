import { apiClient } from './client';

export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post('/users/login', credentials);
    return res; // { status: 'success', token, data: user }
  },
  signup: async (userData) => {
    const res = await apiClient.post('/users/signup', userData);
    return res; // { status: 'success', token, data: user }
  },
};
