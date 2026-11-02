import api from './api';

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
