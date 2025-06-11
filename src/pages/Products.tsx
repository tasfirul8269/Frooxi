
import React from "react";
import { Layout } from "@/components/layout";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Shield, Cloud, Zap, GitMerge, Code } from "lucide-react";
import { Link } from "react-router-dom";

const productCategories = [
  {
    title: "Website Solutions",
    description: "Professional website solutions for businesses of all sizes.",
    products: [
      {
        name: "Business Website",
        description: "Professional websites for businesses with modern design and responsive layouts.",
        features: ["Responsive design", "SEO optimized", "Contact forms", "Analytics integration"],
        icon: <Package className="h-8 w-8 text-primary" />,
        popular: true
      },
      {
        name: "E-commerce Platform",
        description: "Complete online store solution with payment processing and inventory management.",
        features: ["Product management", "Secure checkout", "Order tracking", "Customer accounts"],
        icon: <Shield className="h-8 w-8 text-primary" />
      },
      {
        name: "Custom Web Application",
        description: "Tailor-made web applications to meet specific business needs and workflows.",
        features: ["Custom functionality", "User authentication", "Data visualization", "API integration"],
        icon: <Code className="h-8 w-8 text-primary" />
      }
    ]
  },
  {
    title: "Mobile Solutions",
    description: "High-performance mobile applications for iOS and Android.",
    products: [
      {
        name: "Native Mobile App",
        description: "Platform-specific apps with optimal performance and deep OS integration.",
        features: ["iOS & Android", "Push notifications", "Offline support", "App store deployment"],
        icon: <Zap className="h-8 w-8 text-primary" />,
        popular: true
      },
      {
        name: "Hybrid Mobile App",
        description: "Cross-platform applications that run on multiple devices from a single codebase.",
        features: ["Cross-platform", "Faster development", "Single codebase", "Web technologies"],
        icon: <GitMerge className="h-8 w-8 text-primary" />
      },
      {
        name: "Progressive Web App",
        description: "Web apps that offer a native-like experience with offline capabilities.",
        features: ["Works offline", "Fast loading", "Home screen install", "Native-like UX"],
        icon: <Cloud className="h-8 w-8 text-primary" />
      }
    ]
  }
];

const Products = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="container">
          <SectionHeading 
            title="Our Products" 
            subtitle="Explore our range of digital products designed to elevate your business presence and operational efficiency."
          />
          
          {productCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-24">
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.products.map((product, productIndex) => (
                  <Card key={productIndex} className="group overflow-hidden border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                    {product.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          Popular
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <div className="mb-4 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {product.icon}
                      </div>
                      <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary">{product.name}</CardTitle>
                      <CardDescription className="text-muted-foreground mt-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full group-hover:bg-primary/5">
                        <Link to="/contact" className="flex items-center justify-between">
                          Learn More
                          <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground mb-8">
              Need a custom solution tailored to your specific requirements?
            </p>
            <Button asChild size="lg" className="rounded-full px-8 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
