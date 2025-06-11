import React, { ReactNode, lazy, Suspense } from 'react';
import Footer from './footer';

// Dynamically import components to reduce bundle size
const ThemeToggleButton = lazy(() => import('./ThemeToggleButton'));
const ScrollNavigation = lazy(() => import('./ScrollNavigation'));

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ThemeToggleButton />
        <ScrollNavigation />
      </Suspense>
    </div>
  );
};

export default Layout;
