export interface Testimonial {
  _id: string;
  author: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  isActive: boolean;
  order?: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialDto extends Omit<Testimonial, '_id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateTestimonialDto extends Partial<CreateTestimonialDto> {}
