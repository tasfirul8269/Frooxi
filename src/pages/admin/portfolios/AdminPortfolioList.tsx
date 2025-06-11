import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { getToken } from '../../../lib/auth';

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

const AdminPortfolioList: React.FC = () => {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/portfolio', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPortfolios(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found. Please log in.');
          return;
        }

        const response = await fetch(`/api/portfolios/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setPortfolios(portfolios.filter((p) => p._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <AdminLayout><div>Loading portfolios...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="text-red-500">Error: {error}</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Manage Portfolios</h2>
      <Link
        to="/admin/portfolios/new"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Add New Portfolio
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {portfolios.length === 0 ? (
          <p>No portfolios found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((portfolio) => (
                <tr key={portfolio._id}>
                  <td className="py-2 px-4 border-b">
                    <img src={portfolio.imageUrl} alt={portfolio.title} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="py-2 px-4 border-b">{portfolio.title}</td>
                  <td className="py-2 px-4 border-b">{portfolio.category}</td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/admin/portfolios/edit/${portfolio._id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(portfolio._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolioList;