import { apiClient } from './client';

export const productsApi = {
  getProducts: async (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get(endpoint);
    return res.data; // array of products
  },

  getProduct: async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  getProductStats: async () => {
    const res = await apiClient.get('/products/stats');
    return res.data;
  },

  getCategoryStats: async () => {
    const res = await apiClient.get('/products/category-stats');
    return res.data;
  },

  getTopRated: async (limit = 6) => {
    const res = await apiClient.get(`/products/top-rated?limit=${limit}`);
    return res.data;
  },

  getCheap: async (limit = 6) => {
    const res = await apiClient.get(`/products/cheap?limit=${limit}`);
    return res.data;
  },

  getAvailable: async (limit = 8) => {
    const res = await apiClient.get(`/products/available?limit=${limit}`);
    return res.data;
  },

  createProduct: async (productData) => {
    const res = await apiClient.post('/products', productData);
    return res.data;
  },

  updateProduct: async (id, productData) => {
    const res = await apiClient.patch(`/products/${id}`, productData);
    return res.data;
  },

  deleteProduct: async (id) => {
    return await apiClient.delete(`/products/${id}`);
  },
};
