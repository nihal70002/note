import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_API_BASE_URL,
  SITE_URL,
  escapeXml,
  productImages,
  productPath,
  productTitle,
  absoluteImageUrl
} from './product-seo.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const publicDir = resolve(rootDir, 'public');
const sitemapPath = resolve(publicDir, 'sitemap.xml');

const loadEnvFiles = async () => {
  const envFiles = ['.env', '.env.local', '.env.production', '.env.production.local'];

  for (const file of envFiles) {
    const filePath = resolve(rootDir, file);
    if (!existsSync(filePath)) continue;

    const contents = await readFile(filePath, 'utf8');
    contents.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) return;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
  }
};

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/shop', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
];

const normalizeBaseUrl = (url) => String(url || '')
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

const getApiBaseUrl = () => normalizeBaseUrl(
  process.env.VITE_API_BASE_URL
    || process.env.API_BASE_URL
    || DEFAULT_API_BASE_URL
);

const extractProducts = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const isValidProduct = (product) => {
  const id = product?.id ?? product?._id ?? product?.productId;
  return id !== undefined && id !== null && String(id).trim() !== '';
};

const fetchJson = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'PapercuesSitemapGenerator/1.0 (+https://papercues.in)',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const fetchProducts = async () => {
  const apiBaseUrl = getApiBaseUrl();
  const endpoints = [
    `${apiBaseUrl}/api/products`,
    `${apiBaseUrl}/products`,
  ];

  console.log(`[sitemap] Site URL: ${SITE_URL}`);
  console.log(`[sitemap] API base URL: ${apiBaseUrl}`);

  for (const endpoint of endpoints) {
    try {
      console.log(`[sitemap] Fetching products from ${endpoint}`);
      const payload = await fetchJson(endpoint);
      const products = extractProducts(payload).filter(isValidProduct);
      console.log(`[sitemap] Found ${products.length} valid products from ${endpoint}`);
      return products;
    } catch (error) {
      console.warn(`[sitemap] Product fetch failed for ${endpoint}: ${error.message}`);
    }
  }

  const message = '[sitemap] Could not fetch products from any configured endpoint.';
  if (process.env.SITEMAP_REQUIRE_PRODUCTS === 'true' || process.env.VERCEL === '1') {
    throw new Error(`${message} Set a reachable VITE_API_BASE_URL in Vercel project environment variables.`);
  }

  console.warn(`${message} Generating static sitemap only because SITEMAP_REQUIRE_PRODUCTS is not true.`);
  return [];
};

const buildUrls = (products) => {
  const productPages = products.map((product) => ({
    path: productPath(product),
    changefreq: 'weekly',
    priority: '0.8',
    product,
  }));

  const dedupedUrls = new Map();
  [...staticPages, ...productPages].forEach((url) => {
    const loc = `${SITE_URL}${url.path}`;
    if (!dedupedUrls.has(loc)) {
      dedupedUrls.set(loc, { ...url, loc });
    }
  });

  return [...dedupedUrls.values()];
};

const imageXml = (product) => productImages(product).map((image) => `    <image:image>
      <image:loc>${escapeXml(absoluteImageUrl(image))}</image:loc>
      <image:title>${escapeXml(productTitle(product))}</image:title>
      <image:caption>${escapeXml(`${product?.name || 'Papercues'} aesthetic A5 notebook by Papercues`)}</image:caption>
    </image:image>`).join('\n');

const generateSitemapXml = (urls) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.product ? `\n${imageXml(url.product)}` : ''}
  </url>`).join('\n')}
</urlset>
`;

const validateSitemap = (xml, urls) => {
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    throw new Error('Sitemap must start with an XML declaration.');
  }

  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    throw new Error('Sitemap must include the standard sitemap.org urlset namespace.');
  }

  const uniqueLocs = new Set(urls.map((url) => url.loc));
  if (uniqueLocs.size !== urls.length) {
    throw new Error('Sitemap contains duplicate URLs.');
  }

  urls.forEach((url) => {
    if (!url.loc.startsWith(`${SITE_URL}/`)) {
      throw new Error(`Invalid sitemap URL: ${url.loc}`);
    }
  });
};

await loadEnvFiles();

let products = [];
try {
  products = await fetchProducts();
} catch (error) {
  console.log('[sitemap] Product fetch failed:', error.message);
  products = [];
}

const urls = buildUrls(products);
const sitemap = generateSitemapXml(urls);

try {
  validateSitemap(sitemap, urls);
} catch (error) {
  console.log('[sitemap] Validation error:', error.message);
}

try {
  await mkdir(publicDir, { recursive: true });
  await writeFile(sitemapPath, sitemap);
} catch (error) {
  console.log('[sitemap] Write error:', error.message);
}

console.log(`[sitemap] Generated sitemap.xml at ${sitemapPath}`);
console.log(`[sitemap] Total URLs: ${urls.length}`);
console.log(`[sitemap] Static URLs: ${staticPages.length}`);
console.log(`[sitemap] Product URLs: ${urls.length - staticPages.length}`);
console.log(`[sitemap] Duplicate URLs removed: ${staticPages.length + products.length - urls.length}`);
