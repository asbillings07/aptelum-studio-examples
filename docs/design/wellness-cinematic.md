# Approved photographic wellness compositions — November 27, 2026

Owner: @asbillings07. Related: [Studio issue #5](https://github.com/asbillings07/aptelum-studio/issues/5), M2. This implements the four-brand interactive design the owner approved with “This looks good. Let's implement.” The approved local artifact is `wellness-interactive-review.html`, SHA-256 `f80dd948f4599db0ca6e6dcaff4d8d38794007c55403fbe34cbf02159947ada6`.

## What changed

Forma uses an oxblood portrait opening, an asymmetric treatment edit and a consultation photograph. Its skin-refinement link now reaches a distinct overview; existing injectables, planning, provider and consultation pages remain. Vale uses a skin-care opening, uneven photographic gallery, bounded provider portrait and a daily-care chapter. Morrow uses a garden opening, broad curved photographic chapter, movement story and a quiet consultation invitation. All three use native links to deeper pages rather than repeating the homepage.

The three new generated hero images are optimized derivatives of the approved study, recorded in [cinematic-images.json](cinematic-images.json). Total additional image bytes: 198,419. Existing generated and stock photographs are reused in new placements, once per logical site; compatibility URLs remain aliases. [photography.json](photography.json) retains stock source, author and license information. No RUMA copy, photography or video is included. Illustrative subjects are not named clinicians, clients or treatment results.

`wellness-cinematic.css` implements the approved layout within each wellness homepage. Existing theme controls, native floating menus, local fonts, static builder and SVG icons are reused. Forma's supporting pages inherit its oxblood palette and serif headings; Vale and Morrow use Lora/Outfit. Technology examples and their styling rules remain unchanged. No framework, animation package, remote asset service or new backend is needed.

## Motion and failure behavior

The hero is a still image on first paint, including without JavaScript. A small, labeled control optionally starts a slow pan; this is explicitly a **still-image motion study**, not filmed office footage. Reduced motion hides the control and disables the animation. Scrolling away, backgrounding or leaving the page stops it; return does not restart it. If scripts fail, navigation and content remain usable. Real footage needs suitable licensed material and separate approval.

The enhancement makes no network requests and stores no visitor data. Its exact bytes are pinned by SRI and each homepage CSP. Forms, tracking, real bookings and payment features remain absent. Native service/consultation navigation and existing privacy notices are retained.

## Verification and next gate

Local checks cover all built routes, script hashes, finite inventory, no-form/no-iframe boundaries, production refusal, photo uniqueness and menu behavior. Added lifecycle tests cover reduced motion, explicit play/pause, backgrounding, leaving the viewport and interior pages without a hero. The finite inventory now has 53 HTML pages; the new page is Forma skin refinement.

The in-app browser was checked locally at 320, 390, 768, 1024, 1440 and 1920px for all three homepages: no horizontal overflow or failed loaded images. Desktop full-page and mobile screenshots were inspected. Light/dark/system rendered the expected palettes. Forma menu dismissal restored focus, and its new skin link opened a distinct service page. Initial integration exposed a malformed Vale script-policy delimiter, corrected before browser QA; the full artifact checks then passed. A low-contrast Forma closing eyebrow was also corrected. Browser QA is not an actual iPhone/Safari pass or owner acceptance of the final build.

Independent review must identify both exact integrated commits in PR #3 and private PR #55. Keep both draft pending owner QA. This increment does not publish a preview, merge, alter access, or change Pages, DNS, production, billing or prices. The exact review branch and main retain their disabled automatic Vercel deployment rules. Issue #2 remains open; setup pricing remains provisional. Prior benchmark and November 12 records describe earlier revisions and do not establish acceptance of this one.
