
import React, { useState } from "react";
import { Layout } from "@/components/layout";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const validatedData = contactSchema.parse(formData);
      console.log("Form submitted:", validatedData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ContactFormData;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-background overflow-hidden">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Get In Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have a project in mind or questions about our services? We'd love to hear from you.
            </p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none grid-background"></div>
      </section>
      
      {/* Contact Info Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary mx-auto">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Our Location</h3>
              <p className="text-muted-foreground">
                123 Tech Boulevard<br />
                Suite 456<br />
                San Francisco, CA 94105
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary mx-auto">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-2">
                <a href="mailto:info@frooxi.com" className="hover:text-primary transition-colors">
                  info@frooxi.com
                </a>
              </p>
              <p className="text-muted-foreground">
                <a href="mailto:support@frooxi.com" className="hover:text-primary transition-colors">
                  support@frooxi.com
                </a>
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary mx-auto">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-2">
                <a href="tel:+18005551234" className="hover:text-primary transition-colors">
                  +1 (800) 555-1234
                </a>
              </p>
              <p className="text-muted-foreground">
                <a href="tel:+18005554321" className="hover:text-primary transition-colors">
                  +1 (800) 555-4321
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-16 bg-muted/20 dark:bg-muted/5">
        <div className="container">
          <SectionHeading 
            title="Send Us a Message" 
            subtitle="Fill out the form below and we'll get back to you as soon as possible."
          />
          
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number (optional)
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject <span className="text-destructive">*</span>
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? "border-destructive" : ""}
                />
                {errors.subject && (
                  <p className="text-sm text-destructive">{errors.subject}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
              </div>
              
              <div>
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16">
        <div className="container">
          <div className="h-96 rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.45489411881!2d-122.4337512!3d37.7690242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1684456132258!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Frooxi office location"
            ></iframe>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-muted/20 dark:bg-muted/5">
        <div className="container">
          <SectionHeading 
            title="Frequently Asked Questions" 
            subtitle="Find answers to common questions about working with us."
          />
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-xl font-bold mb-2">How long does a typical project take?</h3>
                <p className="text-muted-foreground">
                  Project timelines vary based on complexity and scope. A simple website might take 4-6 weeks, while a comprehensive web application or mobile app could take 3-6 months. We'll provide a detailed timeline during our initial consultation.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-xl font-bold mb-2">What's your pricing structure?</h3>
                <p className="text-muted-foreground">
                  We offer both project-based and retainer pricing models depending on your needs. Each project is quoted individually based on requirements, complexity, and timeline. We provide transparent pricing with no hidden costs.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-xl font-bold mb-2">Do you provide ongoing support after project completion?</h3>
                <p className="text-muted-foreground">
                  Yes! We offer maintenance packages and ongoing support to ensure your digital solution continues to perform optimally. Our support includes updates, security patches, and technical assistance.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-xl font-bold mb-2">Can you work with clients remotely?</h3>
                <p className="text-muted-foreground">
                  Absolutely. We work with clients globally using collaborative tools for seamless communication. Our process is designed to ensure effective collaboration regardless of location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
