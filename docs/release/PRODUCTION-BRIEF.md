# World Kaiju Tournament — Resume Development Toward v1.0

## 1. Decision: Production resumes

I approve the illustrated, pose-based battle animation approach demonstrated in commit `b922df4`.

The 10-second Komodor–Grumbongo animation trial is artistically acceptable for the intended game. Its style and presentation remind me positively of the battle sequences in the *Super Robot Wars* series.

This changes our previous decision.

**We are no longer holding game production until continuous animation, perfect anatomical consistency, or a professional-quality rigging pipeline is demonstrated.**

Our new objective is to complete a coherent, enjoyable, family-friendly version 1.0 of **World Kaiju Tournament**.

Treat the previous animation experiment as an accepted visual foundation, not an unresolved obstacle.

### Governing priorities

In order:

1. Complete a genuinely playable game.
2. Preserve the approved illustrated visual identity.
3. Make combat satisfying, readable, and expressive.
4. Maintain correct gameplay rules and bilingual accessibility.
5. Keep performance and loading practical for desktop and mobile browsers.
6. Improve secondary visual details only when they materially enhance the experience.

Do not sacrifice completion for increasingly sophisticated animation technology.

This is our first game in this genre and an experimental AI-assisted development project. It does not need commercial-production polish.

It does need to feel like a complete game.

## 2. Project references

Use the existing repository and documentation as the source of truth.

Repository:
https://github.com/jaychtw/kaiju-tournament

Relevant materials:

- `docs/GDD-v1.1.md`
- `docs/visual-direction/README.md`
- `docs/visual-direction/03-graphic-animation.png`
- `docs/animation-trial/REPORT.md`
- `experiments/animation-trial/`
- The original functional combat POC and its tests.

Review the existing code and documentation before modifying the implementation.

Preserve the existing functional work wherever it remains useful.

Do not restart the game from scratch merely because the artistic approach has changed.

## 3. Artistic direction: Illustrated tactical-combat spectacle

The target is an original, expressive, colorful kaiju game with battle presentation inspired by the visual storytelling techniques of *Super Robot Wars*.

This means:

- Distinctive illustrated characters.
- Strong, recognizable silhouettes.
- Dramatic attack and defense poses.
- Readable anticipation, impact, reaction, and recovery.
- Strategic use of sprite movement, timing, camera framing, and restrained effects.
- Consistent arena artwork.
- Expressive faces and character personality.

Continuous anatomical animation is **not** required.

Limited animation is acceptable when the action remains clear, lively, and satisfying.

The approved trial establishes that pose-based animation can be enjoyable even with visible transitions.

Use original artwork and characters. Do not copy *Super Robot Wars* assets, copyrighted character designs, interface elements, or specific animation sequences.

### Character consistency

Preserve each kaiju's defining features and identity across poses.

Minor variation in fine details is acceptable. Obvious changes in anatomy, silhouette, color identity, or recognizable features are not.

Favor a small collection of good poses over a large collection of inconsistent ones.

## 4. Scope: Complete the original game

Implement the gameplay experience described in GDD v1.1, subject to the scope and production constraints in this instruction.

The game must include:

### Character selection

- All six original kaiju.
- Their names, clans, and statistics.
- Attractive, readable character-selection cards.
- English and Traditional Chinese support.
- Clear indication of the selected character.

### Tournament grounds

- A compact, colorful, coherent tournament environment.
- Player-controlled movement.
- Five other kaiju visible and available to challenge.
- Challenges initiated by approaching an opponent.
- Freedom to choose the order of opponents.
- Clear visual indication of opponents already fought.

The grounds do not need to be a large open world.

A compact 2.5D environment, illustrated perspective scene, or another lightweight approach is acceptable if it preserves the intended sense of roaming a tournament venue.

Prefer a finished, readable environment over an ambitious unfinished one.

### Battles

Preserve the approved combat rules.

The player selects **Attack** or **Defend**, then performs the three-second button-mashing phase.

Opponent attacks are simultaneous with the player's action.

Defending creates a mandatory charged Attack on the next round if the player survives.

