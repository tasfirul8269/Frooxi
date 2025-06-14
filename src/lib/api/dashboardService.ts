import api from './api';

export interface DashboardStats {
  success: boolean;
  stats: {
    users: number;
    portfolioItems: number;
    activeSubscriptions: number;
    testimonials: number;
    teamMembers: number;
  };
  recentActivities: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/dashboard/stats');
    return {
      success: true,
      stats: {
        users: response.data.stats.users || 0,
        portfolioItems: response.data.stats.portfolioItems || 0,
        activeSubscriptions: response.data.stats.activeSubscriptions || 0,
        testimonials: response.data.stats.testimonials || 0,
        teamMembers: response.data.stats.teamMembers || 0
      },
      recentActivities: response.data.recentActivities || []
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Note: The recent activities are now included in the dashboard stats response
export const getRecentActivities = async (limit = 5) => {
  try {
    const response = await getDashboardStats();
    return response.recentActivities.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};
