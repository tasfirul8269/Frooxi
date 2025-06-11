import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import api from '@/services/api';

interface TeamMemberFormData {
  name: string;
  position: string;
  bio: string;
  image: string;
  email: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  skills: string[];
}

interface AdminTeamFormProps {
  initialData?: TeamMemberFormData;
}

const AdminTeamForm: React.FC<AdminTeamFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    position: '',
    bio: '',
    image: '',
    email: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
    },
    skills: [],
    ...initialData,
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (id) {
      fetchTeamMember();
    }
  }, [id]);

  const fetchTeamMember = async () => {
    try {
      const response = await api.get(`/team/${id}`);
      const memberData = response.data;
      setFormData({
        name: memberData.name,
        position: memberData.position,
        bio: memberData.bio,
        image: memberData.image,
        email: memberData.email,
        socialLinks: memberData.socialLinks || {},
        skills: memberData.skills || [],
      });
    } catch (error) {
      console.error('Error fetching team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch team member data',
        variant: 'destructive',
      });
      navigate('/admin/team');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const platform = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/team/${id}`, formData);
        toast({
          title: 'Success',
          description: 'Team member updated successfully',
        });
      } else {
        await api.post('/team', formData);
        toast({
          title: 'Success',
          description: 'Team member created successfully',
        });
      }
      navigate('/admin/team');
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.msg || 'Failed to save team member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter team member's name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="Enter team member's position"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter team member's email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="Enter image URL"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  placeholder="Enter team member's bio"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social.linkedin">LinkedIn URL</Label>
                <Input
                  id="social.linkedin"
                  name="social.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  placeholder="Enter LinkedIn profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social.twitter">Twitter URL</Label>
                <Input
                  id="social.twitter"
                  name="social.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  placeholder="Enter Twitter profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social.github">GitHub URL</Label>
                <Input
                  id="social.github"
                  name="social.github"
                  value={formData.socialLinks.github}
                  onChange={handleChange}
                  placeholder="Enter GitHub profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/team')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : id ? 'Update Team Member' : 'Create Team Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTeamForm; 