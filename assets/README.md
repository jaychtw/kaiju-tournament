# Production artwork

Original graphic painted characters derived from the approved sample 03 and its accepted pose-based trial. No Super Robot Wars, Nintendo, or third-party character assets, interface art, or attack sequences are included. Inspiration is limited to readable illustrated battle staging. No paid service subscription, purchased asset, specialist hire, or external video-generation service was used.

- `source/`: ten generated transparent four-pose sheets (six front/rear character identities, minus the two existing trial views), plus one illustrated grounds environment.
- `generation-prompts.json`: verbatim first six prompts and job IDs. These reference `docs/visual-direction/03-graphic-animation.png` for visual identity/style. Four further rear sheets reference their corresponding generated front sheets to retain identity; the grounds painting references sample 03. The tools do not expose seeds or model revision identifiers. Generation itself is not deterministic.
- `export-map.json`: original source SHA-256, component crops, support-area pivots, constant resize per view, and clipping flags. It records the actual export operation, including source-edge checks. Those checks do not certify perfect anatomy or pose consistency.
- `../public/art/`: optimized WebP runtime exports and manifest. No raw production sheets, trial videos, review ZIP, or historical art research ship in the app build.
- `../experiments/animation-trial/assets/frames/`: original 28 approved Komodor rear / Grumbongo front drawings. Their manually registered pivots are retained. The empty battle arena comes from that trial.

## Rebuild

Requires Python 3, Pillow, NumPy and SciPy (the exact versions already recorded in the trial's `requirements.txt`). From the repository root:

```sh
python scripts/build-art.py
python scripts/validate-art.py
```

The export extracts four separate opaque bodies using connected components, removes alpha dust/detached accent droplets, retains a 3px edge fringe, crops padding, registers a right support area, and resizes each view by a single constant factor. It does not synthesize in-betweens, alter RGB anatomy, or create a rig. WebP quality 87 trades a small amount of detail for practical downloads. Scene poses share one timeline/presentation system; guard, hit and defeated presentations reuse drawings deliberately. Rear variants are three-quarter views, and reaction poses sometimes turn toward the viewer.

These images are project-generated material, not distributed under the licenses of the software used to export them. The repository's `UNLICENSED` project setting remains unchanged. No independent trademark clearance or exclusive-rights guarantee is claimed for generated artwork.
