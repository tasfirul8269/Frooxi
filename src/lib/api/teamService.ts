import api from './api';
import type { TeamMember } from '@/types/team';

// Get all team members
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await api.get('/api/team');
  return response.data;
};

// Get a single team member by ID
export const getTeamMember = async (id: string): Promise<TeamMember> => {
  const response = await api.get(`/api/team/${id}`);
  return response.data;
};

// Create a new team member
export const createTeamMember = async (data: Omit<TeamMember, '_id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> => {
  const response = await api.post('/api/team', data);
  return response.data;
};

// Update a team member
export const updateTeamMember = async (id: string, data: Partial<TeamMember>): Promise<TeamMember> => {
  const response = await api.put(`/api/team/${id}`, data);
  return response.data;
};

// Delete a team member
export const deleteTeamMember = async (id: string): Promise<void> => {
  await api.delete(`/api/team/${id}`);
};

// Update team member status
export const updateTeamMemberStatus = async (id: string, isActive: boolean): Promise<TeamMember> => {
  const response = await api.patch(`/api/team/${id}/status`, { isActive });
  return response.data;
};

// Reorder team members
export const reorderTeamMembers = async (ids: string[]): Promise<void> => {
  await api.patch('/api/team/reorder', { ids });
};
