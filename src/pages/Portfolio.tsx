import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { portfolioAPI } from "@/services/api";
import { Loader2 } from "lucide-react";

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  technologies?: string[];
  tags?: string[];
  year?: string;
  link?: string;
  isActive?: boolean;
}

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        const data = await portfolioAPI.getAll();
        // Filter active items and map to match the expected format
        const activeItems = data
          .filter((item: any) => item.isActive !== false)
          .map((item: any) => ({
            _id: item._id,
            title: item.title,
            category: item.category || 'Project',
            image: item.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            description: item.description || 'Check out this project',
            technologies: item.technologies || item.tags || [],
            year: item.year || new Date().getFullYear().toString(),
            link: item.link
          }));
        setPortfolioItems(activeItems);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') console.error('Error fetching portfolio items:', err);
        setError('Failed to load portfolio items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
            <p className="text-lg">Loading portfolio...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Portfolio</h2>
            <p className="text-red-500 dark:text-red-300">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="container">
          <SectionHeading 
            title="Our Portfolio" 
            subtitle="Explore our complete collection of successful projects across various industries and technologies."
          />
          
          {portfolioItems.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No portfolio items found</h3>
              <p className="mt-2 text-gray-400 dark:text-gray-500">Check back later for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item) => (
                <Card 
                  key={item._id} 
                  className={`group overflow-hidden border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${
                    item.link ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => item.link && window.open(item.link, '_blank', 'noopener,noreferrer')}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                      }}
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
                      {item.technologies?.slice(0, 4).map((tech, techIndex) => (
                        <Badge key={`${item._id}-${techIndex}`} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {item.technologies && item.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.technologies.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
