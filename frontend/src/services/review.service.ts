import api from './api';

export const getReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

export const createReview = async (reviewData: any) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};
