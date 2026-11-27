# Wellness story refinement

This draft implements the approved benchmark direction for Forma, Vale and Morrow. It keeps the existing brands and photo library while giving each a distinct homepage composition and more informative service pages. Technology examples are unchanged.

Forma starts with the provider and uses editorial treatment rows. Vale starts with skin-care interests and a featured treatment gallery. Morrow uses an open photographic introduction and alternating care chapters. Each connects the overview to useful detail and then a consultation explanation.

`assets/wellness-benchmark.css` supplies reading scale, spacing and the three compositions. Native menu disclosures float beneath the header through tablet widths. `assets/wellness-navigation.js` handles dismissal only; it is integrity-pinned in the affected pages and adds no collection or network behavior. Existing appearance controls and no-JavaScript links remain.

Run `python3 -m unittest discover -s tests -v` and `node --test tests/wellness-navigation.test.cjs`. Photo provenance is in [photography.json](photography.json). The tests validate builds, links, script integrity, privacy boundaries, one-use photos and controlled menu behavior; they do not certify rendering.

The exact review branch `design/5-ruma-wellness-benchmark` disables automatic Vercel deployment, as does the existing `main` rule. GitHub Pages continues to use the preserved branch; no deployment or domain change is part of this draft. Keep this PR draft until independent review and human visual QA are complete.

Visual QA remains pending at 320, 390, 768, 1024, 1440 and 1920px: light/dark/system, native menus, focus visibility, image crops, page rhythm, and service-to-consultation journeys. No RUMA photographs, copy or assets are included.
