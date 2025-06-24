import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticlesBackground from './ParticlesBackground';
import { Check, Zap, Star, BadgeCheck, Shield, Clock, Gift, Heart, X, Loader2, RefreshCw, Info, Sun, Moon, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { subscriptionAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  discount?: number; // Optional discount percentage
}

// Color and gradient mapping for different subscription tiers
const getPlanStyles = (name: string, isPopular: boolean = false) => {
  const nameLower = name.toLowerCase();
  const baseStyles = 'relative overflow-hidden transition-all duration-300 hover:shadow-2xl';
  const popularStyles = 'border-2 border-primary transform -translate-y-2';
  
  if (nameLower.includes('bronze') || nameLower.includes('basic')) {
    return {
      gradient: 'from-amber-400 to-orange-500',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950',
      button: 'bg-orange-500 hover:bg-orange-600 text-white',
      border: 'border-orange-200 dark:border-orange-900',
      popularBadge: 'bg-amber-500 text-amber-900',
      className: `${baseStyles} ${isPopular ? popularStyles : ''} border-orange-200 dark:border-orange-900`
    };
  } else if (nameLower.includes('silver') || nameLower.includes('standard')) {
    return {
      gradient: 'from-slate-400 to-blue-500',
      bg: 'bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
      border: 'border-blue-200 dark:border-blue-900',
      popularBadge: 'bg-blue-500 text-blue-900',
      className: `${baseStyles} ${isPopular ? popularStyles : ''} border-blue-200 dark:border-blue-900`
    };
  } else if (nameLower.includes('gold') || nameLower.includes('premium')) {
    return {
      gradient: 'from-yellow-400 to-amber-500',
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950',
      button: 'bg-amber-500 hover:bg-amber-600 text-white',
      border: 'border-amber-200 dark:border-amber-900',
      popularBadge: 'bg-yellow-500 text-yellow-900',
      className: `${baseStyles} ${isPopular ? popularStyles : ''} border-amber-200 dark:border-amber-900`
    };
  } else if (nameLower.includes('platinum') || nameLower.includes('enterprise')) {
    return {
      gradient: 'from-indigo-400 to-purple-500',
      bg: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      border: 'border-purple-200 dark:border-purple-900',
      popularBadge: 'bg-purple-500 text-purple-900',
      className: `${baseStyles} ${isPopular ? popularStyles : ''} border-purple-200 dark:border-purple-900`
    };
  }
  
  // Default styles
  return {
    gradient: 'from-gray-400 to-gray-600',
    bg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
    button: 'bg-gray-600 hover:bg-gray-700 text-white',
    border: 'border-gray-200 dark:border-gray-700',
    popularBadge: 'bg-gray-500 text-gray-900',
    className: `${baseStyles} ${isPopular ? popularStyles : ''} border-gray-200 dark:border-gray-700`
  };
}

// Feature icons mapping
const featureIcons: Record<string, React.ReactNode> = {
  '24/7 support': <Clock className="w-5 h-5 text-blue-500" />,
  'priority support': <Zap className="w-5 h-5 text-amber-500" />,
  'exclusive content': <Star className="w-5 h-5 text-purple-500" />,
  'verified badge': <BadgeCheck className="w-5 h-5 text-emerald-500" />,
  'ad-free': <Shield className="w-5 h-5 text-rose-500" />,
  'early access': <Gift className="w-5 h-5 text-pink-500" />,
  'donation': <Heart className="w-5 h-5 text-red-500" />
};

// Get appropriate icon for feature
const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  for (const [key, icon] of Object.entries(featureIcons)) {
    if (lowerFeature.includes(key)) {
      return icon;
    }
  }
  return <Check className="w-5 h-5 text-green-500" />; // Default icon
};

