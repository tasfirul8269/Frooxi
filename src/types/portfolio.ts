export interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  isActive: boolean;
  order?: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioItemDto extends Omit<PortfolioItem, '_id' | 'createdAt' | 'updatedAt'> {}
export interface UpdatePortfolioItemDto extends Partial<CreatePortfolioItem> {}
