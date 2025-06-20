
import React from "react";
import { Layout } from "@/components/layout";
import { SectionHeading } from "@/components/section-heading";
import { Code, LayoutGrid, Rocket, Star, ShieldCheck, Palette, Smartphone, Globe, Database, LineChart, MessageSquare } from "lucide-react";
import { ServiceCard } from "@/components/service-card";

const allServices = [
  {
    title: "WordPress Development",
    description: "Custom WordPress websites built for performance, scalability, and ease of management.",
    icon: <Globe size={24} />,
    category: "web"
  },
  {
    title: "Shopify Development",
    description: "E-commerce solutions that drive sales and provide seamless shopping experiences.",
    icon: <Database size={24} />,
    category: "web"
  },
  {
    title: "Custom Web Development",
    description: "Bespoke web applications tailored to your specific business requirements and workflows.",
    icon: <Code size={24} />,
    category: "web"
  },
  {
    title: "iOS App Development",
    description: "Native iOS applications that provide exceptional user experiences on Apple devices.",
    icon: <Smartphone size={24} />,
    category: "app"
  },
  {
    title: "Android App Development",
    description: "Powerful Android applications optimized for performance and user engagement.",
    icon: <Smartphone size={24} />,
    category: "app"
  },
  {
    title: "React Native Development",
    description: "Cross-platform mobile applications that work seamlessly across iOS and Android.",
    icon: <LayoutGrid size={24} />,
    category: "app"
  },
  {
    title: "Flutter Development",
    description: "Beautiful, natively compiled applications from a single codebase for mobile, web, and desktop.",
    icon: <Rocket size={24} />,
    category: "app"
  },
  {
    title: "Technical SEO",
    description: "Website optimization to improve search engine visibility and organic traffic.",
    icon: <Star size={24} />,
    category: "seo"
  },
  {
    title: "Content Strategy",
    description: "Strategic content planning to attract, engage, and convert your target audience.",
    icon: <MessageSquare size={24} />,
    category: "seo"
  },
  {
    title: "Analytics & Reporting",
    description: "Comprehensive data analysis to track performance and inform marketing decisions.",
    icon: <LineChart size={24} />,
    category: "seo"
  },
  {
    title: "Cyber Security Audits",
    description: "Thorough assessment of your digital assets to identify and mitigate security vulnerabilities.",
    icon: <ShieldCheck size={24} />,
    category: "security"
  },
  {
    title: "UI/UX Design",
    description: "User-centered design that creates intuitive, engaging digital experiences.",
    icon: <Palette size={24} />,
    category: "design"
  }
];

