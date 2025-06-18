import { Consultation } from '@/types/consultation';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, MessageSquare } from 'lucide-react';
import { ConsultationStatusBadge } from './ConsultationStatusBadge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

interface ConsultationCardProps {
  consultation: Consultation;
  onViewDetails: (consultation: Consultation) => void;
  onStatusChange: (id: string, status: string) => void;
  isUpdating?: boolean;
}

export function ConsultationCard({
  consultation,
  onViewDetails,
  onStatusChange,
  isUpdating = false,
}: ConsultationCardProps) {
  const { _id, name, email, phone, status, projectType, createdAt, message } = consultation;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{name}</CardTitle>
          <ConsultationStatusBadge status={status} />
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1.5" />
          <span>{format(new Date(createdAt), 'MMM d, yyyy h:mm a')}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`mailto:${email}`} className="hover:underline hover:text-primary">
              {email}
            </a>
          </div>
          
          {phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`tel:${phone}`} className="hover:underline hover:text-primary">
                {phone}
              </a>
            </div>
          )}
          
          {projectType && (
            <div className="text-sm">
              <span className="font-medium">Project:</span>{' '}
              <span className="text-muted-foreground">{projectType}</span>
            </div>
          )}
          
          {message && (
            <div className="pt-1">
              <div className="flex items-start text-sm">
                <MessageSquare className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                <p className="text-muted-foreground line-clamp-2">{message}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetails(consultation)}
          className="flex-1"
        >
          View Details
        </Button>
        
        <div className="ml-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(_id, e.target.value)}
            disabled={isUpdating}
            className="text-sm rounded-md border border-input bg-background px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </CardFooter>
    </Card>
  );
}
