import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCertifications = async () => {
  const response = await api.get('/certifications');
  return response.data;
};

export const addExternalCertification = async (certData: any) => {
  const response = await api.post('/certifications', certData);
  return response.data;
};

export const uploadLinkedinPdf = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/linkedin/sync-pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
