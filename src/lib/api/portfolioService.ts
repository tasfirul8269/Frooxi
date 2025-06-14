import api from './api';
import type { PortfolioItem, CreatePortfolioItemDto, UpdatePortfolioItemDto } from '@/types/portfolio';

// Get all portfolio items
export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await api.get('/api/portfolio');
  return response.data;
};

// Get a single portfolio item by ID
export const getPortfolioItem = async (id: string): Promise<PortfolioItem> => {
  const response = await api.get(`/api/portfolio/${id}`);
  return response.data;
};

// Create a new portfolio item
export const createPortfolioItem = async (data: CreatePortfolioItemDto): Promise<PortfolioItem> => {
  const response = await api.post('/api/portfolio', data);
  return response.data;
};

// Update a portfolio item
export const updatePortfolioItem = async (id: string, data: UpdatePortfolioItemDto): Promise<PortfolioItem> => {
  const response = await api.put(`/api/portfolio/${id}`, data);
  return response.data;
};

// Delete a portfolio item
export const deletePortfolioItem = async (id: string): Promise<void> => {
  await api.delete(`/api/portfolio/${id}`);
};

// Toggle portfolio item status
export const togglePortfolioItemStatus = async (id: string, isActive: boolean): Promise<PortfolioItem> => {
  const response = await api.patch(`/api/portfolio/${id}/status`, { isActive });
  return response.data;
};

// Toggle portfolio item featured status
export const togglePortfolioItemFeatured = async (id: string, featured: boolean): Promise<PortfolioItem> => {
  const response = await api.patch(`/api/portfolio/${id}/featured`, { featured });
  return response.data;
};

// Reorder portfolio items
export const reorderPortfolioItems = async (ids: string[]): Promise<void> => {
  await api.patch('/api/portfolio/reorder', { ids });
};
