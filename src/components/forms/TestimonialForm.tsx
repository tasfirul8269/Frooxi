import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon, X, Star, User } from "lucide-react";
import type { Testimonial } from "@/types/testimonial";

interface TestimonialFormProps {
  testimonial?: Testimonial;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TestimonialForm({ testimonial, onSave, onCancel, isSubmitting }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    author: testimonial?.author || '',
    role: testimonial?.role || '',
    company: testimonial?.company || '',
    content: testimonial?.content || '',
    rating: testimonial?.rating || 5,
    featured: testimonial?.featured || false,
    isActive: testimonial?.isActive ?? true,
  });
  
  const [previewImage, setPreviewImage] = useState(testimonial?.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      // If there's a new image, it will be handled by the parent component
    });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, rating: i }))}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 ${i <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., CEO, Marketing Director"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center space-x-1">
                {renderStars()}
                <span className="ml-2 text-sm text-muted-foreground">
                  {formData.rating} out of 5
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Author Photo</Label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Author"
                        className="h-16 w-16 rounded-full object-cover border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer bg-muted hover:bg-muted/80 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 w-fit"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {previewImage ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <input
                    id="avatar-upload"
                    name="avatar"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary rounded"
                  />
                  <span className="ml-2 text-sm">Active</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary rounded"
                  />
                  <span className="ml-2 text-sm">Featured</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Testimonial Content *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What they say about your product or service..."
              rows={5}
              required
              className="min-h-[150px]"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
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
                  {testimonial ? 'Updating...' : 'Creating...'}
                </>
              ) : testimonial ? (
                'Update Testimonial'
              ) : (
                'Create Testimonial'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
