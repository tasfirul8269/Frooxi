import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Consultation } from '@/types/consultation';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, MessageSquare, User, MapPin, DollarSign, FileText, X } from 'lucide-react';
import { ConsultationStatusBadge } from './ConsultationStatusBadge';

interface ConsultationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation | null;
  noteText: string;
  onNoteChange: (text: string) => void;
  onAddNote: () => void;
  isSubmittingNote: boolean;
  onStatusChange: (status: string) => void;
  isUpdatingStatus: boolean;
}

export function ConsultationDetailsModal({
  isOpen,
  onClose,
  consultation,
  noteText,
  onNoteChange,
  onAddNote,
  isSubmittingNote,
  onStatusChange,
  isUpdatingStatus,
}: ConsultationDetailsModalProps) {
  if (!consultation) return null;

  const {
    name,
    email,
    phone,
    status,
    projectType,
    location,
    budget,
    preferredContact,
    message,
    notes = [],
    createdAt,
    updatedAt,
  } = consultation;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-3">
                {name}
                <ConsultationStatusBadge status={status} />
              </DialogTitle>
              <DialogDescription className="mt-1">
                Submitted on {format(new Date(createdAt), 'MMMM d, yyyy h:mm a')}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 -mt-2 -mr-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                Contact Information
              </h3>
              <div className="space-y-2 pl-6">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${email}`} className="hover:underline hover:text-primary">
                    {email}
                  </a>
                </div>
                {phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${phone}`} className="hover:underline hover:text-primary">
                      {phone}
                    </a>
                  </div>
                )}
                {preferredContact && (
                  <div className="text-sm text-muted-foreground">
                    Preferred contact: {preferredContact}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                Project Details
              </h3>
              <div className="space-y-2 pl-6">
                {projectType && (
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium">{projectType}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{location}</span>
                  </div>
                )}
                {budget && (
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Budget: {budget}</span>
                  </div>
                )}
                <div className="flex items-start pt-1">
                  <MessageSquare className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground">{message || 'No additional message provided.'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Update Status</h3>
              <div className="pl-2">
                <select
                  value={status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Notes</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note about this consultation..."
                  value={noteText}
                  onChange={(e) => onNoteChange(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={onAddNote}
                    disabled={!noteText.trim() || isSubmittingNote}
                  >
                    {isSubmittingNote ? 'Adding...' : 'Add Note'}
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Previous Notes</h4>
                {notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-muted/10">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {note.addedBy?.name || 'Admin'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(note.addedAt), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                        <p className="mt-1 text-sm whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No notes yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
