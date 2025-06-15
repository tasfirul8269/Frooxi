export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // Duration in months
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanDto extends Omit<SubscriptionPlan, '_id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateSubscriptionPlanDto extends Partial<CreateSubscriptionPlanDto> {}
