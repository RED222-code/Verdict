import { apiClient } from './client';

export const reviewsApi = {
  getReviews: async (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/reviews${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get(endpoint);
    return res.data; // array of populated reviews
  },

  getReview: async (id) => {
    const res = await apiClient.get(`/reviews/${id}`);
    return res.data;
  },

  getReviewStats: async () => {
    const res = await apiClient.get('/reviews/stats');
    return res.data; // { summary: { reviewCount, averageRating }, distribution: [ { rating, count } ] }
  },

  createReview: async (reviewData) => {
    const res = await apiClient.post('/reviews', reviewData);
    return res.data;
  },

  updateReview: async (id, reviewData) => {
    const res = await apiClient.patch(`/reviews/${id}`, reviewData);
    return res.data;
  },

  deleteReview: async (id) => {
    return await apiClient.delete(`/reviews/${id}`);
  },
};
