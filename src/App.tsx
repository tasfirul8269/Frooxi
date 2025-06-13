import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { AdminLayout } from "@/components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import PortfolioPage from "./pages/admin/PortfolioPage";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Admin Routes Component
const AdminRoutes: React.FC = () => (
  <ProtectedRoute>
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
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

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<Login />} />
                  <Route path="/admin/*" element={<AdminRoutes />} />

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
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
