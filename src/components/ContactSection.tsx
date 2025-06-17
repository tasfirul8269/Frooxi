import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { submitContactForm } from '@/lib/api/contactService';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SectionHeading } from './section-heading';
import { Mail, Phone, MapPin, Clock, User, Smartphone, MessageSquare, DollarSign, Send, Layers } from 'lucide-react';

interface ContactSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ sectionRef }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [customBudget, setCustomBudget] = useState('');
  const [showCustomBudget, setShowCustomBudget] = useState(false);

  const services = [
    'Web Development',
    'App Development',
    'UI/UX Design',
    'SEO',
    'Cyber Security'
  ];

  const budgets = [
    { value: '2k-5k', label: '$2k-$5k' },
    { value: '5k-10k', label: '$5k-$10k' },
    { value: '10k-20k', label: '$10k-$20k' },
    { value: '20k-50k', label: '$20k-$50k' },
    { value: '50k+', label: '$50k+' },
    { value: 'custom', label: 'Custom' }
  ];

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitMutation = useMutation({
    mutationFn: async (formData: any) => {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: `New message from ${formData.name} - ${selectedServices.join(', ') || 'General Inquiry'}`,
        message: `Phone: ${formData.phone}\n\nMessage: ${formData.message}\n\nServices: ${selectedServices.join(', ') || 'Not specified'}\nBudget: ${selectedBudget === 'custom' ? customBudget : selectedBudget || 'Not specified'}`
      };
      return await submitContactForm(payload);
    },
    onSuccess: () => {
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setSelectedServices([]);
      setSelectedBudget('');
      setCustomBudget('');
      setShowCustomBudget(false);
      
      toast.success('Message sent successfully!', {
        description: 'We will get back to you soon.',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to send message', {
        description: error.message || 'Please try again later.',
        duration: 5000,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    submitMutation.mutate(formData);
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden bg-background" ref={sectionRef}>
      {/* Gradient overlay that works in both themes */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-background/80 dark:from-gray-900/80 dark:via-gray-900/50 dark:to-gray-900/80"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          title="Get In Touch" 
          subtitle="Have a project in mind or just want to say hello? We'd love to hear from you." 
          alignment="center"
          className="text-foreground"
          titleClassName="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400"
          subtitleClassName="text-muted-foreground max-w-2xl mx-auto"
        />
        
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-4 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="glass-card p-6 rounded-2xl border border-border/50 bg-background/80 dark:bg-gradient-to-br dark:from-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl shadow-lg shadow-purple-500/10 dark:shadow-purple-900/10">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 mb-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-500/20 dark:to-indigo-500/20 flex items-center justify-center mr-2">
                  <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                Send Us a Message
              </h3>
              {/* First Row: Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                      placeholder="John Doe"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Second Row: Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                      placeholder="your@email.com"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                      placeholder="+1 (555) 000-0000"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Message Textarea */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                  required
                />
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
          
          <div className="lg:col-span-7 space-y-6">
            {/* Services Card */}
            <div className="glass-card p-6 rounded-2xl border border-border/50 bg-background/80 dark:bg-gradient-to-br dark:from-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl shadow-lg shadow-purple-500/10 dark:shadow-purple-900/10">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Services Needed
              </h3>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-lg',
                      selectedServices.includes(service)
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-muted text-foreground hover:bg-muted/80 border border-border hover:border-purple-500/30 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/70 dark:border-gray-700/50'
                    )}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Card */}
            <div className="glass-card p-6 rounded-2xl border border-border/50 bg-background/80 dark:bg-gradient-to-br dark:from-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl shadow-lg shadow-purple-500/10 dark:shadow-purple-900/10">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Project Budget
              </h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {budgets.map((budget) => (
                    <button
                      key={budget.value}
                      type="button"
                      onClick={() => {
                        setSelectedBudget(budget.value);
                        setShowCustomBudget(budget.value === 'custom');
                        if (budget.value !== 'custom') {
                          setCustomBudget('');
                        }
                      }}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-lg',
                        selectedBudget === budget.value
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-muted text-foreground hover:bg-muted/80 border border-border hover:border-purple-500/30 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/70 dark:border-gray-700/50'
                      )}
                    >
                      {budget.label}
                    </button>
                  ))}
                </div>
                {showCustomBudget && (
                  <Input
                    type="text"
                    placeholder="Enter custom amount"
                    value={customBudget}
                    onChange={(e) => setCustomBudget(e.target.value)}
                    className="w-full bg-background/50 dark:bg-gray-800/50 border border-input text-foreground placeholder-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-purple-500/30 focus:bg-background/70 dark:focus:bg-gray-800/70"
                  />
                )}
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="glass-card p-6 rounded-2xl border border-border/50 bg-background/80 dark:bg-gradient-to-br dark:from-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl shadow-lg shadow-purple-500/10 dark:shadow-purple-900/10">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 mb-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-500/20 dark:to-indigo-500/20 flex items-center justify-center mr-2">
                  <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 backdrop-blur-sm flex items-center justify-center border border-border/50 group-hover:border-purple-500/30 transition-all duration-300">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-foreground">Our Location</h4>
                    <p className="mt-1 text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 hover:from-foreground hover:to-purple-600 dark:hover:from-white dark:hover:to-purple-200 transition-colors">
                      123 Tech Street, Silicon Valley, CA 94025
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 backdrop-blur-sm flex items-center justify-center border border-border/50 group-hover:border-purple-500/30 transition-all duration-300">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-foreground">Email Us</h4>
                    <a href="mailto:info@frooxi.com" className="mt-1 text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 hover:from-foreground hover:to-purple-600 dark:hover:from-white dark:hover:to-purple-200 transition-colors">
                      info@frooxi.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 backdrop-blur-sm flex items-center justify-center border border-border/50 group-hover:border-purple-500/30 transition-all duration-300">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-foreground">Call Us</h4>
                    <a href="tel:+11234567890" className="mt-1 text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 hover:from-foreground hover:to-purple-600 dark:hover:from-white dark:hover:to-purple-200 transition-colors">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
