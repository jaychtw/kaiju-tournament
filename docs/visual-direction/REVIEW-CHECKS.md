# Review-package checks

Checked on 2026-10-20.

- All three published PNGs were generated, visually inspected, and classified by their actual appearance. Each is 1536×1024 RGB; byte sizes and SHA-256 hashes are recorded in `ART-MANIFEST.json`.
- Local Markdown links and image references in the review package, root README, revised GDD, and historical POC report resolve to existing files. The gallery's sample numbers match the actual saved files.
- The original GDD v1.0 remains unchanged. GDD v1.1's vision/objectives, tournament/scoring rules, roster statistics, battle composition, combat formulas, Guard & Counter, bilingual/accessibility requirements, full-game acceptance list, and deferred-feature sections were compared against the original. Section 3 changes only the rendering/presentation permission; visual-production and review-gate revisions are intentional.
- Runtime source, tests, dependency declarations/lockfile, initial page, favicon, and Playwright configuration are unchanged from `bd13bd8`. There is no new renderer, new playable battle, or deployment workflow.
- The existing combat suite was rerun: **10 passed, 0 failed, 0 skipped**. No new browser/animation/device-performance result is claimed. The original browser results remain historical evidence for the initial POC only.
- The initial POC is recoverable at `bd13bd887888921f1d6fcd646ae82b204b3df628`. Its historical report now explicitly states that the visual direction failed acceptance and its previous 3D recommendation is superseded.
- No rigged model, layered artwork, reusable action animation, phone crop, audio treatment, or hardware performance has been newly validated. Those are explicit future gates, not implied deliverables of these stills.

The three published looks required more than three generation attempts. A reference-conditioned graphic edit was rejected for being too close to the painterly treatment. This is evidence of the need for art direction and review, not evidence of a deterministic six-character asset workflow.
