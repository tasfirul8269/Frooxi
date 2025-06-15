import api from './api';
import type { PortfolioItem, CreatePortfolioItemDto, UpdatePortfolioItemDto } from '@/types/portfolio';

// Get all portfolio items
export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await api.get('/portfolio');
  return response.data;
};

// Get a single portfolio item by ID
export const getPortfolioItem = async (id: string): Promise<PortfolioItem> => {
  const response = await api.get(`/portfolio/${id}`);
  return response.data;
};

// Create a new portfolio item
export const createPortfolioItem = async (data: CreatePortfolioItemDto & { _file?: File }): Promise<PortfolioItem> => {
  try {
    console.log('Starting createPortfolioItem with data:', data);
    
    if (!data._file) {
      throw new Error('Image file is required');
    }

    // Map frontend category values to backend values
    const categoryMap: Record<string, string> = {
      'Web Development': 'web',
      'Mobile Development': 'mobile',
      'UI/UX Design': 'design',
      'Branding': 'design',
      'Graphic Design': 'design',
      'Other': 'other'
    };

    // Get the backend category value, default to 'other' if not found
    const backendCategory = categoryMap[data.category as string] || 'other';

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', data._file);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', backendCategory);
    
    // Handle technologies array
    const technologies = Array.isArray(data.technologies) 
      ? data.technologies 
      : typeof data.technologies === 'string' 
        ? data.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : [];
    
    formData.append('technologies', JSON.stringify(technologies));
    
    // Add optional fields if they exist
    if (data.year) {
      formData.append('year', String(data.year));
    }
    if (data.isFeatured !== undefined) {
      formData.append('isFeatured', String(data.isFeatured));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }
    
    console.log('Sending form data to server');
    
    const response = await api.post('/portfolio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error in createPortfolioItem:', error);
    
    let errorMessage = 'Failed to create portfolio item';
    
    if (error.response) {
      // Server responded with an error status
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      // Use server error message if available
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data?.msg) {
        errorMessage = error.response.data.msg;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
      errorMessage = error.message || 'An unknown error occurred';
    }
    
    throw new Error(errorMessage);
  }
};

// Update a portfolio item
export const updatePortfolioItem = async (id: string, data: UpdatePortfolioItemDto): Promise<PortfolioItem> => {
  const response = await api.put(`/portfolio/${id}`, data);
  return response.data;
};

// Delete a portfolio item
export const deletePortfolioItem = async (id: string): Promise<void> => {
  await api.delete(`/portfolio/${id}`);
};

// Toggle portfolio item status
export const togglePortfolioItemStatus = async (id: string, isActive: boolean): Promise<PortfolioItem> => {
  const response = await api.patch(`/portfolio/${id}/status`, { isActive });
  return response.data;
};

// Toggle portfolio item featured status
export const togglePortfolioItemFeatured = async (id: string, featured: boolean): Promise<PortfolioItem> => {
  const response = await api.patch(`/portfolio/${id}/featured`, { featured });
  return response.data;
};

// Reorder portfolio items
export const reorderPortfolioItems = async (ids: string[]): Promise<void> => {
  await api.patch('/portfolio/reorder', { ids });
};