const SubscriptionSection: React.FC = () => {
  // State management
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [darkMode, setDarkMode] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<{[key: string]: boolean}>({});
  
  // Toggle feature expansion for a plan
  const toggleExpandPlan = (planId: string) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  // Fetch subscription plans from the backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await subscriptionAPI.getAll();
        // Handle both array response and { data: [] } response format
        const plansData = Array.isArray(response) ? response : (response.data || []);
        
        if (!Array.isArray(plansData)) {
          throw new Error('Invalid response format: expected an array of plans');
        }
        
        // Ensure all required fields are present
        const validatedPlans = plansData.map(plan => ({
          _id: plan._id || '',
          name: plan.name || 'Unnamed Plan',
          description: plan.description || '',
          price: Number(plan.price) || 0,
          duration: Number(plan.duration) || 1,
          features: Array.isArray(plan.features) ? plan.features : [],
          isPopular: Boolean(plan.isPopular),
          isActive: plan.isActive !== false, // default to true
          createdAt: plan.createdAt || new Date().toISOString(),
          updatedAt: plan.updatedAt || new Date().toISOString(),
          discount: Number(plan.discount) || undefined
        }));
        
        setPlans(validatedPlans);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') console.error('Failed to fetch subscription plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  
  // Hooks
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Toggle dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Handle plan selection
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    const phoneNumber = '8801310846012';
    const message = `Hello! I'm interested in the ${plan.name} package. Please provide more information.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  // Handle checkout submission
  const handleCheckout = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    setCheckoutError(null);
    
    try {
      // In a real app, this would integrate with Stripe or another payment processor
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCheckoutSuccess(true);
      
      // Reset after success
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setCheckoutSuccess(false);
      }, 2000);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('Checkout failed:', err);
      setCheckoutError('Failed to process your subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Close checkout modal
  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedPlan(null);
    setCheckoutError(null);
    setCheckoutSuccess(false);
  };
  
  // Transform plans for display
  const transformedPlans = plans.map(plan => ({
    ...plan,
    description: plan.description || '',
    isPopular: plan.isPopular || false,
    features: plan.features || []
  }));
  
  // Calculate prices based on billing cycle with 6% discount for annual billing
  const getPlanPrice = (price: number, cycle: 'monthly' | 'yearly') => {
    if (cycle === 'monthly') return price;
    const annualPrice = price * 12;
    const discount = annualPrice * 0.06; // 6% of annual price
    return Math.round(annualPrice - discount);
  };
  
  // Get price display text
  const getPriceText = (price: number, cycle: 'monthly' | 'yearly') => {
    if (cycle === 'monthly') {
      return `$${price} per month`;
    } else {
      const annualPrice = price * 12;
      const discount = annualPrice * 0.06; // 6% of annual price
      const discountedPrice = annualPrice - discount;
      return `$${Math.round(discountedPrice)} per year (save $${Math.round(discount)})`;
    }
  };

  // Loading state with skeleton loader
  if (loading) {
    return (
      <section id="subscription" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {/* Premium Background with Animated Elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"></div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0h.122L30 24.75 5.251 0h.124L0 5.25v.125L24.75 30 0 54.75v.125L5.25 60h.125L30 35.25 54.75 60h.125L60 54.75v-.125L35.25 30 60 5.25v-.125L54.627 0z\' fill=\'%239C92AC\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Animated Blobs */}
          <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob dark:from-indigo-600/10 dark:to-purple-600/10"></div>
          <div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 dark:from-blue-600/10 dark:to-cyan-600/10"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 dark:from-pink-600/10 dark:to-rose-600/10"></div>
          
          {/* Noise Overlay */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\' /%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-16 px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center mb-4 px-4 py-1.5 text-sm font-medium rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              Simple, Transparent Pricing
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400"
            >
              Choose Your Perfect Plan
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto text-lg text-gray-600 dark:text-gray-300/90 max-w-2xl mt-6 leading-relaxed"
            >
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              ) : (
                <>
                  Start with a 14-day free trial. No credit card required. Cancel anytime.
                  <span className="block mt-3 text-indigo-600 dark:text-indigo-400 font-medium">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-sm">
                      <Star className="w-4 h-4 mr-1.5" />
                      No hidden fees, ever. 100% satisfaction guaranteed.
                    </span>
                  </span>
                </>
              )}
            </motion.div>
            
            {/* Billing Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-10"
            >
              <div className="inline-flex items-center p-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-white dark:bg-gray-700/80 text-gray-900 dark:text-white shadow-md backdrop-blur-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-transparent'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    billingCycle === 'yearly'
                      ? 'bg-white dark:bg-gray-700/80 text-gray-900 dark:text-white shadow-md backdrop-blur-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-transparent'
                  }`}
                >
                  <span className="flex items-center">
                    Yearly Billing
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                      Save 20%
                    </span>
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-0 mt-12 max-w-7xl mx-auto">
            {loading ? (
              // Skeleton loading state
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 border border-white/30 dark:border-gray-700/50 animate-pulse">
                  <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
                  <ul className="space-y-3 mb-8">
                    {[1, 2, 3, 4].map((j) => (
                      <li key={j} className="flex items-start">
                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </li>
                    ))}
                  </ul>
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load plans</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">We couldn't load the subscription plans. Please try again later.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </button>
              </div>
            ) : plans.length === 0 ? (
              // No plans available
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                  <Info className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No plans available</h3>
                <p className="text-gray-500 dark:text-gray-400">There are no subscription plans available at the moment.</p>
              </div>
            ) : (
              // Render actual plans
              plans.map((plan, index) => {
                const isPopular = plan.isPopular;
                const monthlyPrice = plan.price;
                const yearlyPrice = Math.round(plan.price * 12 * (1 - (plan.discount || 0) / 100) * 100) / 100;
                
                return (
                <motion.div 
                  key={plan._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    'relative flex flex-col p-8 rounded-3xl transition-all duration-500',
                    isPopular 
                      ? 'bg-black/70 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/20' 
                      : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 shadow-lg hover:shadow-xl',
                    'group overflow-hidden',
                    'transform hover:-translate-y-2',
                    'transition-all duration-500 hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5',
                    'relative z-0',
                    isPopular && 'ring-2 ring-indigo-500/30',
                    !isPopular && 'hover:border-indigo-300/50 dark:hover:border-indigo-600/50'
                  )}
                >
                  {/* Mesh gradient background for popular plan */}
                  {isPopular && (
                    <>
                      <div className="absolute inset-0 -z-10 opacity-30" style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0) 60%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }} />
                      <div className="absolute inset-0 -z-20 opacity-70" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.4) 0%, rgba(99, 102, 241, 0) 40%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 40%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }} />
                      <div className="absolute inset-0 -z-30 bg-black" />
                    </>
                  )}
                  
                  {/* Popular badge */}
                  {isPopular && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-6 py-1 rounded-full shadow-lg backdrop-blur-md border border-white/20 dark:border-white/10 animate-pulse">Recommended</span>
                  )}
                  
                  {/* Subtle glow effect on hover */}
                  <div className={cn(
                    'absolute inset-0 -z-10',
                    isPopular 
                      ? 'bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-2xl' 
                      : 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl',
                    'transition-all duration-500',
                    'group-hover:opacity-80',
                    'opacity-60 group-hover:opacity-80',
                    'rounded-3xl',
                    'before:absolute before:inset-0 before:bg-white/5 before:backdrop-blur-sm before:rounded-3xl',
                    'after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/10 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500 after:rounded-3xl'
                  )}></div>
                  
                  <div className="relative flex-1">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <h3 className={cn(
                        'text-2xl font-bold mb-1',
                        isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                      )}>
                        {plan.name}
                      </h3>
                      <p className={cn(
                      'text-sm',
                      isPopular ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                    )}>{plan.description}</p>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className={cn(
                          'text-4xl font-extrabold',
                          isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                        )}>
                          ${billingCycle === 'monthly' ? monthlyPrice : yearlyPrice}
                        </span>
                        <span className={cn(
                          'ml-2',
                          isPopular ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                        )}>
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && plan.discount && (
                        <div className="mt-2 text-sm font-medium bg-green-500/10 text-green-600 dark:text-green-400 inline-flex items-center px-2.5 py-0.5 rounded-full">
                          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Save {plan.discount}% annually
                        </div>
                      )}
                    </div>
                    
                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={`${plan._id}-${idx}`} className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white text-xs">
                              <Check className="h-3 w-3" />
                            </div>
                          </div>
                          <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* CTA Button */}
                    <div className="relative group/button">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover/button:opacity-50 blur transition duration-300"></div>
                      <button 
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden ${
                          isPopular 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20'
                            : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Get Started
                          <svg className="w-4 h-4 ml-2 -mr-1 transition-transform group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          </div>
        </div>
      </section>
    );
  }

  // No plans available state with helpful message
  if (plans.length === 0) {
    return (
      <section id="pricing" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Plans Available</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">We're currently not offering any subscription plans at the moment. Please check back later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Main return with new design
  return (
    <section
      id="subscription"
      className="relative min-h-screen py-20 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-indigo-100 to-purple-100 dark:from-[#0a0714] dark:via-[#18122B] dark:to-[#0a0714]"
    >
      {/* Enhanced, visually interesting background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Faded grid, more visible but low opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(120,120,180,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,180,0.10) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.5
          }}
        />
        {/* Simple animated particles (floating dots) */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className={`absolute rounded-full bg-indigo-400/30 dark:bg-indigo-300/10 animate-float-particle`}
              style={{
                width: `${8 + (i % 3) * 4}px`,
                height: `${8 + (i % 3) * 4}px`,
                left: `${(i * 11) % 100}%`,
                top: `${(i * 23) % 100}%`,
                animationDelay: `${i * 0.7}s`,
                filter: 'blur(1.5px)'
              }}
            />
          ))}
        </div>
        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, #000 100%)',
          opacity: 0.18
        }} />
        {/* Blurred blobs, more vibrant in dark mode */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-700/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-purple-300/20 dark:bg-purple-800/40 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-pink-200/20 dark:bg-pink-700/40 rounded-full blur-2xl" />
        <div className="absolute top-1/4 left-1/2 w-[200px] h-[200px] bg-blue-400/10 dark:bg-blue-900/30 rounded-full blur-2xl" />
      </div>
      {/* Decorative Stars */}
      <div className="absolute left-10 top-24 flex flex-col gap-2 z-10">
        <span className="block w-2 h-2 bg-white/80 dark:bg-white/40 rounded-full"></span>
        <span className="block w-1.5 h-1.5 bg-white/60 dark:bg-white/30 rounded-full"></span>
        <span className="block w-1 h-1 bg-white/40 dark:bg-white/20 rounded-full"></span>
      </div>
      <div className="absolute right-10 top-24 flex flex-col gap-2 z-10">
        <span className="block w-2 h-2 bg-white/80 dark:bg-white/40 rounded-full"></span>
        <span className="block w-1.5 h-1.5 bg-white/60 dark:bg-white/30 rounded-full"></span>
        <span className="block w-1 h-1 bg-white/40 dark:bg-white/20 rounded-full"></span>
      </div>
      {/* Header */}
      <div className="relative z-20 w-full max-w-4xl mx-auto text-center px-4 sm:px-6 mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight pb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent mb-3 sm:mb-4 drop-shadow-lg">
          Choose your plan
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
          Find the perfect plan to fit your business needs. We provide flexible solutions for startups, growing businesses, and enterprises.
        </p>
      </div>
      {/* Billing Toggle */}
      <div className="relative z-20 mb-8 sm:mb-12 px-4 sm:px-0">
        <div className="inline-flex items-center p-0.5 sm:p-1 bg-white/70 dark:bg-[#18122B]/80 border border-gray-200 dark:border-[#3A2C5A] rounded-full shadow-inner backdrop-blur-md">
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 focus:outline-none whitespace-nowrap ${
              billingCycle === 'yearly' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md sm:shadow-lg ring-1 sm:ring-2 ring-indigo-400/60 dark:ring-purple-700/60' 
                : 'text-gray-700 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Annual Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 focus:outline-none whitespace-nowrap ${
              billingCycle === 'monthly' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md sm:shadow-lg ring-1 sm:ring-2 ring-indigo-400/60 dark:ring-purple-700/60' 
                : 'text-gray-700 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
        </div>
        {billingCycle === 'yearly' && (
          <p className="mt-3 text-xs sm:text-sm text-center text-green-600 dark:text-green-400 font-medium">
            Save up to 6% with annual billing
          </p>
        )}
      </div>
      {/* Pricing Cards */}
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl px-4 sm:px-6">
        {plans.slice(0, 3).map((plan) => {
          const price = billingCycle === 'monthly' 
            ? plan.price 
            : Math.round(plan.price * 12 * 0.94); // 6% discount for annual
          return (
            <div
              key={plan._id}
              className={`relative flex flex-col items-center
                bg-white/80 dark:bg-[#18122B]/90
                backdrop-blur-2xl
                border border-gray-200 dark:border-white/10
                rounded-2xl
                shadow-lg sm:shadow-2xl
                p-6 sm:px-6 sm:py-8
                transition-all duration-300
                ${plan.isPopular ? 'sm:scale-105 z-30 border-indigo-500/60 shadow-indigo-500/20 sm:shadow-indigo-500/30 ring-1 sm:ring-2 ring-indigo-400/30 dark:ring-purple-700/40' : 'z-20'}
                ${!plan.isPopular ? 'md:mt-8' : ''}
                hover:shadow-xl sm:hover:shadow-2xl sm:hover:scale-[1.03] hover:border-indigo-400/40 dark:hover:border-purple-700/40
              `}
              style={{ boxShadow: plan.isPopular ? '0 4px 20px 0 rgba(99,102,241,0.15)' : undefined }}
            >
              {/* Popular Badge (from backend isPopular) */}
              {plan.isPopular && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] sm:text-xs font-bold px-4 sm:px-6 py-1 rounded-full shadow-md sm:shadow-lg backdrop-blur-md border border-white/20 dark:border-white/10 animate-pulse whitespace-nowrap">
                  Recommended
                </span>
              )}
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 drop-shadow">{plan.name}</h3>
              <div className="flex items-end justify-center mb-1 sm:mb-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow">${price}</span>
                <span className="ml-1.5 sm:ml-2 text-sm sm:text-base text-gray-500 dark:text-gray-300 font-medium">
                 {billingCycle === 'monthly' ? '/month' : '/year'}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 mb-4 sm:mb-6 min-h-[40px] sm:min-h-[48px] text-center">{plan.description}</p>
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 mb-6 sm:mb-8 text-sm sm:text-base
                  ${plan.isPopular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:from-indigo-600 hover:to-purple-600 ring-1 sm:ring-2 ring-indigo-400/40 dark:ring-purple-700/60 animate-glow'
                    : 'bg-white/60 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-white/20 border border-white/30 dark:border-white/10'}
                `}
                style={plan.isPopular ? { boxShadow: '0 0 12px 1px #a78bfa, 0 2px 12px 0 #6366f1' } : {}}
              >
                Get Started
              </button>
              <ul className="w-full space-y-2 sm:space-y-3 text-left">
                {plan.features.slice(0, expandedPlans[plan._id] ? plan.features.length : 6).map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start text-gray-900 dark:text-white/90 text-xs sm:text-sm"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <span className="inline-flex items-center justify-center flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mt-0.5 mr-2 sm:mr-3 shadow-md">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </span>
                    <span className="leading-tight">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              {plan.features.length > 6 && (
                <button 
                  onClick={() => toggleExpandPlan(plan._id)}
                  className="mt-3 text-xs font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center"
                >
                  {expandedPlans[plan._id] ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3 ml-1" />
                    </>
                  ) : (
                    `+${plan.features.length - 6} more features`
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SubscriptionSection;
