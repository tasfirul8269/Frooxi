import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getToken } from '../../../lib/auth';

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks: { platform: string; url: string }[];
}

const AdminTeamMemberForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TeamMember>({
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    socialLinks: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchTeamMember = async () => {
        setLoading(true);
        try {
          const token = getToken();
          if (!token) {
            setError('Authentication token not found. Please log in.');
            setLoading(false);
            return;
          }

          const response = await fetch(`/api/team-members/${id}`, {
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
      fetchTeamMember();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddSocialLink = () => {
    if (socialPlatform.trim() && socialUrl.trim()) {
      setFormData({
        ...formData,
        socialLinks: [...formData.socialLinks, { platform: socialPlatform.trim(), url: socialUrl.trim() }],
      });
      setSocialPlatform('');
      setSocialUrl('');
    }
  };

  const handleRemoveSocialLink = (index: number) => {
    const newSocialLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: newSocialLinks });
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

    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', formData.role);
    data.append('bio', formData.bio);
    if (imageFile) {
      data.append('image', imageFile);
    } else if (formData.imageUrl) {
      data.append('imageUrl', formData.imageUrl); // Send existing imageUrl if no new file
    }
    data.append('socialLinks', JSON.stringify(formData.socialLinks));

    try {
      const url = id ? `/api/team-members/${id}` : '/api/team-members';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' is automatically set by browser when using FormData
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      navigate('/admin/team');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <AdminLayout><div>Loading team member...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">{id ? 'Edit Team Member' : 'Add New Team Member'}</h2>
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
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={5}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formData.imageUrl && !imageFile && (
            <p className="text-sm text-gray-500 mt-2">Current image: <a href={formData.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Social Links:</label>
          <div className="flex mb-2">
            <input
              type="text"
              placeholder="Platform (e.g., LinkedIn)"
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value)}
              className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <input
              type="text"
              placeholder="URL"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
          <div>
            {formData.socialLinks.map((link, index) => (
              <span key={index} className="inline-block bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                {link.platform}: {link.url}
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="ml-2 text-gray-800 hover:text-gray-900 font-bold"
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
            {loading ? 'Saving...' : (id ? 'Update Team Member' : 'Add Team Member')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/team')}
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

export default AdminTeamMemberForm;