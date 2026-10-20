# Visual production reassessment

**Status: visual direction unapproved.** This package proposes a new direction; it does not approve one or implement another playable battle. The [review brief](REASSESSMENT-BRIEF.md) supersedes the initial POC's assumption that real-time 3D was the preferred route.

The first POC demonstrated working combat rules, interaction, localization, and a browser implementation. It **failed artistic acceptance**. Its assembled character anatomy and procedural presentation are closer to previs than the intended finished game. More effects or polygons would not resolve the central character-art problem. Its slow software-GPU measurements also did not establish hardware-device performance. The source remains unchanged and available at commit [`bd13bd8`](https://github.com/jaychtw/kaiju-tournament/commit/bd13bd887888921f1d6fcd646ae82b204b3df628).

## How to read the visual samples

See the [visual gallery](README.md). These are **AI-generated art-direction targets**, not screenshots from a new engine, exported Blender renders, layered source art, animation frames, or production-ready assets. They demonstrate possible final-image treatments. Their single-image polish cannot establish view consistency, animation quality, mobile performance, or the cost of making six characters.

The comparison holds the battle idea constant: a rear-facing Komodor in the lower foreground, a front-facing Grumbongo farther away, a sunlit tournament, readable scale, and family-friendly personalities. No painted UI text is presented as working bilingual UI. Actual names, HP, controls, and feedback would remain separate localized interface elements.

**Art style and rendering pipeline are separate decisions.** A painted look can use ordinary 2D or a hybrid; an excellent sculpted look can be baked into sprites or run in real time. In particular, a single still cannot distinguish pipelines B and C.

## A. High-quality illustrated 2D

| Question | Assessment |
| --- | --- |
| Achievable quality | Very high for this fixed battle composition. A finished painting can devote attention directly to the silhouette, face, surface grouping, and light the player sees. Fine painterly edge control is easier to preserve than reconstruct as real-time materials. |
| Expression and animation | Strong when key poses, face changes, and foreshortened limbs are drawn intentionally. A layered skeletal rig can handle breathing, weight shift, tail motion, and some transitions. A large punch or turn requires replacement drawings or frame animation; stretching a single illustration is insufficient. |
| Asset requirements | Approved designs; rear/front battle views; clean layers with hidden areas painted behind overlapping limbs; pivots; face/mouth/brow variants; action-specific drawings; contact shadows; exportable atlases. A flattened PNG is not this asset package. |
| Consistency across six | A shared style guide, color script, scale lineup, anatomy sheets, and one supervised art workflow can keep quality consistent. Every kaiju eventually needs both player/rear and enemy/front views. Generated images alone can drift in scutes, fingers, fur, and proportions. Kraken's tentacles and Sssir Pent's coils need their own rig/pose solutions. |
| Browser/mobile | Usually favorable: textured quads, atlas batching, modest effects. Texture resolution, transparent overdraw, and atlas residency still matter. Decode and upload spikes can cause stutter even with few draw calls. |
| Development complexity | Moderate rendering complexity, substantial drawing/cleanup/animation work. PixiJS or an equivalent 2D compositor is suitable; no engine is selected or installed in this review. An authored cutout rig or a licensed animation runtime is a separate decision. |
| Available autonomy | Image generation can produce strong design/scene candidates and reference-conditioned pose proposals. I can implement compositing, exports from suitable source art, animation playback, combat integration, and tests. I cannot promise reliable automatic decomposition, painted hidden surfaces, or professional action animation from a single generated image. |
| External help / limitation | For predictable production quality, plan for an illustrator/2D animator to approve and clean designs, prepare layered masters, and author difficult poses. A suitable layered paint/animation tool is needed for that work. Generated transparent exports are possible candidates, not proof of clean editable anatomy. |

**Main failure mode:** a gorgeous idle image that becomes a sliding, hinged paper puppet in motion. Reject that result even if the idle screenshot is excellent.

## B. Pre-rendered 3D presented as 2D

| Question | Assessment |
| --- | --- |
| Achievable quality | Very high with excellent source models and offline lighting. Detailed fur, rich shadows, and painted/sculpted surfaces can be baked into an image without running their full shading cost on a phone. |
| Expression and animation | One properly rigged model supports consistent shapes and views. Facial posing, weight, and animation still require art direction. Frame sprites preserve authored deformation and offline light but limit camera changes and can expose low temporal sampling. |
| Asset requirements | Six original sculpted models, topology/UVs, textures, rigs, facial controls, animation clips, a consistent render scene, separate character/shadow passes, alpha-safe edges, frame trimming, atlas/export tooling, and per-view renders. Existing unrelated marketplace monsters do not automatically form a cohesive original roster. |
| Consistency across six | Excellent repeatability once approved models exist; costly to establish. One material/lighting/render template can cover the roster. Different anatomy still needs tailored rigs and actions. |
| Browser/mobile | Low runtime geometry/shading cost, potentially high download, decoding, and GPU texture cost. Compression of the image file does not make its decoded RGBA texture small. Fixed angles are friendly to our battle camera. |
| Development complexity | High offline art/animation pipeline; moderate runtime sprite player. Need to manage contact shadows, baked-light consistency, clip transitions, atlas memory, and frame timing. |
| Available autonomy | Blender 4.3.2 and FFmpeg are installed. I can script reproducible renders, camera/light templates, render passes, sprite packing, and browser playback from valid source assets. A rendering script is not a substitute for those assets. |
| External help / limitation | No specialist high-quality character-model/rig generation tool is exposed here. Image generation does not output a verified rigged Blender/GLB model. Plan for a character artist and animator, or suitably licensed high-quality base assets with substantial design work. I have not produced such models in this phase. |

**Memory example, not a measured asset:** a 512×768 RGBA frame occupies 1.5 MiB uncompressed. Ninety-six frames across a fighter's clips occupy 144 MiB; two active fighters occupy 288 MiB before mipmaps, arena, effects, or duplicates. Trimming, resolution tiers, compressed GPU textures where supported, and loading only the needed clips can help. Their quality and memory behavior must be demonstrated, not assumed.

**Main failure mode:** offline render quality is excellent, but the phone build has huge atlases, abrupt transitions, baked shadows that slide, or an unusable camera crop.

## C. Stylized real-time 3D with production assets

| Question | Assessment |
| --- | --- |
| Achievable quality | High to very high. Browsers can render sophisticated stylized characters; the previous POC's geometry was an asset-quality limitation, not evidence of a general browser image-quality ceiling. Mobile budgets still constrain shading, geometry, shadows, and postprocessing. |
| Expression and animation | Best flexibility for continuous camera changes, skeletal deformation, blended actions, facial morphs, IK, and shared stage lighting. Those controls need good models, skinning, animation, and staging to be useful. |
| Asset requirements | Approved sculpts, retopology/UVs, baked/painted textures, deformable rigs, expressive faces, authored clips, appropriate LODs, and a consistent shader/light setup. Converting the existing primitive assemblies to GLB would not satisfy this requirement. |
| Consistency across six | Strong with a supervised sculpt/texture/rig pipeline and shared art direction. Six anatomical families prevent assuming one generic skeleton or animation retarget will solve all six. |
| Browser/mobile | Feasible, but needs real-device work on skinning, draw calls, texture memory, transparency/fur treatment, shadows, shader compilation, and sustained thermals. Desktop fidelity cannot simply be copied to all phones. |
| Development complexity | Highest runtime visual complexity of these choices, in addition to substantial asset production. Three.js could remain a renderer, but its presence in the repository is no reason to select this path. |
| Available autonomy | I can implement a GLB pipeline, material/light tuning, animation-state integration, budgets, profiling hooks, and tests. Blender can inspect/process assets. None of that independently produces the required artist-quality sculpt, topology, or animation. |
| External help / limitation | High-quality original model/texture/rig/animation work is the gating dependency. It requires specialist art work or a proven asset-generation workflow that has not been demonstrated here. |

**Main failure mode:** spending on renderer sophistication before obtaining compelling, expressive characters. More render features cannot rescue weak anatomy or a generic face.

## D. Hybrid, with illustration leading the image

| Question | Assessment |
| --- | --- |
| Achievable quality | Very high for a directed battle view: richly painted or pre-rendered characters, a matching layered arena, and restrained real-time shadows/effects/camera compositing. This can preserve illustration quality while making depth and impact active. It need not contain any real-time 3D geometry. |
| Expression and animation | Layered idle/secondary motion plus authored replacement poses and short frame sequences for strikes, guards, hits, and KOs. Face variants carry personality. Camera parallax, foreground occlusion, shadows, dust, and sound support the movement; they cannot replace anatomical action. |
| Asset requirements | All of A's character preparation, plus separated foreground/midground/background arena layers, mattes/occlusion masks, a ground-plane definition, contact shadows, and consistent baked light direction. Using pre-rendered characters would additionally inherit B's model-production requirement. |
| Consistency across six | One approved art bible, shared arena/color script, fixed view conventions, pose/motion rules, and a repeatable export review. Character-specific anatomy is handled in the drawings/rigs rather than forced through the old 3D assembly. |
| Browser/mobile | Favorable if texture/overdraw budgets are respected. A shallow compositing stack can be cheaper than shaded 3D, but many large transparent layers or multipass effects can still be expensive. |
| Development complexity | Moderate runtime complexity. Some coordination cost for depth masks, parallax limits, shadows, and asset exports. Do not mix 2D/3D merely to make the stack sound sophisticated. |
| Available autonomy | I can produce still candidates and implement scene layering, a restrained camera, effects, audio timing, action playback, and the existing combat rules. Reference-conditioned image editing can help propose poses, but cleanup and deformation must pass visual inspection. |
| External help / limitation | The key unresolved work is a production-ready illustrated character package and convincing motion. Human illustration/animation cleanup is the realistic baseline for dependable quality. Fully autonomous production remains conditional on a successful animation/export trial. |

**Main failure mode:** attractive flat posters sliding over a mismatched 3D floor, or an effect-heavy scene hiding weak poses. Lighting, foot placement, occlusion, and silhouette need to hold up with effects disabled.

## Recommendation

Use **D with illustrated characters and a painted layered arena**, taking **sample 03's expressive graphic character treatment** as the starting candidate. Its more designed gorilla face, silver crest, alert reptile profile, and clear light/shadow masses fit the slightly cartoonish sporting world better than sample 02's naturalistic surface rendering. Sample 01 remains a viable softer painterly alternative. This is a proposed direction for review, not a selected engine or an approved style. It combines A's direct control of the image with modest real-time staging. The whole battle may remain 2D/2.5D.

This is the best current fit because our composition is directed, the player evaluates large characters at two known view conventions, and the immediate failure was in visible character art. Image generation can already explore that visible target; an illustrator can refine it directly. Real-time 3D adds little value until good models exist. Pre-rendered 3D remains a credible alternative if a capable character-asset team or verified high-quality model workflow becomes available; it should not be chosen on the assumption that such models can be generated automatically here.

**The recommendation includes a real art dependency.** I can continue visual development and engineering autonomously. I cannot honestly commit to all six characters at this sample quality in motion without first proving how clean layers, redraws, and animation will be produced. If external art help is unavailable, the animation trial is a go/no-go experiment; failure should lead to a revised scope/tooling decision, not a return to low-quality procedural substitutes.

### Six-character consistency plan

1. Approve a compact art bible: body-scale lineup, proportion ranges, face/eye construction, scale/fur/feather treatment, light direction, palette, edge treatment, and maximum detail at phone size. Define rear and front camera conventions. Do not create the remaining roster yet.
2. Lock Komodor and Grumbongo anatomy and markings across neutral views and action poses. Review scute count/placement, finger/toe counts, handedness, silver mantle shape, and facial proportions. The current generated stills are not a turnaround proof.
3. Prepare one complete layered character and one challenging motion. Review source layers and hidden-area paint, not only a flattened export. Use the result to establish a real cost and quality baseline.
4. After the two-character POC passes and the user approves scaling, use the same art direction and export checks for the other four kaiju. Tail, tentacle, wing, and coil motion require appropriate anatomy-specific treatment. The later exploration technique may differ; maintain identity rather than forcing identical rendering technology.

### How motion would work

- **Idle:** breathing/weight shift, small neck/shoulder motion, tail follow-through, blinking and expressive eye/brow replacements. Maintain feet and silhouette.
- **Attack:** authored anticipation pose, a foreshortened strike drawing or short frame sequence, contact pose, recoil, recovery. Avoid enlarging a static arm sprite to fake foreshortening.
- **Defend:** a readable braced silhouette with shoulder/forearm changes, planted feet, compressed impact pose, then a distinct counter-ready pose.
- **Charged Attack:** a stronger authored windup and strike with the same anatomy; lighting accents, sound, hit stop and restrained camera motion support it. An orange recolor of the basic strike alone does not qualify.
- **Hit / KO:** facial replacements and action drawings that preserve body mass, ground contact, and weight; a whole-image rotation/fade is insufficient.

Lighting is chiefly art-directed and baked into coherent character/background passes. Contact shadows, selective rim overlays, glints, and effects may vary. There is no promise of arbitrary relighting of a painted character. Camera motion stays within the views the artwork can support; large orbiting cameras would require another asset strategy.

### Integration with existing engineering

Keep `src/combat.js`, stats, the three-second press window, simultaneous outcomes, deterministic rounding, English/Traditional Chinese strings, keyboard/touch behavior, and their meaningful tests. Replace the renderer through action/impact/completion events rather than changing the rules to fit animation. The existing `prepare`, `press`, `startRound`, `reset`, and event hooks are useful reference boundaries, not a requirement to retain the current scene architecture or dependency.

Resolve damage from one shared round snapshot. Commit both HP updates on one presentation event. Neither animation order nor an early KO cancels the other effect. Keep the bilingual UI as real text outside painted art. Do not reuse renderer-specific FPS numbers or tests as evidence for a new renderer; establish new baselines.

## What must be proved next

See [the proposed next-POC brief and acceptance gates](NEXT-POC.md). First approval is of the visible direction and realistic art-production arrangement. Then verify one short **actual animated asset trial** before building the next full playable match. No new playable scene, deployment, full roster, exploration, or championship work is implemented in this review package.
