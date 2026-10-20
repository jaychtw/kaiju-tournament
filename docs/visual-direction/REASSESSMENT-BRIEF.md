# World Kaiju Tournament — Visual Direction Reassessment

I've reviewed the screenshots of the initial POC, and I am not satisfied with the visual quality.

The current implementation appears closer to **dynamic storyboarding or previsualization used in film production** than to a visually polished commercial game.

This is not a criticism of the functional engineering work. The combat system, controls, testing, and technical foundations may be useful. However, the artistic result falls substantially short of our intended experience.

I want us to reconsider the visual-production strategy before continuing.

## 1. Do not continue the current graphics by default

Please do not assume that the next step is to refine the existing procedural 3D characters, add more polygons, or improve the current scene with additional effects.

We should treat the existing POC as a completed technical experiment whose visual direction has **not been approved**.

Preserve useful combat logic, localization, tests, and other reusable engineering work, but do not let the current rendering implementation constrain our next approach.

There is no need to deploy the current POC to GitHub Pages.

## 2. Reconsider the rendering approach

An important clarification to our GDD:

**World Kaiju Tournament does not need to use actual 3D graphics.**

We want an exquisitely rendered visual experience that convincingly conveys depth, volume, scale, personality, movement, and dramatic lighting.

Acceptable techniques include:

- High-quality 2D illustrations and character animation
- 2.5D layered scenes
- Pre-rendered 3D assets presented as 2D
- Real-time stylized 3D
- Hybrid approaches combining these techniques

We are open to different techniques for tournament exploration and combat.

Our priority is the **quality of the final image and experience**, not the sophistication of the underlying rendering technology.

A beautifully illustrated 2D kaiju is preferable to a mediocre real-time 3D kaiju.

Do not interpret Nintendo Switch 1 as a technical ceiling. It remains an artistic benchmark for cohesive, expressive, immersive, stylized games, and we may exceed it where practical.

## 3. Evaluate alternative art-production pipelines

Please reassess how we can produce six original, visually cohesive kaiju at substantially higher quality.

Compare at least these approaches:

**A. High-quality illustrated 2D**

Professionally styled character illustrations, layered body parts, expressive poses, animation, and lighting effects.

**B. Pre-rendered 3D to 2D**

Create or obtain high-quality 3D character assets, render them into carefully designed perspectives and animation sequences, then present those renders through a lightweight 2D engine.

**C. Stylized real-time 3D**

Use high-quality sculpted, textured, and rigged character assets with an appropriate real-time renderer.

**D. Hybrid approach**

Combine illustrated or pre-rendered characters with real-time backgrounds, effects, camera movement, and lighting where beneficial.

For each approach, assess:

- Expected achievable visual quality
- Character expressiveness and animation quality
- Asset-production requirements
- Consistency across six kaiju
- Browser and mobile performance
- Development complexity
- Practical limitations of the available tools
- What can be achieved autonomously and what requires external artwork, software, or human involvement

Distinguish limitations of the browser from limitations of the asset-production workflow.

Do not assume the current Three.js approach is inherently superior because it already exists.

## 4. Prioritize the actual artwork

The biggest improvement must be visible in the characters themselves.

Focus on:

- Original and compelling kaiju designs
- Sophisticated silhouettes and proportions
- Detailed but coherent surface treatment
- Expressive faces and personalities
- Convincing anatomy and volume
- Strong lighting, shading, and color harmony
- Consistency between character artwork and environment

Avoid results that look like assembled geometric primitives, generic clip art, placeholder sprites, or unfinished concept models.

The goal is not photorealism. It is **high-quality stylized illustration and animation**.

## 5. Preserve the intended battle composition

Regardless of rendering technology, retain our established composition:

- Player kaiju in the lower foreground, seen from behind
- Opponent in the upper background, facing the player
- A vibrant, lively tournament arena
- Convincing scale and spatial depth
- Clear HP bars and combat controls
- Expressive Attack, Defend, Charged Attack, hit, and knockout presentations

The scene should feel like a finished game environment rather than a technical demonstration.

## 6. Produce a visual-direction comparison before another playable POC

**Do not immediately rebuild the full battle scene.**

Instead, conduct a short visual-development phase.

Use Komodor and Grumbongo as the reference characters.

Where your available tools permit, produce a small number of representative visual samples demonstrating materially different rendering or art-production approaches.

These should be actual visual artifacts rather than descriptions alone.

At minimum, aim to demonstrate:

- Komodor's rear-facing battle appearance
- Grumbongo's front-facing battle appearance
- Their integration into a cohesive battle scene
- The intended level of detail, lighting, and stylistic polish

The samples should allow us to compare visual quality before investing in another complete implementation.

If your environment cannot produce sufficiently high-quality artwork independently, explain the limitation clearly. Identify what additional tools or assets would be required rather than compensating with low-quality procedural substitutes.

Do not present a polished mockup as proof that its animation or asset pipeline is already solved.

## 7. Recommend a production strategy

After evaluating the alternatives, recommend the approach most likely to achieve our artistic objectives within a realistic development workflow.

Explain:

1. Why the recommended approach offers the best visual result.
2. How it can support all six original kaiju consistently.
3. How character animation would work.
4. How the approach would integrate with the existing combat logic.
5. What technical or artistic uncertainties remain.
6. What should be tested in the next playable POC.

Do not choose the easiest implementation merely because it is convenient.

Also avoid choosing a theoretically superior approach that cannot realistically produce the required assets.

## 8. Update the design documentation

Revise the GDD's visual-production requirements to make rendering technology explicitly optional.

Record the initial POC as an experiment that successfully demonstrated technical feasibility but did not achieve artistic acceptance.

Preserve the original gameplay requirements, bilingual support, and Guard & Counter mechanics.

Keep the initial POC available in version control for reference.

## 9. Stop at the visual-direction review checkpoint

Deliver:

- A comparison of viable visual-production approaches
- Representative visual samples, where feasible
- A recommendation supported by clear reasoning
- An updated GDD
- An explanation of the next proposed POC and its acceptance criteria

**Do not implement the complete game or another full playable battle yet.**

Wait for my approval of the artistic direction and production strategy before proceeding.

Our development principle remains:

**Keep the doors open, but don't build rooms you may never enter.**

And our new visual-production principle is:

**Judge the artwork by what the player sees, not by how technically impressive its implementation is.**