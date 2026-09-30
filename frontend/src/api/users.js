import { apiClient } from './client';

export const usersApi = {
  getUsers: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get(endpoint);
    return res.data; // array of users (admin)
  },

  getUser: async (id) => {
    const res = await apiClient.get(`/users/${id}`);
    return res.data;
  },

  updateUser: async (id, userData) => {
    const res = await apiClient.patch(`/users/${id}`, userData);
    return res.data;
  },

  deleteUser: async (id) => {
    return await apiClient.delete(`/users/${id}`);
  },
};
