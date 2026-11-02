import api from './api';

export const updateProfile = async (profileData: { name?: string; bio?: string; avatar?: string; githubUrl?: string; linkedinUrl?: string; leetcodeUrl?: string; hackerrankUrl?: string }) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const getUserProfile = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const getProfileCompletion = async () => {
  const response = await api.get('/users/profile/completion');
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

export const getSkillAnalysis = async (userId: string, refresh = false) => {
  const response = await api.get(`/skills/analysis/${userId}${refresh ? '?refresh=true' : ''}`);
  return response.data;
};
