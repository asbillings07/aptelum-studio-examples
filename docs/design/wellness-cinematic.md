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


## Real background video update — November 27, 2026

The owner requested actual background video and approved illustrative stock for Mirror Mirror. This supersedes the still-image motion behavior above, while retaining the approved page composition. Each of the four homepages uses a different real filmed stock clip; no RUMA footage is copied. Mirror Mirror clearly labels the footage as illustrative, not its premises, staff or treatment results. Real practice/staff photographs elsewhere remain. This is a protected example, not practice approval for a public campaign.

Native HTML video replaces the CSS pan; no video platform, SDK, iframe, analytics or new subscription. The local H.264 MP4 has no audio track, uses inline muted playback and loops. The first-frame WebP stays readable without JavaScript, on loading failure or when autoplay is denied. Video only loads while visible, with reduced-motion and exposed data-saving preferences respected before assigning its URL. A compact SVG/text control pauses or plays; user pause survives scrolling and tab changes. Automatic offscreen/tab pauses may resume if the user has not paused. Preference changes and page exit stop playback until a new user request. Denied autoplay is attempted once, then only on explicit Play; a media error disables playback for that page load. No timer, retry loop, storage or remote asset request is added.

The local media admission stays finite and hash-pinned. The HTML policy adds only `media-src 'self'`; the changed enhancement script has a new SHA-256 integrity pin. Publisher licensing permits website use and modification, with no implied endorsement; exact source, creator, license link, derivative size and hashes are recorded alongside the assets. An unrelated candidate download failed and was not treated as acquired. No new paid media or infrastructure was purchased.

Local verification: playback observed in Chrome, including a working pause/play control; all four video dimensions decoded at 1280×720. Visual inspection at 390px and 1440px; geometry checks at 320px, 768px and 1920px found no horizontal overflow. Controlled tests cover blocked autoplay, decode failure, reduced motion, data saving, manual-pause persistence and late playback after cancellation. These are not iPhone/Safari or owner QA. Existing carousel and appearance controls remain; actual iPhone playback, Low Power Mode and the footage choice remain review points for the owner.

Protected preview uploads are authorized by the current conversation after independent review and green current-source CI. Keep both PRs draft, issue #2 open and setup pricing provisional. No merge, Pages change, DNS change, production launch, live payments, customer-alias change or sharing/access expansion is authorized. The operator inspects project protection and source revisions before each upload, inspects uncertain outcomes before retrying, and stops on any unexpected provider change. Recovery is a source revert and a separately authorized preview replacement; no existing deployment is deleted.

[Stock footage provenance](background-video.json): Forma is a beauty portrait (583,092 bytes), Vale a skin-care routine (1,032,644 bytes), and Morrow a close detail of outdoor movement (1,731,317 bytes). Each 9–10 second clip is under the 2.5 MB per-file budget. Posters add 13,810, 11,982 and 80,916 bytes respectively. These video-derived stills replace the hero photos; earlier hero files are retained as rollback assets. The public artifact contains 132 files.
