import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar } from '@quasar/vite-plugin';
import fs from 'fs';
import path from 'path';


export default defineConfig({
  plugins: [
    vue(),
    quasar()
  ],

  server: {
    proxy : {
      '/api/': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
      }
    },
    host: true
  },
});