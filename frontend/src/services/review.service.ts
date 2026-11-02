import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

export const createReview = async (reviewData: any) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};
