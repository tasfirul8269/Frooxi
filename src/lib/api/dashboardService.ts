import api from './api';

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalPortfolioItems: number;
  totalTestimonials: number;
  recentActivities: Array<{
    _id: string;
    action: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    createdAt: string;
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

export const getRecentActivities = async (limit = 5) => {
  const { data } = await api.get(`/dashboard/activities?limit=${limit}`);
  return data;
};
