import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getToken } from '../../../lib/auth';
import { useNavigate } from 'react-router-dom';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found. Please log in.');
          return;
        }

        const response = await fetch(`/api/user/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setUsers(users.filter((user) => user._id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <AdminLayout><div>Loading users...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="text-red-500">Error: {error}</div></AdminLayout>;
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role: 'admin' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setRegisterSuccess('Admin user registered successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      setShowAddUserForm(false); // Hide form after successful registration
      fetchUsers(); // Refresh the user list
    } catch (err: any) {
      setRegisterError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>
      <Button onClick={() => setShowAddUserForm(!showAddUserForm)} className="mb-4">
        {showAddUserForm ? 'Hide Add Admin Form' : 'Add New Admin'}
      </Button>

      {showAddUserForm && (
        <Card className="w-full max-w-md mx-auto mb-6">
          <CardHeader>
            <CardTitle>Add New Admin User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Admin Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {registerError && <p className="text-red-500 text-sm">{registerError}</p>}
              {registerSuccess && <p className="text-green-500 text-sm">{registerSuccess}</p>}
              <Button type="submit" className="w-full">
                Register Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(user._id)}
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

export default AdminUserList;