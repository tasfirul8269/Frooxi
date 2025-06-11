import React from 'react';
import { SectionHeading } from '@/components/section-heading';

// Define and export the type for a single stat item
export interface StatItem {
  value: string;
  label: string;
}

// Define the props for the StatsSection component
interface StatsSectionProps {
  statsData: StatItem[];
  sectionRef: (el: HTMLElement | null) => void;
}

const StatsSection: React.FC<StatsSectionProps> = ({ statsData, sectionRef }) => {
  return (
    <section
      id="stats"
      className="py-20 md:py-28 bg-gray-50 dark:bg-gray-950 relative overflow-hidden slide-in-section"
      ref={sectionRef}
    >
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-3">
        <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <div className="container relative z-10 mx-auto px-6">
        <SectionHeading
          title="Our Achievements in Numbers"
          subtitle="We are proud of what we have accomplished. Our stats speak for themselves."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="stat-item p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border dark:border-gray-800/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-400 mb-2">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
