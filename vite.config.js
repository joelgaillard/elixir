import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl'


export default defineConfig({
  plugins: [basicSsl(), vue()],
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