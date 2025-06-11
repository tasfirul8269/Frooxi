import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ sectionRef }) => {
  return (
    <section
      id="cta"
      className="py-20 md:py-28 bg-gradient-to-r from-blue-600 to-purple-700 text-white slide-in-section"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Next Project?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Let's collaborate to build something amazing. Contact us today for a free consultation and let's turn your vision into reality.
        </p>
        <Button asChild size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 border-transparent group relative overflow-hidden px-10 py-4 rounded-full transition-all duration-300 hover:shadow-2xl">
          <Link to="/contact">
            Get a Free Quote
            <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
