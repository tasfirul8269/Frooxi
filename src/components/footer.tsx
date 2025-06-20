import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary-400">Frooxi</h3>
            <p className="text-gray-400">
              Empowering businesses with cutting-edge technology solutions and innovative digital experiences.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/frooxi.official" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.facebook.com/frooxi.official" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#team" className="text-gray-400 hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">App Development</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Web Development</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">UI/UX Design</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">SEO Services</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Cyber Security</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-primary-400" />
                <span className="text-gray-400">Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400" />
                <a href="mailto:info@frooxi.com" className="text-gray-400 hover:text-white transition-colors">
                  info@frooxi.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-400" />
                <a href="https://wa.me/+8801310846012" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  +8801310846012
                </a>
              </div>
              {/* <div className="flex items-center space-x-3">
                <FaClock className="text-primary-400" />
                <span className="text-gray-400">Mon - Fri: 9:00 - 18:00</span>
              </div> */}
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Frooxi. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
