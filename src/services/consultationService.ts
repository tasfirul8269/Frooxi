import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all consultations (admin only)
export const getConsultations = async (token: string, params: any = {}) => {
  const response = await axios.get(`${API_URL}/consultations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

// Create a new consultation
export const createConsultation = async (consultationData: any) => {
  const response = await axios.post(`${API_URL}/consultations`, consultationData);
  return response.data;
};

// Update consultation status (admin only)
export const updateConsultationStatus = async (id: string, status: string, token: string) => {
  const response = await axios.put(
    `${API_URL}/consultations/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Add a note to consultation (admin only)
export const addConsultationNote = async (id: string, content: string, token: string) => {
  const response = await axios.post(
    `${API_URL}/consultations/${id}/notes`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
