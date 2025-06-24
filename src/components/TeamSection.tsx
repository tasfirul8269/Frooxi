import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getTeamMembers } from '@/lib/api/teamService';
import type { TeamMember } from '@/types/team';
import { Button } from '@/components/ui/button';
import TeamMemberCard from './TeamMemberCard';

// Using TeamMember type from @/types/team

// Define the props for the TeamSection component
interface TeamSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ sectionRef }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        if (process.env.NODE_ENV !== 'production') console.log('Fetching team members...');
        
        // Make a test request to the API endpoint
        try {
          const testResponse = await fetch(`${import.meta.env.VITE_API_URL}/team`);
          const testData = await testResponse.json();
          if (process.env.NODE_ENV !== 'production') console.log('Test API Response:', testData);
          if (testData && testData.length > 0) {
            if (process.env.NODE_ENV !== 'production') console.log('Test - First team member:', testData[0]);
            if (process.env.NODE_ENV !== 'production') console.log('Test - Image URL:', testData[0].imageUrl);
          }
        } catch (testError) {
          if (process.env.NODE_ENV !== 'production') console.error('Test API Error:', testError);
        }
        
        // Original API call
        const response = await getTeamMembers();
        if (process.env.NODE_ENV !== 'production') console.log('API Response:', response);
        
        if (response && response.length > 0) {
          if (process.env.NODE_ENV !== 'production') console.log('First team member data:', response[0]);
          if (process.env.NODE_ENV !== 'production') console.log('Image URL of first member:', response[0].imageUrl);
          
          // Log the full image URL
          const fullImageUrl = response[0].imageUrl.startsWith('http') 
            ? response[0].imageUrl 
            : `${import.meta.env.VITE_API_URL}${response[0].imageUrl}`;
          if (process.env.NODE_ENV !== 'production') console.log('Full image URL:', fullImageUrl);
        }
        
        const data = Array.isArray(response) ? response : [];
        
        if (data.length === 0) {
          if (process.env.NODE_ENV !== 'production') console.warn('No team members found in the response');
          setTeamMembers([]);
          return;
        }
        
        // Filter only active team members and sort by order
        const activeMembers = data
          .filter((member): member is TeamMember => member && member.isActive)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        if (process.env.NODE_ENV !== 'production') console.log('Active Team Members:', activeMembers);
        if (process.env.NODE_ENV !== 'production') console.log('Number of active members:', activeMembers.length);
        
        if (activeMembers.length === 0) {
          if (process.env.NODE_ENV !== 'production') console.warn('No active team members found');
        }
        
        setTeamMembers(activeMembers);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') console.error('Error fetching team members:', err);
        setError('Failed to load team members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <section id="team" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden" ref={sectionRef}>
        <div className="container mx-auto px-4 text-center">
          <p>Loading team members...</p>
        </div>
      </section>
    );
  }


  if (error) {
    return (
      <section id="team" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden" ref={sectionRef}>
        <div className="container mx-auto px-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <section id="team" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden" ref={sectionRef}>
        <div className="container mx-auto px-4 text-center">
          <p>No team members available at the moment.</p>
        </div>
      </section>
    );
  }
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="team"
      className="py-24 relative overflow-hidden bg-gray-50 dark:bg-gray-950"
      ref={sectionRef}
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1), transparent 40%), radial-gradient(circle at 80% 70%, rgba(96, 165, 250, 0.1), transparent 40%), radial-gradient(circle at 40% 60%, rgba(147, 197, 253, 0.1), transparent 50%)',
            filter: 'blur(100px)'
          }}
        />
      </div>
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-15 dark:opacity-8">
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Meet Our <span className="text-blue-600 dark:text-blue-400">Team</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '6rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-blue-600 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Our team of dedicated professionals is here to bring your ideas to life. {teamMembers.length > 4 ? `Meet the core team members below, or view all ${teamMembers.length} team members.` : teamMembers.length > 0 ? `Meet our ${teamMembers.length} amazing team members.` : 'Our team information is coming soon.'}
          </motion.p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.slice(0, 4).map((member, index) => (
            <div key={`debug-${member._id}`} className="hidden">
              Member {index + 1}: {member.name} (Active: {member.isActive ? 'Yes' : 'No'}, Order: {member.order})
            </div>
          ))}
          {teamMembers.slice(0, 4).map((member) => (
            <TeamMemberCard key={member._id} member={member} itemVariants={item} />
          ))}
        </motion.div>

        {teamMembers.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button asChild size="lg" className="group">
              <Link to="/team">
                View All Team
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
                         