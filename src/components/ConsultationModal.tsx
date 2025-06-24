import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  location: z.string().min(2, { message: 'Please enter your location' }),
  whatsapp: z.string().min(5, { message: 'Please enter a valid WhatsApp number' }),
  website: z.string().url({ message: 'Please enter a valid URL' }).or(z.literal('')),
  projectDetails: z.string().min(20, { message: 'Please provide more details about your project (at least 20 characters)' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      location: '',
      whatsapp: '',
      website: '',
      projectDetails: ''
    },
  });

  const handleSuccess = () => {
    setIsSuccess(true);
    form.reset();
    toast.success('Consultation request submitted successfully!');
    // Close the modal after a short delay to show success message
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      onSuccess?.();
    }, 3000);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      if (process.env.NODE_ENV !== 'production') console.log('Submitting form data:', data);
      
      const response = await fetch('http://localhost:5000/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          source: 'website',
          status: 'new'
        }),
      });

      if (process.env.NODE_ENV !== 'production') console.log('Response status:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        if (process.env.NODE_ENV !== 'production') console.log('Response data:', responseData);
      } catch (jsonError) {
        if (process.env.NODE_ENV !== 'production') console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        if (process.env.NODE_ENV !== 'production') console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        
        const errorMessage = responseData?.message || 
                           responseData?.errors?.[0]?.msg || 
                           `Server responded with status ${response.status}`;
        
        throw new Error(errorMessage);
      }
      
      if (process.env.NODE_ENV !== 'production') console.log('Consultation submitted successfully:', responseData);
      handleSuccess();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('Error in onSubmit:', error);
      toast.error(error.message || 'Failed to submit consultation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose, isSubmitting]);

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal is closed
      setIsSubmitting(false);
      setIsSuccess(false);
      form.reset();
    }
  }, [isOpen, form]);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
      return false;
    }
    return open;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-background text-foreground border border-border rounded-xl overflow-hidden p-0 shadow-xl max-w-full w-[95vw] sm:w-auto max-h-[90vh] overflow-y-auto my-4">
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column - Form */}
            <div className="p-4 sm:p-8 md:p-10">
              <div className="mb-6 sm:mb-8 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Start Your Project</h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  We'll get back to you within 24 hours
                </p>
              </div>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Full Name"
                        className="bg-background/80 border-input text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...form.register('name')}
                      />
                      {form.formState.errors.name && (
                        <p className="text-destructive text-xs mt-1">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        className="bg-background/80 border-input text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...form.register('email')}
                      />
                      {form.formState.errors.email && (
                        <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        id="location"
                        type="text"
                        placeholder="Location (City, Country)"
                        className="bg-background/80 border-input text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...form.register('location')}
                      />
                      {form.formState.errors.location && (
                        <p className="text-destructive text-xs mt-1">{form.formState.errors.location.message}</p>
                      )}
                    </div>
                  
                    <div>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="WhatsApp Number"
                        className="bg-background/80 border-input text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...form.register('whatsapp')}
                      />
                      {form.formState.errors.whatsapp && (
                        <p className="text-destructive text-xs mt-1">{form.formState.errors.whatsapp.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Input
                      id="website"
                      type="url"
                      placeholder="Website URL (optional)"
                      className="bg-background/80 border-input text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...form.register('website')}
                    />
                    {form.formState.errors.website && (
                      <p className="text-destructive text-xs mt-1">{form.formState.errors.website.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <textarea
                      id="projectDetails"
                      rows={4}
                      placeholder="Tell us about your project..."
                      className="flex w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...form.register('projectDetails')}
                    />
                    {form.formState.errors.projectDetails && (
                      <p className="text-destructive text-xs mt-1">{form.formState.errors.projectDetails.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 text-white font-medium py-2.5 px-6 rounded-md transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-base sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                        Sending...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4 inline" />
                        Message Sent!
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center text-xs text-muted-foreground/70">
                <p>We respect your privacy. Your information is secure with us.</p>
              </div>
            </div>
            
            {/* Right Column - Info */}
            <div className="bg-gradient-to-b from-primary/90 to-primary p-4 sm:p-8 md:p-10 flex flex-col justify-between text-white min-h-[300px]">
              <div>
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">What to Expect</h3>
                  <p className="text-white/80 text-sm">
                    Our team will review your request and contact you within 24 hours to discuss your project in detail.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-white">No Obligation</h4>
                      <p className="text-xs text-white/80">This consultation is completely free with no strings attached.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Expert Advice</h4>
                      <p className="text-xs text-white/80">Get insights from our experienced development team.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Custom Solution</h4>
                      <p className="text-xs text-white/80">Tailored recommendations for your specific needs.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Prefer to talk?</p>
                    <a href="tel:+11234567890" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
