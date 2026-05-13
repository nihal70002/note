export const SITE_URL = 'https://papercues.in';
export const DEFAULT_API_BASE_URL = 'https://noteback-production.up.railway.app';
export const BRAND_NAME = 'Papercues';

export const escapeXml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export const escapeHtml = (value) => escapeXml(value);

export const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const productSlug = (product) => {
  const baseSlug = slugify(product?.name ?? product?.title ?? 'papercues-notebook') || 'papercues-notebook';
  return baseSlug.includes('notebook') || baseSlug.includes('journal') || baseSlug.includes('diary')
    ? baseSlug
    : `${baseSlug}-aesthetic-notebook`;
};

export const productPath = (product) => `/product/${productSlug(product)}`;

export const legacyProductPath = (product) => {
  const id = product?.id ?? product?._id ?? product?.productId;
  return id ? `/product/${slugify(product?.name ?? product?.title ?? 'product')}--${id}` : null;
};

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const absoluteImageUrl = (image) => {
  if (!image) return `${SITE_URL}/logo.png`;
  return absoluteUrl(image);
};

export const productTitle = (product) => {
  const name = product?.name || product?.title || 'Premium Aesthetic Notebook';
  return `${name} Aesthetic A5 Notebook - 100 GSM Paper Journal | ${BRAND_NAME}`;
};

export const productMetaDescription = (product) => {
  const name = product?.name || 'Papercues aesthetic notebook';
  return `Buy ${name}, a premium aesthetic A5 notebook and journal from Papercues India. 100 GSM paper for daily writing, journaling, study notes, diary planning and gifting.`;
};

export const productDescription = (product) => {
  const name = product?.name || 'Papercues aesthetic notebook';
  const category = product?.category || 'journals';
  const originalDescription = String(product?.description || '').trim();

  return [
    originalDescription,
    `${name} by Papercues is designed for anyone who wants an aesthetic notebook that feels thoughtful, premium and useful every day. This A5 notebook works beautifully as a journal, diary, study notebook, planner or creative writing companion, with smooth 100 GSM paper that supports daily writing, journaling, lists, ideas and class notes.`,
    `The cover artwork gives the notebook a distinctive stationery look without feeling loud, making it easy to carry to college, work, cafes or your study desk. It is a practical choice for students, writers, creators and stationery lovers who want a notebook that looks good in photos and feels reliable in regular use.`,
    `Use it for bullet journaling, habit tracking, gratitude notes, travel memories, meeting notes, sketches, personal planning or gifting. If you are searching for a premium ${category.toLowerCase()} product, an aesthetic A5 notebook, a journal for daily writing, or a diary gift from an Indian stationery brand, ${name} brings together design, paper quality and everyday usability in a clean Papercues finish.`
  ].filter(Boolean).join(' ');
};

export const productImages = (product) => [
  product?.image,
  product?.image2,
  product?.image3,
  product?.image4,
  product?.image5
].filter(Boolean);

export const productImageAlt = (product) => `${product?.name || 'Papercues'} aesthetic A5 notebook by Papercues`;

export const productJsonLd = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: productTitle(product),
  description: productDescription(product),
  image: productImages(product).map(absoluteImageUrl),
  sku: String(product?.id ?? product?._id ?? product?.productId ?? ''),
  brand: {
    '@type': 'Brand',
    name: BRAND_NAME,
  },
  aggregateRating: Number(product?.averageRating || 0) > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: String(product.averageRating),
    reviewCount: String(product.reviewCount || 1),
  } : undefined,
  offers: {
    '@type': 'Offer',
    url: absoluteUrl(productPath(product)),
    priceCurrency: 'INR',
    price: String(product?.price || 0),
    availability: Number(product?.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
  },
});

export const breadcrumbJsonLd = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_URL}/shop` },
    { '@type': 'ListItem', position: 3, name: product?.name || 'Product', item: absoluteUrl(productPath(product)) },
  ],
});
