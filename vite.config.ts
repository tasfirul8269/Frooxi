import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  // Define global constants for environment variables
  const envWithProcess = {
    'process.env': {
      ...env,
      // Ensure Vite replaces these during build
      VITE_API_URL: JSON.stringify(env.VITE_API_URL || 'https://frooxi-backend.onrender.com/api'),
      NODE_ENV: JSON.stringify(mode),
      PROD: JSON.stringify(mode === 'production')
    }
  };

  return {
    server: {
      host: '::',
      port: 8080,
      // Only use proxy in development
      proxy: mode === 'development' ? {
        '^/api': {
          target: 'https://frooxi-backend.onrender.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      } : undefined
    },
    define: envWithProcess,
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, './src')
        },
        {
          find: '@/components',
          replacement: path.resolve(__dirname, './src/components')
        },
        {
          find: '@/lib',
          replacement: path.resolve(__dirname, './src/lib')
        }
      ]
    },
    optimizeDeps: {
      include: ['@/components/**/*']
    }
  };
});
