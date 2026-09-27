# Action Plan: Fake Shopping Simulator

## Phase 1: Critical Fixes

1. Serve a real `/robots.txt` with `Content-Type: text/plain`.
2. Serve a real `/sitemap.xml` with `Content-Type: application/xml` and only canonical public URLs.
3. Return HTTP 404 for unknown paths instead of the SPA shell.
4. Replace `http://localhost:3001/` in canonical and Open Graph metadata at deployment.

## Phase 2: High-Impact Improvements

1. Prerender the homepage H1, simulator explanation, representative products, and core navigation.
2. Split the 572.46 kB initial JavaScript bundle with lazy-loaded views and modals.
3. Add crawlable copy explaining fictional prices, no real purchases, cart sharing, and challenges.
4. Apply image dimensions and responsive sizing consistently in Cart, modal, receipt, and share views.
5. Add production security headers: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.

## Phase 3: Content & Authority

1. Add About, Privacy, Contact, and Terms links.
2. Add catalog or challenge update information where it is meaningful.
3. Add an absolute production URL, image, and provider to JSON-LD when those values exist.
4. Establish verifiable public brand signals without inventing credentials or reviews.

## Phase 4: Monitoring & Iteration

1. Run Lighthouse on the public production URL and capture LCP, INP, and CLS.
2. Validate robots, sitemap, JSON-LD, canonical, and 404 behavior after every deployment.
3. Monitor index coverage and soft-404 reports.
4. Track bundle size and interaction performance as features are added.

## Priority Summary

- Critical: discovery endpoints, real 404s, production URL metadata.
- High: prerendering, code splitting, crawlable explanation, consistent image sizing.
- Medium: security headers, trust content, AI discovery files.
- Low: safe-area polish and freshness details.
