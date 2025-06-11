
import React from "react";
import { Layout } from "@/components/layout";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const portfolioItems = [
  {
    title: "E-commerce Platform",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    description: "Modern e-commerce platform with advanced features including real-time inventory, payment processing, and customer analytics.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    year: "2024"
  },
  {
    title: "Mobile Banking App",
    category: "Mobile Development",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    description: "Secure and user-friendly banking application with biometric authentication and real-time transaction monitoring.",
    technologies: ["React Native", "Firebase", "TypeScript", "Redux"],
    year: "2024"
  },
  {
    title: "Healthcare Dashboard",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80",
    description: "Intuitive dashboard for healthcare professionals with patient management and data visualization.",
    technologies: ["Figma", "React", "D3.js", "PostgreSQL"],
    year: "2023"
  },
  {
    title: "Restaurant Chain Website",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    description: "Multi-location restaurant management system with online ordering and reservation capabilities.",
    technologies: ["Vue.js", "Laravel", "MySQL", "PayPal"],
    year: "2023"
  },
  {
    title: "Fitness Tracking App",
    category: "Mobile Development",
    image: "https://images.unsplash.com/photo-1571019613914-85e2c8a0d026?auto=format&fit=crop&w=800&q=80",
    description: "Comprehensive fitness tracking application with workout plans and progress monitoring.",
    technologies: ["Flutter", "Dart", "Firebase", "HealthKit"],
    year: "2024"
  },
  {
    title: "Corporate Website Redesign",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: "Complete redesign of corporate website with improved user experience and modern design principles.",
    technologies: ["Adobe XD", "React", "Tailwind CSS", "Framer Motion"],
    year: "2023"
  }
];

const Portfolio = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="container">
          <SectionHeading 
            title="Our Portfolio" 
            subtitle="Explore our complete collection of successful projects across various industries and technologies."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="group overflow-hidden border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {item.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{item.year}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
