import React from 'react';
import { SectionHeading } from '@/components/section-heading';
import { Quote, Star } from 'lucide-react';

// Define and export the type for a single testimonial item
export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string; // Company name, can be part of the role string if preferred
  avatarUrl?: string; // Optional: URL for the author's avatar
  icon?: React.ReactNode; // For the quote icon, though we'll use <Quote /> directly
}

// Define the props for the TestimonialsSection component
interface TestimonialsSectionProps {
  testimonialsData: TestimonialItem[];
  sectionRef: (el: HTMLElement | null) => void;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonialsData, sectionRef }) => {
  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-white dark:bg-gray-950 relative overflow-hidden slide-in-section"
      ref={sectionRef}
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Optional: Rating badge as in the image */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="inline-flex items-center bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
            <Star size={16} className="mr-2 fill-current" />
            Rated 4/5 by over 1 Lakh users
          </div>
        </div>

        <div className="text-center mb-12 md:mb-16">
          <SectionHeading
            title="Words of praise from others about our presence."
            subtitle=""
          />
        </div>

        {/* 
          CSS for marquee animation (add to your global CSS file, e.g., index.css):
          @keyframes marquee-normal {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee-normal {
            animation: marquee-normal 40s linear infinite;
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0%); }
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 40s linear infinite;
          }
          .group:hover .animate-marquee-normal,
          .group:hover .animate-marquee-reverse {
            animation-play-state: paused;
          }
        */}
        <div className="relative group overflow-hidden">
          {/* Fade Left */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-gray-950 dark:via-gray-950/80 dark:to-transparent z-10 pointer-events-none" />
          
          {/* Row 1: Scrolls right-to-left (content moves left) */}
          <div className="flex animate-marquee-normal mb-6 md:mb-8">
            {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 w-80 sm:w-96 mx-3 sm:mx-4 p-6 bg-slate-50 dark:bg-slate-800/70 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 min-h-[6em]">{testimonial.quote}</p>
                <div className="flex items-center mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                  {testimonial.avatarUrl ? (
                    <img src={testimonial.avatarUrl} alt={testimonial.author} className="w-10 h-10 rounded-full mr-3 object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full mr-3 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">{testimonial.author.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{testimonial.author}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Scrolls left-to-right (content moves right) */}
          <div className="flex animate-marquee-reverse">
            {[...testimonialsData.slice(Math.ceil(testimonialsData.length / 2)), ...testimonialsData.slice(0, Math.ceil(testimonialsData.length / 2)), ...testimonialsData.slice(Math.ceil(testimonialsData.length / 2)), ...testimonialsData.slice(0, Math.ceil(testimonialsData.length / 2))].map((testimonial, index) => (
              <div key={`row2-${index}`} className="flex-shrink-0 w-80 sm:w-96 mx-3 sm:mx-4 p-6 bg-slate-50 dark:bg-slate-800/70 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 min-h-[6em]">{testimonial.quote}</p>
                <div className="flex items-center mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                  {testimonial.avatarUrl ? (
                    <img src={testimonial.avatarUrl} alt={testimonial.author} className="w-10 h-10 rounded-full mr-3 object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full mr-3 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">{testimonial.author.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{testimonial.author}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Fade Right */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 md:w-24 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-gray-950 dark:via-gray-950/80 dark:to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
