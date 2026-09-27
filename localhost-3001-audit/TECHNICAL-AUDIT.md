# Technical SEO Audit: Fake Shopping Simulator

**Audited URL:** http://localhost:3001/  
**Audit date:** 2026-09-26  
**Technical score:** **Not provided** because Core Web Vitals, browser mobile behavior, and production TLS were not measurable on localhost.

This report scores only directly measured categories. It does not convert unavailable production evidence into a guessed number.

## Category Breakdown

| Category | Status | Score |
|---|---|---:|
| Crawlability | Pass | 100/100 |
| Indexability | Pass | 100/100 |
| Security | Warn | 50/100 |
| URL Structure | Pass | 100/100 |
| Mobile Signals | Pass, limited | 100/100 |
| Core Web Vitals | Not measured | — |
| Structured Data | Pass | 100/100 |
| JavaScript Rendering | Pass, limited | 100/100 |
| IndexNow | Fail / optional | 0/100 |

## Crawlability

Direct HTTP checks returned:

- `/robots.txt`: `200 text/plain`
- `/sitemap.xml`: `200 application/xml`, listing the homepage
- `/llms.txt`: `200 text/plain`
- `/.well-known/ai-plugin.json`: `200 application/json`
- `/nonexistent-seo-check`: `404`

The current robots policy is:

```text
User-agent: *
Allow: /
Sitemap: http://localhost:3001/sitemap.xml
```

The wildcard allows Googlebot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, and the listed training crawlers. Search and training purposes are distinct: allowing `GPTBot` does not prove ChatGPT Search access; `OAI-SearchBot` governs that capability.

The prescribed `sitemap_discovery.py` helper produced no usable output in this Windows environment, so the sitemap result was validated directly by HTTP status, content type, and XML output.

## Indexability

- Raw homepage robots directive: `index,follow`.
- Canonical: `http://localhost:3001/`, self-referencing in the local environment.
- No conflicting canonical was observed.
- Unknown route returns a real `404`, avoiding soft-404 duplication.
- Remix states are marked `noindex,follow` after client state is decoded; the raw homepage remains indexable.
- The root document is approximately 5.8 KB and well below Google's 2 MB HTML fetch limit.
- Hreflang is not applicable to the current single-language application.

## Security

Observed on the local HTTP response:

- Present: `X-Frame-Options: SAMEORIGIN`
- Present: `X-Content-Type-Options: nosniff`
- Present: `Referrer-Policy: strict-origin-when-cross-origin`
- Present: `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Missing on the Vite development response: `Content-Security-Policy`
- Missing: `Strict-Transport-Security`
- HTTPS is unavailable on the local development port

The missing HTTPS, HSTS, and development CSP are deployment/environment limitations, but production must enforce HTTPS, add HSTS, and serve a tested CSP. The preview middleware contains a CSP baseline; validate it against deployed scripts, fonts, images, and connections before enforcing it publicly.

No back-button hijacking pattern was identified in the reviewed application flow.

## URL Structure

- Root URL is short and clean.
- Hash navigation is used for in-page application sections.
- No redirect chain was observed.
- Unknown route behavior is correct with HTTP 404.
- The one public canonical URL is within one click from all primary app tabs.
- Remix query URLs are stateful sharing URLs and are excluded from indexing by client metadata; they should remain intentionally non-indexable unless public route-level landing pages are introduced.

## Mobile Signals

- Viewport: `width=device-width, initial-scale=1.0, viewport-fit=cover`.
- Responsive utility classes and mobile-first sizing are present.
- Primary controls use comfortable minimum heights.
- Fixed bottom navigation includes safe-area padding.
- A real device-width visual and touch-target test was not available in the technical runner, so this is a source-level pass with limited confidence.

## Core Web Vitals

**Not measured.** No usable PageSpeed, CrUX, Lighthouse, or browser performance trace was available for localhost.

Source-level risks to measure after deployment:

- External Google Fonts may affect LCP and font reflow.
- React hydration and the initial JavaScript entry may affect LCP/INP.
- Lazy-loaded images have intrinsic dimensions, reducing CLS risk.

Measure production at the 75th percentile for LCP, INP, and CLS. Do not substitute a local heuristic for field data.

## Structured Data

Initial HTML contains valid JSON-LD for `WebApplication` with:

- `@context`, `@type`, name, URL, description
- `applicationCategory`, `operatingSystem`
- `browserRequirements`, `featureList`
- Zero-price `Offer` with availability and URL

No Microdata or RDFa entity markup was detected. The six `property` attributes observed in the DOM are Open Graph metadata, not RDFa. Full schema validation should be repeated on the public HTTPS URL.

## JavaScript Rendering

The initial HTML includes:

- One H1
- Definition and no-payment explanation
- Question-led answer sections
- Featured fictional exhibits
- Navigation links
- JSON-LD

The full catalog, cart, game, and interaction state remain React-rendered. This is not full SSR, but the raw document is no longer an empty SPA shell. Browser hydration was confirmed after clearing persisted local state. The app uses lazy-loaded views, so stateful screenshots should be tested from a clean browser context.

## IndexNow

No IndexNow implementation was detected:

- `/indexnow-key.txt`: `404`
- No IndexNow endpoint or key was found in the source.

IndexNow is optional and does not affect Google Search. Add it only if faster update notification for Bing, Yandex, or Naver is a product requirement. If implemented, publish a real key file and submit only canonical public URLs.

## Priority Issues

### High

- Deploy behind HTTPS and add HSTS.
- Serve and test the CSP in production rather than relying on the development response.

### Medium

- Run mobile visual/touch checks on a production URL.
- Validate JSON-LD with a public schema validator after deployment.
- Measure LCP, INP, and CLS using Lighthouse and Search Console/CrUX when available.

### Low / Optional

- Add IndexNow for non-Google update discovery if needed.
- Add explicit crawler-specific robots policy only after deciding whether model-training access is allowed; the current wildcard correctly permits search crawlers.

## Limitations

- Localhost cannot provide public HTTPS, CrUX, Search Console, live SERP, or production TLS evidence.
- The prescribed sitemap helper did not produce usable Windows output; direct HTTP validation was used.
- Site-wide duplicate and parameter analysis is limited because this is a one-page SPA with stateful hash/query behavior.
- Lighthouse and agentic browser tooling did not complete against the loopback target.
