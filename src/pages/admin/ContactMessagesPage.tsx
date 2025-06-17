import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Mail, 
  Search, 
  Trash2, 
  MailOpen, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react';

import { 
  getContactMessages, 
  getContactMessage,
  deleteContactMessage,
  toggleReadStatus,
  type ContactMessage,
  type PaginatedResponse
} from '@/lib/api/contactService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ContactMessagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const queryClient = useQueryClient();
  const limit = 10;

  // Use the query with proper typing
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['contact-messages', { page, search, selectedTab }],
    queryFn: () => getContactMessages({
      page,
      limit: 10,
      search,
      read: selectedTab === 'all' ? undefined : false
    }),
    // @ts-ignore - keepPreviousData is a valid option in newer versions
    keepPreviousData: true,
    staleTime: 5000, // Keep data fresh for 5 seconds
  });
  
  // The backend returns { docs: [], total, page, pages, ... }
  const messages = data?.docs || [];
  const totalMessages = data?.total || 0;
  const totalPages = data?.pages || 1;
  const hasNextPage = data?.hasNextPage || false;
  const hasPreviousPage = data?.hasPrevPage || false;

  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      if (selectedMessage) {
        setSelectedMessage(null);
      }
      toast.success('Message deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete message');
    }
  });

  const toggleReadMutation = useMutation({
    mutationFn: toggleReadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
  });

  const handleViewMessage = async (id: string) => {
    try {
      const message = await getContactMessage(id);
      setSelectedMessage(message);
      
      // Mark as read if unread
      if (!message.isRead) {
        await toggleReadMutation.mutateAsync(message._id);
      }
    } catch (error) {
      console.error('Error fetching message:', error);
      toast.error('Failed to load message');
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      await toggleReadMutation.mutateAsync(id);
      toast.success(`Message marked as ${isRead ? 'unread' : 'read'}`);
    } catch (error) {
      console.error('Error toggling read status:', error);
      toast.error('Failed to update message status');
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading messages: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">
            View and manage messages from the contact form
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  {totalMessages} total messages • {messages.filter(m => !m.isRead).length} unread
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-8 w-full sm:w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Tabs 
              value={selectedTab} 
              onValueChange={(value) => {
                setSelectedTab(value as 'all' | 'unread');
                setPage(1);
              }}
              className="mt-4"
            >
              <TabsList>
                <TabsTrigger value="all">All Messages</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow 
                      key={message._id}
                      className={`cursor-pointer hover:bg-muted/50 ${!message.isRead ? 'font-medium' : ''}`}
                      onClick={() => handleViewMessage(message._id)}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          {!message.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          {message.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{message.email}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="line-clamp-1">{message.subject}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        {format(new Date(message.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant={message.isRead ? 'outline' : 'default'}>
                          {message.isRead ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRead(message._id, message.isRead);
                            }}
                          >
                            <MailOpen className="h-4 w-4" />
                            <span className="sr-only">
                              {message.isRead ? 'Mark as unread' : 'Mark as read'}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(message._id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {messages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No messages found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing {messages.length} of {totalMessages} messages
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!hasPreviousPage || isLoading || isFetching}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasNextPage || isLoading || isFetching}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Detail Sidebar */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedMessage.createdAt), 'PPpp')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleRead(selectedMessage._id, selectedMessage.isRead)}
                >
                  <MailOpen className="h-4 w-4 mr-2" />
                  {selectedMessage.isRead ? 'Mark as unread' : 'Mark as read'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteMessage(selectedMessage._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="whitespace-pre-line">{selectedMessage.message}</div>
              
              {selectedMessage.ipAddress && (
                <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                  <p><strong>IP Address:</strong> {selectedMessage.ipAddress}</p>
                  {selectedMessage.userAgent && (
                    <p className="mt-1"><strong>User Agent:</strong> {selectedMessage.userAgent}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
