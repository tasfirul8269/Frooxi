import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code, LayoutGrid, Rocket, Star, MessagesSquare, ShieldCheck, Palette, MonitorSmartphone, Globe, Smartphone, Search, Shield, Brush, Camera, Users, Award, Clock, HeadphonesIcon, Mail, Phone, MapPin, Send, Package, Zap, GitMerge, Cloud, ChevronUp, Home, Briefcase, Image, MessageSquare, BarChart } from "lucide-react";
import { Layout } from "@/components/layout";
import { ServiceCard } from "@/components/service-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/components/testimonial-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParallaxWrapper } from "@/components/ParallaxWrapper";

const services = [
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

const products = [
  {
    title: "Frooxi CMS",
    description: "A powerful content management system designed for modern businesses.",
    features: ["Easy to use", "SEO optimized", "Mobile responsive", "Secure"],
    price: "$299/month",
    icon: <Package size={24} />,
    popular: true
  },
  {
    title: "Frooxi Analytics",
    description: "Advanced analytics platform to track and optimize your digital performance.",
    features: ["Real-time data", "Custom dashboards", "AI insights", "Export tools"],
    price: "$199/month",
    icon: <Zap size={24} />
  },
  {
    title: "Frooxi Security Suite",
    description: "Comprehensive security solution for websites and applications.",
    features: ["24/7 monitoring", "Threat detection", "Backup system", "SSL certificates"],
    price: "$399/month",
    icon: <Shield size={24} />
  }
];

const portfolioItems = [
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

const testimonials = [
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

const stats = [
  { value: "250+", label: "Projects Completed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15+", label: "Years Experience" },
  { value: "24/7", label: "Support" }
];

const teamMembers = [
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
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
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
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Ripple effect on click
  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
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

  // Intersection Observer for slide-in animations
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
      {/* Hero Section with Parallax and Ripple Effects */}
      <ParallaxWrapper id="home" className="min-h-screen flex items-center">
        <div 
          ref={heroRef}
          className="relative w-full h-full flex items-center pt-32 pb-24 md:pt-40 md:pb-32"
          onClick={createRipple}
        >
          {/* Parallax Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 parallax-bg" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2069&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'translateZ(0)'
            }}></div>
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
          </div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="hero-blur-orb hero-blur-orb-1"></div>
            <div className="hero-blur-orb hero-blur-orb-2"></div>
            <div className="hero-blur-orb hero-blur-orb-3"></div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="hero-content">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-glow">
                  <p className="text-sm font-medium flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
                    Innovative Digital Solutions
                  </p>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
                  Empowering Ideas with{" "}
                  <span className="hero-gradient-text">
                    Digital Solutions
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up-delay">
                  We specialize in designing and developing innovative websites and apps, offering
                  tailored solutions that deliver seamless user experiences and measurable results.
                  Innovative Digital Solutions
                </p>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
                Empowering Ideas with{" "}
                <span className="hero-gradient-text">
                  Digital Solutions
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up-delay">
                We specialize in designing and developing innovative websites and apps, offering
                tailored solutions that deliver seamless user experiences and measurable results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay-2">
                <Button 
                  size="lg" 
                  className="hero-cta-button group"
                  onClick={createRipple}
                >
                  <a href="#contact" className="flex items-center">
                    Get Started
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="hero-secondary-button group"
                >
                  <a href="#services" className="flex items-center">
                    Our Services
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="relative hero-image-container">
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80" 
                  alt="Frooxi digital solutions" 
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="hero-image-overlay"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="floating-badge floating-badge-1">
                <Star size={14} className="text-primary mr-1.5" />
                Premium Quality
              </div>
              <div className="floating-badge floating-badge-2">
                <Code size={14} className="text-primary mr-1.5" />
                Clean Code
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section with Parallax */}
      <ParallaxWrapper id="services" className="py-24 relative overflow-hidden">
        <div 
          ref={(el) => { if (el) sectionsRef.current[0] = el; }}
          className="slide-in-section"
        >
          <div className="container relative z-10">
          <SectionHeading 
            title="Our Services" 
            subtitle="We offer a comprehensive range of digital services to help your business thrive in the digital landscape."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <div 
                key={index}
                className="service-card-wrapper"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard 
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="view-more-button">
              <Link to="/services">
                View All Services
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
          </div>
          <div className="section-bg-pattern"></div>
        </div>
      </ParallaxWrapper>

      {/* Products Section */}
      <section 
        id="products" 
        className="py-24 bg-muted/20 dark:bg-muted/5 relative overflow-hidden slide-in-section"
        ref={(el) => { sectionsRef.current[1] = el; }}
      >
        <div className="container relative z-10">
          <SectionHeading 
            title="Our Products" 
            subtitle="Innovative software solutions designed to streamline your business operations and drive growth."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {products.map((product, index) => (
              <Card 
                key={index} 
                className="product-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {product.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Popular
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="mb-4 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center product-icon text-primary">
                    {product.icon}
                  </div>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="view-more-button">
              <Link to="/products">
                View All Products
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section 
        id="portfolio" 
        className="py-24 relative overflow-hidden slide-in-section"
        ref={(el) => { sectionsRef.current[2] = el; }}
      >
        <div className="container relative z-10">
          <SectionHeading 
            title="Our Portfolio" 
            subtitle="Showcasing our best work and the success stories of our clients across various industries."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {portfolioItems.map((item, index) => (
              <div 
                key={index} 
                className="portfolio-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="aspect-video overflow-hidden rounded-t-2xl">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover portfolio-image"
                  />
                </div>
                <div className="p-6 bg-background border border-border/40 rounded-b-2xl">
                  <Badge variant="secondary" className="bg-primary/10 text-primary mb-3">
                    {item.category}
                  </Badge>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="view-more-button">
              <Link to="/portfolio">
                View All Portfolio
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden stats-section">
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center stat-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-4xl md:text-5xl font-bold mb-2 stat-value">{stat.value}</p>
                <p className="text-lg opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company/Team Section */}
      <section 
        id="company" 
        className="pt-24 pb-8 relative overflow-hidden slide-in-section"
        ref={(el) => { sectionsRef.current[3] = el; }}
      >
        <div className="container relative z-10">
          <SectionHeading 
            title="Meet Our Team" 
            subtitle="Our talented team of designers, developers, and strategists work together to bring your vision to life."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-background rounded-2xl p-6 shadow-sm border border-border text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
          
          {/* Add View All Team Members button */}
          <div className="text-center mt-12">
            <Button asChild size="lg" className="view-more-button">
              <Link to="/company">
                View All Team Members
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-8 bg-muted/20 dark:bg-muted/5 slide-in-section">
        <div className="container">
          <SectionHeading 
            title="What Our Clients Say" 
            subtitle="Don't just take our word for it. Here's what our clients have to say about working with us."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className="py-24 relative overflow-hidden slide-in-section"
        ref={(el) => { sectionsRef.current[4] = el; }}
      >
        <div className="container relative z-10">
          <SectionHeading 
            title="Get In Touch" 
            subtitle="Ready to start your next project? Let's discuss how we can help bring your vision to life."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@frooxi.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (234) 567-890</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Office</p>
                    <p className="text-muted-foreground">123 Digital Street, Tech City, TC 12345</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <HeadphonesIcon size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Support</p>
                    <p className="text-muted-foreground">24/7 Customer Support</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name</label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <Input id="subject" placeholder="Project Inquiry" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <Textarea id="message" rows={5} placeholder="Tell us about your project..." />
                </div>
                <Button className="w-full rounded-full bg-gradient-to-r from-primary to-secondary">
                  Send Message
                  <Send size={16} className="ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <ParallaxWrapper id="services" className="py-24 relative overflow-hidden">
        <div 
          ref={(el) => { sectionsRef.current[0] = el; }}
          className="slide-in-section"
        >
          <div className="container relative z-10">
            <SectionHeading 
              title="Get In Touch" 
              subtitle="Ready to start your next project? Let's discuss how we can help bring your vision to life."
            />
            
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Digital Presence?</h2>
              <p className="text-xl opacity-90 mb-8">
                Let's collaborate to bring your vision to life with innovative technology solutions that drive results.
              </p>
              <Button size="lg" variant="secondary" className="rounded-full">
                <a href="#contact">Get Started Today</a>
              </Button>
            </div>
          </div>
        </div>
      </ParallaxWrapper>
    </Layout>
  );
};
export default Index;