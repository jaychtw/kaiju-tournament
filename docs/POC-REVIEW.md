# Battle POC review

## The experiment

The visual direction is a **sunlit coastal kaiju festival**. Sandstone architecture and a parchment-and-ink interface frame teal/coral Komodor against Grumbongo's charcoal/silver silhouette. The camera shows the player from the rear foreground and the opponent from the front background. Both characters are rendered and animated in actual 3D.

The strongest established result is a cohesive, playable battle composition. This build **does not establish parity with a polished Nintendo Switch game**. The supplied references have substantially more developed character sculpting, animation, materials, staging, and audiovisual editing. Their composition is a useful comparison; a console-quality claim is not justified by this POC.

## Evaluation

| Criterion | Demonstrated | Remaining gap |
| --- | --- | --- |
| Character quality | Original silhouettes, Komodor's articulated tail and coral sail, Grumbongo's exaggerated forearms and silver mantle, modeled eyes/brows/jaws, repeatable 3D views | Rounded limb intersections and regular surface patterns remain visibly procedural. Neither character has an artist-sculpted face, production topology, or a complete facial rig. |
| Artistic consistency | Shared sandstone/teal/coral/gold palette, common lighting, matching arena ornament and interface | The layered fur reads more like stylized locks than a fully resolved silverback coat. The crowd and distant landscape are simple repeated forms. |
| Immersion | Breathing, blinking, tail motion, waving flags, drifting clouds, staged movement, reactive synth audio, hit reactions, knockout and winner poses | No foot IK, hand-keyed arcs, authored creature voices, or individualized crowd performance. The scene remains a contained test arena. |
| Combat impact | Different guard/counter presentation; shield, swipe, shockwave, particles, recoil, impact flash, brief camera shake, paired HP changes | The punch choreography is simplified. Contact is sold partly through effects; hands are not constrained to anatomical contact points. KO is a controlled pose transition, not a physical ragdoll. |
| Performance and responsiveness | Capped DPR, static mesh batching, instanced crowd, fixed particle pool, Eco setting, real keyboard/touch browser tests | The cloud browser uses a software GPU. Its frame rates cannot predict a hardware-accelerated desktop or a physical phone. Real-device profiling is still required before accepting the performance target. |

## Highest-impact next refinements, subject to review

1. **One focused character-art pass.** Review turnarounds for both kaiju, then sculpt and retopologize approved designs. Bake normals/ambient occlusion and paint a shared texture treatment. Preserve the current silhouettes and palette if approved. Export a rigged GLB per character; replace the current assembly inside the scene rather than building a general-purpose asset framework.
2. **One focused animation pass.** Hand-key anticipation, contact, follow-through, guard absorption, and KO; add planted feet and a few facial poses. Improve the one existing matchup before producing more characters or moves.
3. **Profile the same battle on target hardware.** Test a midrange Android phone, an iPhone in Safari, and an integrated-GPU laptop. Measure sustained FPS and frame-time spikes during charged impacts, loading, memory use, thermal behavior, and touch responsiveness. Tune shadow resolution, draw calls, and DPR from those measurements.
4. **Author a small audio set.** Replace synthesized battle music and impacts with original or properly licensed music, two character voices, a crowd bed, and a few layered impacts. The existing mute/unlock and event hooks can remain.

These are recommendations, not additional implemented scope. No extra tournament spaces, roster members, progression, or speculative gameplay systems are included.

## Known limitations

- Animation is procedural joint-group interpolation, not a skinned animation production pipeline. Some joints can intersect and feet can slide during lunges. The silver fur is solid geometry; there are no groomed hair or cloth simulations.
- The starting camera is fixed to this matchup. Portrait and landscape are separately framed; the outer tail or decorative arena edge may approach the crop on narrow screens.
- Eco removes dynamic shadows and reduces resolution. It preserves contact patches and gameplay, but loses some grounding and material definition.
- The audience is instanced decorative geometry, not individual animated characters. Flags sway as assemblies rather than deforming as cloth.
- Only modern WebGL 2 browsers are supported. There is a readable fallback if renderer creation fails. A GPU context loss needs a page reload.
- Traditional Chinese glyphs use installed system fonts, so line wrapping and weight may vary by device. No remote font service is needed.
- Music, impacts, and result stings are synthesized. There are no authored kaiju roars. Browser audio policies require an interaction before sound starts.
- This is not a balance certification. Exact GDD mechanics are retained; mash speed strongly affects both survival and damage. There is no assist mode or alternate timing mechanic in this POC.
- The production renderer bundle triggers Vite's default 500 KB uncompressed chunk-size advisory. It is approximately 164 KB gzipped; splitting the one-screen demo into speculative chunks was not necessary for this checkpoint.
- Automated browser coverage is Chromium only. Physical-device performance, Safari, Firefox, screen-reader usability, and long-session thermal behavior remain unverified.
- Observed cloud SwiftShader samples were **2–4 FPS**, including 2 FPS for the emulated phone viewport. That is slow software rendering, not proof of smooth performance. The performance target is **unproven** until hardware-accelerated desktop and physical-phone tests are run. [Raw measurements](evidence/production-smoke.json) identify the resolution, DPR, draw calls, and triangle counts.

## Captured evidence

- [Desktop, High quality](evidence/desktop-high.png)
- [Guard completed; counter ready](evidence/guard-counter.png)
- [Traditional Chinese, phone portrait](evidence/mobile-zh.png)
- [Phone landscape](evidence/mobile-landscape.png)
- [Victory and knockout](evidence/victory-desktop.png)
- [Simultaneous double knockout](evidence/draw-desktop.png)
- [Validation report](evidence/VALIDATION.md)

## Asset provenance

The two character designs, arena, procedural textures, animations, UI icons, and synthesized audio were authored for this POC. No franchise characters, reference-image extracts, commercial game assets, emoji character art, or externally hosted illustrations are used. Three.js is MIT-licensed; the bundled Latin fonts are SIL OFL-licensed. The supplied GDD is retained verbatim as the product specification.
