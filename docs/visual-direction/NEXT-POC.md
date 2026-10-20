# Proposed next POC — approval required

> **Production update:** The user accepted the pose-based trial and approved the complete six-kaiju game. The former stop/gate recommendations below are historical and superseded by the [v1.0 production brief](../release/PRODUCTION-BRIEF.md) and [release review](../release/REVIEW.md). Continuous rigging is not required.

**Gate status:** sample 03 was approved as the target for a bounded tool-assisted animation feasibility trial. Gate 2's [trial and assessment](../animation-trial/REPORT.md) are delivered for review with partial results. **Gate 3, another complete playable battle, is not approved or started.** The initial real-time 3D POC remains a historical technical experiment.

## Gate 1: choose the visible direction and art workflow

The user authorized sample 03 and an autonomous feasibility test; no paid purchase or artist hire was authorized. The original review criteria below remain the benchmark, not proof that the motion trial passes.

Review [the gallery](README.md), [pipeline comparison](PIPELINE-COMPARISON.md), and sample-specific caveats. Select or revise the look. Confirm how layered source art, pose redraws, and animation cleanup will be supplied: an illustrator/animator, a proven external asset workflow, or a bounded autonomous trial with a genuine possibility of rejection. Approval is needed before implementation; silence does not select a direction.

**Pass criteria:** both character designs are compelling at battle size; Komodor reads from behind and Grumbongo from the front; anatomy, expressions, palette, material treatment, and arena belong together; neither relies on geometric assemblies, generic clip art, or effects hiding the body. Approve the character designs separately from the environment. The direction must remain convincing with the decorative effects and UI removed.

## Gate 2: prove animated assets before a complete battle

The bounded trial is now [available with reusable sources and an honest assessment](../animation-trial/REPORT.md). It has not demonstrated a production-ready pipeline; wait for user review before dependent work.

Produce one real 8–12 second motion study of Komodor with a restrained Grumbongo reaction. Include idle → guard absorption → counter preparation → charged strike → recovery, plus a face change and an explicit ground-contact guide. This is a targeted asset/animation trial, not a new complete game.

Deliver the actual usable source layers/rig/pose drawings and exported animation assets along with playback. Use the chosen treatment at the intended in-game character size and phone scale. A concept board, video generated without reusable assets, whole-image wobble, or crossfade between unrelated pictures does not pass.

**Pass criteria:**

- Scutes, digits, markings, face proportions, and the tail remain consistent across poses. There are no unexplained extra limbs, melting features, or visible unpainted holes behind moving parts.
- The motion shows anticipation, transfer of weight, contact, follow-through, and recovery. Feet remain planted where appropriate. A strike has genuine shape/foreshortening changes rather than only translation, squash, or rigid puppet rotation.
- The guard reads without a shield effect; the charged strike reads without extra particles. The face communicates intent and impact. Komodor's mass and personality remain recognizable in the rear view.
- The fixed light direction and contact shadows remain coherent during motion. Alpha edges hold up against light and dark arena regions. Camera movement does not expose unsupported views or slide the ground beneath the feet.
- Exported frames/layers can be replayed deterministically at varied render frame rates. Record asset count, source dimensions, compressed size, decoded texture footprint, source editing requirements, and the real production effort. Do not extrapolate six-character cost from prompt duration alone.

If this fails, pause and revise the art workflow or obtain appropriate art support. Do not compensate with extra effects or expand scope.

## Gate 3: one playable Komodor-versus-Grumbongo match

Only after the visual direction and animated asset trial are accepted, implement the next playable POC. Use the approved production artwork, not static substitutes. Preserve the rear-player/front-opponent camera, convincing arena depth, readable HP, real bilingual text, and keyboard/touch input. No exploration, selection, extra kaiju, progression, or new combat mechanics.

### Artistic and experiential acceptance

- Both fighters retain the approved image quality and anatomical consistency in idle, Attack, Defend, Charged Attack, hit, and KO. No character is a finished still paired with unfinished action poses.
- Attack, guard absorption, and the charged counter have distinct posing and timing. Hits communicate contact and mass; KO is an authored action rather than just rotating the whole sprite. Include a calm recovery beat so impact is not a constant barrage.
- Camera, floor perspective, foreground occlusion, character scale, contact shadows, arena layers, and effects maintain a coherent depth model. Portrait and landscape crops keep essential bodies and controls readable.
- Sound reinforces creature identity, anticipation, attack/guard contact, counter, and results. Mute works. Audio quality is reviewed by listening, not inferred from the lack of console errors.
- English and Traditional Chinese switching works during a match without losing state; HUD text is not baked into artwork. A first-time player can understand Guard & Counter without extensive instructions.

### Rules and interaction acceptance

Run the existing deterministic combat tests and renderer-independent input/outcome flows against the new presentation. Keep a real three-second mash window, no held-key repeat counts, a 1% boost per valid press, exact GDD attributes/formulas, simultaneous HP changes, double KO, guard survival/charge rules, disabled Defend in the charged round, and charge consumption. Presentation cannot change the outcome. All tests must execute meaningful assertions, with failed/skipped/unrun outcomes reported separately.

### Proposed performance gates — targets, not current results

Agree on exact reference devices before claiming a performance pass. A practical initial set is an integrated-GPU laptop in current Chrome, an iPhone 12-class device in Safari, and a Pixel 6a-class Android device in Chrome. Equivalent available devices may be selected and documented. Cloud software-renderer results are not substitutes.

- Target 60 FPS; require sustained **at least 50 FPS median and a 95th-percentile frame time no greater than 33 ms** during an active match on each selected reference device, with an explicit quality preset and CSS/backing-buffer resolution recorded. If a supported low-end tier needs 30 FPS, approve that tier separately instead of silently lowering this gate.
- Measure over a five-minute play session after shader/asset warm-up, including charged impacts, rematches, language changes, and portrait/landscape changes. Record dropped frames, long stalls, and device/OS/browser details. Do not infer sustained performance from a still or a brief idle sample.
- Input acceptance and visible feedback should normally occur within **100 ms** under those conditions. The three-second window must use elapsed time rather than assuming a fixed rendering rate.
- Start with a provisional **128 MiB resident texture budget** for the active match and **12 MiB compressed visual-asset download budget** for this POC. Verify decoded/uploaded textures and peak transitions, not just compressed file size. Record first-load and rematch behavior; adjust these budgets only with measured quality/performance evidence and review.
- No failed assets, runtime errors, uncontrolled memory growth across ten rematches, or hidden asset loading that changes the combat result. Test audio unlock, tab background/return, and touch on physical devices.

If these gates cannot be measured in the available environment, report them as unverified and identify the actual device access needed. Do not call mobile performance validated based on viewport emulation.

## Stop boundary

At each failed or unapproved gate, retain the useful engineering and review evidence and stop dependent work. After the next single-match POC, deliver another review checkpoint. Full production still requires explicit approval.
