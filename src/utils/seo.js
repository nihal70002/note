export const SITE_URL = 'https://papercues.in';
export const DEFAULT_TITLE = 'Papercues | Premium Aesthetic Journals & Notebooks India';
export const DEFAULT_DESCRIPTION = 'Shop premium aesthetic journals, notebooks and planners at Papercues. Elegant stationery designed for students, journaling and gifting.';
export const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const getProductPath = (product) => {
  const slug = slugify(product?.name) || 'product';
  return `/product/${slug}-${product?.id}`;
};

export const getProductIdFromSlug = (slug) => {
  const value = String(slug || '');
  const parts = value.split('-');
  return parts[parts.length - 1] || value;
};

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const productDescription = (product) => {
  return `Buy ${product?.name || 'this product'} from Papercues. Premium aesthetic journal/notebook designed for journaling, gifting and students.`;
};
