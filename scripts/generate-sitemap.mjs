import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://papercues.in';
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://noteback-production.up.railway.app';
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

const escapeXml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const productPath = (product) => {
  const slug = slugify(product.name) || 'product';
  return `/product/${slug}-${product.id}`;
};

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/shop', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
];

const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error(`Products API returned ${response.status}`);
    const products = await response.json();
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.warn(`Could not fetch products for sitemap: ${error.message}`);
    return [];
  }
};

const products = await fetchProducts();
const urls = [
  ...staticPages,
  ...products.map((product) => ({
    path: productPath(product),
    changefreq: 'weekly',
    priority: '0.8',
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${url.path}`)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

await mkdir(publicDir, { recursive: true });
await writeFile(resolve(publicDir, 'sitemap.xml'), sitemap);
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
