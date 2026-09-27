import { CartItem, Currency } from '../types';
import { formatPrice, formatRealCost } from './formatters';

export interface ChallengeShareData {
  items: CartItem[];
  creatorHandle: string;
  totalMsrp: number;
  remixUrl: string;
  orderNumber?: string;
  currency?: Currency;
}

/**
 * Detects whether the Web Share API is available on the current device.
 */
export function isNativeShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Detects if the user is on a mobile device or tablet.
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Builds high-converting viral challenge copy pre-filled for social platforms.
 */
export function buildChallengeCaption({
  items,
  creatorHandle,
  totalMsrp,
  remixUrl,
  orderNumber,
  currency = 'USD',
}: ChallengeShareData): string {
  const formattedTotal = formatPrice(totalMsrp, currency);
  const formattedReal = formatRealCost(currency);

  const topItems = items.slice(0, 3).map((item) => {
    return `• ${item.quantity > 1 ? `${item.quantity}x ` : ''}${item.product.title} (${formatPrice(item.product.msrp * item.quantity, currency, { compact: true })})`;
  });

  const remainingCount = items.length - 3;
  const moreText = remainingCount > 0 ? `• +${remainingCount} more outrageous luxuries\n` : '';

  return `🛍️ "CAN YOU BEAT MY CART?" 🛍️
I just blew ${formattedTotal} on Fake Shopping for exactly ${formattedReal} REAL.

Acquisitions:
${topItems.join('\n')}
${moreText}
🧾 Ref: ${orderNumber || 'SPREE-VERIFIED'}
💳 Charged: ${formattedReal} (Paid in Full)
🚫 Zero debt, zero liabilities, pure endorphins.

Remix my cart and try to out-spend me:
${remixUrl}`;
}

/**
 * Builds compact challenge text suited for character-limited platforms like X (Twitter).
 */
export function buildTwitterChallengeText({
  totalMsrp,
  creatorHandle,
  items,
  currency = 'USD',
}: Omit<ChallengeShareData, 'remixUrl'>): string {
  const formattedTotal = formatPrice(totalMsrp, currency);
  const topItem = items[0]?.product.title || 'pure luxury';
  return `Can you beat my cart? I just spent ${formattedTotal} on Fake Shopping (featuring ${topItem}) for $0.00 REAL! Remix my cart & try to out-spend me:`;
}

/**
 * Opens the native X / Twitter web share intent with pre-filled text and URL.
 */
export function openTwitterShare(text: string, url: string): void {
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}`;
  if (typeof window !== 'undefined') {
    window.open(twitterIntentUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  }
}

/**
 * Opens the Facebook web share dialog with pre-filled quote and URL.
 */
export function openFacebookShare(url: string, quote?: string): void {
  const params = new URLSearchParams({
    u: url,
    ...(quote ? { quote } : {}),
  });
  const fbIntentUrl = `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  if (typeof window !== 'undefined') {
    window.open(fbIntentUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  }
}

/**
 * Safe clipboard copy with fallback.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}

/**
 * Executes a native share or triggers the fallback callback if rejected or unsupported.
 */
export async function triggerNativeShare(
  data: {
    title: string;
    text: string;
    url: string;
    files?: File[];
  },
  onFallback?: () => void
): Promise<boolean> {
  if (isNativeShareSupported()) {
    try {
      // If files are provided and supported by canShare, include them
      if (
        data.files &&
        data.files.length > 0 &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: data.files })
      ) {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url,
          files: data.files,
        });
        return true;
      }

      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url,
      });
      return true;
    } catch (err: unknown) {
      // User cancelled share sheet (AbortError) or platform error
      if (err instanceof Error && err.name !== 'AbortError') {
        onFallback?.();
      }
      return false;
    }
  } else {
    onFallback?.();
    return false;
  }
}
