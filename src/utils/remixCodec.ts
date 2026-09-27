import { CartItem, Product } from '../types';
import { PRODUCTS } from '../data/products';

export interface SharedCartItemPayload {
  id: string;
  q: number;
}

export interface SharedCartPayload {
  v: 1;
  i: SharedCartItemPayload[];
  c?: string; // creator handle
  n?: string; // note / challenge message
  o?: string; // order reference if from receipt
  t?: number; // timestamp
}

export interface DecodedRemixCart {
  items: CartItem[];
  creatorHandle: string;
  challengeNote: string;
  orderNumber?: string;
  originalTotalMsrp: number;
  timestamp?: number;
}

/**
 * Encodes a cart into a compact, safe base64 URL parameter string.
 */
export function encodeCartForRemix(
  items: CartItem[],
  options?: {
    creatorHandle?: string;
    challengeNote?: string;
    orderNumber?: string;
  }
): string {
  try {
    const compactItems: SharedCartItemPayload[] = items.map((item) => ({
      id: item.product.id,
      q: Math.max(1, item.quantity),
    }));

    const payload: SharedCartPayload = {
      v: 1,
      i: compactItems,
      c: options?.creatorHandle || '@OverkillKing',
      n: options?.challengeNote || 'Can you beat my cart?',
      o: options?.orderNumber,
      t: Date.now(),
    };

    const jsonStr = JSON.stringify(payload);
    // Use encodeURIComponent to protect unicode characters, then btoa
    const base64 = btoa(encodeURIComponent(jsonStr));
    return base64;
  } catch (err) {
    console.error('Failed to encode cart for remix:', err);
    return '';
  }
}

/**
 * Decodes a base64 URL parameter back into fully populated CartItems matched to the catalog.
 */
export function decodeCartFromRemix(encodedString: string): DecodedRemixCart | null {
  try {
    if (!encodedString || typeof encodedString !== 'string') return null;

    const jsonStr = decodeURIComponent(atob(encodedString));
    const payload: SharedCartPayload = JSON.parse(jsonStr);

    if (!payload || !Array.isArray(payload.i) || payload.i.length === 0) {
      return null;
    }

    const reconstructedItems: CartItem[] = [];

    for (const itemPayload of payload.i) {
      const product = PRODUCTS.find((p) => p.id === itemPayload.id);
      if (product) {
        reconstructedItems.push({
          product,
          quantity: Math.max(1, Math.min(99, itemPayload.q || 1)),
          addedAt: Date.now(),
        });
      }
    }

    // If no matching products were found, fallback to first catalog item so it never breaks
    if (reconstructedItems.length === 0 && PRODUCTS.length > 0) {
      reconstructedItems.push({
        product: PRODUCTS[0],
        quantity: 1,
        addedAt: Date.now(),
      });
    }

    const originalTotalMsrp = reconstructedItems.reduce(
      (sum, item) => sum + item.product.msrp * item.quantity,
      0
    );

    return {
      items: reconstructedItems,
      creatorHandle: payload.c || '@OverkillKing',
      challengeNote: payload.n || 'Can you beat my cart?',
      orderNumber: payload.o,
      originalTotalMsrp,
      timestamp: payload.t,
    };
  } catch (err) {
    console.error('Failed to decode cart from remix:', err);
    return null;
  }
}

/**
 * Builds the full shareable URL with the ?remix= parameter encoded.
 */
export function buildShareableRemixUrl(
  items: CartItem[],
  options?: {
    creatorHandle?: string;
    challengeNote?: string;
    orderNumber?: string;
  }
): string {
  const code = encodeCartForRemix(items, options);
  if (!code) {
    return typeof window !== 'undefined' ? window.location.href : '';
  }

  if (typeof window === 'undefined') {
    return `/?remix=${code}`;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('remix', code);
  return url.toString();
}
