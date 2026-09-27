# Performance Findings

**Score: 58/100, static/local risk estimate**

The production build passed and emitted a 572.46 kB minified JavaScript chunk, 154.01 kB gzip. All views, modals, and utilities are bundled into the initial path, creating LCP and INP risk. Two external variable font families add loading and font-swap cost. Product-card media has stable dimensions, but other state views need the same guarantee.

LCP, INP, and CLS were not measured because localhost is unavailable to the Lighthouse/CrUX tooling. Measure a public production deployment.
