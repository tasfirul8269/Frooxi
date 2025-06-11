import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getToken } from '../../../lib/auth';

interface SubscriptionPlan {
  _id?: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

const AdminSubscriptionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SubscriptionPlan>({
    name: '',
    price: 0,
    duration: '',
    features: [],
  });
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchSubscription = async () => {
        setLoading(true);
        try {
          const token = getToken();
          if (!token) {
            setError('Authentication token not found. Please log in.');
            setLoading(false);
            return;
          }

          const response = await fetch(`/api/subscriptions/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFormData(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSubscription();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureAdd = () => {
    if (featureInput.trim() !== '') {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const handleFeatureRemove = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const url = id ? `/api/subscriptions/${id}` : '/api/subscriptions';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      navigate('/admin/subscriptions');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <AdminLayout><div>Loading subscription...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">{id ? 'Edit Subscription' : 'Add New Subscription'}</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">Duration:</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="features" className="block text-gray-700 text-sm font-bold mb-2">Features:</label>
          <div className="flex">
            <input
              type="text"
              id="featureInput"
              name="featureInput"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              placeholder="Add a feature"
            />
            <button
              type="button"
              onClick={handleFeatureAdd}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
          <div className="mt-2">
            {formData.features.map((feature, index) => (
              <span key={index} className="inline-block bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                {feature}
                <button
                  type="button"
                  onClick={() => handleFeatureRemove(index)}
                  className="ml-2 text-blue-800 hover:text-blue-900 font-bold"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Saving...' : (id ? 'Update Subscription' : 'Add Subscription')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/subscriptions')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSubscriptionForm;