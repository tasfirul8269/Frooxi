import React from 'react';
import { motion } from 'framer-motion';
import { TeamMemberItem } from './TeamSection';

interface TeamMemberCardProps {
  member: TeamMemberItem;
  itemVariants: any;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, itemVariants }) => {
  // Fallback for missing image
  const imageUrl = member.imageUrl || 'https://randomuser.me/api/portraits/lego/1.jpg';
  
  // Role color mapping with enhanced colors
  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('lead') || roleLower.includes('director') || roleLower.includes('ceo')) {
      return 'from-blue-500 to-blue-600';
    } else if (roleLower.includes('design') || roleLower.includes('ui') || roleLower.includes('ux')) {
      return 'from-purple-500 to-pink-600';
    } else if (roleLower.includes('dev') || roleLower.includes('engineer')) {
      return 'from-green-500 to-teal-600';
    }
    return 'from-gray-500 to-gray-700';
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
        {/* Profile Picture - Circular with gradient border */}
        <div className="relative w-36 h-36 -mt-20 mb-4 group-hover:-translate-y-1 transition-transform duration-300">
          <div 
            className={`absolute inset-0 rounded-full p-1 bg-gradient-to-br ${getRoleColor(member.position)}`}
            style={{
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '3px'
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800">
              <img
                src={imageUrl}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://randomuser.me/api/portraits/lego/1.jpg';
                }}
              />
            </div>
          </div>
        </div>
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
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <p className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg text-gray-700 dark:text-gray-300 text-sm italic">
            {member.bio || "Hello, I like not doing anything at all. Let's DM."}
          </p>
        </div>
        
        {/* Social Icons with glass effect */}
        <div className="mt-auto w-full pt-4">
          <div className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-3">
            <div className="flex justify-center space-x-5">
              {member.socialLinks?.linkedin && (
                <a 
                  href={member.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {member.socialLinks?.twitter && (
                <a 
                  href={member.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
                  aria-label={`${member.name}'s Twitter`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              {member.socialLinks?.github && (
                <a 
                  href={member.socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-gray-100/70 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={`${member.name}'s GitHub`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              )}
              {member.socialLinks?.portfolio && (
                <a 
                  href={member.socialLinks.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-all duration-300 hover:scale-110"
                  aria-label={`${member.name}'s Portfolio`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;