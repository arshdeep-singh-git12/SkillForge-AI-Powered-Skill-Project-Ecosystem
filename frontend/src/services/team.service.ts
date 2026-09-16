import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

export const createTeam = async (teamData: any) => {
  const response = await api.post('/teams', teamData);
  return response.data;
};

export const joinTeam = async (teamId: string) => {
  const response = await api.post(`/teams/${teamId}/join`);
  return response.data;
};
