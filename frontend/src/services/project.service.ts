import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const createProject = async (projectData: any) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};
