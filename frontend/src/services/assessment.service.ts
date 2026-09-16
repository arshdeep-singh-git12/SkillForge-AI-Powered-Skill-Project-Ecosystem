import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAssessments = async () => {
  const response = await api.get('/assessments');
  return response.data;
};

export const getAssessmentById = async (id: string) => {
  const response = await api.get(`/assessments/${id}`);
  return response.data;
};

export const submitCode = async (id: string, language: string, code: string) => {
  const response = await api.post(`/assessments/${id}/submit`, { language, code });
  return response.data;
};
