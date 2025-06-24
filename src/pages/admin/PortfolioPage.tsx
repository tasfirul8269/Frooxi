import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Filter, Edit, Trash2, Loader2, X, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api/api"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { 
  getPortfolioItems, 
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem, 
  togglePortfolioItemStatus, 
  togglePortfolioItemFeatured
} from "@/lib/api/portfolioService"
import type { PortfolioItem, CreatePortfolioItemDto, UpdatePortfolioItemDto } from "@/types/portfolio"
import { PortfolioItemForm } from "@/components/forms/PortfolioItemForm"
import { format } from "date-fns"
import React from "react"

export default function PortfolioPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)

  // Fetch portfolio items
  const { data: portfolioItems = [], isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: ['portfolioItems'],
    queryFn: getPortfolioItems,
  })

  // Filter portfolio items based on search term
  const filteredItems = portfolioItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.technologies || []).some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] })
      setItemToDelete(null)
      setIsDeleteDialogOpen(false)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete portfolio item.",
        variant: "destructive",
      })
    },
  })

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      togglePortfolioItemStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] })
      toast({
        title: "Success",
        description: "Portfolio item status updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    },
  })

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => 
      togglePortfolioItemFeatured(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] })
      toast({
        title: "Success",
        description: "Portfolio item featured status updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update featured status.",
        variant: "destructive",
      });
    },
  })

  // Handle edit button click
  const handleEdit = (e: React.MouseEvent, item: PortfolioItem) => {
    e.stopPropagation()
    setEditingItem(item)
    setShowForm(true)
  }

  // Handle toggle status
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ id, isActive: !currentStatus })
  }

  // Handle toggle featured
  const handleToggleFeatured = (id: string, featured: boolean) => {
    toggleFeaturedMutation.mutate({ id, featured })
  }

  // Create portfolio item mutation
  const createPortfolioMutation = useMutation({
    mutationFn: (data: CreatePortfolioItemDto) => createPortfolioItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] })
      toast({
        title: "Success",
        description: "Portfolio item created successfully.",
      })
      setShowForm(false)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create portfolio item.",
        variant: "destructive",
      })
    },
  })

  // Update portfolio item mutation
  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePortfolioItemDto }) => 
      updatePortfolioItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] })
      toast({
        title: "Success",
        description: "Portfolio item updated successfully.",
      })
      setShowForm(false)
      setEditingItem(null)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update portfolio item.",
        variant: "destructive",
      })
    },
  })

  // Handle form submission
  const handleFormSubmit = async (formData: any) => {
    try {
      if (process.env.NODE_ENV !== 'production') console.log('Form submitted with data:', formData);
      
      if (editingItem) {
        // For updates, we need to handle the file upload if a new image was selected
        if (formData._file) {
          try {
            // Upload the new image first
            const uploadFormData = new FormData();
            uploadFormData.append('image', formData._file);
            
            if (process.env.NODE_ENV !== 'production') console.log('Uploading image...');
            const uploadResponse = await api.post('/portfolio/upload', uploadFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            
            if (process.env.NODE_ENV !== 'production') console.log('Image upload response:', uploadResponse.data);
            // Update the data with the new image URL
            formData.image = uploadResponse.data.url;
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') console.error('Error uploading image:', error);
            toast({
              title: 'Error',
              description: 'Failed to upload image. Please try again.',
              variant: 'destructive',
            });
            return;
          }
        }
        
        // Prepare the update data
        const { _file, ...updateData } = formData;
        if (process.env.NODE_ENV !== 'production') console.log('Updating portfolio item with data:', updateData);
        
        updatePortfolioMutation.mutate({ 
          id: editingItem._id, 
          data: updateData 
        });
      } else {
        // For new items, the file upload is handled in the createPortfolioItem function
        if (process.env.NODE_ENV !== 'production') console.log('Creating new portfolio item with data:', formData);
        createPortfolioMutation.mutate(formData);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error in form submission:', error);
      let errorMessage = 'An error occurred while saving the portfolio item.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }

  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setItemToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  // Handle bulk selection
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item._id))
    } else {
      setSelectedItems([])
    }
  }

  // Handle individual selection
  const toggleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id])
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id))
    }
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    // Implement bulk delete logic here
    toast({
      title: "Bulk Delete",
      description: `${selectedItems.length} items will be deleted.`,
    })
    // Reset selection
    setSelectedItems([])
  }

  // Handle cancel delete button click
  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    setItemToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  // Handle confirm delete button click
  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete)
    }
  }

  // Handle add new item button click
  const handleAddNew = (e: React.MouseEvent) => {
    e.preventDefault()
    setEditingItem(null)
    setShowForm(true)
  }

  // Handle close form button click
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        {/* Main content */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search portfolio items..."
              className="pl-9 md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/50 p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedItems.length === filteredItems.length}
                onCheckedChange={(checked) => toggleSelectAll(!!checked)}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                {selectedItems.length} selected
              </Label>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        )}

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    id="select-all"
                    checked={
                      filteredItems.length > 0 &&
                      selectedItems.length === filteredItems.length
                    }
                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Loading portfolio items...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-destructive">
                    Failed to load portfolio items. Please try again.
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-muted-foreground">
                        {searchTerm ? (
                          'No portfolio items found matching your search.'
                        ) : (
                          'No portfolio items found.'
                        )}
                      </p>
                      <Button onClick={handleAddNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Item
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Checkbox
                        id={`select-${item._id}`}
                        checked={selectedItems.includes(item._id)}
                        onCheckedChange={(checked) =>
                          toggleSelectItem(item._id, !!checked)
                        }
                        aria-label={`Select ${item.title}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        {item.image && (
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.title}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        )}
                        <span>{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            item.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <span>{item.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleToggleFeatured(item._id, item.featured)}
                      >
                        {item.featured ? (
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle Featured</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleToggleStatus(item._id, item.isActive)}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            item.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <span className="sr-only">Toggle Status</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleEdit(e, item)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteClick(e, item._id)}
                          disabled={deleteMutation.isPending && itemToDelete === item._id}
                        >
                          {deleteMutation.isPending && itemToDelete === item._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Delete Portfolio Item</h3>
              <p className="text-muted-foreground">
                Are you sure you want to delete this portfolio item? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Item Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background p-6 rounded-lg w-full max-w-4xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseForm}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            {showForm && (
              <PortfolioItemForm
                item={editingItem}
                onSave={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={createPortfolioMutation.isPending || updatePortfolioMutation.isPending}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}