import { api } from './api';
import { 
  Consultation, 
  ConsultationStatus, 
  GetConsultationsParams, 
  PaginatedResponse 
} from '@/types/consultation';

export type ConsultationStatus = 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';

export interface Consultation {
  _id: string;
  name: string;
  email: string;
  location: string;
  whatsapp: string;
  website?: string;
  projectDetails: string;
  status: ConsultationStatus;
  source: string;
  notes?: Array<{
    text: string;
    createdAt: string;
    createdBy: {
      _id: string;
      name: string;
    };
  }>;
  metadata: {
    ipAddress: string;
    userAgent: string;
    referrer: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetConsultationsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const getConsultations = async (
  params: GetConsultationsParams = {}
): Promise<PaginatedResponse<Consultation>> => {
  const response = await api.get<PaginatedResponse<Consultation>>('/api/consultations', { params });
  return response.data;
};

export const updateConsultationStatus = async (
  id: string, 
  status: ConsultationStatus
): Promise<{ success: boolean; data: Consultation }> => {
  const response = await api.put(`/consultations/${id}/status`, { status, note });
  return response.data;
};

export const addConsultationNote = async (
  id: string,
  text: string
): Promise<{ success: boolean; data: Consultation }> => {
  const response = await api.post(`/consultations/${id}/notes`, { text });
  return response.data;
};
