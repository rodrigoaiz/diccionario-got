import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';

const staticRoutes = ['/', '/diccionario/', '/mapa/', '/fuentes/'];

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async () => {
  const entries = await getCollection('entries');
  const entryRoutes = entries
    .filter(({ data }) => data.type !== 'Pendiente' && data.editorialStatus === 'revisada')
    .map(({ data }) => `/diccionario/${data.slug}/`);
  const routes = [...new Set([...staticRoutes, ...entryRoutes])];
  const urls = routes
    .map((route) => `  <url><loc>${escapeXml(new URL(route, `${SITE_URL}/`).href)}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
};
