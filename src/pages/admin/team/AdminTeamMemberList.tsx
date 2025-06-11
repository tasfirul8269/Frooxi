import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { getToken } from '../../../lib/auth';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  imageUrl: string;
}

const AdminTeamMemberList: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/team', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTeamMembers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found. Please log in.');
          return;
        }

        const response = await fetch(`/api/team-members/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setTeamMembers(teamMembers.filter((tm) => tm._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <AdminLayout><div>Loading team members...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="text-red-500">Error: {error}</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Manage Team Members</h2>
      <Link
        to="/admin/team/new"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Add New Team Member
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {teamMembers.length === 0 ? (
          <p>No team members found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member._id}>
                  <td className="py-2 px-4 border-b">
                    <img src={member.imageUrl} alt={member.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="py-2 px-4 border-b">{member.name}</td>
                  <td className="py-2 px-4 border-b">{member.role}</td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/admin/team/edit/${member._id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(member._id)}
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

export default AdminTeamMemberList;