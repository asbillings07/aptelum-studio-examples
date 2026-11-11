# Vercel previews and the later launch

Owner/operator: @asbillings07. November 11, 2026. This increment prepares the approved Studio gallery and six fictional examples for review on Vercel. It does not launch the service or establish client hosting qualification. Pricing remains provisional.

## Source and scope

The existing public site remains at <https://asbillings07.github.io/aptelum-studio-examples/>. Its `main` branch still publishes through GitHub Pages. This preview branch does not change those source pages, DNS or the Pages domain setting. `aptelumstudio.com` is reserved for a separately approved Vercel production launch.

Reuse the approved static site instead of adding a framework, CMS or application services. Auth0, Supabase and Stripe remain the selected services for features that actually need them; this gallery needs none of them. Keep real client projects and data separate. The existing client-hosting plan is not changed by this Studio-owned, already-public fictional preview workflow.

`site-files.json` explicitly lists the 81 deployable files, including 52 HTML pages. `node scripts/build-preview.mjs` creates `dist/` using only that inventory. It removes the Pages path prefix from generated HTML, updates the five hosting disclosures to Vercel, and uses the generated preview hostname for Vale's route inventory. The original source files stay compatible with Pages. Images, styles, scripts, content and fictional/unavailable handoff states are retained. No new data collection is added.

The builder has no third-party dependencies, network calls or secrets. Local builds use `preview.invalid` in the sitemap; Vercel builds use `VERCEL_URL`. This preview remains noindex and is not submitted to search engines. Only `dist/` may be served: repository tooling, documentation, environment files and private sources are not deployable assets.

## Checks and project settings

Run `python3 -m unittest discover -s tests -v`. Checks build the complete artifact, verify all local page links/fragments and CSS assets, theme-script integrity and unchanged presentation bytes, and exercise production refusal, missing input, invalid paths, symlinks and unexpected files. CI has read-only permissions, pinned actions, a five-minute limit and no deployment credentials. CI is not independent review or human acceptance.

Configure one project named `aptelum-studio` in the existing **Aptelum Labs** team, linked only to this repository:

- Framework: Other / null; Node 22.x; build: `node scripts/build-preview.mjs`; no install command; output: `dist`.
- Preview deployments enabled. Production branch: `main`; `vercel.json` disables Git deployment for `main`.
- Project ignored-build command: `test "$VERCEL_ENV" != "preview"`. Exit 0 skips every non-preview build, including a missing environment. The builder independently refuses a hosted environment other than Preview.
- Vercel Authentication: **All Deployments** (`all`), retained through Preview review. Do not downgrade it to Standard Protection. Add **no custom domains**, bypass links or automation bypass secrets. Verify protection before sharing. Keep build/source visibility private, fork protection on and automatic custom-domain assignment off. Add no analytics instrumentation or optional paid service. The existing Speed Insights record had no data and paid analytics quantity was zero at the November 11 preflight; do not treat a record identifier alone as enabled instrumentation or paid service. Recheck actual account state before another release. Disable preview toolbar injection because these examples intentionally restrict scripts.
- No new plan, paid add-on, seat, database, auth tenant or billing service. If the existing account cannot supply these settings, stop and record the gap.

These controls prevent routine automatic production builds. An authorized administrator can change them; they are not a substitute for owner approval, independent source review or verified provider permissions. Do not claim project settings or a live preview exist from this file alone: consult the PR's actual provider receipt.

## Preview updates and recovery

1. Independently review the immutable candidate, pass CI and keep the PR draft for the owner's review. Source changes require renewed review. Preserve approved layouts; changed hosting disclosure is part of preview review.
2. Read back the intended team/project, protection and no-custom-domain settings. Creating/linking must not silently release production. The main branch does not contain this builder yet and remains disabled for Vercel deployment.
3. Publish the reviewed branch once and let Git integration create its Preview; do not also request a duplicate manual deployment. Bind verification to the exact Git SHA. Inspect the returned deployment target, source and status. A production target is a stop even if no domain is attached. Never promote it as a workaround.
4. Verify anonymous protection, authorized review access, headers, representative desktop/mobile paths, all six homepages, Vale service detail and the unavailable consultation outcome. A successful build alone is insufficient. Provide the ordinary preview URL; the reviewer uses their Vercel access. No bypass link is needed.
5. Keep the existing Pages site untouched. For a failed preview, retain the failure and known-good Pages site. Inspect state before retrying a lost provider reply; at most two readbacks and one justified retry, with a ten-minute build and twenty-minute verification investigation limit. Stop on wrong target, missing protection, unexpected charges or uncertain effects. AB owns the next decision.

Git integration supplies later branch previews. Review a new candidate before deliberately publishing another revision; no CI job receives a deployment token. No production, DNS, decommissioning or automatic-promotion workflow is included. Stop temporary local servers after checks; do not delete a review deployment while the owner is using it.

## Production and Pages retirement are later gates

The owner first accepts the preview and exact release source. A separate reviewed launch change must define the approved public content, any outstanding licensing/quality/privacy requirements, account costs, domain/DNS records, protection settings, monitoring, recovery target and release window. Remove the production stops only through that approved change.

Stage a production-configured artifact without assigning domains, test that artifact and obtain release approval before promotion. Promoting a Preview rebuilds it with production configuration; do not describe the preview's tests as proof of that new build. Connect `aptelumstudio.com` only with the approved DNS plan. Verify the real domain, HTTPS, routes, assets and handoffs after launch.

Keep Pages during the migration and recovery window. After the Vercel site is accepted, obtain the owner's explicit Pages retirement approval, inventory shared old links and decide their transition. Disable Pages only then, while retaining source/history and agreed recovery material. Production approval alone is not permission to delete the old repository.

References checked November 11: [Git branch deployment controls](https://vercel.com/docs/project-configuration/git-configuration), [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication), [deployment API](https://vercel.com/docs/rest-api/deployments/create-a-new-deployment), [staged production builds](https://vercel.com/docs/deployments/managing-deployments).

## Header alignment revision

The owner approved correcting header alignment across all six examples and updating the protected Preview after independent review. Full-width backgrounds are separate from bounded content: Forma/Morrow retain a 1320px content shell, Vale 1440px, and Technology 1320px. Each header, example strip and main layout shares its brand gutter; gutters stop growing on wide screens. Brand shapes, quiet appearance controls and business actions remain unchanged.

Check all six at 320px and 390px mobile, intermediate menu widths, 1280px desktop and 1920px/2560px wide screens. Verify centered content, matching header/main edges, full-width surfaces, no overflow, open mobile/appearance menus and Light/Dark/System behavior. Include representative interior pages; screenshot checks must allow lazy images to settle. Keep PR #1 draft, Pages/main and DNS unchanged, pricing provisional and discovery issue #2 open. This approval permits the reviewed protected Preview update, not production or merge.
