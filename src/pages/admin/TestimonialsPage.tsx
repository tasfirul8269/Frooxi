import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash2, Star, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { 
  getTestimonials, 
  createTestimonial,
  updateTestimonial,
  deleteTestimonial as deleteTestimonialApi,
  toggleTestimonialStatus,
  toggleTestimonialFeatured
} from "@/lib/api/testimonialService"
import type { Testimonial, CreateTestimonialDto } from "@/types/testimonial"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTestimonialId, setCurrentTestimonialId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateTestimonialDto>({
    clientName: '',
    clientPosition: '',
    clientCompany: '',
    content: '',
    rating: 5,
    imageUrl: '',
    isActive: true,
    featured: false,
    order: 0
  })
  const { toast } = useToast()

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true)
        const data = await getTestimonials()
        setTestimonials(Array.isArray(data) ? data : [])
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error('Error fetching testimonials:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch testimonials',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [toast])

  // Handle delete testimonial
  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonialApi(id)
        setTestimonials(testimonials.filter(testimonial => testimonial._id !== id))
        toast({
          title: 'Success',
          description: 'Testimonial deleted successfully',
        })
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error('Error deleting testimonial:', error)
        toast({
          title: 'Error',
          description: 'Failed to delete testimonial',
          variant: 'destructive',
        })
      }
    }
  }

  // Handle status toggle
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const updatedTestimonial = await toggleTestimonialStatus(id, !currentStatus)
      setTestimonials(testimonials.map(t => 
        t._id === id ? { ...t, isActive: updatedTestimonial.isActive } : t
      ))
      toast({
        title: 'Success',
        description: `Testimonial ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      })
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error toggling testimonial status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update testimonial status',
        variant: 'destructive',
      })
    }
  }

  // Handle featured toggle
  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const updatedTestimonial = await toggleTestimonialFeatured(id, !currentFeatured)
      setTestimonials(testimonials.map(t => 
        t._id === id ? { ...t, featured: updatedTestimonial.featured } : t
      ))
      toast({
        title: 'Success',
        description: `Testimonial ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      })
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error toggling testimonial featured status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update testimonial featured status',
        variant: 'destructive',
      })
    }
  }

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch = testimonial.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === 'published' ? testimonial.isActive : !testimonial.isActive)
    return matchesSearch && matchesStatus
  })

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(testimonials.map(item => item._id))
    } else {
      setSelected([])
    }
  }

  const toggleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelected(prev => [...prev, id])
    } else {
      setSelected(prev => prev.filter(itemId => itemId !== id))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || name === 'rating' ? parseInt(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonialId(testimonial._id);
    setIsEditing(true);
    setFormData({
      clientName: testimonial.clientName,
      clientPosition: testimonial.clientPosition || '',
      clientCompany: testimonial.clientCompany || '',
      content: testimonial.content,
      rating: testimonial.rating,
      imageUrl: testimonial.imageUrl || '',
      isActive: testimonial.isActive,
      featured: testimonial.featured,
      order: testimonial.order || 0
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditing && currentTestimonialId) {
        // Update existing testimonial
        const updatedTestimonial = await updateTestimonial(currentTestimonialId, formData);
        setTestimonials(testimonials.map(t => 
          t._id === currentTestimonialId ? updatedTestimonial : t
        ));
        toast({
          title: 'Success',
          description: 'Testimonial updated successfully',
        });
      } else {
        // Create new testimonial
        const newTestimonial = await createTestimonial(formData);
        setTestimonials(prev => [...prev, newTestimonial]);
        toast({
          title: 'Success',
          description: 'Testimonial added successfully',
        });
      }
      
      setIsFormOpen(false);
      setIsEditing(false);
      setCurrentTestimonialId(null);
      setFormData({
        clientName: '',
        clientPosition: '',
        clientCompany: '',
        content: '',
        rating: 5,
        imageUrl: '',
        isActive: true,
        featured: false,
        order: 0
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error adding testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to add testimonial',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header and Search */}
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Testimonials</h1>
            <p className="text-muted-foreground">
              Manage customer testimonials and reviews
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="rounded-lg border bg-card">
          <div className="flex flex-col justify-between space-y-4 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search testimonials..."
                className="w-full bg-background pl-8 sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("published")}>Published</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {selected.length > 0 && (
                <Button variant="outline" size="sm" className="h-9" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete ({selected.length})
                </Button>
              )}
            </div>
          </div>

          {/* Testimonials Table */}
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.length === testimonials.length && testimonials.length > 0}
                      onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                      className="h-4 w-4"
                    />
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Testimonial</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTestimonials.length === 0 ? (
                  <TableRow key="no-results">
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No testimonials found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTestimonials.map((testimonial) => (
                    <TableRow key={testimonial._id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(testimonial._id)}
                          onCheckedChange={(checked) =>
                            toggleSelectItem(testimonial._id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{testimonial.clientName}</TableCell>
                      <TableCell>{testimonial.clientPosition} {testimonial.clientCompany ? `at ${testimonial.clientCompany}` : ''}</TableCell>
                      <TableCell className="max-w-xs truncate">{testimonial.content}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < (testimonial.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={testimonial.isActive ? 'default' : 'secondary'}
                          className="capitalize cursor-pointer"
                          onClick={() => handleToggleStatus(testimonial._id, testimonial.isActive)}
                        >
                          {testimonial.isActive ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={testimonial.featured}
                          onCheckedChange={() => handleToggleFeatured(testimonial._id, testimonial.featured)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(testimonial)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTestimonial(testimonial._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add Testimonial Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Client Name *</label>
                  <Input
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Client Position</label>
                  <Input
                    name="clientPosition"
                    value={formData.clientPosition}
                    onChange={handleInputChange}
                    placeholder="CEO"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Client Company</label>
                  <Input
                    name="clientCompany"
                    value={formData.clientCompany}
                    onChange={handleInputChange}
                    placeholder="Company Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Rating *</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>
                        {Array(num).fill('⭐').join('')} ({num} star{num !== 1 ? 's' : ''})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Image URL</label>
                  <Input
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                
                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Published
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Featured
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Testimonial Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Share your experience..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Testimonial'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
