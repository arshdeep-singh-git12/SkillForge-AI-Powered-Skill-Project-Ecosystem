import api from './api';

export const getRepoStats = async (repoUrl: string) => {
  const response = await api.get(`/github/stats?repoUrl=${encodeURIComponent(repoUrl)}`);
  return response.data;
};
