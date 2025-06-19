import api from './api';
import { 
  Consultation, 
  ConsultationStatus, 
  GetConsultationsParams, 
  PaginatedResponse 
} from '@/types/consultation';

export const getConsultations = async (
  params: GetConsultationsParams = {}
): Promise<PaginatedResponse<Consultation>> => {
  const response = await api.get<PaginatedResponse<Consultation>>('/consultations', { params });
  return response.data;
};

export const updateConsultationStatus = async (
  id: string, 
  status: ConsultationStatus
): Promise<{ success: boolean; data: Consultation }> => {
  const response = await api.put(`/consultations/${id}/status`, { status });
  return response.data;
};

export const addConsultationNote = async (
  id: string,
  text: string
): Promise<{ success: boolean; data: Consultation }> => {
  const response = await api.post(`/consultations/${id}/notes`, { text });
  return response.data;
};
