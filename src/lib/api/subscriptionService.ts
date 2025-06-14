import api from './api';
import type { SubscriptionPlan, CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from '@/types/subscription';

// Get all subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await api.get('/api/subscriptions');
  return response.data;
};

// Get a single subscription plan by ID
export const getSubscriptionPlan = async (id: string): Promise<SubscriptionPlan> => {
  const response = await api.get(`/api/subscriptions/${id}`);
  return response.data;
};

// Create a new subscription plan
export const createSubscriptionPlan = async (data: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> => {
  const response = await api.post('/api/subscriptions', data);
  return response.data;
};

// Update a subscription plan
export const updateSubscriptionPlan = async (id: string, data: UpdateSubscriptionPlanDto): Promise<SubscriptionPlan> => {
  const response = await api.put(`/api/subscriptions/${id}`, data);
  return response.data;
};

// Delete a subscription plan
export const deleteSubscriptionPlan = async (id: string): Promise<void> => {
  await api.delete(`/api/subscriptions/${id}`);
};

// Toggle subscription plan status
export const toggleSubscriptionPlanStatus = async (id: string, isActive: boolean): Promise<SubscriptionPlan> => {
  const response = await api.patch(`/api/subscriptions/${id}/status`, { isActive });
  return response.data;
};

// Toggle subscription plan popularity
export const toggleSubscriptionPlanPopularity = async (id: string, isPopular: boolean): Promise<SubscriptionPlan> => {
  const response = await api.patch(`/api/subscriptions/${id}/popular`, { isPopular });
  return response.data;
};

// Reorder subscription plans
export const reorderSubscriptionPlans = async (ids: string[]): Promise<void> => {
  await api.patch('/api/subscriptions/reorder', { ids });
};
