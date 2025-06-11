import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import api from '@/services/api';

interface Portfolio {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link: string;
  createdAt: string;
}

const AdminPortfolioList = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/portfolio');
      // Ensure we're getting an array of portfolios
      const data = Array.isArray(response.data) ? response.data : [];
      setPortfolios(data);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError('Failed to fetch portfolios. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to fetch portfolios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      await api.delete(`/portfolio/${id}`);
      toast({
        title: 'Success',
        description: 'Portfolio item deleted successfully',
      });
      fetchPortfolios(); // Refresh the list
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete portfolio item',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchPortfolios}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <Button onClick={() => navigate('/admin/portfolios/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Portfolio
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No portfolio items found</p>
            <Button onClick={() => navigate('/admin/portfolios/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio._id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={portfolio.image}
                  alt={portfolio.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{portfolio.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {portfolio.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {portfolio.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin/portfolios/${portfolio._id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin/portfolios/edit/${portfolio._id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(portfolio._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPortfolioList;