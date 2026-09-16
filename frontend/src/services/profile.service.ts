import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateProfile = async (profileData: { name?: string; bio?: string; avatar?: string }) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const getUserProfile = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// --- Skill Endpoints ---

export const getUserSkills = async (userId: string) => {
  const response = await api.get(`/skills/user/${userId}`);
  return response.data;
};

export const addSkill = async (skillData: { name: string; proficiency: number; category?: string }) => {
  const response = await api.post('/skills', skillData);
  return response.data;
};
