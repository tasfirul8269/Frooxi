import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Star, Loader2 } from "lucide-react"
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

// Mock data - replace with actual API calls
const mockTestimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "CEO, TechCorp",
    content: "Working with Frooxi has been a game-changer for our business. Their team delivered exceptional results.",
    rating: 5,
    status: "published",
    date: "2023-10-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Marketing Director",
    content: "The team's attention to detail and creative approach helped us achieve our marketing goals.",
    rating: 4,
    status: "pending",
    date: "2023-11-02",
  },
  {
    id: 3,
    name: "Michael Johnson",
    role: "Founder, StartupX",
    content: "Frooxi's development team built us a robust and scalable solution that perfectly fits our needs.",
    rating: 5,
    status: "published",
    date: "2023-11-20",
  },
]

export default function TestimonialsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter testimonials
  const filteredTestimonials = mockTestimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(mockTestimonials.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const toggleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id])
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id))
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true)
      // TODO: Implement delete API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: "Testimonial deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
      />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage customer testimonials and reviews
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

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
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Published</DropdownMenuItem>
                <DropdownMenuItem>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedItems.length > 0 && (
              <Button variant="outline" size="sm" className="h-9" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      selectedItems.length === mockTestimonials.length &&
                      mockTestimonials.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestimonials.length > 0 ? (
                filteredTestimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(testimonial.id)}
                        onCheckedChange={(checked) =>
                          toggleSelectItem(testimonial.id, checked as boolean)
                        }
                        aria-label={`Select ${testimonial.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {testimonial.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {testimonial.role}
                    </TableCell>
                    <TableCell>
                      <div className="flex">
                        {renderStars(testimonial.rating)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          testimonial.status === 'published' ? 'default' : 'outline'
                        }
                      >
                        {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(testimonial.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No testimonials found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
