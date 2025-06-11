import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '@/services/api';

interface Subscription {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

const AdminSubscriptionList: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/subscriptions');
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Data type:', typeof response.data);
      console.log('Is Array?', Array.isArray(response.data));
      
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Processed data:', data);
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch subscriptions',
        variant: 'destructive',
      });
      setSubscriptions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) {
      return;
    }

    try {
      await api.delete(`/subscriptions/${id}`);
      toast({
        title: 'Success',
        description: 'Subscription plan deleted successfully',
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete subscription plan',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <Button onClick={() => navigate('/admin/subscriptions/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No subscription plans found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{subscription.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/subscriptions/edit/${subscription._id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(subscription._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{subscription.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">${subscription.price}</span>
                    <span className="text-sm text-gray-500">{subscription.duration} days</span>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Features:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {subscription.features.map((feature, index) => (
                        <li key={index} className="text-sm">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        subscription.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {subscription.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionList;