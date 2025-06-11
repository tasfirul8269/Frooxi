
import React from "react";
import { Layout } from "@/components/layout";
import { SectionHeading } from "@/components/section-heading";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Company = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-background overflow-hidden">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Frooxi</h1>
            <p className="text-xl text-muted-foreground">
              We're a passionate team of digital innovators committed to helping businesses thrive in the digital world.
            </p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none grid-background"></div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                title="Our Story" 
                subtitle="From humble beginnings to a leading digital solutions provider."
                alignment="left"
              />
              <p className="text-muted-foreground mb-6">
                Founded in 2010, Frooxi began with a simple mission: to help businesses leverage technology to achieve their goals. What started as a small web development shop has grown into a comprehensive digital solutions provider serving clients across the globe.
              </p>
              <p className="text-muted-foreground mb-6">
                Our journey has been defined by continuous learning, adaptation to emerging technologies, and an unwavering commitment to delivering exceptional results for our clients. Through the years, we've evolved our services to meet the changing needs of businesses in an increasingly digital world.
              </p>
              <p className="text-muted-foreground">
                Today, Frooxi is proud to be a trusted partner for businesses of all sizes, from startups to enterprise organizations, helping them navigate the complexities of the digital landscape and achieve sustainable growth.
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-secondary to-primary p-1 rounded-2xl">
                <div className="bg-background rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80" 
                    alt="Frooxi team brainstorming" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="absolute -z-10 bottom-4 -right-4 w-full h-full bg-primary/20 rounded-2xl blur-lg"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision Section */}
      <section className="py-24 bg-muted/20 dark:bg-muted/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-background p-8 rounded-xl shadow-sm border border-border">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </span>
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To empower businesses with innovative digital solutions that drive growth, enhance user experiences, and deliver measurable results. We strive to be a trusted partner in our clients' success by providing expertise, creativity, and exceptional service.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-xl shadow-sm border border-border">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </span>
                Our Vision
              </h3>
              <p className="text-muted-foreground">
                To be a global leader in digital innovation, recognized for our commitment to excellence, ethical practices, and forward-thinking approach. We envision a future where every business, regardless of size, can harness the power of technology to reach its full potential.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-24">
        <div className="container">
          <SectionHeading 
            title="Our Values" 
            subtitle="The core principles that guide everything we do at Frooxi."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in every aspect of our work, from code quality to design aesthetics and client communication.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"></path>
                  <line x1="16" y1="8" x2="2" y2="22"></line>
                  <line x1="17.5" y1="15" x2="9" y2="15"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We embrace creativity and forward-thinking approaches to solve complex problems and create cutting-edge solutions.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-muted-foreground">
                We believe in the power of teamwork, both internally and with our clients, to achieve the best possible outcomes.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-muted-foreground">
                We conduct our business with honesty, transparency, and ethical practices, building trust with every interaction.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Client Focus</h3>
              <p className="text-muted-foreground">
                We put our clients' needs at the center of everything we do, ensuring solutions that address their unique challenges.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Continuous Learning</h3>
              <p className="text-muted-foreground">
                We invest in ongoing education and skill development to stay at the forefront of technology trends and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-24 bg-muted/20 dark:bg-muted/5">
        <div className="container">
          <SectionHeading 
            title="Our Leadership Team" 
            subtitle="Meet the passionate experts driving innovation and excellence at Frooxi."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
              <div className="h-64">
                <img 
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">Sarah Johnson</h3>
                <p className="text-primary mb-4">CEO & Founder</p>
                <p className="text-muted-foreground text-sm mb-4">
                  With 15+ years in tech leadership, Sarah drives Frooxi's vision and strategic direction.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
              <div className="h-64">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">Michael Chen</h3>
                <p className="text-primary mb-4">CTO</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Michael leads our technical team, ensuring cutting-edge solutions and technological excellence.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
              <div className="h-64">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">Emily Rodriguez</h3>
                <p className="text-primary mb-4">Design Director</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Emily oversees our creative team, ensuring visually stunning and user-friendly designs.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
              <div className="h-64">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">David Wilson</h3>
                <p className="text-primary mb-4">Client Success Manager</p>
                <p className="text-muted-foreground text-sm mb-4">
                  David ensures our clients receive exceptional service and achieve their business objectives.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/company/team">Meet Our Full Team</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                title="Why Choose Frooxi" 
                subtitle="What sets us apart from other digital solutions providers."
                alignment="left"
              />
              
              <div className="space-y-6">
                <div className="flex">
                  <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Expertise Across Technologies</h3>
                    <p className="text-muted-foreground">
                      Our team brings diverse skills across multiple technologies and platforms, ensuring the right solution for your specific needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Results-Driven Approach</h3>
                    <p className="text-muted-foreground">
                      We focus on delivering measurable outcomes that contribute to your business goals, not just beautiful designs or elegant code.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Transparent Communication</h3>
                    <p className="text-muted-foreground">
                      We maintain clear, consistent communication throughout your project, ensuring you're always informed and involved.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Long-Term Partnership</h3>
                    <p className="text-muted-foreground">
                      We don't just deliver a project and disappear. We build lasting relationships, providing ongoing support and strategic guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="h-40 bg-background rounded-xl shadow-sm border border-border p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-4xl font-bold text-primary mb-2">15+</p>
                  <p className="text-muted-foreground">Years of Experience</p>
                </div>
                <div className="h-40 bg-background rounded-xl shadow-sm border border-border p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-4xl font-bold text-primary mb-2">50+</p>
                  <p className="text-muted-foreground">Expert Team Members</p>
                </div>
              </div>
              <div className="space-y-6 mt-12">
                <div className="h-40 bg-background rounded-xl shadow-sm border border-border p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-4xl font-bold text-primary mb-2">250+</p>
                  <p className="text-muted-foreground">Successful Projects</p>
                </div>
                <div className="h-40 bg-background rounded-xl shadow-sm border border-border p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-4xl font-bold text-primary mb-2">98%</p>
                  <p className="text-muted-foreground">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-xl opacity-90 mb-8">
              Let's discuss how Frooxi can help you achieve your digital objectives and drive your business forward.
            </p>
            <Button asChild size="lg" variant="outline" className="bg-background text-foreground hover:bg-background/90 rounded-full">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Company;
