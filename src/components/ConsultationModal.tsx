import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !email || !meetingDate || !meetingTime) {
      alert('Please fill in all required fields (Name, Email, Meeting Date, Meeting Time).');
      return;
    }
    console.log('Consultation Request:', {
      name,
      email,
      websiteUrl,
      socialLinks,
      meetingDate,
      meetingTime,
    });
    alert('Consultation request submitted! We will get back to you soon.');
    onClose(); // Close modal on submission
    // Reset form fields
    setName('');
    setEmail('');
    setWebsiteUrl('');
    setSocialLinks('');
    setMeetingDate('');
    setMeetingTime('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-[9999] p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      {/* Blur and dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-none" />
      {/* Modal content */}
      <div 
        className="relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mt-8 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Book a Free Consultation</h2>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name <span className="text-red-500">*</span></label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white" />
          </div>
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website URL (Optional)</label>
            <input type="url" id="websiteUrl" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white" />
          </div>
          <div>
            <label htmlFor="socialLinks" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Social Links (Optional, comma-separated)</label>
            <input type="text" id="socialLinks" value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="meetingDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Date <span className="text-red-500">*</span></label>
              <input type="date" id="meetingDate" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white" />
            </div>
            <div>
              <label htmlFor="meetingTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Time <span className="text-red-500">*</span></label>
              <input type="time" id="meetingTime" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white" />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800">
              Request Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationModal;
