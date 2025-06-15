import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import type { TeamMember as TeamMemberType } from "@/types/team";

interface TeamMemberFormProps {
  member?: TeamMemberType;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TeamMemberForm({ member, onSave, onCancel, isSubmitting }: TeamMemberFormProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    position: member?.position || '',
    bio: member?.bio || '',
    imageUrl: member?.imageUrl || '',
    socialLinks: member?.socialLinks || {
      linkedin: '',
      twitter: '',
      github: '',
      portfolio: ''
    }
  });
  
  const [previewImage, setPreviewImage] = useState(member?.imageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData to handle file upload
    const formDataToSend = new FormData();
    
    // Append all form fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('bio', formData.bio);
    
    // Append social links as JSON string
    formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
    
    // Append the image file if it exists
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (formData.imageUrl) {
      // If there's an existing image URL, send it as is
      formDataToSend.append('imageUrl', formData.imageUrl);
    }
    
    onSave(formDataToSend);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{member ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Profile Image</Label>
                <div className="mt-2 flex items-center">
                  <div className="relative">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-32 w-32 rounded-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium border border-gray-300"
                    >
                      Choose Image
                    </Label>
                    <p className="mt-2 text-xs text-gray-500">
                      JPG, PNG, or GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Social Links</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="linkedin" className="text-xs text-muted-foreground">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.socialLinks?.linkedin || ''}
                      onChange={handleSocialLinkChange}
                      placeholder="https://linkedin.com/in/username"
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter" className="text-xs text-muted-foreground">
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.socialLinks?.twitter || ''}
                      onChange={handleSocialLinkChange}
                      placeholder="https://twitter.com/username"
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github" className="text-xs text-muted-foreground">
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.socialLinks?.github || ''}
                      onChange={handleSocialLinkChange}
                      placeholder="https://github.com/username"
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio" className="text-xs text-muted-foreground">
                      Portfolio
                    </Label>
                    <Input
                      id="portfolio"
                      name="portfolio"
                      value={formData.socialLinks?.portfolio || ''}
                      onChange={handleSocialLinkChange}
                      placeholder="https://yourportfolio.com"
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Member'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
