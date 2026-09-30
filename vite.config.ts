import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import productsData from './src/data/products.json';

const defaultSiteUrl = 'https://unlimitedshopping.me';

function getSiteUrl(): string {
  return (process.env.VITE_SITE_URL || process.env.APP_URL || defaultSiteUrl).replace(/\/$/, '');
}

function seoFilesPlugin(): Plugin {
  const files: Record<string, { content: string; type: string }> = {
    '/robots.txt': {
      type: 'text/plain',
      content: `User-agent: *\nAllow: /\nSitemap: ${getSiteUrl()}/sitemap.xml\n`,
    },
    '/sitemap.xml': {
      type: 'application/xml',
      content: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${getSiteUrl()}/</loc></url></urlset>`,
    },
    '/llms.txt': {
      type: 'text/plain',
      content: `# Unlimited Shopping\n\n> Unlimited Shopping is a satirical fantasy-shopping simulator. Users build absurd carts, pay nothing, and can challenge friends.\n\n## Important context\n- No real products are sold.\n- All prices and product descriptions are fictional.\n- The application is free to use.\n\n## Homepage\n- ${getSiteUrl()}/\n`,
    },
    '/.well-known/ai-plugin.json': {
      type: 'application/json',
      content: JSON.stringify({
        schema_version: 'v1',
        name_for_human: 'Unlimited Shopping',
        name_for_model: 'fake_shopping',
        description_for_human: 'A satirical fantasy-shopping simulator where every purchase costs $0.',
        description_for_model: 'Use this site as an entertainment simulator. No real products are sold and no real purchases occur.',
        api: { type: 'none' },
      }),
    },
  };

  const serveFile = (req: { url?: string }, res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void }, next: () => void) => {
    const pathname = new URL(req.url || '/', 'http://localhost').pathname;
    const file = files[pathname];
    if (!file) {
      const isAppShellRequest = pathname === '/' || pathname === '/index.html';
      const isDevelopmentAsset = pathname.startsWith('/@') || pathname.startsWith('/src/') || pathname.startsWith('/node_modules/');
      if (!isAppShellRequest && !isDevelopmentAsset && !pathname.startsWith('/assets/')) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
        return;
      }
      next();
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', file.type);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(file.content);
  };

  return {
    name: 'seo-files',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        next();
      });
      server.middlewares.use(serveFile);
    },
    configurePreviewServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' https: data:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");
        if (getSiteUrl().startsWith('https://')) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
      });
      server.middlewares.use(serveFile);
    },
    generateBundle() {
      for (const [pathname, file] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName: pathname.slice(1), source: file.content });
      }
    },
  };
}

function dynamicOpenGraphPlugin(): Plugin {
  return {
    name: 'dynamic-opengraph-remix',
    transformIndexHtml(html, ctx) {
      html = html.replaceAll('__SITE_URL__', getSiteUrl());
      if (!ctx || !ctx.originalUrl) return html;
      try {
        const url = new URL(ctx.originalUrl, 'http://localhost');
        const remixParam = url.searchParams.get('remix');
        if (!remixParam) return html;

        // Decode remix param
        const jsonStr = decodeURIComponent(Buffer.from(remixParam, 'base64').toString('utf-8'));
        const payload = JSON.parse(jsonStr);
        if (!payload || !Array.isArray(payload.i) || payload.i.length === 0) return html;

        // Calculate total and find top item from productsData
        let total = 0;
        let topProduct: any = null;
        let maxMsrp = -1;

        for (const item of payload.i) {
          const product = (productsData as any[]).find((p) => p.id === item.id);
          if (product) {
            const qty = item.q || 1;
            total += product.msrp * qty;
            if (product.msrp > maxMsrp) {
              maxMsrp = product.msrp;
              topProduct = product;
            }
          }
        }

        if (!topProduct) {
          topProduct = (productsData as any[])[0];
        }

        const creator = payload.c || '@OverkillKing';
        const formattedTotal =
          total >= 1000000
            ? `$${(total / 1000000).toFixed(1)}M`
            : total >= 1000
            ? `$${(total / 1000).toFixed(0)}K`
            : `$${total}`;

        const fullFormatted = `$${total.toLocaleString('en-US')}`;
        const title = `Can you beat my cart? (${formattedTotal} for $0) — Unlimited Shopping`;
        const description = `Challenged by ${creator} to out-spend their ${fullFormatted} fantasy cart featuring ${topProduct?.title || 'pure luxury'}. Indulge with $0 billed!`;
        const image =
          topProduct?.image ||
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';

        return html
          .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(
            /<meta name="description" content=".*?" \/>/,
            `<meta name="description" content="${description}" />`
          )
          .replace(
            /<meta property="og:title" content=".*?" \/>/,
            `<meta property="og:title" content="${title}" />`
          )
          .replace(
            /<meta property="og:description" content=".*?" \/>/,
            `<meta property="og:description" content="${description}" />`
          )
          .replace(
            /<meta property="og:image" content=".*?" \/>/,
            `<meta property="og:image" content="${image}" />`
          )
          .replace(
            /<meta name="twitter:title" content=".*?" \/>/,
            `<meta name="twitter:title" content="${title}" />`
          )
          .replace(
            /<meta name="twitter:description" content=".*?" \/>/,
            `<meta name="twitter:description" content="${description}" />`
          )
          .replace(
            /<meta name="twitter:image" content=".*?" \/>/,
            `<meta name="twitter:image" content="${image}" />`
          );
      } catch (e) {
        console.error('Error in dynamic OpenGraph transform:', e);
        return html;
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoFilesPlugin(), dynamicOpenGraphPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
