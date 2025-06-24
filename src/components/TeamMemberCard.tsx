import React from 'react';
import { motion } from 'framer-motion';
import type { TeamMember } from '@/types/team';

interface TeamMemberCardProps {
  member: TeamMember;
  itemVariants: any;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, itemVariants }) => {
  // Fallback for missing image
  const getImageUrl = () => {
    if (!member.imageUrl) {
      if (process.env.NODE_ENV !== 'production') console.log('No image URL provided for', member.name);
      return 'https://randomuser.me/api/portraits/lego/1.jpg';
    }
    
    // If the URL is already absolute, return it as is
    if (member.imageUrl.startsWith('http')) {
      return member.imageUrl;
    }
    
    // Handle relative URLs by prepending the API base URL
    const baseUrl = import.meta.env.VITE_API_URL || '';
    
    // Ensure the URL has a leading slash but not double slashes
    const imagePath = member.imageUrl.startsWith('/') 
      ? member.imageUrl 
      : `/${member.imageUrl}`;
    
    // Remove any double slashes that might occur when joining URLs
    const fullUrl = `${baseUrl}${imagePath}`.replace(/([^:]\/)\/+/g, '$1');
    
    if (process.env.NODE_ENV !== 'production') console.log('Constructed image URL:', {
      baseUrl,
      imagePath,
      fullUrl,
      originalUrl: member.imageUrl
    });
    
    return fullUrl;
  };
  
  const imageUrl = getImageUrl();

  // Role color mapping with blue-based gradients
  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('lead') || roleLower.includes('director') || roleLower.includes('ceo') || roleLower.includes('founder')) {
      return 'from-blue-600 to-blue-700';
    } else if (roleLower.includes('design') || roleLower.includes('ui') || roleLower.includes('ux') || roleLower.includes('creative')) {
      return 'from-sky-500 to-blue-600';
    } else if (roleLower.includes('dev') || roleLower.includes('engineer') || roleLower.includes('developer')) {
      return 'from-blue-500 to-indigo-600';
    } else if (roleLower.includes('manager') || roleLower.includes('head') || roleLower.includes('chief')) {
      return 'from-indigo-500 to-blue-700';
    } else if (roleLower.includes('marketing') || roleLower.includes('growth') || roleLower.includes('sales')) {
      return 'from-blue-400 to-cyan-600';
    } else if (roleLower.includes('product') || roleLower.includes('pm') || roleLower.includes('owner')) {
      return 'from-blue-500 to-blue-700';
    }
    return 'from-blue-400 to-blue-600'; // Default blue gradient
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl p-0.5"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
      }}
    >
      {/* Glass card container */}
      <div className="relative h-full w-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-6 flex flex-col items-center text-center">
        {/* Profile Picture - Simplified */}
        <div className="relative w-32 h-32 mb-4">
          <img
            src={imageUrl}
            alt={member.name}
            className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 object-cover"
            style={{
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://randomuser.me/api/portraits/lego/1.jpg';
            }}
          />
        </div>
        {/* Content */}
        <div className="w-full flex-grow flex flex-col items-center">
          {/* Name with gradient text */}
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
            {member.name}
          </h3>
          {/* Role with gradient background */}
          <span className={`inline-block px-4 py-1.5 text-sm font-medium text-white rounded-full mb-4 bg-gradient-to-r ${getRoleColor(member.position)}`}>
            {member.position}
          </span>
          {/* Fun Quote/Bio with subtle glow effect */}
          <div className="relative w-full mb-6">
            <div className="absolute -inset-1 "></div>
            <p className="relative rounded-lg text-gray-700 dark:text-gray-300 text-sm italic">
              {member.bio || "Hello, I like not doing anything at all. Let's DM."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;