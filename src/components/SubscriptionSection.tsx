import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const packages = [
  {
    name: 'Bronze',
    color: 'from-yellow-400 to-yellow-600',
    features: [
      'Basic Support',
      'Up to 2 Projects',
      'Email Support',
      'Basic Analytics',
    ],
    weekly: 29,
    yearly: 129,
  },
  {
    name: 'Silver',
    color: 'from-blue-400 to-blue-600',
    features: [
      'Priority Support',
      'Up to 5 Projects',
      'Chat & Email Support',
      'Advanced Analytics',
      'Custom Domain',
    ],
    weekly: 59,
    yearly: 259,
    highlight: true,
  },
  {
    name: 'Gold',
    color: 'from-purple-500 to-pink-500',
    features: [
      '24/7 Premium Support',
      'Unlimited Projects',
      'Dedicated Manager',
      'Full Analytics Suite',
      'Custom Integrations',
      'Free Consultation',
    ],
    weekly: 99,
    yearly: 399,
  },
];

const SubscriptionSection: React.FC = () => {
  const [tab, setTab] = useState<'weekly' | 'yearly'>('weekly');

  return (
    <section id="subscription" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Flexible Subscription Packages</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Choose a plan that fits your needs. Switch between weekly and yearly pricing.</p>
          <div className="inline-flex mt-6 bg-slate-200 dark:bg-slate-800 rounded-full p-1">
            <button
              onClick={() => setTab('weekly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${tab === 'weekly' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' : 'text-gray-700 dark:text-gray-200'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTab('yearly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${tab === 'yearly' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' : 'text-gray-700 dark:text-gray-200'}`}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <div
              key={pkg.name}
              className={`relative rounded-3xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col items-center p-8 pt-12 transition-transform duration-300 hover:-translate-y-2 group ${pkg.highlight ? 'scale-105 z-10 ring-4 ring-blue-400/20' : ''}`}
              style={{ animation: `fadeInUp 0.7s ease ${(i * 0.12).toFixed(2)}s both` }}
            >
              <div className={`absolute top-0 left-0 w-full h-[auto] ${pkg.name === 'Silver' ? 'bg-gradient-to-r from-green-500 to-blue-600 ' : pkg.color}`}>
               {pkg.name === 'Silver' && <span className="w-full h-full flex items-center justify-center text-white text-xl font-bold">Recommended</span>}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{pkg.name}</h3>
              <div className="flex items-end mb-4">
                <span className="text-4xl md:text-5xl font-extrabold text-primary-600 dark:text-primary-400">${tab === 'weekly' ? pkg.weekly : pkg.yearly}</span>
                <span className="ml-2 text-lg text-gray-500 dark:text-gray-300 font-medium">/ {tab}</span>
              </div>
              <ul className="mb-8 text-left w-full">
                {pkg.features.map((feature, idx) => (
                  <li key={feature+idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                    <CheckCircle className="text-green-500 w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-auto px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow bg-gradient-to-r ${pkg.color} text-white hover:scale-105`}>Choose {pkg.name}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
