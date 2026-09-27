import { CartItem, Currency, OrderReceipt } from '../types';
import { formatPrice, formatRealCost } from './formatters';

export interface StoryReceiptSnapshot {
  orderNumber: string;
  items: CartItem[];
  subtotalMsrp: number;
  date?: string;
}

export interface StoryReceiptDrawOptions {
  receipt: OrderReceipt | StoryReceiptSnapshot;
  creatorHandle?: string;
  currency?: Currency;
  remixUrl?: string;
}

/**
 * Draws a sharp, high-resolution 1080x1920 (9:16) Instagram / TikTok Story card onto an HTML Canvas.
 */
export function drawStoryReceipt(
  ctx: CanvasRenderingContext2D,
  {
    receipt,
    creatorHandle = '@OverkillKing',
    currency = 'USD',
    remixUrl = window.location.href,
  }: StoryReceiptDrawOptions
): void {
  const width = 1080;
  const height = 1920;

  // 1. Background Parchment Color
  ctx.fillStyle = '#faf9f6';
  ctx.fillRect(0, 0, width, height);

  // Subtle paper grain / soft gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#fdfdfb');
  bgGrad.addColorStop(0.5, '#f7f6f2');
  bgGrad.addColorStop(1, '#f2f0eb');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Outer Didone Editorial Border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#1a1c1a';
  ctx.strokeRect(50, 50, width - 100, height - 100);

  // Inner hairline border
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#1a1c1a';
  ctx.strokeRect(66, 66, width - 132, height - 132);

  // 3. Watermark: "VOID • ZERO DEBT"
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-35 * Math.PI) / 180);
  ctx.font = '900 190px "Bodoni Moda", "Times New Roman", serif';
  ctx.fillStyle = 'rgba(26, 28, 26, 0.035)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZERO DEBT', 0, -80);
  ctx.fillText('VOID', 0, 100);
  ctx.restore();

  // 4. Receipt Header Jagged Edge simulation
  ctx.fillStyle = '#ba0900';
  ctx.fillRect(80, 80, width - 160, 16);

  // 5. Brand Logo & Title
  const centerX = width / 2;
  let cursorY = 160;

  // Brand Icon Circle
  ctx.fillStyle = '#1a1c1a';
  ctx.beginPath();
  ctx.arc(centerX, cursorY, 36, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Bodoni Moda", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('F', centerX, cursorY + 2);

  cursorY += 68;
  ctx.fillStyle = '#1a1c1a';
  ctx.font = '900 48px "Bodoni Moda", "Times New Roman", serif';
  ctx.fillText('FAKE SHOPPING', centerX, cursorY);

  cursorY += 40;
  ctx.fillStyle = '#ba0900';
  ctx.font = '800 20px "Hanken Grotesk", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('OFFICIAL MEME RECEIPT • ZERO LIABILITIES', centerX, cursorY);

  cursorY += 34;
  ctx.fillStyle = '#5d5c5b';
  ctx.font = '600 18px "Courier New", monospace';
  ctx.fillText(`ORDER: ${receipt.orderNumber} • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, centerX, cursorY);

  // Dashed divider line
  cursorY += 42;
  drawDashedLine(ctx, 120, cursorY, width - 120, cursorY, 12, 8, '#1a1c1a', 3);

  // 6. Creator & Challenge Banner
  cursorY += 60;
  ctx.fillStyle = '#ffe8e4';
  roundRect(ctx, 140, cursorY - 10, width - 280, 56, 28);
  ctx.fill();
  ctx.strokeStyle = '#ba0900';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ba0900';
  ctx.font = '800 20px "Hanken Grotesk", sans-serif';
  ctx.fillText(`CHALLENGED BY ${creatorHandle.toUpperCase()}`, centerX, cursorY + 26);

  cursorY += 95;
  ctx.fillStyle = '#ba0900';
  ctx.font = '900 58px "Bodoni Moda", "Times New Roman", serif';
  ctx.fillText('CAN YOU BEAT MY CART?', centerX, cursorY);

  // 7. Total Fictional Damage (Massive Didone Typography)
  cursorY += 90;
  ctx.fillStyle = '#5d5c5b';
  ctx.font = '800 22px "Hanken Grotesk", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('TOTAL FICTIONAL DAMAGE', centerX, cursorY);

  cursorY += 80;
  const formattedDamage = formatPrice(receipt.subtotalMsrp, currency);
  ctx.fillStyle = '#ba0900';
  // Adjust font size if total is extremely long
  const damageFontSize = formattedDamage.length > 12 ? 82 : formattedDamage.length > 9 ? 94 : 108;
  ctx.font = `900 ${damageFontSize}px "Bodoni Moda", "Times New Roman", serif`;
  ctx.fillText(formattedDamage, centerX, cursorY);

  // 8. Mint Green Pill: Real Billed $0.00
  cursorY += 68;
  const realBilledText = `REAL BILLED: ${formatRealCost(currency)} (PAID IN FULL)`;
  ctx.font = '900 24px "Hanken Grotesk", sans-serif';
  const pillWidth = Math.max(480, ctx.measureText(realBilledText).width + 64);
  const pillHeight = 56;

  ctx.fillStyle = '#6cf8bb';
  roundRect(ctx, centerX - pillWidth / 2, cursorY - pillHeight / 2, pillWidth, pillHeight, 28);
  ctx.fill();
  ctx.strokeStyle = '#006c49';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#005236';
  ctx.fillText(realBilledText, centerX, cursorY + 8);

  // Dashed divider line
  cursorY += 60;
  drawDashedLine(ctx, 120, cursorY, width - 120, cursorY, 12, 8, '#1a1c1a', 3);

  // 9. Itemized Acquisitions List
  cursorY += 45;
  ctx.fillStyle = '#1a1c1a';
  ctx.font = '800 22px "Hanken Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`ACQUISITIONS (${receipt.items.length} ITEMS)`, 130, cursorY);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#5d5c5b';
  ctx.font = '600 18px "Courier New", monospace';
  ctx.fillText('REAL COST', width - 130, cursorY);

  cursorY += 25;
  // White panel for list
  const listStartY = cursorY;
  const maxDisplayItems = Math.min(receipt.items.length, 5);
  const listHeight = maxDisplayItems * 72 + (receipt.items.length > 5 ? 54 : 30);

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 120, listStartY, width - 240, listHeight, 16);
  ctx.fill();
  ctx.strokeStyle = '#1a1c1a';
  ctx.lineWidth = 2;
  ctx.stroke();

  let itemCursorY = listStartY + 48;
  for (let i = 0; i < maxDisplayItems; i++) {
    const item = receipt.items[i];
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1a1c1a';
    ctx.font = '700 24px "Hanken Grotesk", sans-serif';

    const itemLabel = `${item.quantity}x ${item.product.title}`;
    // Truncate if too long
    const maxTextWidth = 520;
    let truncated = itemLabel;
    if (ctx.measureText(truncated).width > maxTextWidth) {
      while (ctx.measureText(truncated + '...').width > maxTextWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
      }
      truncated += '...';
    }
    ctx.fillText(truncated, 150, itemCursorY);

    // MSRP sublabel
    ctx.fillStyle = '#ba0900';
    ctx.font = '800 20px "Bodoni Moda", serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatPrice(item.product.msrp * item.quantity, currency, { compact: true }), width - 260, itemCursorY);

    // Real Cost $0.00
    ctx.fillStyle = '#006c49';
    ctx.font = '800 20px "Hanken Grotesk", sans-serif';
    ctx.fillText(formatRealCost(currency), width - 150, itemCursorY);

    itemCursorY += 72;
  }

  if (receipt.items.length > 5) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#5d5c5b';
    ctx.font = 'italic 600 20px "Hanken Grotesk", sans-serif';
    ctx.fillText(`+ ${receipt.items.length - 5} more lavish delusions in cart`, 150, itemCursorY - 14);
  }

  cursorY = listStartY + listHeight + 50;

  // 10. Barcode Section
  drawBarcode(ctx, centerX, cursorY, 480, 68);

  cursorY += 95;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#5d5c5b';
  ctx.font = '700 18px "Courier New", monospace';
  ctx.letterSpacing = '6px';
  ctx.fillText('100% GUARANTEED NON-EXISTENT DEBT', centerX, cursorY);

  // 11. Bottom Remix Challenge Invitation Callout
  cursorY += 56;
  ctx.fillStyle = '#1a1c1a';
  roundRect(ctx, 120, cursorY, width - 240, 96, 20);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px "Hanken Grotesk", sans-serif';
  ctx.fillText('REMIX THIS CART & BEAT MY DAMAGE:', centerX, cursorY + 38);

  ctx.fillStyle = '#6cf8bb';
  ctx.font = '700 18px "Courier New", monospace';
  const cleanUrl = remixUrl.replace(/^https?:\/\//, '').slice(0, 48);
  ctx.fillText(cleanUrl.length >= 48 ? cleanUrl + '...' : cleanUrl, centerX, cursorY + 68);
}

function drawDashedLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dash: number,
  gap: number,
  color: string,
  width: number
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash([dash, gap]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBarcode(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  width: number,
  height: number
) {
  const bars = [
    3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 4, 1, 2,
    3, 2, 1, 4, 3, 1, 2, 4, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3,
  ];
  const totalUnits = bars.reduce((a, b) => a + b, 0);
  const unitWidth = width / totalUnits;
  let startX = centerX - width / 2;

  ctx.fillStyle = '#1a1c1a';
  for (let i = 0; i < bars.length; i++) {
    const barWidth = bars[i] * unitWidth;
    if (i % 2 === 0) {
      ctx.fillRect(startX, y, barWidth, height);
    }
    startX += barWidth;
  }
}

/**
 * Creates and renders an offscreen canvas of the story receipt, returning an HTMLCanvasElement.
 */
export function createStoryReceiptCanvas(options: StoryReceiptDrawOptions): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    drawStoryReceipt(ctx, options);
  }
  return canvas;
}

/**
 * Returns a Promise that resolves with a PNG Blob of the 1080x1920 story receipt card.
 */
export async function generateStoryReceiptBlob(
  options: StoryReceiptDrawOptions
): Promise<Blob> {
  const canvas = createStoryReceiptCanvas(options);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate PNG blob from canvas'));
      }
    }, 'image/png');
  });
}

/**
 * Returns a real File object for mobile native sharing with navigator.share({ files: [file] }).
 */
export async function getStoryReceiptFile(
  options: StoryReceiptDrawOptions
): Promise<File> {
  const blob = await generateStoryReceiptBlob(options);
  const filename = `fake-shopping-receipt-${options.receipt.orderNumber}.png`;
  return new File([blob], filename, { type: 'image/png' });
}

/**
 * Triggers an immediate browser download of the 1080x1920 Instagram Story receipt card.
 */
export async function downloadStoryReceiptImage(
  options: StoryReceiptDrawOptions
): Promise<void> {
  const blob = await generateStoryReceiptBlob(options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fake-shopping-story-receipt-${options.receipt.orderNumber}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
