import { DecodedRemixCart } from './remixCodec';
import { formatPrice } from './formatters';

function setMetaTag(selector: string, attribute: 'content', value: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    if (selector.startsWith('meta[name=')) {
      const name = selector.match(/name="([^"]+)"/)?.[1];
      if (name) element.setAttribute('name', name);
    } else if (selector.startsWith('meta[property=')) {
      const prop = selector.match(/property="([^"]+)"/)?.[1];
      if (prop) element.setAttribute('property', prop);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

/**
 * Dynamically updates document title and OpenGraph / Twitter card meta tags in the DOM.
 */
export function updateDocumentMetaTags(remixData: DecodedRemixCart | null): void {
  if (typeof document === 'undefined') return;

  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : '/';
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
  setMetaTag(
    'meta[name="robots"]',
    'content',
    remixData && remixData.items.length > 0 ? 'noindex,follow' : 'index,follow',
  );

  if (remixData && remixData.items.length > 0) {
    const formattedTotal = formatPrice(remixData.originalTotalMsrp, 'USD');
    const compactTotal = formatPrice(remixData.originalTotalMsrp, 'USD', { compact: true });
    const topItem = remixData.items[0]?.product;
    const topItemTitle = topItem?.title || 'Ultra Luxury Artifact';
    const topItemImage = topItem?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';

    const title = `Can you beat my cart? (${compactTotal} for $0) — Fake Shopping`;
    const description = `Challenged by ${remixData.creatorHandle} to beat their ${formattedTotal} fantasy cart featuring ${topItemTitle}. Indulge with $0 real cost!`;

    document.title = title;

    // Standard description
    setMetaTag('meta[name="description"]', 'content', description);

    // OpenGraph
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:image"]', 'content', topItemImage);
    setMetaTag('meta[property="og:type"]', 'content', 'website');
    if (typeof window !== 'undefined') {
      setMetaTag('meta[property="og:url"]', 'content', window.location.href);
    }

    // Twitter / X
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', topItemImage);
  } else {
    // Reset to default
    const defaultTitle = 'Fake Shopping Simulator | Spend Nothing';
    const defaultDesc =
      'Build an absurd luxury cart, challenge your friends, and indulge every irrational shopping urge in a satirical $0 fantasy simulator.';

    document.title = defaultTitle;
    setMetaTag('meta[name="description"]', 'content', defaultDesc);
    setMetaTag('meta[property="og:title"]', 'content', defaultTitle);
    setMetaTag('meta[property="og:description"]', 'content', defaultDesc);
    setMetaTag('meta[property="og:type"]', 'content', 'website');
    setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', defaultTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', defaultDesc);
  }
}
