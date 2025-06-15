import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X } from 'lucide-react';
import { PortfolioCategory, PortfolioItem } from '@/types/portfolio';

interface PortfolioItemFormProps {
  item?: PortfolioItem;
  onSave: (data: Omit<PortfolioItem, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories: PortfolioCategory[] = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Branding',
  'Graphic Design',
  'Other'
];

const categoryMap: Record<string, string> = {
  'Web Development': 'web',
  'Mobile Development': 'mobile',
  'UI/UX Design': 'design',
  'Branding': 'design',
  'Graphic Design': 'design',
  'Other': 'other'
};

export function PortfolioItemForm({ item, onSave, onCancel, isLoading = false }: PortfolioItemFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    image: string;
    category: PortfolioCategory;
    technologies: string;
    year: string;
    link: string;
    tags: string;
    featured: boolean;
    isActive: boolean;
    _file?: File; // Temporary storage for the file object before upload
  }>({
    title: item?.title || '',
    description: item?.description || '',
    image: item?.image || '',
    category: item?.category || 'Web Development',
    technologies: item?.technologies?.join(', ') || '',
    year: item?.year || new Date().getFullYear().toString(),
    link: item?.link || '',
    tags: item?.tags?.join(', ') || '',
    featured: item?.featured ?? false,
    isActive: item?.isActive ?? true,
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(item?.image || '');
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // In a real app, you would upload the file to your server here
      // For now, we'll create a preview URL and store the file
      const previewUrl = URL.createObjectURL(file);
      
      // In a real implementation, you would upload the file to your server here
      // and get back the image URL. For now, we'll just use the file name
      // and you'll need to handle the actual file upload in the parent component
      setFormData(prev => ({
        ...prev,
        image: file.name, // This should be replaced with the actual image URL after upload
        // In a real app, you would also want to store the file object for upload
        _file: file // This is a temporary workaround
      }));
      
      setPreviewImage(previewUrl);
      
      // Show success message
      // toast({
      //   title: "Image selected",
      //   description: file.name,
      //   variant: "default",
      // });
    } catch (error) {
      console.error('Error handling image:', error);
      // toast({
      //   title: "Error",
      //   description: "Failed to process image. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsUploading(false);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
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

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    setPreviewImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!formData.image && !previewImage) {
        throw new Error('Please upload an image');
      }
      
      // Create the data object with all required fields
      const dataToSave = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        category: formData.category,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        year: formData.year,
        link: formData.link,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        featured: formData.featured,
        isActive: formData.isActive,
        _file: formData._file // Include the file for upload
      };
      
      console.log('Submitting form data:', dataToSave);
      await onSave(dataToSave as any); // Type assertion needed due to _file property
      
    } catch (error) {
      console.error('Error in form submission:', error);
      // Show error toast
      toast({
        title: 'Error',
        description: error.message || 'Failed to save portfolio item',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {item ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project Title"
              required
            />
          </div>
          
          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              placeholder="2023"
              min="2000"
              max={new Date().getFullYear() + 1}
            />
          </div>
          
          {/* Project URL */}
          <div className="space-y-2">
            <Label htmlFor="link">Project URL (optional)</Label>
            <Input
              id="link"
              name="link"
              type="url"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, Design"
            />
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, category: value as PortfolioCategory }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Technologies */}
          
          {/* Technologies */}
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma separated)</Label>
            <Input
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, TypeScript"
            />
          </div>
          
          {/* Image Upload */}
          <div className="md:col-span-2 space-y-2">
            <Label>Project Image *</Label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent/30 transition-colors ${
                isDragActive ? 'border-primary bg-accent/20' : 'border-muted-foreground/25'
              }`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : previewImage ? (
                <div className="relative mx-auto max-w-md">
                  <img 
                    src={previewImage} 
                    alt="Project preview" 
                    className="max-h-64 w-full object-contain rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 rounded-full h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 py-8">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isDragActive 
                      ? 'Drop the image here' 
                      : 'Drag & drop an image here, or click to select'}
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Recommended: 1200x630px (2:1 aspect ratio)
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the project, technologies used, challenges faced, etc."
              rows={5}
              required
              className="min-h-[120px]"
            />
          </div>
          
          {/* Status Toggles */}
          <div className="md:col-span-2 space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="space-y-1 mb-3 sm:mb-0">
                <h4 className="font-medium">Project Visibility</h4>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive 
                    ? 'This project is visible on the portfolio page.' 
                    : 'This project is hidden from the portfolio page.'}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isActive: checked }))
                    }
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="featured" 
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
            </div>
            
            {formData.featured && (
              <div className="text-sm text-amber-600 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                Featured projects will be displayed on the home page. Only a limited number of projects can be featured.
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isUploading || !formData.title || !formData.description || !formData.image}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {item ? 'Saving...' : 'Creating...'}
              </>
            ) : item ? (
              'Save Changes'
            ) : (
              'Create Project'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
