# Validation record

Validated on 2026-10-20 with Node 24.19.0, npm 11.9.0, system Chromium, and SwiftShader software rendering in the cloud workspace.

| Check | Result |
| --- | --- |
| `npm ci --cache /tmp/wkt-npm-cache` | Passed; frozen lockfile installation |
| `npm test` | 10 passed, 0 failed, 0 skipped |
| `npm run test:browser` | 5 passed, 0 failed, 0 skipped; final run after rounding/localization corrections |
| `npm run build` | Passed; Vite emitted its default large-chunk advisory for the Three.js bundle |
| Production preview, port 4173 | Application rendered successfully |
| Production Guard smoke, 13 presses | Komodor 138 HP, Grumbongo 185 HP, round 2, counter charged |
| Production network inspection | 0 failed requests; 0 external requests |
| Production console/runtime inspection | 0 errors |
| Real-device performance / Safari / Firefox | Not run |

The browser scenarios exercise:

1. Startup, physical keyboard event handling, rejection of held/repeated Space, exactly five discrete presses, Guard state, live language switching, and language persistence after reload.
2. Defend → Charged Attack → Attack, simultaneous draw, both HP values at zero, and complete rematch reset.
3. A charged victory, including incoming damage on the winning round.
4. A 390×844 touch viewport with DPR 2, exactly one count per tap, localized UI, expected HP, touch target sizes, no horizontal overflow, rules dialog, and reset.
5. A 360px-wide English charged button, defeat after three basic attacks, and visible controls/no horizontal overflow after rotation to 844×390.

Unit tests also cover immutable simultaneous resolution, invalid inputs, damage floors, charge locking/consumption, no charge on a fatal guard, and half-up rounding. Specific regression cases include 13 basic-attack presses (80 damage), 59 basic-attack presses (149), and 118 charged-attack presses (401), avoiding binary floating-point half-value errors.

## Rendering observations

These are short diagnostic samples, not a controlled device benchmark. The cloud uses a CPU/software GPU. [Raw production observations](production-smoke.json):

| View | Drawing buffer/DPR setting | Draw calls | Triangles per rendered frame | Sampled FPS |
| --- | --- | ---: | ---: | ---: |
| Desktop 1280×900, High | CSS stage 1280×598, DPR 1 | 221 | 238,118 including shadow passes | 2 |
| Desktop 1280×900, Eco | CSS stage 1280×598, DPR 1 | 141 | 156,782 | 2 |
| Emulated phone 390×844, Eco | CSS stage 390×526, capped DPR 1.15 | 126 | 153,254 | 2 |
| Desktop charged-ready state, Eco | CSS stage 1280×598, DPR 1 | 144 | 158,318 | 4 |

**Smooth desktop/mobile performance is not established.** Hardware-accelerated profiling remains a review prerequisite. The deterministic combat tests and input/result checks establish gameplay correctness independently of these frame rates.

Production captures are `desktop-high.png`, `guard-counter.png`, and `mobile-zh.png`. The three outcome/landscape captures come from the final browser suite in Eco mode. Screenshots are evidence of rendered states, not a substitute for playing the animation or listening to the audio.
