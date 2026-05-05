import { useEffect } from 'react';
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, DEFAULT_TITLE, absoluteUrl } from '../utils/seo';

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes.identity).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  Object.entries(attributes.values).forEach(([key, value]) => element.setAttribute(key, value));
};

const setLink = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const SEO = ({ title, description, path = '/', image, type = 'website', jsonLd }) => {
  useEffect(() => {
    const pageTitle = title || DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const canonical = absoluteUrl(path);
    const ogImage = absoluteUrl(image || DEFAULT_IMAGE);

    document.title = pageTitle;
    setMeta('meta[name="description"]', { identity: { name: 'description' }, values: { content: pageDescription } });
    setMeta('meta[property="og:title"]', { identity: { property: 'og:title' }, values: { content: pageTitle } });
    setMeta('meta[property="og:description"]', { identity: { property: 'og:description' }, values: { content: pageDescription } });
    setMeta('meta[property="og:image"]', { identity: { property: 'og:image' }, values: { content: ogImage } });
    setMeta('meta[property="og:url"]', { identity: { property: 'og:url' }, values: { content: canonical } });
    setMeta('meta[property="og:type"]', { identity: { property: 'og:type' }, values: { content: type } });
    setMeta('meta[name="twitter:card"]', { identity: { name: 'twitter:card' }, values: { content: 'summary_large_image' } });
    setLink('canonical', canonical);

    document.head.querySelectorAll('script[data-seo-json-ld="true"]').forEach((element) => element.remove());
    const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoJsonLd = 'true';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [title, description, path, image, type, jsonLd]);

  return null;
};

export default SEO;
