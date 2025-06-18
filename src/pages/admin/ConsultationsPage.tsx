import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getConsultations, 
  updateConsultationStatus, 
  addConsultationNote,
  type Consultation,
  type ConsultationStatus 
} from '@/lib/api/consultationService';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { ConsultationCard } from '@/components/ConsultationCard';
import { ConsultationDetailsModal } from '@/components/ConsultationDetailsModal';

const statusColors: Record<ConsultationStatus, string> = {
  pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusOptions: { value: ConsultationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ConsultationsPage = () => {
  const { token } = useAuth();
  
  // State
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected consultation
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  
  // Notes state
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  // Form state
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch consultations
  const fetchConsultations = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      };
      
      const response = await getConsultations(params);
      setConsultations(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError('Failed to load consultations. Please try again.');
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (consultationId: string, newStatus: string) => {
    if (!token) return;
    
    try {
      setIsUpdatingStatus(true);
      const { data: updatedConsultation } = await updateConsultationStatus(
        consultationId, 
        newStatus as ConsultationStatus
      );
      
      // Update the local state
      setConsultations(prev => 
        prev.map(consultation => 
          consultation._id === consultationId 
            ? updatedConsultation 
            : consultation
        )
      );
      
      // If the updated consultation is the selected one, update it as well
      if (selectedConsultation?._id === consultationId) {
        setSelectedConsultation(updatedConsultation);
      }
      
      toast.success('Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle add note
  const handleAddNote = async () => {
    if (!selectedConsultation || !noteText.trim() || !token) return;
    
    try {
      setIsSubmittingNote(true);
      const { data: updatedConsultation } = await addConsultationNote(
        selectedConsultation._id, 
        noteText
      );
      
      // Update the local state
      setConsultations(prev => 
        prev.map(consultation => 
          consultation._id === selectedConsultation._id 
            ? updatedConsultation 
            : consultation
        )
      );
      
      // Update the selected consultation
      setSelectedConsultation(updatedConsultation);
      setNoteText('');
      
      toast.success('Note added successfully');
    } catch (err) {
      console.error('Error adding note:', err);
      toast.error('Failed to add note');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ConsultationStatus | 'all');
    setPage(1); // Reset to first page when filter changes
  };

  // Fetch consultations when filters or pagination changes
  useEffect(() => {
    fetchConsultations();
  }, [statusFilter, searchQuery, page]);

  // Check if user is admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchConsultations();
  }, [token, navigate]);

  const filteredConsultations = consultations.filter(consultation => {
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      consultation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (consultation.phone && consultation.phone.includes(searchQuery));
    
    return matchesStatus && matchesSearch;
  });

  if (loading && consultations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading consultations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Consultations</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={fetchConsultations}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Consultations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track consultation requests
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultation List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredConsultations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No consultations found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {filteredConsultations.map((consultation) => (
                <Card 
                  key={consultation._id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedConsultation?._id === consultation._id 
                      ? 'ring-2 ring-blue-500 border-blue-500' 
                      : ''
                  }`}
                  onClick={() => setSelectedConsultation(consultation)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{consultation.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {consultation.email}
                        </p>
                      </div>
                      <Badge className={statusColors[consultation.status]}>
                        {consultation.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{consultation.projectType}</span>
                      <span>{format(new Date(consultation.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Consultation Details */}
        <div className="lg:col-span-2">
          {selectedConsultation ? (
            <Card className="h-full">
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedConsultation.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {selectedConsultation.email}
                      {selectedConsultation.phone && ` • ${selectedConsultation.phone}`}
                    </CardDescription>
                  </div>
                  <Select
                    value={selectedConsultation.status}
                    onValueChange={(value) => handleStatusUpdate(selectedConsultation._id, value as Status)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Type</p>
                    <p className="capitalize">{selectedConsultation.projectType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</p>
                    <p>{selectedConsultation.budget || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Contact</p>
                    <p className="capitalize">{selectedConsultation.preferredContact.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</p>
                    <p>{format(new Date(selectedConsultation.createdAt), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Message</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="whitespace-pre-line">
                      {selectedConsultation.message || 'No message provided.'}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Notes</h3>
                  
                  <div className="space-y-4 mb-6">
                    {selectedConsultation.notes && selectedConsultation.notes.length > 0 ? (
                      selectedConsultation.notes.map((note, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span>Added by {note.addedBy}</span>
                            <span>{format(new Date(note.addedAt), 'MMM d, yyyy h:mm a')}</span>
                          </div>
                          <p className="whitespace-pre-line">{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No notes yet.</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddNote} 
                        disabled={!newNote.trim() || isUpdating}
                      >
                        {isUpdating ? 'Adding...' : 'Add Note'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-center p-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  No consultation selected
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a consultation from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationsPage;
