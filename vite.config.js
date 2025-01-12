import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';


export default defineConfig({
  plugins: [vue()],
  server: {
    proxy : {
      '/api/': {
        target: 'https://elixir-api-st9s.onrender.com/',
        changeOrigin: true,
      }
    },
    host: true
  },
});