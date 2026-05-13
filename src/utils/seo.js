export const SITE_URL = 'https://papercues.in';
export const DEFAULT_TITLE = 'Papercues India | Premium Journals, Diaries & Aesthetic Notebooks';
export const DEFAULT_DESCRIPTION = 'Shop premium journals, aesthetic notebooks, planners and creative stationery at Papercues India. Designed for writing, planning and self-expression.';
export const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
export const BRAND_NAME = 'Papercues';
export const DEFAULT_NOTEBOOK_SIZE = 'A5';
export const DEFAULT_PAPER_TYPE = '100 GSM paper';

export const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const buildProductSlug = (product) => {
  const baseSlug = slugify(product?.name || product?.title || 'papercues-notebook') || 'papercues-notebook';

  return baseSlug.includes('notebook') || baseSlug.includes('journal') || baseSlug.includes('diary')
    ? baseSlug
    : `${baseSlug}-aesthetic-notebook`;
};

export const getProductPath = (product) => `/product/${buildProductSlug(product)}`;

export const isLegacyProductSlug = (slug) => String(slug || '').includes('--')
  || /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(slug || ''));

export const getProductIdFromLegacySlug = (slug) => {
  const value = String(slug || '');
  if (value.includes('--')) {
    return value.slice(value.lastIndexOf('--') + 2) || value;
  }

  const uuidMatch = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  return uuidMatch?.[0] || value.split('-').at(-1) || value;
};

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const absoluteImageUrl = (image) => {
  if (!image) return DEFAULT_IMAGE;
  return absoluteUrl(image);
};

export const productTitle = (product) => {
  const name = product?.name || product?.title || 'Premium Aesthetic Notebook';
  const size = product?.size || DEFAULT_NOTEBOOK_SIZE;
  const paperType = product?.paperType || DEFAULT_PAPER_TYPE;
  const title = `${name} Aesthetic ${size} Notebook - ${paperType} Journal | ${BRAND_NAME}`;

  return title.length > 68 ? `${name} Aesthetic Notebook Journal | ${BRAND_NAME}` : title;
};

export const productMetaDescription = (product) => {
  const name = product?.name || 'Papercues aesthetic notebook';
  const category = product?.category || 'stationery';
  return `Buy ${name}, a premium aesthetic A5 notebook and journal from Papercues India. ${DEFAULT_PAPER_TYPE}, daily writing, journaling, study notes, diary planning and gifting. Shop ${category.toLowerCase()} stationery online.`;
};

export const productDescription = (product) => {
  const name = product?.name || 'Papercues aesthetic notebook';
  const category = product?.category || 'journals';
  const size = product?.size || DEFAULT_NOTEBOOK_SIZE;
  const paperType = product?.paperType || DEFAULT_PAPER_TYPE;
  const originalDescription = String(product?.description || '').trim();

  return [
    originalDescription,
    `${name} by Papercues is designed for anyone who wants an aesthetic notebook that feels thoughtful, premium and useful every day. This ${size} notebook works beautifully as a journal, diary, study notebook, planner or creative writing companion, with smooth ${paperType} that supports daily writing, journaling, lists, ideas and class notes.`,
    `The cover artwork gives the notebook a distinctive stationery look without feeling loud, making it easy to carry to college, work, cafes or your study desk. It is a practical choice for students, writers, creators and stationery lovers who want a notebook that looks good in photos and feels reliable in regular use.`,
    `Use it for bullet journaling, habit tracking, gratitude notes, travel memories, meeting notes, sketches, personal planning or gifting. If you are searching for a premium ${category.toLowerCase()} product, an aesthetic A5 notebook, a journal for daily writing, or a diary gift from an Indian stationery brand, ${name} brings together design, paper quality and everyday usability in a clean Papercues finish.`
  ].filter(Boolean).join(' ');
};

export const productImageAlt = (product, suffix = '') => {
  const name = product?.name || 'Papercues notebook';
  const detail = suffix ? ` ${suffix}` : '';
  return `${name} aesthetic A5 notebook by Papercues${detail}`;
};
