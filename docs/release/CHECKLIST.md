# v1.0 implementation checklist

Authority: [production brief](PRODUCTION-BRIEF.md) supersedes the old art/production hold. Pose-based animation at b922df4 is accepted.

- [x] A: illustrated Komodor–Grumbongo battle, keyboard/touch, bilingual, Guard & Counter verified in browser
- [x] B: all six front/rear characters, shared pose presentation, deterministic balance report
- [x] C: selection → grounds movement → proximity challenge → five independent matches → standings → restart
- [ ] D: regression tests, responsive checks, assets/loading measurements, release instructions and repository push

Phase A: playable illustrated battle verified. Original 10 unit tests pass; all five original browser scenarios pass (four together, landscape scenario after layout fix). Build passes. Rules generalized to roster IDs without arithmetic changes. Hippocalypse ATK 85→110 is the sole balance adjustment; see BALANCE.md.

Next: six-character artwork and tournament loop. Physical-device performance remains unverified.

Phases B/C: all 12 browser scenarios pass, including six complete five-match tournaments (30/30 ordered matchups), saved results, restart, keyboard/touch movement, declined challenges, bilingual controls, and draw/loss progression. All 14 unit tests and 120 deterministic matchup samples pass.

Next: production bundle under a repository subpath, additional full phone tournament, performance samples, final release handoff. Continuous animation/rigging is intentionally not required by the production brief.
