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
interface PortfolioFormData extends Omit<PortfolioItem, '_id' | 'createdAt' | 'updatedAt' | 'technologies' | 'tags'> {
  _file?: File;
  technologies: string | string[];
  tags?: string | string[];
}

export const createPortfolioItem = async (data: PortfolioFormData): Promise<PortfolioItem> => {
  try {
    console.log('Starting createPortfolioItem with data:', data);
    
    if (!data._file && !data.image) {
      throw new Error('Image file is required');
    }

    // Create FormData for file upload
    const formData = new FormData();
  
    // Extract file if exists
    const file = data._file;
    
    // Prepare the data object with proper type handling
    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      year: data.year,
      link: data.link || undefined,
      featured: data.featured || false,
      isActive: data.isActive !== false, // Default to true if not provided
    };

    // Handle technologies and tags as arrays
    const technologies = Array.isArray(data.technologies) 
      ? data.technologies 
      : typeof data.technologies === 'string' 
        ? data.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === 'string'
        ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
    
    // Append all fields to form data
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Append arrays
    technologies.forEach(tech => {
      if (tech) formData.append('technologies', tech);
    });

    tags.forEach(tag => {
      if (tag) formData.append('tags', tag);
    });
    
    // Handle file upload
    if (file) {
      formData.append('image', file);
    } else if (data.image) {
      // If no new file but image URL exists, use that
      formData.append('image', data.image);
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
