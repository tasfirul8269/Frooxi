import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Search, Filter, Plus, MessageSquare, Calendar, Mail, Phone, MapPin, Globe, Clock, User, X, Check, Clock3, CheckCircle, XCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

import { Consultation, ConsultationStatus, GetConsultationsParams, PaginatedResponse } from '@/types/consultation';
import { cn } from '@/lib/utils';
import { getConsultations, updateConsultationStatus, addConsultationNote } from '@/lib/api/consultations';

const statusVariant = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  contacted: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  in_progress: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  completed: 'bg-green-100 text-green-800 hover:bg-green-200',
  cancelled: 'bg-red-100 text-red-800 hover:bg-red-200',
} as const;

const statusIcons = {
  pending: <Clock3 className="h-4 w-4" />,
  contacted: <MessageSquare className="h-4 w-4" />,
  in_progress: <Loader2 className="h-4 w-4 animate-spin" />,
  completed: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
} as const;

const statusOptions: { value: ConsultationStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ConsultationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch consultations
  const { data, isLoading, isError } = useQuery<PaginatedResponse<Consultation>>({
    queryKey: ['consultations', { page, status: statusFilter, search: searchQuery }],
    queryFn: () => getConsultations({ 
      page, 
      limit: 10, 
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(searchQuery && { search: searchQuery })
    }),
    keepPreviousData: true,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ConsultationStatus }) => 
      updateConsultationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      toast.success('Status updated successfully');
      setIsUpdatingStatus(false);
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      setIsUpdatingStatus(false);
    }
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => 
      addConsultationNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      setNewNote('');
      toast.success('Note added successfully');
    },
    onError: (error) => {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  });

  const handleStatusUpdate = (status: ConsultationStatus) => {
    if (!selectedConsultation) return;
    setIsUpdatingStatus(true);
    updateStatusMutation.mutate({ id: selectedConsultation._id, status });
  };

  const handleAddNote = () => {
    if (!selectedConsultation || !newNote.trim()) return;
    addNoteMutation.mutate({ id: selectedConsultation._id, note: newNote });
  };

  const openDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedConsultation(null);
    setNewNote('');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading consultations. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Consultation Requests</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 w-64"
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ConsultationStatus | 'all')}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-16 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data?.data?.length ? (
                    data.data.map((consultation) => (
                      <TableRow key={consultation._id}>
                        <TableCell className="font-medium">{consultation.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-600">{consultation.email}</span>
                            {consultation.phone && (
                              <span className="text-sm text-gray-500">{consultation.phone}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{consultation.projectType}</TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              'inline-flex items-center gap-1',
                              statusVariant[consultation.status]
                            )}
                          >
                            {statusIcons[consultation.status]}
                            {consultation.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(consultation.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openDetails(consultation)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No consultation requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {data && data.totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum = page <= 3 ? i + 1 : 
                  page >= data.totalPages - 2 ? data.totalPages - 4 + i :
                  page - 2 + i;
                
                if (pageNum < 1 || pageNum > data.totalPages) return null;
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNum);
                      }}
                      isActive={pageNum === page}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < (data?.totalPages || 1)) setPage(page + 1);
                  }}
                  className={page === data?.totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Consultation Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedConsultation && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedConsultation.name}</DialogTitle>
                    <DialogDescription>
                      Requested on {formatDate(selectedConsultation.createdAt)}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={selectedConsultation.status} 
                      onValueChange={(value) => handleStatusUpdate(value as ConsultationStatus)}
                      disabled={isUpdatingStatus}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Client Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Client Information</h3>
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedConsultation.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedConsultation.name}</p>
                        <p className="text-sm text-gray-500">Client</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`mailto:${selectedConsultation.email}`} className="text-blue-600 hover:underline">
                          {selectedConsultation.email}
                        </a>
                      </div>
                      {selectedConsultation.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <a href={`tel:${selectedConsultation.phone}`} className="text-gray-700">
                            {selectedConsultation.phone}
                          </a>
                        </div>
                      )}
                      {selectedConsultation.whatsapp && (
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-gray-700">{selectedConsultation.whatsapp}</span>
                        </div>
                      )}
                      {selectedConsultation.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-400" />
                          <a 
                            href={selectedConsultation.website.startsWith('http') ? selectedConsultation.website : `https://${selectedConsultation.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedConsultation.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{selectedConsultation.location || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium">Project Details</h3>
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium mb-1">Project Type</h4>
                      <p className="text-gray-700">{selectedConsultation.projectType}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Project Details</h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedConsultation.projectDetails || 'No details provided.'}
                      </p>
                    </div>
                    
                    {selectedConsultation.budget && (
                      <div>
                        <h4 className="font-medium mb-1">Budget</h4>
                        <p className="text-gray-700">{selectedConsultation.budget}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-1">Preferred Contact Method</h4>
                      <p className="text-gray-700 capitalize">
                        {selectedConsultation.preferredContact.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Source</h4>
                      <p className="text-gray-700 capitalize">
                        {selectedConsultation.source || 'Website'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="md:col-span-3 space-y-4">
                  <h3 className="text-lg font-medium">Notes</h3>
                  
                  {/* Add Note */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a note about this consultation..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || addNoteMutation.isLoading}
                      >
                        {addNoteMutation.isLoading ? 'Adding...' : 'Add Note'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Notes List */}
                  {selectedConsultation.notes?.length ? (
                    <div className="space-y-4">
                      {selectedConsultation.notes.map((note) => (
                        <div key={note._id} className="p-4 bg-white border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {note.addedBy.name || 'System'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(note.addedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700 whitespace-pre-line">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No notes yet. Add your first note above.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