const Services = () => {
  const [activeCategory, setActiveCategory] = React.useState("all");
  
  const categories = [
    { id: "all", name: "All Services" },
    { id: "web", name: "Web Development" },
    { id: "app", name: "App Development" },
    { id: "seo", name: "SEO" },
    { id: "security", name: "Cyber Security" },
    { id: "design", name: "Design" },
  ];
  
  const filteredServices = activeCategory === "all" 
    ? allServices 
    : allServices.filter(service => service.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-background overflow-hidden">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive digital solutions to help your business thrive in the digital landscape.
            </p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none grid-background"></div>
      </section>
      
      {/* Services Section */}
      <section className="py-16">
        <div className="container">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard 
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-24 bg-muted/20 dark:bg-muted/5">
        <div className="container">
          <SectionHeading 
            title="Our Development Process" 
            subtitle="We follow a structured approach to ensure the success of every project we undertake."
          />
          
          <div className="relative">
            {/* Process Timeline */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-0">
              {/* Step 1 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:text-right md:pr-12 relative">
                  <div className="hidden md:block absolute right-0 top-6 w-12 h-1 bg-primary"></div>
                  <div className="hidden md:block absolute right-0 -translate-x-1/2 top-3 w-8 h-8 rounded-full border-4 border-primary bg-background"></div>
                  <h3 className="text-2xl font-bold mb-4">1. Discovery</h3>
                  <p className="text-muted-foreground">
                    We begin by understanding your business objectives, target audience, and project requirements through in-depth consultation sessions.
                  </p>
                </div>
                <div className="mt-6 md:mt-0 md:pl-12">
                  <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Initial consultation and requirement gathering</li>
                      <li>Business objectives analysis</li>
                      <li>Target audience research</li>
                      <li>Competitive landscape analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:order-last md:text-left md:pl-12 relative">
                  <div className="hidden md:block absolute left-0 top-6 w-12 h-1 bg-primary"></div>
                  <div className="hidden md:block absolute left-0 -translate-x-1/2 top-3 w-8 h-8 rounded-full border-4 border-primary bg-background"></div>
                  <h3 className="text-2xl font-bold mb-4">2. Design</h3>
                  <p className="text-muted-foreground">
                    Our design team creates intuitive, user-friendly interfaces that align with your brand identity and project goals.
                  </p>
                </div>
                <div className="mt-6 md:mt-0 md:pr-12 md:text-right">
                  <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground md:list-inside">
                      <li>Wireframing and prototyping</li>
                      <li>User experience (UX) design</li>
                      <li>User interface (UI) design</li>
                      <li>Brand integration and visual identity</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:text-right md:pr-12 relative">
                  <div className="hidden md:block absolute right-0 top-6 w-12 h-1 bg-primary"></div>
                  <div className="hidden md:block absolute right-0 -translate-x-1/2 top-3 w-8 h-8 rounded-full border-4 border-primary bg-background"></div>
                  <h3 className="text-2xl font-bold mb-4">3. Development</h3>
                  <p className="text-muted-foreground">
                    Our developers bring the designs to life using modern technologies and best practices to ensure performance and reliability.
                  </p>
                </div>
                <div className="mt-6 md:mt-0 md:pl-12">
                  <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Frontend development</li>
                      <li>Backend systems implementation</li>
                      <li>Database architecture</li>
                      <li>API integrations</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:order-last md:text-left md:pl-12 relative">
                  <div className="hidden md:block absolute left-0 top-6 w-12 h-1 bg-primary"></div>
                  <div className="hidden md:block absolute left-0 -translate-x-1/2 top-3 w-8 h-8 rounded-full border-4 border-primary bg-background"></div>
                  <h3 className="text-2xl font-bold mb-4">4. Testing</h3>
                  <p className="text-muted-foreground">
                    We rigorously test all aspects of your digital product to ensure quality, performance, and user satisfaction.
                  </p>
                </div>
                <div className="mt-6 md:mt-0 md:pr-12 md:text-right">
                  <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground md:list-inside">
                      <li>Quality assurance testing</li>
                      <li>Performance optimization</li>
                      <li>Cross-browser/device compatibility testing</li>
                      <li>Security vulnerability assessment</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Step 5 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:text-right md:pr-12 relative">
                  <div className="hidden md:block absolute right-0 top-6 w-12 h-1 bg-primary"></div>
                  <div className="hidden md:block absolute right-0 -translate-x-1/2 top-3 w-8 h-8 rounded-full border-4 border-primary bg-background"></div>
                  <h3 className="text-2xl font-bold mb-4">5. Deployment & Support</h3>
                  <p className="text-muted-foreground">
                    We handle the launch of your project and provide ongoing support to ensure continued success.
                  </p>
                </div>
                <div className="mt-6 md:mt-0 md:pl-12">
                  <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Smooth deployment process</li>
                      <li>Knowledge transfer and training</li>
                      <li>Post-launch support</li>
                      <li>Ongoing maintenance and updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Technologies Section */}
      <section className="py-24">
        <div className="container">
          <SectionHeading 
            title="Technologies We Use" 
            subtitle="We leverage the latest technologies to build modern, scalable, and high-performing digital solutions."
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              "React", "Angular", "Vue.js", "Node.js", "PHP", "Laravel",
              "WordPress", "Shopify", "React Native", "Flutter", "Swift", "Kotlin",
              "Python", "Django", "Express", "MongoDB", "MySQL", "PostgreSQL"
            ].map((tech, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center py-6 px-4 bg-background rounded-lg shadow-sm border border-border text-center"
              >
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      

    </Layout>
  );
};

export default Services;
