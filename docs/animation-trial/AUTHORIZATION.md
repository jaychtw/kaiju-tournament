# World Kaiju Tournament — Animation Feasibility Trial

## Authorization and objective

I approve **sample 03 — Graphic Animation Treatment** as the visual target for our next experiment.

Reference:

https://github.com/jaychtw/kaiju-tournament/blob/main/docs/visual-direction/03-graphic-animation.png

Use the current GDD v1.1, pipeline comparison, and `docs/visual-direction/NEXT-POC.md` as the governing documents.

**This is approval to conduct the animation feasibility trial, not approval for full game production or another complete playable battle.**

Sample 03 exceeds my expectations for the game's potential artistic quality. However, I am skeptical that its quality can be reproduced consistently in actual gameplay, especially given the shortcomings of our first POC.

That skepticism is precisely what this experiment should investigate.

Our objective is not to demonstrate that something can move on a screen. It is to determine whether we can transform high-quality AI-generated concept artwork into **convincing, reusable, production-ready animated game assets without substantially compromising the original visual quality**.

## 1. Experiment philosophy

This is a learning project without commercial deadlines or production pressure.

Prioritize discovering actual capabilities and limitations over demonstrating apparent success.

A failed experiment that clearly identifies the technical or artistic bottleneck is more valuable than an impressive-looking demonstration that conceals unresolved problems.

Do not lower the artistic benchmark simply to produce a passing result.

Do not confuse:

- A beautiful still image with a usable game asset.
- A generated video with a reusable animation pipeline.
- Moving image layers with convincing character animation.
- Technically correct animation playback with satisfactory artistic quality.
- A successful one-off result with a repeatable production process.

**Preserve sample 03 as the reference benchmark throughout the experiment.**

## 2. Tool-assisted autonomy

You are authorized to use tools and resources beyond the current project dependencies when they can materially improve the experiment.

Permitted resources include:

- Available AI image-generation and image-editing capabilities.
- Free or open-source illustration and animation tools.
- Blender and other suitable graphics software.
- Free animation libraries, frameworks, and utilities.
- Scripts and automated asset-processing workflows.
- External tools or services that are genuinely free to use and whose terms permit this project.

You may investigate alternative tools rather than assuming the current Three.js implementation must be retained.

However:

- Do not purchase software, assets, subscriptions, credits, or services without my approval.
- Do not hire or commission an artist or animator without my approval.
- Respect copyright, licensing, attribution, and service terms.
- Do not use copyrighted game characters or artwork as substitute production assets.
- Document significant tools, dependencies, asset sources, and license obligations.
- Do not upload private project material to third-party services without confirming that doing so is permitted and appropriate.
- If a desirable tool is unavailable, report the dependency rather than pretending it was used.

The goal is to test **tool-assisted AI autonomy**, not artificially restrict the experiment to a single software environment.

You are free to select the most promising feasible workflow, but explain why you selected it.

## 3. Animation trial scope

Create one short animation study, approximately **8–12 seconds**, featuring Komodor as the primary animated character and Grumbongo as the opponent.

Use the approved graphic visual treatment.

The sequence should demonstrate:

1. **Idle:** Komodor breathes, shifts weight subtly, and shows signs of life.
2. **Defend:** Komodor assumes a convincing defensive stance and absorbs an incoming attack.
3. **Counter preparation:** Komodor visibly gathers strength and prepares a charged response.
4. **Charged Attack:** Komodor executes a forceful strike with meaningful body movement and a readable contact moment.
5. **Reaction:** Grumbongo reacts convincingly to the impact.
6. **Recovery:** Komodor returns to a stable, controlled posture.

Include at least one expressive facial change.

Preserve the established battle composition: Komodor in the lower foreground, primarily seen from behind; Grumbongo in the upper background, facing the player.

This is a motion study, not a complete gameplay sequence. It does not need to implement HP calculations, button mashing, localization, tournament progression, or interactive controls.

## 4. Artistic requirements

The animation must preserve the quality and identity of sample 03 as closely as the selected workflow permits.

Pay particular attention to:

**Character consistency**

- Stable proportions, anatomy, and silhouette.
- Consistent facial features, markings, scales, fur, and other distinctive details.
- Correct limb and digit counts.
- No unexplained changes between poses.
- No distorted or missing body surfaces revealed during movement.

**Movement quality**

- Clear anticipation before major actions.
- Convincing weight transfer and body mass.
- Readable defensive and offensive silhouettes.
- Meaningful changes in anatomy and foreshortening during strikes.
- Proper follow-through and recovery.
- Stable foot placement and believable ground contact.

**Visual coherence**

- Consistent lighting direction.
- Character and arena artwork that belong to the same visual world.
- Coherent shadows, scale, perspective, and occlusion.
- Clean alpha edges and layer transitions.
- Expressive movement without excessive visual clutter.

Do not rely on particles, camera shake, flashes, or sound effects to conceal weak character animation.

Evaluate the animation both with and without decorative effects.

