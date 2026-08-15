import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './src/config/site.ts';

export default defineConfig({
  site: SITE_URL,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
