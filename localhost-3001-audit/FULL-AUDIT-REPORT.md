# Full SEO Audit: Fake Shopping Simulator

**Audited URL:** http://localhost:3001/  
**Audit date:** 2026-09-26  
**Business type:** Entertainment web application / satirical shopping simulator  
**Pages crawled:** 1 effective application URL; stateful SPA views are not independent crawlable pages.

## Executive Summary

**SEO Health Score: 54/100**

The application is a compelling interactive tool for users searching for a fake shopping simulator, fantasy cart, or consequence-free luxury browsing. Visual rendering is strong and the metadata, heading, navigation, schema, and image work already completed improved the surface materially.

The main weakness is deployment architecture. Discovery endpoints and unknown routes are handled by the Vite SPA fallback, so robots, sitemap, llms, and nonexistent URLs all return the same HTML shell with HTTP 200. The initial HTML is also thin because the catalog and feature content require React hydration. These issues reduce crawl reliability and make the app difficult for non-JavaScript agents to cite.

## Scorecard

| Category | Score | Weight |
|---|---:|---:|
| Technical SEO | 38 | 22% |
| Content Quality | 68 | 23% |
| On-Page SEO | 72 | 20% |
| Schema | 80 | 10% |
| Performance | 58 | 10% |
| AI Search Readiness | 44 | 10% |
| Images | 64 | 5% |
| **Weighted health score** | **54** | **100%** |

Visual/accessibility review scored 92/100 as a supplementary category; it is not part of the supplied weighted formula.

## Top Critical Findings

1. `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/.well-known/ai-plugin.json` return `200 text/html` with the app shell.
2. `/nonexistent-seo-check` returns `200` instead of `404`, creating soft-404 and duplicate URL risk.
3. The primary catalog and explanatory copy are client-rendered; raw HTML contains only the mount point and a small noscript summary.
4. Static canonical and Open Graph URLs point to localhost and must be replaced for production.
5. The production build emits one 572.46 kB minified JavaScript chunk, creating LCP and INP risk.

## What Works

- Strong, differentiated tool intent and clear fictional/$0 positioning.
- Title: `Fake Shopping Simulator | Spend Nothing`.
- Description clearly states the fantasy simulator premise.
- One rendered homepage H1 in the play state.
- Crawlable internal navigation links for Play, Worlds, Game, and Cart.
- JSON-LD WebApplication schema with a truthful zero-price offer.
- Product image alt text and stable media containers in the play catalog.
- Desktop/mobile visual audit found no horizontal overflow and good above-fold CTA visibility.

## Technical SEO

The local server is a Vite development server, so development assets such as `/@vite/client` and React Refresh are exposed. Production security headers were not present in the local response and should be set at the hosting layer. The shared browser could render the app, but the prescribed render script did not return usable Windows JSON output and Lighthouse/agentic tooling blocked loopback hosts. No production CWV or CrUX claims are made.

## Content Quality and SXO

This is a task-focused entertainment homepage, not a conventional editorial or retail product page. Approximately 424 words were visible in the play state. Readability is strong, but crawlable explanation is limited. Add a short section answering what the simulator is, whether anything is purchased, how fantasy pricing works, and how users share challenges. This will improve search intent matching while preserving the fast-start experience.

Real luxury-shopping intent is intentionally not satisfied because the app sells nothing. State that boundary clearly to avoid misleading transactional expectations.

## Schema

One JSON-LD block was detected: `WebApplication` with a nested zero-price `Offer`. Syntax and type are valid. Add the absolute production URL, an image or screenshot, and a real provider only when those values are authoritative. Do not add Product schema to fictional catalog objects.

## Performance and Images

The build passed successfully but reported a 572.46 kB minified JavaScript chunk. Lazy-load Worlds, Cart, Game, modals, and challenge functionality. Google Fonts add external stylesheet and font-swap cost. Product cards reserve dimensions, but the persisted Cart view showed images without width/height attributes; normalize all image components. Remote Googleusercontent and Unsplash assets should be optimized or placed behind a controlled image pipeline.

## AI Search and Agent Readiness

AI search readiness is 44/100. The rendered UI has useful structure, but raw non-JavaScript access is weak. There is no valid llms.txt, no parseable robots policy, no Markdown delivery, and no verified WebMCP implementation. The absence of optional AI discovery standards is not itself a ranking defect, but returning HTML at those endpoints is a technical defect.

Lighthouse Agentic Browsing fraction is unavailable because the audit runtime blocks localhost; it must be measured on a public deployment.

## Limitations

- Localhost cannot provide CrUX, live SERP, backlink, or Google indexation data.
- Lighthouse and agentic browser checks were blocked by loopback URL safety policy.
- Optional Google, Matomo, backlink, and drift checks were not available through the Windows launcher invocation.
- The app is stateful: `/` can show Play or a persisted Cart state. Findings distinguish the play homepage from the observed persisted state.

See [ACTION-PLAN.md](ACTION-PLAN.md) for phased remediation and `findings/` for category details.
