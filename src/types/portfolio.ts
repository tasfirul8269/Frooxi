export type PortfolioCategory = 'Web Development' | 'Mobile Development' | 'UI/UX Design' | 'Graphic Design' | 'Branding' | 'Other';

export interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: PortfolioCategory;
  technologies: string[];
  year: string;
  link?: string;
  tags?: string[];
  featured: boolean;
  isActive: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioItemDto extends Omit<PortfolioItem, '_id' | 'createdAt' | 'updatedAt' | 'technologies'> {
  technologies: string | string[]; // Allow both string (comma-separated) and string[]
}

export interface UpdatePortfolioItemDto extends Partial<Omit<PortfolioItem, '_id' | 'createdAt' | 'updatedAt' | 'technologies'>> {
  technologies?: string | string[]; // Allow both string (comma-separated) and string[]
}
