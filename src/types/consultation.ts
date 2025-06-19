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
  location: string;
  whatsapp: string;
  website?: string;
  projectType: string;
  projectDetails: string;
  message: string;
  budget?: string;
  preferredContact: string;
  status: ConsultationStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  notes?: Array<{
    content: string;
    addedAt: string;
    addedBy: string;
    _id: string;
  }>;
  metadata: {
    ipAddress: string;
    userAgent: string;
    referrer: string;
  };
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
