import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // This effect ensures we only render the button after mounting (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server or during hydration
  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 bg-background/80 backdrop-blur-sm hover:bg-background/100 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggleButton;
