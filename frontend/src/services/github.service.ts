import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRepoStats = async (repoUrl: string) => {
  const response = await api.get(`/github/stats?repoUrl=${encodeURIComponent(repoUrl)}`);
  return response.data;
};
