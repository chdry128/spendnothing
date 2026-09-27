# GEO Analysis: Fake Shopping Simulator

**Audited URL:** http://localhost:3001/  
**Audit date:** 2026-09-26  
**GEO Readiness Score:** **57/100**  
**Business type:** Entertainment web application / satirical shopping simulator

This assessment treats GEO as SEO fundamentals applied to AI-search surfaces, consistent with Google's AI Optimization Guide: useful, indexable, accessible content remains the foundation for Google Search, AI Overviews, and AI Mode. The score is a heuristic, not a Google or AI-provider ranking signal.

## Dimension Scores

| Dimension | Score | Evidence |
|---|---:|---|
| Citability | 18/25 | Raw HTML contains a clear definition, fictional-purchase disclaimer, H1, and H2 before hydration. Depth and supporting evidence remain limited. |
| Structural readability | 12/20 | Valid H1/H2/H3 hierarchy and short sections; no question-led FAQ, comparison table, or ordered explanation yet. |
| Multi-modal content | 8/15 | Interactive simulator, product imagery, and JSON-LD are present. Raw HTML exposes limited image context and no video or original visual data. |
| Authority and brand signals | 4/20 | Clear entity name and update date, but no verifiable owner, author, citations, `sameAs`, or public brand presence can be established from localhost. |
| Technical accessibility | 15/20 | Raw fallback content is available without JavaScript; the full catalog and interactive features still depend on client hydration. |

## Platform Breakdown

No live platform visibility tool was available for localhost, so platform scores are intentionally not assigned.

- **Google AI Overviews:** Qualitatively eligible in principle because the page has indexable metadata, a canonical, crawlable content, and a valid rendered/fallback structure. Actual eligibility requires a public indexed URL and Search Console's Search generative AI setting.
- **Google AI Mode:** Not measured. Readiness depends on the same indexability and helpful-content foundations, plus public entity and freshness signals.
- **ChatGPT Search:** Not measured. `OAI-SearchBot` is allowed by the wildcard robots rule, but localhost cannot be crawled or cited publicly.
- **Perplexity:** Not measured. `PerplexityBot` is allowed, but public discovery is impossible while the site remains local.
- **Claude Search:** Not measured. `Claude-SearchBot` is allowed by the wildcard rule, subject to public availability and indexing.
- **Bing Copilot:** Not measured. `Googlebot`-style accessibility does not substitute for Bing indexing or live visibility data.

## AI Crawler Access Status

The current `/robots.txt` is:

```text
User-agent: *
Allow: /
Sitemap: http://localhost:3001/sitemap.xml
```

This wildcard allows each checked crawler. These capabilities are intentionally reported separately:

| Crawler | Capability governed | Status |
|---|---|---|
| `Googlebot` | Google Search, including eligibility for AI Overviews and AI Mode | Allowed |
| `OAI-SearchBot` | ChatGPT Search citability | Allowed |
| `Claude-SearchBot` | Claude search citability | Allowed |
| `PerplexityBot` | Perplexity search | Allowed |
| `Applebot` | Siri, Spotlight, and Safari discovery | No specific restriction observed; wildcard allows it |
| `GPTBot` | OpenAI model training only | Allowed; this does not prove ChatGPT Search access |
| `ClaudeBot` | Anthropic model training only | Allowed; this does not prove Claude Search access |
| `Google-Extended` | Gemini/Vertex training and grounding only | Allowed; this does not govern Google Search or AI Overviews |
| `CCBot` | Common Crawl/training access | Allowed by wildcard |
| `Applebot-Extended` | Apple Intelligence training labeling | Allowed by wildcard |

No crawler-specific block was found. Whether training crawlers should be allowed is a licensing decision, not a search-citability requirement.

## `llms.txt` Status

`/llms.txt` is present, readable as `text/plain`, and accurately explains that Fake Shopping is a free fictional simulator. It is useful as optional machine-readable context and is correctly linked to the homepage and sitemap.

Google's AI Optimization Guide explicitly says that Google Search ignores `llms.txt` and that it neither helps nor harms Google visibility or rankings. No major AI search provider has confirmed using third-party `llms.txt` files as a citation lever. Keep the file as low-cost optionality, not as a substitute for SEO, SSR, or public authority.

`/index.md` and RSL endpoints were not present. Markdown delivery and RSL are optional and are not required for Google AI Search visibility.

## Passage-Level Citability

The strongest current passage is near the top of the raw HTML:

> Fake Shopping is a satirical fantasy-shopping simulator. Build an absurd luxury cart, challenge your friends, and indulge every irrational shopping urge without spending real money. Every product, price, and purchase is fictional. Add ridiculous items to an imaginary cart, generate a random spree, compare your fantasy total, and share the result with friends. No real products are sold and no payment is collected.

This is a useful self-contained definition and trust block, but it is shorter than the commonly cited 130-170-word passage heuristic. That heuristic is not a Google requirement and should not be met by padding. Add only useful detail: how the simulator works, what sharing does, what data stays local, and why the product is intentionally fictional.

