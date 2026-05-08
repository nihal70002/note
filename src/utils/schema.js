import { SITE_URL, absoluteUrl, productDescription } from './seo';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Papercues',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Papercues India creates premium journals, aesthetic notebooks, planners and creative stationery for writing, planning and self-expression.',
  sameAs: [
    SITE_URL,
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Papercues',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/shop?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

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
    itemCondition: 'https://schema.org/NewCondition',
  },
  aggregateRating: Number(product.averageRating || 0) > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: String(product.averageRating),
    reviewCount: String(product.reviewCount || 1),
  } : undefined,
  brand: {
    '@type': 'Brand',
    name: 'Papercues',
  },
});

export const reviewSchema = (product, reviews = []) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  review: reviews.slice(0, 10).map((review) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.username || 'Papercues customer',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(review.rating || 5),
      bestRating: '5',
    },
    reviewBody: review.comment || '',
  })),
});