Do not reintroduce Dodge or other removed mechanics.

Preserve:

- Existing damage calculations.
- Charge behavior.
- Simultaneous damage resolution.
- Draw handling.
- HP reset between matches.
- The five-opponent tournament structure.

Reuse and extend the original combat tests.

### Tournament results

- Every opponent can be challenged once.
- A loss or draw does not terminate the tournament.
- After five matches, present the player's final placement.
- Preserve the original win-count ranking rules.
- Provide an enjoyable results presentation.
- Allow the player to start a new tournament.

Do not implement NPC-versus-NPC tournament simulation.

## 5. Six-kaiju visual production strategy

We need six visually distinct kaiju, but we do not need six individually engineered animation systems.

Use a shared battle-presentation framework.

Each character should have a deliberately limited, practical set of visual states, such as:

- Idle.
- Attack preparation.
- Attack/contact.
- Defend/guard.
- Hit reaction.
- Recovery or defeat.

You may reuse or combine poses when the result remains convincing.

Because any of the six kaiju can be selected as the player, account for the required rear-facing player view and front-facing opponent view.

However, do not assume that every state needs a completely separate illustration in every view.

Look for sensible reuse, mirroring where anatomically appropriate, and presentation techniques that reduce asset-production effort without visibly undermining quality.

Adapt the approach to each character's anatomy:

- Komodor: tail and reptilian body.
- Grumbongo: heavy arms and expressive face.
- Kraken: tentacles.
- Hippocalypse: massive body and jaw.
- Condorion: wings.
- Sssir Pent: serpentine body.

**The goal is six enjoyable, visually coherent playable characters—not six perfect animation rigs.**

## 6. Address gameplay balance before finalizing the roster

Preserve the approved combat system, but evaluate the provisional character statistics for unintended deadlocks or nonfunctional matchups.

In particular, Hippocalypse's provisional ATK of 85 is below every other character's DEF, potentially making some encounters incapable of progressing through ordinary attacks.

Run deterministic matchup simulations and identify:

- Zero-damage loops.
- Unwinnable or practically interminable encounters.
- Severe first-player or character-selection imbalances.
- Whether Defend and charged Attack remain meaningful.
- Whether typical battle duration is suitable for family play.

Recommend the smallest necessary balance changes.

You may implement well-justified numerical adjustments that preserve the characters' intended identities and the original combat mechanics.

Document every change and its rationale.

Do not redesign combat or add new mechanics merely to solve a balance problem.

## 7. Bilingual accessibility and controls

Preserve full English and Traditional Chinese support.

The language toggle should work without restarting and should persist appropriately.

Ensure that the following are localized:

- Menus.
- Character names and clans.
- Instructions.
- Combat actions.
- Battle feedback.
- Results.
- Restart controls.

Support desktop keyboard interaction and practical touch controls for mobile devices.

Make button-mashing interactions comfortable and responsive on both input types.

Provide clear instructions for first-time players, including younger players.

Avoid small touch targets and text that becomes unreadable on phone screens.

## 8. Engineering and performance

Prefer the simplest reliable architecture that supports the approved experience.

You may reuse the existing application, adapt its renderer, or replace specific presentation components where necessary.

Do not undertake a large-scale engine migration unless the existing approach demonstrably prevents completion.

Maintain a clear separation between:

- Gameplay rules.
- Tournament state.
- Localization.
- Input handling.
- Visual presentation.
- Asset loading.

Reuse the existing combat logic and automated tests wherever possible.

Optimize obvious performance and loading issues, but avoid premature infrastructure work.

Measure performance on available devices and browsers. Distinguish real measurements from estimates or cloud-renderer limitations.

Do not claim physical mobile performance has been verified unless it has actually been tested.

## 9. Completion-oriented implementation plan

Work in the following order.

### Phase A — Integrate the approved battle presentation

Replace the first POC's rejected procedural character visuals with the accepted illustrated, pose-based approach.

Preserve the working combat logic.

Produce a playable Komodor-versus-Grumbongo battle with the new presentation.

