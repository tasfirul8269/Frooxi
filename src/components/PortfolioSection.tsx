import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { portfolioAPI } from '@/services/api'; // Import the portfolioAPI



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

const PortfolioCard: React.FC<{ item: PortfolioItemType }> = ({ item }) => {
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
      className={`group relative mb-6 break-inside-avoid rounded-2xl shadow-xl overflow-hidden bg-slate-200 dark:bg-slate-800 transition-all duration-300 hover:shadow-2xl ${
        item.link ? 'cursor-pointer' : ''
      }`}
    >
      <img
        src={item.image}
        alt={item.title || 'Portfolio project image'}
        className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75 brightness-100"
        loading="lazy"
      />
      {/* Content overlay slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 flex flex-col justify-end p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-in-out">
        <h4 className="text-lg font-bold text-white mb-1 drop-shadow-md">{item.title}</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="inline-block px-2 py-0.5 rounded bg-primary-600/80 text-xs text-white font-semibold">{item.category}</span>
          {item.tags && item.tags.map((tag, idx) => (
            <span key={tag+idx} className="inline-block px-2 py-0.5 rounded bg-slate-700/70 text-xs text-primary-200 animate-fade-in-up" style={{animationDelay: `${0.1 + idx * 0.05}s`}}>{tag}</span>
          ))}
        </div>
        <p className="text-sm text-white/90 mb-3">{item.description}</p>
        {item.link && (
          <div className="flex items-center text-xs text-white/70 mt-1">
            <span className="truncate">{new URL(item.link).hostname.replace('www.', '')}</span>
            <ArrowRight size={14} className="ml-1 flex-shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
};

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolioItemsData: initialPortfolioItems, sectionRef }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemType[]>(initialPortfolioItems || []);
  const [loading, setLoading] = useState(!initialPortfolioItems?.length);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <section
      id="portfolio"
      className=" bg-slate-50 dark:bg-slate-900 relative overflow-hidden slide-in-section"
      ref={sectionRef}
    >

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-3">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"></div>
      </div>
      <div className="container relative z-10 mt-10 mx-auto px-6">
        <SectionHeading
          title="Our Portfolio"
          subtitle="Explore our creative endeavors and successful project deliveries."
        />

        <div className="relative mt-12 md:mt-16 z-10">
          {/* Simple grid layout with fade effect at the bottom */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <PortfolioCard key={item._id || item.title} item={item} />
              ))}
            </div>
            {/* Fade effect only for the grid */}
            <div className="absolute -bottom-6 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900 pointer-events-none"></div>
          </div>
          
          {/* View More Button - outside the fade effect */}
          <div className="mt-16 text-center relative z-10">
            <Button asChild size="lg" className="group relative overflow-hidden px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-semibold transform hover:scale-105">
              <Link to="/portfolio">
                View More Projects
                <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
