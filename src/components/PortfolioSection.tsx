import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';

// Add type declarations for styled-jsx
declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
import { portfolioAPI } from '@/services/api';
import { cn } from '@/lib/utils';

// Helper function to chunk array into groups
const chunkArray = (arr: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};



// Define and export the type for a single portfolio item
export interface PortfolioItemType {
  _id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  link?: string;
  tags?: string[];
  technologies?: string[];
  year?: string;
  featured?: boolean;
  isActive?: boolean;
}

// Define the props for the PortfolioSection component
interface PortfolioSectionProps {
  portfolioItemsData: PortfolioItemType[];
  sectionRef: (el: HTMLElement | null) => void;
}

const PortfolioCard: React.FC<{ item: PortfolioItemType, mobile?: boolean }> = ({ item, mobile = false }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (item.link) {
      // Only prevent default if there's a link to avoid scrolling
      e.preventDefault();
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`group relative break-inside-avoid rounded-xl shadow-xl overflow-hidden bg-slate-200 dark:bg-slate-800 transition-all duration-300 hover:shadow-2xl ${
        item.link ? 'cursor-pointer' : ''
      } ${mobile ? 'w-full' : 'mb-6'}`}
    >
      <div className={`relative ${mobile ? 'aspect-video' : 'h-56'}`}>
        <img
          src={item.image}
          alt={item.title || 'Portfolio project image'}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90 brightness-90"
          loading="lazy"
        />
        {/* Content overlay - simplified for mobile */}
        <div className={`absolute inset-0 flex flex-col justify-end p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent ${
          mobile ? 'opacity-100' : 'opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0'
        } transition-all duration-400 ease-in-out`}>
          <h4 className="text-sm sm:text-base font-bold text-white mb-1 drop-shadow-md line-clamp-1">{item.title}</h4>
          <div className="flex flex-wrap gap-1 mb-1">
            <span className="inline-block px-1.5 py-0.5 rounded bg-primary-600/80 text-[10px] sm:text-xs text-white font-semibold">
              {item.category}
            </span>
            {item.tags && item.tags.map((tag, idx) => (
              <span 
                key={tag+idx} 
                className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-700/70 text-[10px] text-primary-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-[11px] sm:text-sm text-white/90 mb-1.5 line-clamp-2">{item.description}</p>
          {item.link && (
            <div className="flex items-center text-[10px] sm:text-xs text-white/70">
              <span className="truncate">{new URL(item.link).hostname.replace('www.', '')}</span>
              <ArrowRight size={12} className="ml-0.5 flex-shrink-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolioItemsData: initialPortfolioItems, sectionRef }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemType[]>(initialPortfolioItems || []);
  const [loading, setLoading] = useState(!initialPortfolioItems?.length);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      // Don't fetch if we already have data passed as props
      if (initialPortfolioItems?.length) return;
      
      try {
        setLoading(true);
        const data = await portfolioAPI.getAll();
        // Filter active items and map to match the expected format
        const activeItems = data
          .filter((item: any) => item.isActive !== false)
          .map((item: any) => ({
            _id: item._id,
            title: item.title,
            category: item.category || 'Web Development', // Default category if not provided
            image: item.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', // Default image if not provided
            description: item.description || 'Check out this amazing project',
            link: item.link || '#',
            tags: item.tags || item.technologies?.slice(0, 2) || ['Web', 'Design'], // Use tags or first 2 technologies as tags
            featured: item.featured || false
          }));
        setPortfolioItems(activeItems);
      } catch (err) {
        console.error('Error fetching portfolio items:', err);
        setError('Failed to load portfolio items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [initialPortfolioItems]);

  if (loading && !portfolioItems.length) {
    return (
      <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            <span className="ml-2 text-lg">Loading portfolio...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (!portfolioItems.length) {
    return (
      <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p>No portfolio items available at the moment.</p>
        </div>
      </section>
    );
  }

  // Split portfolio items into two rows for mobile
  const mobileRow1 = [...portfolioItems];
  const mobileRow2 = [...portfolioItems].reverse(); // Reverse for different starting points
  
  // For desktop, maintain the original 3-column layout
  const columns = 3;
  const itemsPerColumn = Math.ceil(portfolioItems.length / columns);
  const columnItems = Array(columns).fill(0).map((_, i) => 
    portfolioItems.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
  );
  
  // Duplicate items for seamless scrolling
  const getDuplicatedItems = (items: PortfolioItemType[]) => [...items, ...items];

  return (
    <section
      id="portfolio"
      className="bg-slate-50 dark:bg-slate-900 relative overflow-hidden slide-in-section py-20"
      ref={sectionRef}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-3">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <SectionHeading
          title="Our Portfolio"
          subtitle="Explore our creative endeavors and successful project deliveries."
        />

        <div className="relative mt-12 md:mt-16 z-10">
          {/* Mobile: Horizontal scrolling rows */}
          <div className="md:hidden space-y-1">
            {/* Row 1 */}
            <div className="relative group overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none" />
              <div className="flex space-x-0.5 sm:space-x-1 px-1 sm:px-2 py-2 animate-marquee-normal">
                {[...mobileRow1, ...mobileRow1].map((item, index) => (
                  <div key={`mobile-row1-${index}`} className="flex-shrink-0 w-[80vw] sm:w-80 px-0.5">
                    <PortfolioCard item={item} mobile />
                  </div>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none" />
            </div>
            
            {/* Row 2 */}
            <div className="relative group overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none" />
              <div className="flex space-x-0.5 sm:space-x-1 px-1 sm:px-2 py-2 animate-marquee-reverse">
                {[...mobileRow2, ...mobileRow2].map((item, index) => (
                  <div key={`mobile-row2-${index}`} className="flex-shrink-0 w-[80vw] sm:w-80 px-0.5">
                    <PortfolioCard item={item} mobile />
                  </div>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none" />
            </div>
          </div>

          {/* Desktop: Vertical scrolling columns */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[800px] overflow-hidden relative">
            {/* Fade effects */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none"></div>
            
            {columnItems.map((items, colIndex) => {
              const isReversed = colIndex % 2 === 1; // Reverse direction for even columns (1-based index)
              const animationDuration = 60 + (colIndex * 5); // Different speed for each column
              
              return (
                <div 
                  key={colIndex} 
                  className={cn(
                    "relative h-full overflow-hidden",
                    isReversed ? "origin-top" : "origin-bottom"
                  )}
                >
                  <div 
                    className={cn(
                      "space-y-6 w-full opacity-90 hover:opacity-100 transition-opacity duration-300",
                      "animate-portfolio-scroll",
                      isReversed ? "animate-portfolio-scroll-reverse" : ""
                    )}
                    style={{
                      animationDuration: `${animationDuration}s`,
                      animationIterationCount: 'infinite',
                      animationTimingFunction: 'linear',
                      animationPlayState: isHovered ? 'paused' : 'running'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {getDuplicatedItems(items).map((item, itemIndex) => (
                      <PortfolioCard 
                        key={`${item._id || item.title}-${itemIndex}`} 
                        item={item} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* View More Button */}
          <div className="mt-16 text-center relative z-10">
            <Button 
              asChild 
              size="lg" 
              className="group relative overflow-hidden px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-semibold transform hover:scale-105"
            >
              <Link to="/portfolio">
                View More Projects
                <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Add global styles for the animation */}
      <style jsx={true} global={true}>{`
        @keyframes portfolio-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 1.5rem)); } /* 1.5rem accounts for gap-6 */
        }
        @keyframes portfolio-scroll-reverse {
          0% { transform: translateY(calc(-50% - 1.5rem)); }
          100% { transform: translateY(0); }
        }
        .animate-portfolio-scroll {
          animation: portfolio-scroll 60s linear infinite;
        }
        .animate-portfolio-scroll-reverse {
          animation: portfolio-scroll-reverse 60s linear infinite;
        }
        .animate-portfolio-scroll:hover, 
        .animate-portfolio-scroll-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default PortfolioSection;
