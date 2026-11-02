import api from './api';

export const getTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

export const createTeam = async (teamData: any) => {
  const response = await api.post('/teams', teamData);
  return response.data;
};

export const joinTeam = async (teamId: string, formData?: any) => {
  const response = await api.post(`/teams/${teamId}/join`, formData);
  return response.data;
};

export const closeTeam = async (teamId: string) => {
  const response = await api.post(`/teams/${teamId}/close`);
  return response.data;
};
