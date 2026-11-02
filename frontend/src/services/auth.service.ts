import api from './api';

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  if (typeof window !== 'undefined' && response.data?.token) {
    localStorage.setItem('skillforge_token', response.data.token);
  }
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string, avatar?: string) => {
  const response = await api.post('/auth/register', { name, email, password, avatar });
  if (typeof window !== 'undefined' && response.data?.token) {
    localStorage.setItem('skillforge_token', response.data.token);
  }
  return response.data;
};

export const logoutUser = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('skillforge_token');
  }
  try {
    await api.post('/auth/logout');
  } catch (err) {
    // Ignore network error on logout
  }
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
