import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Team from "./pages/Team";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import PortfolioPage from "./pages/admin/PortfolioPage";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [initialCheck, setInitialCheck] = useState(true);

  useEffect(() => {
    // After initial check, mark as not initial
    const timer = setTimeout(() => setInitialCheck(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state only during initial check or when explicitly loading
  if (loading && initialCheck) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login with return location
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Import all admin pages
import UsersPage from "./pages/admin/UsersPage";
import TeamPage from "./pages/admin/TeamPage";
import TestimonialsPage from "./pages/admin/TestimonialsPage";
import SubscriptionsPage from "./pages/admin/SubscriptionsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ContactMessagesPage from "./pages/admin/ContactMessagesPage";
import FinancePage from "./pages/admin/FinancePage";
import ConsultationsPage from "./pages/admin/ConsultationsPage";

// Admin Routes Component
const AdminRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="messages" element={<ContactMessagesPage />} />
        <Route path="consultations" element={<ConsultationsPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
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
            title="Our Portfolio" 
            description="Browse our portfolio of successful projects and see how we've helped businesses transform their digital presence." 
          />
          <Portfolio />
        </>
      } />
      <Route path="/company" element={
        <>
          <SEO 
            title="About Us" 
            description="Learn about Frooxi, a leading IT services company dedicated to delivering innovative digital solutions." 
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
      <Route path="/products" element={
        <>
          <SEO 
            title="Our Products" 
            description="Discover our range of digital products designed to help businesses succeed in the digital landscape." 
          />
          <Products />
        </>
      } />

      <Route path="/team" element={
        <>
          <SEO 
            title="Our Team" 
            description="Meet the talented professionals behind Frooxi who are dedicated to delivering exceptional digital solutions." 
          />
          <Team />
        </>
      } />

      {/* Admin Routes */}
      <Route path="/admin/login" 
        element={
          <>
            <SEO 
              title="Admin Login" 
              description="Access the Frooxi admin dashboard" 
            />
            <Login />
          </>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <AdminRoutes />
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
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
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
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
                        title="Our Portfolio" 
                        description="Browse our portfolio of successful projects and see how we've helped businesses transform their digital presence." 
                      />
                      <Portfolio />
                    </>
                  } />
                  <Route path="/company" element={
                    <>
                      <SEO 
                        title="About Us" 
                        description="Learn about Frooxi, a leading IT services company dedicated to delivering innovative digital solutions." 
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
                  <Route path="/products" element={
                    <>
                      <SEO 
                        title="Our Products" 
                        description="Discover our range of digital products designed to help businesses succeed in the digital landscape." 
                      />
                      <Products />
                    </>
                  } />
                  <Route path="/team" element={
                    <>
                      <SEO 
                        title="Our Team" 
                        description="Meet the talented professionals behind Frooxi who are dedicated to delivering exceptional digital solutions." 
                      />
                      <Team />
                    </>
                  } />
                  <Route path="/admin/login" element={
                    <>
                      <SEO 
                        title="Admin Login" 
                        description="Access the Frooxi admin dashboard" 
                      />
                      <Login />
                    </>
                  } />
                  <Route path="/admin/*" element={
                    <ProtectedRoute>
                      <AdminRoutes />
                    </ProtectedRoute>
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
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