Verify that:

- Attack and Defend work.
- Three-second mashing works.
- The mandatory charged Attack works.
- Both characters react appropriately.
- The visual presentation remains satisfying during actual gameplay.
- Keyboard and touch input work.
- English and Traditional Chinese work.

This is an integration milestone, not a new art-research project.

### Phase B — Complete the six-character roster

Create the remaining characters and their required battle views/states.

Reuse the common animation and combat presentation system.

Validate that each character can function as either player or opponent.

Test all matchups for correctness and practical completion.

### Phase C — Complete the tournament loop

Implement character selection, compact tournament grounds, opponent challenges, match history, rankings, and results.

Connect all components into one uninterrupted player journey:

**Select → Explore → Challenge → Battle → Repeat → Final Results → Play Again**

### Phase D — Polish, validate, and prepare release

Prioritize:

1. Game-breaking bugs.
2. Incorrect combat or progression.
3. Missing assets or localization.
4. Unclear controls and feedback.
5. Mobile usability.
6. Major visual inconsistencies.
7. Performance and loading.
8. Optional decorative polish.

Avoid adding unrelated features.

Prepare a browser-playable release candidate and deployment instructions.

If the existing repository supports a simple, secure static deployment, recommend that route.

Do not require a complex backend or user accounts.

## 10. Autonomy and resource constraints

Continue using tool-assisted autonomy.

You may use:

- Existing project assets.
- Available image-generation capabilities.
- Free and open-source tools.
- Suitable libraries and scripts.
- Reusable production techniques developed during the animation trial.

Do not incur paid expenses, subscribe to services, or hire specialists without explicit approval.

Document material third-party dependencies and licensing considerations.

You may make routine engineering and implementation decisions autonomously.

Do not repeatedly stop for minor design choices when the GDD and this instruction provide adequate guidance.

If an important choice is reversible and low risk, choose a sensible default and proceed.

If a decision would fundamentally change the approved game experience, require payment, or introduce a major irreversible dependency, stop and ask.

## 11. Progress reporting and scope discipline

Maintain a concise implementation checklist in the repository.

At each major milestone, report:

- What is complete and playable.
- What remains.
- What was tested.
- What is unverified.
- Any significant deviation from the GDD.
- The next planned step.

Commit coherent work regularly.

Avoid spending substantial effort on documentation that does not support implementation, verification, or handoff.

**Do not treat the end of each phase as a mandatory approval checkpoint.** Continue through the approved phases unless a major decision genuinely requires my input.

However, do not declare a phase complete solely because its code exists. Confirm the corresponding player experience works.

## 12. Definition of done — v1.0

Version 1.0 is complete when:

- All six kaiju are selectable.
- All five opponents can be challenged in any order.
- All required battles can be completed.
- Attack, Defend, charging, and mashing behave correctly.
- Character-specific illustrated battle presentations are available.
- The tournament grounds are navigable.
- Match history and final placement are correct.
- English and Traditional Chinese are usable throughout.
- Keyboard and touch controls are functional.
- A complete tournament can be played without developer intervention.
- The game can be restarted and played again.
- Automated tests pass.
- A browser-playable release candidate is available for review.
- Known limitations are documented honestly.

Perfection is not part of this definition.

## 13. Final delivery

When the release candidate is ready:

1. Push the completed work to the repository.
2. Provide a concise implementation summary.
3. Provide a direct way to play the game, if deployed, or straightforward launch instructions.
4. Report test results and platform coverage.
5. Identify known issues that materially affect gameplay.
6. Distinguish completed functionality from any remaining aspirations.
7. Stop for my final review before undertaking post-v1.0 improvements.

## Final instruction

The project has already taught us valuable lessons about AI-assisted engineering, artwork generation, and animation production.

Now I want to experience the completed game.

Make pragmatic decisions. Preserve the artistic character we've established. Keep the game fun, understandable, and complete.

**Favor finishing a good game over indefinitely pursuing a theoretically better one.**

Keep the doors open, but don't build rooms you may never enter.

**Proceed with development toward v1.0.**