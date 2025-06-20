import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Twitter, Github, Globe } from 'lucide-react';
import { teamAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
// Theme provider import removed as it's not used in this component
import { TeamMemberItem } from '@/components/TeamSection';

const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const data = await teamAPI.getAll();
        // Filter only active team members and sort by order
        const activeMembers = data
          .filter((member: TeamMemberItem) => member.isActive)
          .sort((a: TeamMemberItem, b: TeamMemberItem) => a.order - b.order);
        setTeamMembers(activeMembers);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-96">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">No team members available at the moment.</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15), transparent 40%), radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.15), transparent 50%)',
            filter: 'blur(100px)'
          }}
        />
      </div>
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Meet Our <span className="text-blue-600 dark:text-blue-400">Team</span>
          </motion.h1>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '6rem' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-blue-600 mx-auto mb-6 rounded-full"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Get to know the talented individuals who make our work possible.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div 
              key={member._id}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-white/20 dark:border-gray-700/50"
            >
              <div className="relative overflow-hidden h-64 bg-gray-100 dark:bg-gray-900">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xl font-bold">{member.name}</h3>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-600/20 text-blue-100 rounded-full mb-3">{member.position}</span>
                    {member.bio && (
                      <p className="text-gray-200 text-sm mb-4 line-clamp-3">{member.bio}</p>
                    )}
                    
                    <div className="flex space-x-3">
                      {member.socialLinks?.linkedin && (
                        <a 
                          href={member.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-300 hover:text-blue-400 transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks?.twitter && (
                        <a 
                          href={member.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-300 hover:text-blue-400 transition-colors"
                          aria-label={`${member.name}'s Twitter`}
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks?.github && (
                        <a 
                          href={member.socialLinks.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                          aria-label={`${member.name}'s GitHub`}
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks?.portfolio && (
                        <a 
                          href={member.socialLinks.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-300 hover:text-purple-400 transition-colors"
                          aria-label={`${member.name}'s Portfolio`}
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="p-6 flex-grow flex flex-col bg-white/80 dark:bg-gray-900/30 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full mb-3 w-fit">{member.position}</span>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{member.bio}</p>
                </div>
                
                {member.skills && member.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                          +{member.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
