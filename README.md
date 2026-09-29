<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Fake Shopping

Fake Shopping is a Vite + React single-page application. The production build is configured for both Cloudflare Pages and Cloudflare Workers Static Assets.

## Run Locally

**Prerequisites:** Node.js 20 or newer


1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

## Deploy To Cloudflare Pages

Authenticate Wrangler once with `npx wrangler login`, then run:

```bash
npm run deploy:pages
```

For a Git-connected Pages project, use `npm run build` as the build command and `dist` as the output directory. Set `VITE_SITE_URL` to the final HTTPS site URL before building so canonical URLs, the sitemap, and `llms.txt` use the production origin.

## Deploy To Cloudflare Workers

The included `wrangler.jsonc` serves the same `dist` directory as Workers Static Assets and enables SPA fallback:

```bash
npx wrangler login
npm run deploy:worker
```

Set `VITE_SITE_URL` in the deployment environment, for example:

```bash
$env:VITE_SITE_URL = "https://fake-shopping.example.com"
npm run deploy:worker
```

The app is client-rendered, so no Worker runtime code or secret API keys are required for deployment.
