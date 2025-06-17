import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { subscriptionAPI } from '@/services/api';

interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Color mapping for different subscription tiers
const getColorForPlan = (name: string): string => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('bronze') || nameLower.includes('basic')) {
    return 'from-yellow-400 to-yellow-600';
  } else if (nameLower.includes('silver') || nameLower.includes('standard')) {
    return 'from-blue-400 to-blue-600';
  } else if (nameLower.includes('gold') || nameLower.includes('premium')) {
    return 'from-purple-500 to-pink-500';
  } else if (nameLower.includes('platinum') || nameLower.includes('enterprise')) {
    return 'from-teal-400 to-emerald-600';
  }
  return 'from-gray-400 to-gray-600';
};

const SubscriptionSection: React.FC = () => {
  const [tab, setTab] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const data = await subscriptionAPI.getAll();
        // Filter only active plans
        const activePlans = data.filter((plan: SubscriptionPlan) => plan.isActive);
        setPlans(activePlans);
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  if (loading) {
    return (
      <section id="subscription" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <p>Loading subscription plans...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="subscription" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 max-w-5xl text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (plans.length === 0) {
    return (
      <section id="subscription" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <p>No subscription plans available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="subscription" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Flexible Subscription Packages</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Choose a plan that fits your needs. Switch between weekly and yearly pricing.</p>
          <div className="inline-flex mt-6 bg-slate-200 dark:bg-slate-800 rounded-full p-1">
            <button
              onClick={() => setTab('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${tab === 'monthly' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' : 'text-gray-700 dark:text-gray-200'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTab('yearly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${tab === 'yearly' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' : 'text-gray-700 dark:text-gray-200'}`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const color = getColorForPlan(plan.name);
            const monthlyPrice = plan.price;
            const yearlyPrice = Math.round(plan.price * 12 * 0.8); // 20% discount for yearly
            
            return (
              <div
                key={plan._id}
                className={`relative rounded-3xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col items-center p-8 pt-12 transition-transform duration-300 hover:-translate-y-2 group ${plan.isPopular ? 'scale-105 z-10 ring-4 ring-blue-400/20' : ''}`}
                style={{ animation: `fadeInUp 0.7s ease ${(i * 0.12).toFixed(2)}s both` }}
              >
                <div className={`absolute top-0 left-0 w-full h-[auto] ${plan.isPopular ? 'bg-gradient-to-r from-green-500 to-blue-600 ' : color}`}>
                  {plan.isPopular && (
                    <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold py-1">
                      Most Popular
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4 min-h-[3em]">
                  {plan.description}
                </p>
                <div className="flex items-end mb-4">
                  <span className="text-4xl md:text-5xl font-extrabold text-primary-600 dark:text-primary-400">
                    ${tab === 'monthly' ? monthlyPrice : yearlyPrice}
                  </span>
                  <span className="ml-2 text-lg text-gray-500 dark:text-gray-300 font-medium">
                    / {tab === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {tab === 'yearly' && (
                  <div className="mb-4 text-sm text-green-500 font-medium">
                    Save {Math.round((1 - (yearlyPrice / (monthlyPrice * 12))) * 100)}% annually
                  </div>
                )}
                <ul className="mb-8 text-left w-full">
                  {plan.features.map((feature, idx) => (
                    <li key={`${plan._id}-${idx}`} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                      <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`mt-auto px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow bg-gradient-to-r ${color} text-white hover:scale-105 w-full max-w-[200px]`}
                >
                  Choose {plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
