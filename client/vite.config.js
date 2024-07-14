import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/maps/api/place/autocomplete/json': {
        target: 'https://maps.googleapis.com', // Replace with the actual API server if different
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