## 5. Reusable asset requirement

This is the experiment's most important technical requirement.

**The result must include reusable animation assets, not merely a rendered video.**

Depending on the selected workflow, acceptable deliverables may include:

- Editable layered character artwork.
- Skeletal or cutout animation rigs.
- Authored pose drawings and replacement parts.
- Frame sequences or sprite atlases.
- Source animation projects.
- Reproducible export scripts and playback configuration.

The exact format is your decision.

However, the source materials must be inspectable, and the animation must be reproducible from them.

A generated video can supplement the deliverables, but it cannot substitute for reusable assets.

If AI-generated imagery cannot be reliably separated into clean layers or converted into consistent action poses, report that limitation explicitly.

Do not silently substitute whole-image translation, scaling, rotation, or crossfades for meaningful anatomical movement.

## 6. Deliver a viewable animation

Unlike the first technical POC, this experiment must provide an accessible way to review its actual output.

A full game deployment is unnecessary.

Provide a browser-viewable animation or a standard video file, together with the source assets.

If a standalone HTML animation viewer is useful, you may create one, but do not expand it into another playable combat system.

Include enough information for me to inspect the animation without installing development tools.

The viewer or video must show the actual reusable asset pipeline's output, not a separately generated promotional animation.

## 7. Evaluate the gap between target and result

Do not report only whether the animation works.

Compare the result against sample 03 across these dimensions:

| Dimension | Evaluation question |
|---|---|
| Visual fidelity | How much of the original illustration's quality survives animation? |
| Character identity | Does Komodor remain recognizably the same character in every pose? |
| Motion quality | Does the movement convey anatomy, weight, intention, and impact? |
| Artistic coherence | Do lighting, shadows, perspective, and environment remain consistent? |
| Asset reusability | Can the source assets support additional animation without starting over? |
| Repeatability | Can the same workflow realistically produce animations for other kaiju? |
| Autonomy | Which steps were accomplished autonomously, and which would require specialist intervention? |

Use a transparent assessment such as **Pass / Partial / Fail / Unverified**, supported by concrete observations.

Include side-by-side comparisons or representative frames where helpful.

Do not declare the experiment successful merely because all deliverable files exist.

## 8. Document the production process

Provide a concise but substantive production report covering:

1. Tools and techniques selected, including the reasons for choosing them.
2. Steps taken to transform the visual reference into usable assets.
3. Manual adjustments, cleanup, or corrections required.
4. Asset formats, dimensions, and approximate storage/memory requirements.
5. Time and effort involved in each major production stage, distinguishing measured work from estimates.
6. Problems encountered and unsuccessful approaches worth documenting.
7. Limitations that remain unresolved.
8. Dependencies on paid tools, specialist skills, or external services that would affect future production.

If the workflow required extensive manual intervention, make that visible.

If the animation was created using an improvised technique that cannot scale reliably, explain why.

## 9. Assess feasibility for the full roster

Do not create the other four kaiju.

Instead, assess whether the demonstrated workflow could reasonably support all six original characters, including their different anatomical challenges:

- Komodor's tail and reptilian anatomy.
- Grumbongo's massive arms and expressive face.
- Kraken's multiple tentacles.
- Hippocalypse's heavy body and jaw.
- Condorion's wings and feathers.
- Sssir Pent's long serpentine body.

Identify which characters would require substantially different rigging, drawing, or animation techniques.

Avoid extrapolating production effort from one successful animation without accounting for these differences.

## 10. Preserve existing engineering

Keep the first POC and its functional work in version control.

Do not modify combat mechanics, character statistics, bilingual behavior, or tournament requirements as part of this experiment.

The animation trial may use an independent implementation if that is more appropriate.

Avoid unnecessary changes to the existing application architecture.

## 11. Deliverables

Commit the experiment to the repository and provide:

- The actual 8–12-second animation.
- A directly viewable video or lightweight viewer.
- Inspectable reusable source assets.
- Any scripts or configuration needed to reproduce the animation.
- A visual-fidelity comparison against sample 03.
- An honest feasibility report.
- A recommendation for the next development decision.

Clearly distinguish completed work, partial results, failed attempts, and unverified assumptions.

If you encounter a fundamental blocker, document it and stop rather than constructing an elaborate workaround that defeats the experiment's purpose.

## 12. Stop condition

After delivering the animation trial and assessment, **stop and wait for my review**.

Do not proceed to:

- Another complete playable battle.
- The tournament exploration environment.
- The remaining four kaiju.
- Full character animation production.
- Championship progression.
- A large-scale rendering-engine migration.

The next decision will depend on what the experiment actually demonstrates.

## Guiding principles

**Judge the artwork by what the player sees, not by how technically impressive its implementation is.**

**A beautiful still is a visual promise; a reusable, convincing animation is evidence of production capability.**

**An experiment succeeds when it reduces uncertainty, even if the result fails to meet the target.**

And, as always:

**Keep the doors open, but don't build rooms you may never enter.**