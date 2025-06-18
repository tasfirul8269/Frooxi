import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';

import { Button } from '@/components/ui/button';

// Define the type for a single service item
export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode; // Assuming icons are passed as React nodes
}

// Define the props for the ServicesSection component
interface ServicesSectionProps {
  servicesData: ServiceItem[];
  sectionRef: (el: HTMLElement | null) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ servicesData, sectionRef }) => {
  return (
    <section
      id="services"
      className="py-20 md:py-28 relative overflow-hidden bg-slate-100 dark:bg-slate-950 slide-in-section"
      ref={sectionRef}
    
    >
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-900 z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900 z-10 pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-6">
        <SectionHeading
          title="Our Services"
          subtitle="Our mission is to drive progress and enhance the lives of our customers by delivering superior products and services that exceed expectations."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {servicesData.slice(0, 4).map((service, index) => ( // Displaying up to 4 services as per visual
            <div
              key={index}
              className="service-card-container transform transition-all duration-300 ease-in-out hover:-translate-y-1.5"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 h-full flex flex-col hover:shadow-xl">
                <div className="w-10 h-10 mb-5 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 dark:from-primary-500 dark:to-purple-500 text-white shadow-md">
                  {React.cloneElement(service.icon as React.ReactElement, { 
                    className: 'w-6 h-6 text-white',
                    strokeWidth: 2 
                  })}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow mb-4">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="group relative overflow-hidden px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transform hover:scale-105">
            <Link to="/services" className="group-hover:translate-x-0.5 transition-transform duration-300">
              View More Services
              <ArrowRight size={16} className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-3">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
    </section>
  );
};

export default ServicesSection;
