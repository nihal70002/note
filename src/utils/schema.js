import { SITE_URL, absoluteUrl, productDescription } from './seo';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Papercues',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
};

export const productSchema = (product, path) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: productDescription(product),
  image: [product.image, product.image2, product.image3, product.image4, product.image5].filter(Boolean).map((image) => absoluteUrl(image)),
  offers: {
    '@type': 'Offer',
    url: absoluteUrl(path),
    priceCurrency: 'INR',
    price: String(product.price || 0),
    availability: Number(product.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  },
});
