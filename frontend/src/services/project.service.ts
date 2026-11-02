import api from './api';

export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const createProject = async (projectData: any) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const getUserProjects = async (userId: string) => {
  const response = await api.get(`/projects/user/${userId}`);
  return response.data;
};

export const likeProject = async (projectId: string) => {
  const response = await api.post(`/projects/${projectId}/like`);
  return response.data;
};
