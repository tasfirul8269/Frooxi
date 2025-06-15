import api from './api';
import type { TeamMember } from '@/types/team';

// Get all team members
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await api.get('/team');
  return response.data;
};

// Get a single team member by ID
export const getTeamMember = async (id: string): Promise<TeamMember> => {
  const response = await api.get(`/team/${id}`);
  return response.data;
};

// Create a new team member
export const createTeamMember = async (formData: FormData): Promise<TeamMember> => {
  const response = await api.post('/team', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update a team member
export const updateTeamMember = async (id: string, formData: FormData | Record<string, any>): Promise<TeamMember> => {
  // Convert regular object to FormData if needed
  if (!(formData instanceof FormData)) {
    const data = formData;
    const newFormData = new FormData();
    
    // Append all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'socialLinks' && typeof value === 'object') {
          newFormData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          newFormData.append('image', value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          newFormData.append(key, String(value));
        }
      }
    });
    
    formData = newFormData;
  }
  
  const response = await api.put(`/team/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete a team member
export const deleteTeamMember = async (id: string): Promise<void> => {
  await api.delete(`/team/${id}`);
};

// Update team member status
export const updateTeamMemberStatus = async (id: string, isActive: boolean): Promise<TeamMember> => {
  const response = await api.patch(`/team/${id}/status`, { isActive });
  return response.data;
};

// Reorder team members
export const reorderTeamMembers = async (ids: string[]): Promise<void> => {
  await api.patch('/team/reorder', { ids });
};
