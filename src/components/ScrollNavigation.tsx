import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Users, Star, Mail, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const ScrollNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const sections: Section[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'services', label: 'Services', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart className="h-5 w-5" /> },
    { id: 'team', label: 'Team', icon: <Users className="h-5 w-5" /> },
    { id: 'testimonials', label: 'Testimonials', icon: <Star className="h-5 w-5" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update active section
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const scrollPosition = currentScrollY + 100;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      });

      // Show/hide navigation based on scroll direction
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (currentScrollY < lastScrollY.current) {
            // Scrolling up
            setIsVisible(false);
          } else {
            // Scrolling down or at top
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for header
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ 
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border border-gray-200 dark:border-gray-700">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            variant="ghost"
            size="sm"
            className={cn(
              'relative group rounded-full px-3 py-6 transition-all flex flex-col items-center gap-1',
              activeSection === section.id 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400'
            )}
            aria-label={`Scroll to ${section.label}`}
          >
            <div className={cn(
              'p-1.5 rounded-full transition-colors',
              activeSection === section.id && 'bg-primary-100 dark:bg-primary-900/30'
            )}>
              {section.icon}
            </div>
            <span className="text-xs font-medium">
              {section.label}
            </span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default ScrollNavigation;
