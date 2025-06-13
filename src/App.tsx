import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import Products from "./pages/Products";



const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <>
                  <SEO 
                    title="Home" 
                    description="Frooxi offers professional IT services including Web Development, App Development, SEO, UI/UX Design, and Cyber Security solutions." 
                  />
                  <Index />
                </>
              } />
              <Route path="/services" element={
                <>
                  <SEO 
                    title="Our Services" 
                    description="Explore our comprehensive IT services including custom software development, web applications, mobile apps, and digital solutions." 
                  />
                  <Services />
                </>
              } />
              <Route path="/portfolio" element={
                <>
                  <SEO 
                    title="Our Work" 
                    description="Check out our portfolio of successful projects and case studies showcasing our expertise in delivering high-quality IT solutions." 
                  />
                  <Portfolio />
                </>
              } />
              <Route path="/products" element={
                <>
                  <SEO 
                    title="Our Products" 
                    description="Discover our innovative software products designed to solve complex business challenges and drive growth." 
                  />
                  <Products />
                </>
              } />
              <Route path="/company" element={
                <>
                  <SEO 
                    title="About Us" 
                    description="Learn about Frooxi - a leading IT solutions provider with expertise in software development, design, and digital transformation." 
                  />
                  <Company />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <SEO 
                    title="Contact Us" 
                    description="Get in touch with our team to discuss your project requirements and how we can help your business grow." 
                  />
                  <Contact />
                </>
              } />
             
              <Route path="*" element={
                <>
                  <SEO 
                    title="Page Not Found" 
                    description="The page you are looking for doesn't exist or has been moved." 
                  />
                  <NotFound />
                </>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
