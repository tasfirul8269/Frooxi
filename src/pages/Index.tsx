import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code, LayoutGrid, Star, MessagesSquare, ShieldCheck, Palette, MonitorSmartphone, Globe, Smartphone, Search, Shield, Brush, Camera, Users, Award, Clock, HeadphonesIcon, Mail, Phone, MapPin, Send, Package, Zap, GitMerge, Cloud, ChevronUp, Home, Briefcase, Image, MessageSquare, BarChart, Play, CheckCircle } from "lucide-react";
import { TypeAnimation } from 'react-type-animation';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layout } from "../components/layout";

gsap.registerPlugin(ScrollTrigger);
import { ServiceCard } from "@/components/service-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from '@/components/ui/button';
import { TestimonialCard } from "@/components/testimonial-card";
import ServicesSection, { ServiceItem } from "@/components/ServicesSection"; 
import PortfolioSection, { PortfolioItemType } from "@/components/PortfolioSection"; 
import SubscriptionSection from "../components/SubscriptionSection";
import StatsSection, { StatItem } from "@/components/StatsSection"; 
import TeamSection, { TeamMemberItem } from "@/components/TeamSection"; 
import TestimonialsSection, { TestimonialItem } from "@/components/TestimonialsSection"; 
import ContactSection from "@/components/ContactSection"; 
import CtaSection from "@/components/CtaSection"; 
import ConsultationModal from "../components/ConsultationModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services: ServiceItem[] = [
  {
    title: "Website Development",
    description: "Custom coded websites, WordPress, Shopify, and other CMS solutions tailored to your business needs.",
    icon: <Code size={24} />,
  },
  {
    title: "Native App Development",
    description: "Powerful, performance-focused native mobile applications for iOS and Android platforms.",
    icon: <MonitorSmartphone size={24} />,
  },
  {
    title: "Hybrid App Development",
    description: "Cross-platform applications that work seamlessly across multiple devices and operating systems.",
    icon: <LayoutGrid size={24} />,
  },
  {
    title: "Search Engine Optimization",
    description: "Strategic SEO services that improve visibility and drive organic traffic to your digital platforms.",
    icon: <Search size={24} />,
  },
  {
    title: "Cyber Security",
    description: "Comprehensive security solutions to protect your digital assets and user data.",
    icon: <ShieldCheck size={24} />,
  },
  {
    title: "UI/UX Design",
    description: "User-centered design that creates intuitive, engaging experiences that convert visitors into customers.",
    icon: <Palette size={24} />,
  },
];

const portfolioItems: PortfolioItemType[] = [
  {
    title: "E-commerce Platform",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    description: "Modern e-commerce platform with advanced features"
  },
  {
    title: "Mobile Banking App",
    category: "Mobile Development",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    description: "Secure and user-friendly banking application"
  },
  {
    title: "Healthcare Dashboard",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80",
    description: "Intuitive dashboard for healthcare professionals"
  },
  {
    title: "Restaurant Chain Website",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    description: "Multi-location restaurant management system"
  }
];

const testimonials: TestimonialItem[] = [
  {
    quote: "Frooxi transformed our outdated website into a modern, responsive platform that has significantly increased our conversion rates.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechSolve Inc."
  },
  {
    quote: "The mobile app developed by Frooxi exceeded our expectations. Their attention to detail and commitment to quality is unmatched.",
    author: "Michael Chen",
    role: "Product Manager",
    company: "Infinite Solutions"
  },
  {
    quote: "Their SEO strategies helped us climb to the first page of search results within months. We've seen a 200% increase in organic traffic.",
    author: "Amanda Rodriguez",
    role: "CEO",
    company: "Growth Dynamics"
  }
];

const stats: StatItem[] = [
  { value: "250+", label: "Projects Completed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15+", label: "Years Experience" },
  { value: "24/7", label: "Support" }
];