The rendered page currently exposes approximately 521 words, including product names, hooks, controls, and About/Privacy/Terms/Contact copy. Product descriptions are original and vivid, but many are entertainment fragments rather than independently useful answers.

## Server-Side Rendering Check

The application now delivers a meaningful static HTML fallback containing:

- H1 and simulator definition
- Fictional-price and no-payment explanation
- Section navigation
- Metadata and WebApplication JSON-LD

The full React application is not true SSR. Product cards, cart state, challenges, modal content, and the complete interactive experience are hydrated client-side. This is materially better than an empty app shell for raw AI crawlers, but the representative catalog and feature details should eventually be statically rendered or generated at build time.

## Structure and Entity Clarity

Current strengths:

- One rendered homepage H1: `Shop Anything. Spend Nothing.`
- Descriptive H2/H3 hierarchy for catalog and trust sections.
- Consistent entity name: Fake Shopping / Fake Shopping Simulator.
- `WebApplication` JSON-LD with description, URL, category, operating system, and a truthful zero-price offer.
- Explicit September 2026 catalog/update signal.

Gaps:

- No organization or creator identity that can be verified publicly.
- No `sameAs` links to official profiles.
- No author/byline, which is acceptable for a game but leaves authority signals thin.
- No primary-source claims are made, so citations are not required yet.
- No question-based section such as “What is a fake shopping simulator?” or “Are the purchases real?”

## Brand Mention Analysis

Wikipedia, Wikidata, Reddit, YouTube, and LinkedIn presence could not be verified from `localhost`. No public brand-mention or backlink tool data was available. Do not manufacture profiles, reviews, or mentions. Once the product has a real public identity, link only to genuine official profiles through `sameAs` and build reputation through authentic product/community activity.

## Schema Recommendations

The existing `WebApplication` JSON-LD is appropriate for this entertainment tool. Keep the fictional `$0` offer because it describes access to the application, not a real product sale.

Recommended future additions, only when factual:

- `image` or `screenshot` using a stable public asset.
- `provider` or `author` as an `Organization` when the owner is identified.
- `sameAs` for official public profiles.
- `dateModified` when catalog updates are maintained reliably.

Do not add `Product` schema to fictional catalog entries. Do not add FAQPage schema merely to pursue rich results; use visible question-and-answer content for users.

## Top 5 Highest-Impact Changes

1. **Make the representative catalog statically crawlable.** Render a small set of product names, categories, descriptions, and fictional-price disclosures in the HTML fallback or through SSG.
2. **Add useful question-led explanations.** Answer what the simulator is, whether purchases are real, how fantasy carts work, and how sharing/challenges work without keyword stuffing.
3. **Deploy publicly with the real origin.** Replace localhost canonical, sitemap, and schema URLs through `VITE_SITE_URL`; then verify indexing and Search Console's generative-AI setting.
4. **Establish verifiable entity signals.** Add a real owner/provider and official `sameAs` links only when they exist; do not pursue artificial mention farming, which conflicts with Google's guidance.
5. **Measure production visibility.** Run Search Console, Bing Webmaster Tools, and production Lighthouse checks after deployment. Localhost cannot produce live citation, ranking, CrUX, or agentic fractions.

## Content Reformatting Suggestions

### Add a definition near the first viewport

**What is Fake Shopping?** Fake Shopping is a free satirical shopping simulator where you build an imaginary luxury cart without spending real money. Every product, price, and purchase is fictional. Use the catalog to create an absurd spree, compare your fantasy total, and share the result with friends.

### Add a direct trust answer

**Are the purchases real?** No. Fake Shopping does not sell the listed products, collect payment, or create real orders. The prices and product specifications are fictional entertainment data, and your cart stays in the browser unless you choose to share it.

### Add a workflow explanation

**How does the fantasy cart work?** Choose any ridiculous catalog item, add it to your imaginary cart, and compare the fictional MSRP with a real cost of $0. Use Surprise Me for a random spree, then export the cart to challenge friends.

These blocks should remain visible, accurate, and useful. They should not be added solely to reach a word count.

## Limitations

- The site is localhost and cannot be crawled, ranked, or cited by public AI systems.
- The prescribed `render_page.py`, Lighthouse, and agentic tools did not complete successfully in this Windows/loopback environment; browser and raw HTTP checks were used instead.
- Platform readiness is qualitative and not a visibility measurement.
- No live brand, backlink, Google Search Console, Bing, or AI mention data was available.

## Sources and Method

- Google Search Central, [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), consulted through the supplied local reference on 2026-09-26.
- Supplied `llms.txt` evidence reference, which records Google's position that Google Search ignores the file.
- Raw HTTP checks for `/`, `/robots.txt`, `/llms.txt`, `/index.md`, `/rsl.json`, and `/.well-known/rsl.json`.
- Rendered browser DOM and accessibility-visible page content from the shared localhost browser.
