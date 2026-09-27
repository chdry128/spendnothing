# Technical SEO Findings

**Current measured status:** Crawlability, indexability, URL structure, mobile source signals, structured data, and raw HTML rendering now pass. Security remains limited by localhost HTTP; Core Web Vitals and IndexNow are not measured or implemented.

- Pass: `/robots.txt` and `/sitemap.xml` return correct content types and the homepage is listed.
- Pass: unknown paths return `404` instead of the SPA shell.
- Pass: initial HTML contains H1, explanatory content, featured exhibits, metadata, and JSON-LD.
- Pass: canonical is self-referencing in the local environment; remix states are marked `noindex,follow` after decoding.
- Warning: HTTPS/HSTS and production CSP require deployment-layer validation.
- Optional: no IndexNow key or submission endpoint is implemented.

See [TECHNICAL-AUDIT.md](../TECHNICAL-AUDIT.md) for category scores, crawler distinctions, endpoint evidence, and production-only limitations.
