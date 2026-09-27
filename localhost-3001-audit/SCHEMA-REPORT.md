# Schema Markup Report: Fake Shopping Simulator

**URL:** http://localhost:3001/  
**Audit date:** 2026-09-26  
**Schema score:** **86/100**

## Detection

| Format | Result |
|---|---|
| JSON-LD | 1 initial HTML block detected |
| Microdata | None detected |
| RDFa | No RDFa entity markup detected; six `property` attributes belong to Open Graph meta tags |
| Primary format | JSON-LD, correctly used in the initial HTML |

The JSON-LD is delivered in the initial document rather than injected only after React hydration, which is the correct approach for application metadata.

## Validation Results

| Schema | Type | Status | Issues |
|---|---|---|---|
| JSON-LD block 1 | `WebApplication` | Pass with warnings | Valid `@context`, active `@type`, truthful name/description/category/operating system, and zero-price application offer. Production URL currently resolves to localhost. |
| Nested offer | `Offer` | Pass with warnings | `price` is a string containing a valid numeric value and `priceCurrency` is `USD`. The offer describes free application access, not fictional catalog products. |

### Verified properties

- `@context`: `https://schema.org`
- `@type`: `WebApplication`, active and appropriate for a browser application
- `name`: `Fake Shopping`
- `url`: absolute in the current response, but currently `http://localhost:3001/`
- `description`: present and aligned with visible page content
- `applicationCategory`: `EntertainmentApplication`
- `operatingSystem`: `Web`
- `offers.@type`: `Offer`
- `offers.price`: `0`
- `offers.priceCurrency`: `USD`
- No placeholder text in the live response
- No invalid dates
- No deprecated `HowTo`, `FAQPage`, `ClaimReview`, or other retired schema type

## Issues and Recommendations

### High: replace the localhost URL at deployment

The current absolute `url` is syntactically valid but not production-valid because it points to `http://localhost:3001/`. Set `VITE_SITE_URL` or `APP_URL` to the deployed HTTPS origin and rebuild. The Vite metadata plugin already supports this configuration.

### Medium: add truthful application properties

When verified for production, add:

- `browserRequirements`: explain that a modern browser with JavaScript is needed for the interactive experience.
- `featureList`: describe the fantasy cart, random spree generator, friend challenges, and cart sharing.
- `image` or `screenshot`: use a stable public asset, not a temporary localhost or development URL.
- `provider` or `author`: only after the real owner or organization is identified.
- `sameAs`: only for genuine official profiles.

Do not invent a provider, author, ratings, reviews, or social profiles.

### Info: no product schema for fictional catalog items

The catalog is explicitly fictional and no products are sold. Do not add `Product`, `Review`, or `AggregateRating` markup to the catalog. That would imply real commerce or fabricated reputation signals.

### Info: visible Q&A content does not require FAQPage schema

Question-led explanatory content may be added for users, but Google retired FAQ rich results for all sites in May 2026. Do not add FAQPage solely for a SERP feature. Use QAPage only for a genuine single-question community-answer page, which this application does not currently have.

## Generated Schema Recommendation

Use the generated template in [generated-schema.json](generated-schema.json). Replace `https://YOUR-DOMAIN.example/` and the screenshot placeholder only when real production values exist. The current implementation is already valid; these additions are optional enhancements, not a reason to add unverifiable data.

## Testing Notes

- JSON parsed successfully from the initial HTML response.
- Browser DOM and raw `Invoke-WebRequest` extraction agreed on the JSON-LD object.
- The local schema was not submitted to Google's Rich Results Test because localhost is not publicly accessible.
- `render_page.py` did not complete in this Windows/loopback environment; direct HTML parsing and browser DOM inspection were used.

## Summary

The existing JSON-LD implementation is sound for this page type. The highest-value schema action is deployment configuration: replace localhost with the real HTTPS origin. Keep the markup focused on the `WebApplication` entity and avoid fictional product, review, or organization claims.
