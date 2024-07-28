import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/maps/api/place/autocomplete/json': {
        target: 'https://maps.googleapis.com', 
        changeOrigin: true,
        secure: false,
      },
      '/maps/api/place/details/json': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        secure: false,
      },
      '/maps/api/place/findplacefromtext/json': {
        target: 'https://maps.googleapis.com', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


