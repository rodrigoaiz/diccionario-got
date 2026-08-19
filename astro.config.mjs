import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './src/config/site.ts';

export default defineConfig({
  site: SITE_URL,
  redirects: {
    '/diccionario/caminante-blanco/': '/diccionario/caminantes-blancos/',
    '/diccionario/catelyn-tully/': '/diccionario/catelyn-stark/',
    '/diccionario/jenny-of-oldstones/': '/diccionario/cancion-de-jenny/',
    '/diccionario/jon-nieve/': '/diccionario/jon-snow/',
    '/diccionario/ramsay-nieve/': '/diccionario/ramsay-bolton/',
    '/diccionario/rebelion-de-robert/': '/diccionario/guerra-del-usurpador/',
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