const teamMembers: TeamMemberItem[] = [
  {
    name: "Alex Thompson",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bio: "15+ years of experience in software development and business strategy."
  },
  {
    name: "Sarah Williams",
    role: "Lead Designer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
    bio: "Award-winning designer with expertise in UI/UX and brand identity."
  },
  {
    name: "Mike Johnson",
    role: "Technical Director",
    image: "https://images.unsplash.com/photo-1507003211169-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80",
    bio: "Full-stack developer specializing in scalable web applications."
  },
  {
    name: "Emily Davis",
    role: "Project Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    bio: "Expert in agile methodologies and client relationship management."
  }
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null); // Keep for other potential uses or remove if only for parallax
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  };

  const terminalRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Parallax effects removed.
    // The main useEffect hook now only handles the typing timer cleanup
    // and killing all ScrollTriggers on unmount.

    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
      // Ensure any remaining ScrollTriggers (e.g. from slide-in sections) are killed on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); 
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !terminalRef.current) return;

    const codeLines = [
      'const company = {',
      '  name: "Frooxi",',
      '  type: "Digital Agency",',
      '  services: ["Web Dev", "Mobile Apps", "UI/UX"],',
      '  motto: "Building Digital Excellence"',
      '};',
      '',
      'console.log(`Welcome to ${company.name}!`);',
      '// Let\'s create something amazing together!',
      ''
    ];

    const terminal = terminalRef.current;
    let lineIndex = 0;
    let charIndex = 0;
    let isTyping = true;

    const renderLine = (line: string) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'code-line';
      
      if (line.trim().startsWith('//')) {
        lineEl.innerHTML = `<span class="text-gray-500">${line}</span>`;
      } 
      else if (line.includes('"')) {
        lineEl.innerHTML = line
          .replace(/(['"])(?:(?=(\\?))\\2.)*?\1/g, 
            match => `<span class="text-yellow-300">${match}</span>`);
      }
      else {
        lineEl.innerHTML = line
          .replace(/\b(const|let|var|function|if|else|return|for|while|console|log)\b/g, 
            match => `<span class="text-purple-400">${match}</span>`)
          .replace(/\b(true|false|null|undefined)\b/g, 
            match => `<span class="text-blue-400">${match}</span>`);
      }
      
      return lineEl;
    };

    const typeCode = () => {
      if (!isTyping || !terminal) return;
      
      if (lineIndex < codeLines.length) {
        const currentLine = codeLines[lineIndex];
        
        if (currentLine === '') {
          const lineEl = document.createElement('div');
          lineEl.className = 'h-5';
          terminal.appendChild(lineEl);
          lineIndex++;
          typingTimer.current = setTimeout(typeCode, 100);
          return;
        }
        
        const lines = terminal.querySelectorAll('.code-line');
        let currentLineEl = lines[lineIndex] as HTMLElement;
        
        if (!currentLineEl) {
          currentLineEl = renderLine('');
          terminal.appendChild(currentLineEl);
        }
        
        if (charIndex < currentLine.length) {
          const nextChar = currentLine[charIndex];
          currentLineEl.textContent = currentLine.substring(0, charIndex + 1);
          charIndex++;
          
          const highlighted = renderLine(currentLine.substring(0, charIndex));
          currentLineEl.innerHTML = highlighted.innerHTML;
          
          const speed = nextChar.match(/[,.\-;{}()\[\]]/) ? 150 : Math.random() * 30 + 30;
          typingTimer.current = setTimeout(typeCode, speed);
        } else {
          lineIndex++;
          charIndex = 0;
          typingTimer.current = setTimeout(typeCode, 200); 
        }
      } else {
        const prompt = document.createElement('div');
        prompt.className = 'flex items-center mt-4';
        prompt.innerHTML = `
          <span class="text-green-400 font-mono font-medium">frooxi@dev</span>
          <span class="text-gray-400 mx-1">:</span>
          <span class="text-blue-400 font-mono font-medium">~</span>
          <span class="text-gray-400">$</span>
          <span class="ml-1 h-4 w-2 bg-green-400 inline-block animate-pulse"></span>
        `;
        terminal.appendChild(prompt);
        
        isTyping = false;
      }
    };

    terminal.innerHTML = '';
    typingTimer.current = setTimeout(typeCode, 1000);

    return () => {
      isTyping = false;
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
    };
  }, [isMounted]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('slide-in-active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);



  return (
    <Layout>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-800"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  Welcome to Frooxi - We're live!
                </div>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Star size={14} className="mr-1.5" />
                  Premium Quality
                </div>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Code size={14} className="mr-1.5" />
                  Clean Code
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Building{' '}
                <span className="hero-gradient-text">
                  Digital
                </span>{' '}
                Excellence
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We transform your ideas into powerful digital solutions. From custom websites to mobile apps, 
                we deliver cutting-edge technology that drives your business forward.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative">
                <button 
                  onClick={() => { setIsModalOpen(true); }}
                  className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
                >
                  Get Free Consultation
                  <ArrowRight className="inline ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {/* Modal is now rendered at the root of the page for proper fixed overlay */}
                <button 
                  onClick={createRipple} 
                  className="group flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 relative overflow-hidden"
                >
                  <Search className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Get Free Audit
                </button>
              </div>
            </div>

            {/* Right Column - Terminal */}
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 border border-gray-800">
                {/* Terminal Header */}
                <div className="flex items-center px-4 py-3 bg-gray-800/90 border-b border-gray-700">
                  <div className="flex space-x-2 mr-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-gray-300 text-xs font-mono font-medium">frooxi@terminal</span>
                  </div>
                </div>
                
                {/* Terminal Content */}
                <div className="bg-gray-900/80 p-4 h-full min-h-[300px] overflow-auto">
                  <div ref={terminalRef} className="font-mono text-sm text-gray-300 leading-relaxed space-y-1">
                    {/* Content will be added by the typing animation */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce w-8 h-14 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection 
        servicesData={services}
        sectionRef={(el) => { if (sectionsRef.current) sectionsRef.current[1] = el; }} // Adjusted index
      />

      {/* Placeholder for Pricing Section - to be implemented */}
      {/* <PricingSection 

      {/* Portfolio Section */}
      <PortfolioSection 
        portfolioItemsData={portfolioItems} 
        sectionRef={(el) => { if (sectionsRef.current) sectionsRef.current[1] = el; }} 
      />
      <SubscriptionSection 
        sectionRef={(el) => { if (sectionsRef.current) sectionsRef.current[2] = el; }} 
      />

      {/* Stats Section */}
      <StatsSection 
        statsData={stats}
        sectionRef={(el) => { if (sectionsRef.current) sectionsRef.current[3] = el; }}
      />

      {/* Team Section */}
      <TeamSection 
        teamMembersData={teamMembers}
        sectionRef={(el) => { if (sectionsRef.current) sectionsRef.current[4] = el; }}
      />

      {/* Testimonials Section */}
      <TestimonialsSection 
        testimonialsData={testimonials}
        sectionRef={(el) => { if (sectionsRef.current) sectionsRef.current[5] = el; }}
      />

      {/* Contact Section */}
      <ContactSection 
        sectionRef={(el) => { if (sectionsRef.current) sectionsRef.current[6] = el; }}
      />

      {/* Call to Action Section */}
      <CtaSection 
        sectionRef={(el) => { if (sectionsRef.current) sectionsRef.current[7] = el; }}
      />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
};
export default Index;