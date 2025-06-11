import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';



// Define and export the type for a single portfolio item
export interface PortfolioItemType {
  title: string;
  category: string;
  image: string;
  description: string;
  link?: string;
  tags?: string[];
}

// Define the props for the PortfolioSection component
interface PortfolioSectionProps {
  portfolioItemsData: PortfolioItemType[];
  sectionRef: (el: HTMLElement | null) => void;
}

const PortfolioCard: React.FC<{ item: PortfolioItemType }> = ({ item }) => {
  return (
    <div className="group relative mb-6 break-inside-avoid rounded-2xl shadow-xl overflow-hidden bg-slate-200 dark:bg-slate-800 transition-all duration-300 hover:shadow-2xl">
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
        <p className="text-sm text-white/90 mb-3 line-clamp-2">{item.description}</p>
        {item.link && (
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/90 hover:bg-primary-600 hover:text-white font-medium text-primary-700 transition-colors duration-200 shadow-md">
            View Project <ArrowRight size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolioItemsData, sectionRef }) => {
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

       
        {/* Fade effects */}
      
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none" />
        
        <div className="relative mt-12 md:mt-16 z-10">
          <div className="portfolio-marquee-container flex flex-col md:flex-row gap-4 md:gap-6 h-[600px] md:h-[750px] overflow-hidden group relative">
            {/* Absolute CTA Button */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
              <Button asChild size="lg" className="group relative overflow-hidden px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-semibold transform hover:scale-105">
                <Link to="/portfolio">
                  View More Projects
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            {[0, 1, 2].map((colIndex) => {
              const itemsPerColumn = Math.ceil(portfolioItemsData.length / 3);
              let columnItems = portfolioItemsData.slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn);
              if (columnItems.length === 0 && portfolioItemsData.length > 0) {
                columnItems = [...portfolioItemsData];
              }
              // Duplicate for seamless scrolling
              const minScrollItems = 10;
              const duplications = columnItems.length > 0 ? Math.max(4, Math.ceil(minScrollItems / columnItems.length)) : 0;
              const displayItems = duplications > 0 ? Array(duplications).fill(columnItems).flat() : [];
              const animationClass = colIndex === 1 
                ? 'animate-marquee-vertical-normal' 
                : 'animate-marquee-vertical-reverse';
              // Animation duration based on items
              const estimatedCardHeightWithGap = 260;
              const scrollableContentHeight = displayItems.length / 2 * estimatedCardHeightWithGap;
              const desiredSpeed = 40;
              const animationDuration = displayItems.length > 0 ? Math.max(30, scrollableContentHeight / desiredSpeed) : 60;
              return (
                <div key={colIndex} className="flex-1 h-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none" />
                  <div 
                    className={`flex flex-col gap-4 md:gap-6 ${animationClass} h-full portfolio-marquee-column`} 
                    style={{ animationDuration: `${animationDuration}s` }}
                  >
                    {displayItems.map((item, itemIndex) => (
                      <div key={`${colIndex}-${itemIndex}-${item.title}-${item.image}`}> 
                        <PortfolioCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
