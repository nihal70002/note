export const SITE_URL = 'https://papercues.in';
export const DEFAULT_TITLE = 'Papercues India | Premium Journals, Diaries & Aesthetic Notebooks';
export const DEFAULT_DESCRIPTION = 'Shop premium journals, aesthetic notebooks, planners and creative stationery at Papercues India. Designed for writing, planning and self-expression.';
export const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const getProductPath = (product) => {
  const slug = slugify(product?.name) || 'product';
  return `/product/${slug}--${product?.id}`;
};

export const getProductIdFromSlug = (slug) => {
  const value = String(slug || '');
  if (value.includes('--')) {
    return value.slice(value.lastIndexOf('--') + 2) || value;
  }
  const uuidMatch = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  if (uuidMatch) return uuidMatch[0];
  const parts = value.split('-');
  return parts[parts.length - 1] || value;
};

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const productDescription = (product) => {
  const name = product?.name || 'premium aesthetic journal';
  return `Buy ${name} from Papercues India. Premium aesthetic journal and notebook for writing, planning, journaling, gifting and creative self-expression.`;
};

export const productTitle = (product) => {
  const name = product?.name || 'Premium Aesthetic Journal';
  return `${name} | Premium Aesthetic Journal | Papercues India`;
};
