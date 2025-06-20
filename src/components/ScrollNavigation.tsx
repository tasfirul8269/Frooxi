import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Users, Star, Mail, BarChart, Bell } from 'lucide-react';
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
    { id: 'subscription', label: 'Subscription', icon: <Bell className="h-5 w-5" /> },
    { id: 'team', label: 'Team', icon: <Users className="h-5 w-5" /> },
    { id: 'testimonials', label: 'Testimonials', icon: <Star className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if we're at the very top of the page (home section)
      if (currentScrollY < 100) {
        setActiveSection('home');
      } else {
        // Update active section for other sections
        sections.slice(1).forEach(section => { // Skip home section since we already checked it
          const element = document.getElementById(section.id);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            const scrollPosition = currentScrollY + 100;
            
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section.id);
            }
          }
        });
      }

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
      className="fixed bottom-6 left-0 right-0 z-40 hidden md:flex justify-center px-4"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border border-gray-200 dark:border-gray-700">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            variant="ghost"
            size="sm"
            className={cn(
              'relative group rounded-full px-3 py-6 flex flex-col items-center gap-1 transition-colors',
              activeSection === section.id 
                ? 'bg-gradient-to-r from-[#4b50eb] to-[#bf27d4] bg-clip-text text-transparent' 
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#4b50eb] hover:to-[#bf27d4] hover:bg-clip-text hover:text-transparent dark:text-gray-400',
              'hover:bg-transparent dark:hover:bg-transparent'
            )}
            aria-label={`Scroll to ${section.label}`}
          >
            <div className={cn(
              'p-[2px] rounded-full transition-all',
              activeSection === section.id 
                ? 'bg-gradient-to-r from-[#4b50eb] to-[#bf27d4]' 
                : 'group-hover:bg-gradient-to-r group-hover:from-[#4b50eb] group-hover:to-[#bf27d4]',
              'flex items-center justify-center'
            )}>
              <div className={cn(
                'bg-white dark:bg-gray-900 rounded-full p-1.5 transition-all',
                activeSection === section.id 
                  ? 'p-1' 
                  : 'group-hover:p-1',
                'flex items-center justify-center'
              )}>
                <div className={cn(
                  'transition-colors',
                  activeSection === section.id 
                    ? 'text-[#4b50eb] dark:text-[#bf27d4]' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-[#4b50eb] dark:group-hover:text-[#bf27d4]',
                  'flex items-center justify-center'
                )}>
                  {section.icon}
                </div>
              </div>
            </div>
            <span className={cn(
              'text-xs font-medium',
              activeSection === section.id && 'bg-gradient-to-r from-[#4b50eb] to-[#bf27d4] bg-clip-text text-transparent'
            )}>
              {section.label}
            </span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default ScrollNavigation;
