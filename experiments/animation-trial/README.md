# Komodor animation feasibility trial

**Result: reusable frame playback is demonstrated; production-quality animation is not established.** Read the [assessment](../../docs/animation-trial/REPORT.md) before treating the files as production assets. The approved benchmark is the unchanged [sample 03](assets/benchmark.png).

## Review without development tools

- **Quick browser preview:** [animated WebP](output/motion-study.webp). This is a smaller, compressed preview of the actual export, not a separate generated video.
- **Primary output:** [10-second MP4, effects off](output/motion-study.mp4?raw=true), 1200×800, H.264, silent. On GitHub, use the download button/View raw; open the downloaded file in a standard browser or video player.
- **Comparison output:** [same study with small decorative accents](output/motion-study-effects.mp4?raw=true).
- **Asset reviewer:** download [animation-review.zip](output/animation-review.zip?raw=true), extract it, and try `index.html`. It includes the reusable sprites, timeline, and main MP4. The viewer uses ordinary local images and plain scripts, not modules or `fetch`. The cloud's managed browser blocks `file://`, so direct local-file launch is **unverified** here; the viewer was tested over HTTP. If local pages are blocked in your browser, open the included MP4 instead. No development tools are needed for the video.

The viewer has play/pause, slow playback, scrubbing, phase jumps, light/dark matte checks, optional accents, support-foot registration guides, and a pose inspector. These are review controls, not a playable battle. The guides show annotated support points; they do not implement foot IK or certify natural contact.

![Actual study preview, effects off](output/motion-study.webp)

## Reusable sources

| File/directory | Purpose |
| --- | --- |
| `assets/benchmark.png` | Byte-identical copy of approved sample 03; protected by SHA-256 validation |
| `assets/source/` | Nine raw generated PNGs: two isolated character masters and seven four-pose sheets |
| `assets/arena.png` | Generated matching empty arena plate; no characters baked into it |
| `assets/frames/` | 28 extracted RGBA drawings: 20 Komodor, 8 Grumbongo |
| `source-map.json` | Raw sheet membership, pose descriptions, and manually annotated source-image support-foot pivots |
| `assets.json` | Exported sprite dimensions, pivots, source references, byte counts, and hashes |
| `timeline.json` | Actual ten-second frame exposures, actor positions, draw order, phases, and contacts |
| `scripts/build_assets.py` | Rebuilds PNG sprites from the raw sources; no generative step or anatomical repainting |
| `scripts/render.py` | Composites the actual sprites into stills or MP4; clean and accent variants |
| `scripts/validate.py` | Checks benchmark, source/frame hashes, timing, deterministic frames, video duration/frame counts, and video/source correspondence |
| `scripts/prepare_viewer.py` | Generates plain-script playback data and the lightweight review ZIP |
| `scripts/make_evidence.py` | Recreates comparisons, matte checks, and the smaller animated preview |
| `PROMPTS.md`, `generation-log.json` | Full image prompts, reference relationships, and measured request intervals |
| `output/` | MP4s, animated preview, visual comparisons, validation and memory/storage measurements |

This is **frame animation**, not a layered skeletal rig. Each pose is a whole-character drawing. Major action changes are drawn: elbows/shoulders bend, torso/hips coil, the arm extends with foreshortening, the tail changes its silhouette, and faces change. No optical-flow morphs, crossfades, animated whole-image rotation/scaling, or separately generated video are used. Constant per-character scale and explicit position changes stage the drawings. Sparse exposures and position changes still create visible stepping and contact limitations; they are not equivalent to fully authored in-betweens.

Thirty encoded video frames per second does **not** mean thirty unique character drawings per second. The study holds and reuses the 28 source poses according to `timeline.json`.

## Reproduce from the saved assets

Python 3.12 with the versions in `requirements.txt`, plus FFmpeg 7.1.5 with `libx264`, were used. The existing environment already provides them. An optional isolated environment can install the pinned Python requirements; no regeneration of the artwork is required.

```sh
cd experiments/animation-trial
# Optional on another machine: create a virtual environment, then
# python -m pip install -r requirements.txt
python scripts/build_assets.py
python scripts/render.py
python scripts/render.py --effects
python scripts/make_evidence.py
python scripts/validate.py
python scripts/prepare_viewer.py
```

To export a guide frame:

```sh
python scripts/render.py --still 2.65 --guides
```

The PNG sources are saved because image generation is not deterministic and does not expose a seed/model identifier here. The export is reproducible from those sources; regenerating identical artwork from the prompts is not claimed. Exact encoded MP4 bytes can vary across encoder builds even when the source images and timing agree.

For HTTP inspection where local files are blocked, a developer can serve the repository with `python -m http.server 8765 --bind 127.0.0.1` and open the trial's `index.html` through that server. This is optional; the MP4/animated preview provides the no-install review path.

## Tools and licensing

The built-in image-generation tool used only the project's approved artwork and generated masters as image references. No new software/assets/credits/subscriptions were purchased, no artist was hired, and no references were uploaded to unrelated external art services. Use of the built-in capability remains subject to the platform/account terms; no claim is made that platform usage itself has no cost.

Local processing uses **Python 3.12.14**, **Pillow 12.3.0**, **NumPy 2.3.5**, **SciPy 1.17.0**, and **FFmpeg 7.1.5**. Python uses the PSF license; Pillow uses MIT-CMU/HPND terms; NumPy and SciPy use BSD-style licenses. The installed FFmpeg build enables GPL components including libx264. Those tools/binaries are dependencies, not redistributed in the review ZIP. Follow their licenses if redistributing the software itself. The scripts/viewer do not bundle a third-party animation runtime. DejaVu Sans is used from the system for diagnostic captions, not bundled as a font file. Existing Three.js/font dependencies in the historical POC are unchanged and unused by this trial.

Blender was available but **not used**; no rigged 3D model or Blender project is claimed. There is no generated video, external animation API, commissioned cleanup, or hidden hand-painted correction stage.

## Stop boundary

Only sample 03's visual target and this bounded trial were authorized. No complete playable battle, roster expansion, grounds, progression, or rendering-engine migration has been implemented. The next development decision requires user review of the actual motion and [feasibility report](../../docs/animation-trial/REPORT.md).
