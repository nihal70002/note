import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_API_BASE_URL,
  SITE_URL,
  absoluteImageUrl,
  absoluteUrl,
  breadcrumbJsonLd,
  escapeHtml,
  legacyProductPath,
  productDescription,
  productImageAlt,
  productImages,
  productJsonLd,
  productMetaDescription,
  productPath,
  productTitle
} from './product-seo.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const publicDir = resolve(rootDir, 'public');
const distDir = resolve(rootDir, 'dist');
const distIndexPath = resolve(distDir, 'index.html');
const targetRootDir = existsSync(distIndexPath) ? distDir : publicDir;
const productDir = resolve(targetRootDir, 'product');
const redirectsPath = resolve(targetRootDir, '_redirects');

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
        'User-Agent': 'PapercuesProductPrerender/1.0 (+https://papercues.in)',
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

  for (const endpoint of endpoints) {
    try {
      console.log(`[product-pages] Fetching products from ${endpoint}`);
      const payload = await fetchJson(endpoint);
      const products = extractProducts(payload).filter(isValidProduct);
      console.log(`[product-pages] Found ${products.length} valid products from ${endpoint}`);
      return products;
    } catch (error) {
      console.warn(`[product-pages] Product fetch failed for ${endpoint}: ${error.message}`);
    }
  }

  if (process.env.SITEMAP_REQUIRE_PRODUCTS === 'true' || process.env.VERCEL === '1') {
    throw new Error('Could not fetch products for prerendered product pages.');
  }

  return [];
};

const stripDefaultSeo = (html) => html
  .replace(/<title>[\s\S]*?<\/title>/i, '')
  .replace(/\s*<meta\s+name=["']description["'][^>]*>\s*/gi, '\n')
  .replace(/\s*<meta\s+name=["']robots["'][^>]*>\s*/gi, '\n')
  .replace(/\s*<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, '\n')
  .replace(/\s*<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, '\n')
  .replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, '\n');

const injectHead = (html, headContent) => stripDefaultSeo(html).replace('</head>', `${headContent}\n  </head>`);

const injectBodyContent = (html, bodyContent) => html.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);

const renderProductHtml = (product, baseHtml) => {
  const path = productPath(product);
  const canonical = absoluteUrl(path);
  const title = productTitle(product);
  const metaDescription = productMetaDescription(product);
  const description = productDescription(product);
  const images = productImages(product);
  const mainImage = absoluteImageUrl(images[0]);
  const schemas = [productJsonLd(product), breadcrumbJsonLd(product)];

  const headContent = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(metaDescription)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(metaDescription)}" />
    <meta property="og:image" content="${escapeHtml(mainImage)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(mainImage)}" />
    ${schemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join('\n    ')}`;

  const bodyContent = `
    <main>
      <nav aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="/shop">Shop</a> / <a href="${escapeHtml(path)}">${escapeHtml(product?.name || 'Product')}</a>
      </nav>
      <article>
        <h1>${escapeHtml(title)}</h1>
        ${images.map((image, index) => `<img src="${escapeHtml(absoluteImageUrl(image))}" alt="${escapeHtml(productImageAlt(product))}${index ? ` detail image ${index + 1}` : ''}" loading="${index === 0 ? 'eager' : 'lazy'}" width="960" height="1200" />`).join('\n        ')}
        <p>${escapeHtml(description)}</p>
        <p>Price: INR ${escapeHtml(product?.price || 0)}</p>
        <p>Availability: ${Number(product?.stock || 0) > 0 ? 'In stock' : 'Out of stock'}</p>
        <p><a href="/shop">Browse more Papercues aesthetic notebooks and journals</a></p>
      </article>
      <script>
        window.__PAPERCUES_PRODUCT__ = ${JSON.stringify(product)};
      </script>
    </main>`;

  return injectBodyContent(injectHead(baseHtml, headContent), bodyContent);
};

const renderLegacyRedirectHtml = (fromPath, toPath) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${escapeHtml(absoluteUrl(toPath))}" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(toPath)}" />
    <title>Redirecting to Papercues product</title>
  </head>
  <body>
    <p>This product moved to <a href="${escapeHtml(toPath)}">${escapeHtml(absoluteUrl(toPath))}</a>.</p>
    <script>window.location.replace(${JSON.stringify(toPath)});</script>
  </body>
</html>
`;

await loadEnvFiles();

let products = [];
try {
  products = await fetchProducts();
} catch (error) {
  console.warn(`[product-pages] ${error.message}`);
}

if (products.length > 0) {
  await rm(productDir, { recursive: true, force: true });
}

const baseHtml = existsSync(distIndexPath)
  ? await readFile(distIndexPath, 'utf8')
  : '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body><div id="root"></div></body></html>';

const redirects = [];

for (const product of products) {
  const path = productPath(product);
  const targetDir = resolve(targetRootDir, `.${path}`);
  await mkdir(targetDir, { recursive: true });
  await writeFile(resolve(targetDir, 'index.html'), renderProductHtml(product, baseHtml));

  const legacyPath = legacyProductPath(product);
  if (legacyPath && legacyPath !== path) {
    const legacyDir = resolve(targetRootDir, `.${legacyPath}`);
    await mkdir(legacyDir, { recursive: true });
    await writeFile(resolve(legacyDir, 'index.html'), renderLegacyRedirectHtml(legacyPath, path));
    redirects.push(`${legacyPath} ${path} 301`);
  }
}

if (redirects.length > 0) {
  await writeFile(redirectsPath, `${redirects.join('\n')}\n`);
}

console.log(`[product-pages] Generated ${products.length} product HTML pages.`);
console.log(`[product-pages] Generated ${redirects.length} legacy redirect entries.`);
