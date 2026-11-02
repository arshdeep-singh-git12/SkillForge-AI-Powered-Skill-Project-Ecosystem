import api from './api';

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

export const likeCertification = async (certId: string) => {
  const response = await api.post(`/certifications/${certId}/like`);
  return response.data;
};
