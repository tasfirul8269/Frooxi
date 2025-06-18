export type ConsultationStatus = 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';

export interface Note {
  _id: string;
  text: string;
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

export interface Consultation {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: ConsultationStatus;
  projectType?: string;
  budget?: string;
  location?: string;
  preferredContact?: string;
  notes?: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface GetConsultationsParams {
  page?: number;
  limit?: number;
  status?: ConsultationStatus;
  search?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
