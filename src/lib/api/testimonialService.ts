import api from './api';
import type { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '@/types/testimonial';

// Get all testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get('/testimonials');
  return response.data;
};

// Get a single testimonial by ID
export const getTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await api.get(`/testimonials/${id}`);
  return response.data;
};

// Create a new testimonial
export const createTestimonial = async (data: CreateTestimonialDto): Promise<Testimonial> => {
  const response = await api.post('/testimonials', data);
  return response.data;
};

// Update a testimonial
export const updateTestimonial = async (id: string, data: UpdateTestimonialDto): Promise<Testimonial> => {
  const response = await api.put(`/testimonials/${id}`, data);
  return response.data;
};

// Delete a testimonial
export const deleteTestimonial = async (id: string): Promise<void> => {
  await api.delete(`/testimonials/${id}`);
};

// Toggle testimonial status
export const toggleTestimonialStatus = async (id: string, isActive: boolean): Promise<Testimonial> => {
  const response = await api.patch(`/testimonials/${id}/status`, { isActive });
  return response.data;
};

// Toggle testimonial featured status
export const toggleTestimonialFeatured = async (id: string, featured: boolean): Promise<Testimonial> => {
  const response = await api.patch(`/testimonials/${id}/featured`, { featured });
  return response.data;
};

// Reorder testimonials
export const reorderTestimonials = async (ids: string[]): Promise<void> => {
  await api.patch('/testimonials/reorder', { ids });
};
