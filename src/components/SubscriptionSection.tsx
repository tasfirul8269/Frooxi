import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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
  // All hooks must be called at the top level, before any conditional returns
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
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

  // Transform the API data to match our UI needs
  const transformedPlans = plans.map(plan => ({
    _id: plan._id,
    name: plan.name,
    price: plan.price,
    description: plan.description || '',
    isPopular: plan.isPopular || false,
    features: plan.features || []
  }));

  // Loading state
  if (loading) {
    return (
      <section id="subscription" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <p>Loading subscription plans...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="subscription" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6 max-w-5xl text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  // No plans available state
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
    <section id="pricing" className="py-16 relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50 dark:from-gray-950 dark:via-indigo-950/50 dark:to-purple-950/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-indigo-100/30 to-purple-100/20 dark:from-indigo-900/10 dark:to-purple-900/5 rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-gradient-to-tr from-blue-100/30 to-cyan-100/20 dark:from-blue-900/10 dark:to-cyan-900/5 rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
      </div>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="relative z-10 text-center mb-20 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-6 border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            Simple, Transparent Pricing
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Choose Your Perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Plan</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Start with a 14-day free trial. No credit card required. Cancel anytime. 
            <span className="hidden md:inline-block">✨ No hidden fees, ever.</span>
          </motion.p>
          
          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm border border-gray-100 dark:border-gray-800 mt-10 mb-6"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                billingCycle === 'monthly' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yearly Billing
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
          <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Need a custom solution?{' '}
            <a href="#contact" className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline font-medium">
              Contact our sales team
            </a>
          </p>
        </div>
        </div>
        
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {transformedPlans.map((plan, index) => {
            const isPopular = plan.isPopular;
            const price = billingCycle === 'monthly' ? plan.price : Math.round(plan.price * 12 * 0.8);
            const monthlyPrice = plan.price;
            const yearlyPrice = Math.round(plan.price * 12 * 0.8);
            
            return (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`relative flex flex-col h-full ${isPopular ? 'md:-mt-2' : 'md:mt-6'}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="px-5 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center">
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/90"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className={`relative flex-1 rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-500 transform hover:scale-[1.02] group ${
                  isPopular 
                    ? 'shadow-2xl shadow-indigo-500/20 border border-white/20 bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-900/70 dark:to-gray-900/30 backdrop-blur-xl before:absolute before:inset-0 before:bg-[rad-gradient(100%_100%_at_0%_0%,rgba(255,255,255,0.4),rgba(255,255,255,0))] before:rounded-3xl before:z-0'
                    : 'shadow-lg hover:shadow-xl border border-white/10 hover:border-white/20 bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/50 dark:to-gray-900/20 backdrop-blur-lg hover:backdrop-blur-xl before:absolute before:inset-0 before:bg-[rad-gradient(100%_100%_at_0%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0))] before:rounded-3xl before:z-0 before:opacity-0 group-hover:opacity-100 before:transition-opacity before:duration-300'
                }`}>
                  {/* Glass reflections */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute -top-1/2 -right-1/2 w-full h-64 bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-45"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                    {isPopular && (
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col h-full relative z-10">
                    <div className="relative z-10 mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                          {plan.name}
                        </h3>
                       
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                    </div>
                    
                    <div className="mb-8 p-6 bg-gradient-to-r from-white/20 to-white/5 dark:from-gray-800/30 dark:to-gray-800/10 rounded-xl border border-white/10 backdrop-blur-sm">
                      <div className="flex items-baseline">
                        <span className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                          ${price}
                        </span>
                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="mt-2 px-3 py-1.5 inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Save ${(monthlyPrice * 12) - yearlyPrice} annually
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, idx) => (
                        <li key={`${plan._id}-${idx}`} className="flex items-start group">
                          <div className="flex-shrink-0 mt-1">
                            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-indigo-100 to-white text-indigo-600 dark:from-indigo-900/50 dark:to-indigo-800/50 dark:text-indigo-300 shadow-sm group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-900/50 transition-shadow">
                              <Check className="h-3 w-3" />
                            </div>
                          </div>
                          <span className="ml-3 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group ${
                        isPopular 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30'
                          : 'bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-900 dark:to-gray-800 hover:from-gray-900 hover:to-gray-800 dark:hover:from-gray-800 dark:hover:to-gray-700'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Get Started with {plan.name}
                        <svg className="w-4 h-4 ml-2 -mr-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        
        
      </div>
      
    </section>
    
  );
};

export default SubscriptionSection;
