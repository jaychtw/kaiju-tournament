# Dependencies and licensing

No paid purchases, subscriptions, asset-store packs or specialist hires were made for this release.

| Dependency/tool | Role | License / distribution note |
|---|---|---|
| Vite 8 / Rolldown | Build/development server | MIT; development only |
| Playwright | Chromium browser regression tests | Apache-2.0; development only |
| DM Sans | Local Latin UI font | SIL Open Font License 1.1; font package includes OFL |
| Barlow Condensed | Local Latin display font | SIL Open Font License 1.1; font package includes OFL |
| Three.js | Historical first POC | MIT; retained dependency/legacy source, no runtime import in release |
| Python | Optional asset rebuild tooling | PSF license; not shipped with game |
| Pillow | Optional crop/WebP export | HPND; not shipped with game |
| NumPy | Optional alpha processing | BSD-3-Clause; not shipped with game |
| SciPy | Optional connected-component extraction | BSD-3-Clause; not shipped with game |
| Chromium | Local browser verification | Chromium BSD and bundled third-party licenses; not shipped |
| GitHub Actions | Optional build/Pages workflow | checkout/setup-node/upload-pages-artifact/deploy-pages are MIT; service subject to host terms |

Generated artwork comes from the available image-generation tool, guided by project-original sample 03 and saved source sheets. No third-party character, soundtrack, recording or visual asset is used. Sound/music are synthesized locally by `src/audio.js`. Traditional Chinese uses device system fonts rather than an external CDN.

Font OFL texts are copied into `public/licenses/` and ship with the static build. Exact dependency resolutions are in `package-lock.json`. Original project source/art remain UNLICENSED; third-party tool licenses do not imply an open-source license for the game. This is a practical dependency inventory, not legal clearance for trademarks or exclusive rights in AI-generated artwork.
