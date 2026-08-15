import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';

export const GET: APIRoute = () => {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
