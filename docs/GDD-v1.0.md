# World Kaiju Tournament
## Game Design Document — Version 1.0

**Project type:** Single-player, browser-based kaiju fighting tournament  
**Target platforms:** Desktop and mobile browsers  
**Languages:** English and Traditional Chinese (繁體中文)  
**Primary audience:** Family-friendly, accessible to children and enjoyable for older players  
**Development approach:** Design-first collaboration, followed by AI-assisted implementation

---

## 1. Game Vision

*World Kaiju Tournament* is a colorful, expressive, single-player fighting game featuring six original kaiju competing in an annual championship.

The player selects one kaiju, explores a compact tournament venue, and challenges the other five competitors in any order.

Each match uses a simplified, simultaneous-resolution combat system built around two choices:

- **Attack:** Strike immediately.
- **Defend:** Reduce incoming damage and prepare a powerful attack for the following round.

The game emphasizes accessible controls, strategic restraint, satisfying button-mashing interactions, expressive characters, and spectacular visual feedback.

### Core design philosophy

**Immersion over realism. Coherence over complexity. Expressiveness over raw fidelity.**

The game should be easy to learn without feeling simplistic. Its visual quality should approach that of polished, stylized commercial games while remaining practical for modern browsers.

## 2. Project Objectives

### Player experience

- Deliver an enjoyable, complete five-match tournament.
- Make each kaiju visually distinctive and full of personality.
- Encourage players to consider when to attack immediately and when to prepare a stronger strike.
- Provide satisfying combat feedback without complicated controls.
- Support both English and Traditional Chinese naturally.

### Development experiment

Explore how far a compact, AI-assisted browser game can go in visual quality, animation, presentation, and immersion.

Outstanding stylized Nintendo Switch games are an **aspirational reference**, not a technical ceiling or hardware specification.

Evaluate quality through artistic consistency, expressiveness, immersion, visual fidelity, and performance.

## 3. Game Structure

### 3.1 Character selection

At the beginning of a tournament, the player chooses one of six kaiju.

The selected kaiju becomes the player's character. **There are no trainers, commanders, or human avatars.** Kaiju fight independently.

The remaining five kaiju become opponents.

The selection interface presents each contender on a collectible-card-inspired panel featuring:

- Character artwork
- Unique name
- Clan
- Short personality description
- HP, Attack, and Defense statistics

The cards should be visually appealing, legible, and easy to navigate on touchscreens.

### 3.2 Tournament grounds

After selecting a kaiju, the player enters a compact, colorful tournament venue.

The environment should feature:

- A central martial-arts arena as a prominent visual landmark
- Accessible walkways and decorative surroundings
- Bright daylight and lively festival atmosphere
- Banners, architectural details, and subtle ambient animation
- The five remaining kaiju positioned around the grounds

Use a visually rich 2.5D or stylized 3D perspective, avoiding an isometric presentation.

The player begins near the lower center of the playable area and can approach opponents in any order.

### 3.3 Initiating a battle

Approaching or making contact with an available opponent opens a confirmation prompt:

**“Challenge [Kaiju Name]?”**

Options:

- Yes
- No

Confirming starts a battle transition.

Declining returns the player to exploration.

Previously challenged opponents remain identifiable but cannot be challenged again during the same tournament.

### 3.4 Tournament progression

Each tournament consists of exactly five matches.

A loss does not end the tournament. The player continues until all five opponents have been faced.

Every match starts with both kaiju at **full base HP**. Damage does not carry over between matches.

This follows the independent-match structure of arcade fighting games rather than RPG resource persistence.

## 4. Tournament Scoring

A battle can end in:

- **Victory:** Only the opponent is knocked out.
- **Defeat:** Only the player is knocked out.
- **Draw:** Both kaiju are knocked out during the same simultaneous resolution.

A draw counts as a loss for tournament scoring.

| Wins | Final standing |
|---|---|
| 5 | Champion |
| 4 | Second place |
| 3 | Third place |
| 2 | Fourth place |
| 1 | Fifth place |
| 0 | Sixth place |

The tournament interface should show wins, losses, and remaining matches.

After all five battles, present a celebratory final-results screen showing the player's kaiju, record, and placement.

Offer an option to start a new tournament.

The ranking represents the player's tournament performance; there is no requirement to simulate battles between computer-controlled opponents.

## 5. Kaiju Roster

All six characters are original kaiju inspired by animals or mythology, not literal oversized versions of ordinary animals.

Their anatomy, proportions, silhouettes, colors, and movements should make them recognizable as fantastical creatures.

The following names, clans, and statistics are **initial design values**, subject to review during production.

| Kaiju | Inspiration | HP | ATK | DEF | Total |
|---|---|---:|---:|---:|---:|
| Komodor | Humanoid Komodo dragon | 200 | 150 | 100 | 450 |
| Grumbongo | Silverback gorilla | 185 | 175 | 90 | 450 |
| Kraken | Mythical cephalopod | 195 | 155 | 100 | 450 |
| Hippocalypse | Humanoid hippopotamus | 240 | 85 | 125 | 450 |
| Condorion | Humanoid condor | 165 | 190 | 95 | 450 |
| Sssir Pent | Single-headed serpent | 210 | 140 | 100 | 450 |

### 5.1 Komodor — The Baseline

**Clan:** The Sunbathing Scales  
**Environment:** Coastal swampland  
**Combat identity:** Balanced

A powerful humanoid monitor-lizard kaiju with rugged scales, muscular limbs, claws, and a thick tail.

Komodor serves as the baseline for evaluating other characters' statistics.

The design may evoke familiar giant reptilian monsters but must have an original silhouette and character identity.

**Personality:** Fierce in combat; deeply committed to sunbathing afterward.

### 5.2 Grumbongo — The Bruiser

**Clan:** The Banana Republic  
**Environment:** Jungle  
**Combat identity:** High Attack

A massive silverback-inspired kaiju with enormous forearms, broad shoulders, a distinctive silver mantle, and expressive primate features.

Its visual inspiration should emphasize the natural silverback rather than reproducing a particular cinematic gorilla.

**Personality:** Usually composed, unless someone touches his bananas.

### 5.3 Kraken — The Abyssal Horror

**Clan:** The Ink Corporation  
**Environment:** Deep sea  
**Combat identity:** Versatile

A mythical cephalopod kaiju with a powerful central body and expressive, muscular tentacles.

Its anatomy must support readable battle poses and animations.

**Personality:** Has plenty of arms but very little patience.

### 5.4 Hippocalypse — The Fortress

**Clan:** The Heavyweight Grazers  
**Environment:** Grasslands and rivers  
**Combat identity:** High HP and Defense, low Attack

A bulky, hippopotamus-inspired humanoid titan with thick hide, an enormous jaw, and tremendous physical presence.

Its silhouette should immediately communicate durability.

**Personality:** Looks slow, moves slowly, and remains completely unbothered by both facts.

### 5.5 Condorion — The Sky Reaper

**Clan:** The Frequent Flyers  
**Environment:** Mountain skies  
**Combat identity:** High Attack, low HP

A tall, birdlike kaiju with an imposing hooked beak, dramatic wings, powerful talons, and a distinctive feather collar.

**Personality:** An accomplished flyer who still complains about legroom.

### 5.6 Sssir Pent — The Constrictor

**Clan:** The Cold-Blooded Aristocrats  
**Environment:** Ancient wilderness  
**Combat identity:** Durable, balanced

A single-headed, long-bodied serpent with powerful coils and subtle dragonlike features.

The design may draw from pythons, anacondas, and East Asian dragon imagery, but should remain distinct from Komodor.

No multiple heads.

**Personality:** Insists on being addressed formally, despite having no use for formal clothing.

### Character design principles

- Strongly differentiated silhouettes
- Slightly cartoonish, expressive faces and movements
- Powerful but approachable appearances
- Cohesive shared art style
- Distinctive colors and personalities
- Original artwork rather than direct reproduction of existing franchise characters
- Consistent anatomy across exploration, battle, and character-card presentations

## 6. Battle Presentation

The battle screen should use a cinematic, perspective-based composition:

- Player-controlled kaiju in the lower foreground, seen primarily from behind
- Opponent in the upper background, facing the player
- Both characters large and visually readable
- Tournament arena providing spatial depth and atmosphere
- Clearly visible HP bars and character names
- A dedicated lower interface for combat actions and button mashing

The reference is the **composition and dramatic clarity** of creature-battle games, not their specific characters, interface artwork, or assets.

The battle environment should feel like a major sporting event.

## 7. Combat System

### 7.1 Base attributes

Every kaiju has three attributes:

- **HP:** Health points
- **Attack (ATK):** Offensive strength
- **Defense (DEF):** Flat reduction of incoming attack strength

No Agility or Speed attribute is required.

### 7.2 Simultaneous resolution

Combat is divided into rounds, but neither kaiju attacks first.

The player selects an action and completes a three-second button-mashing challenge.

The opponent always performs a basic Attack.

Both sides' effects are calculated from the same pre-resolution state, and both HP changes are applied together.

A knockout does not cancel an opponent's attack in the same round.

Simultaneous knockouts result in a Draw.

Animation may be sequenced for visual clarity, but animation order must never affect combat calculations.

### 7.3 Button-mashing multiplier

For each action, the player has three seconds to repeatedly press a designated keyboard key or touchscreen button.

Let:

- `N` = number of valid presses during the three-second window
- `M = 1 + 0.01 × N`

Each press increases the relevant attribute's effectiveness by 1%.

The interface should show the countdown and responsive feedback for successful presses.

The input system must work on both keyboard and touchscreens and avoid unintended counts from holding a key.

### 7.4 Attack

The player attacks immediately.

**Effective Attack:**

`Player ATK × M`

**Damage dealt:**

`max(0, Effective Attack − Opponent DEF)`

The opponent simultaneously attacks the player.

**Damage received:**

`max(0, Opponent ATK − Player DEF)`

HP cannot fall below zero.

### 7.5 Defend — Guard & Counter

Defend is an intentional setup for a powerful counterstrike, inspired by boxing's defensive-to-offensive techniques.

The player sacrifices immediate damage to reduce incoming damage and charge the following round's Attack.

**Effective Defense:**

`Player DEF × M`

**Damage received while Defending:**

`max(0, Opponent ATK − Effective Defense)`

The player deals no damage during the Defend round.

If the player survives, their next Attack becomes charged.

### 7.6 Charged Attack

After Defend, the following round requires an Attack.

- The Attack button remains available and visually highlighted.
- The Defend button is disabled.
- The player actively initiates the charged Attack.
- The normal three-second button-mashing challenge still applies.
- The charge is consumed after the Attack.
- The following round restores both action choices, provided the battle continues.

**Charged effective Attack:**

`Player Base ATK × 1.5 × M`

**Charged damage:**

`max(0, Charged Effective Attack − Opponent DEF)`

The charged bonus does not stack.

If the player is knocked out during Defend, the battle ends without a charged strike.

### 7.7 Combat philosophy

**Attack:** Seize the initiative and deal damage now.

**Defend:** Guard against an attack and commit to a stronger strike next round.

The system should encourage thoughtful restraint and delayed gratification rather than indiscriminate Attack selection.

The distinction must be communicated through gameplay and visual feedback, not lengthy instructions.

### 7.8 Enemy behavior

For version 1.0, computer-controlled opponents always use basic Attack.

They do not select Defend or receive charged bonuses.

Their individual statistics create different matchups and levels of difficulty.

### 7.9 Numerical handling

Use consistent rounding for displayed HP and damage. Exact rounding behavior may be selected during implementation, but must be deterministic and tested.

## 8. Combat Interface and Feedback

The interface has two primary actions:

**ATTACK** and **DEFEND**

During a charged round, Defend is visibly unavailable and Attack is highlighted.

Recommended charged-state message:

**“CATCH & SHOOT! — Attack ×1.5”**

The interface should provide:

- Large, touch-friendly buttons
- Readable HP bars
- Visible three-second countdown
- Immediate response to button presses
- Distinct animations for Attack, Defend, and Charged Attack
- Clear damage and knockout feedback
- Victory, defeat, and draw announcements

### Animation direction

**Attack:** Strong anticipation, decisive strike, clear impact.

**Defend:** Guarding pose, impact absorption, visible preparation for the counterstrike.

**Charged Attack:** Stronger anticipation, more dramatic motion, distinctive visual effects, and heavier impact feedback.

Use restrained camera shake, impact flashes, particles, and expressive reactions to create spectacle without obscuring gameplay.

## 9. Visual Direction

### 9.1 Artistic identity

**Arcade Kaiju Spectacle**

A vibrant, lively, slightly cartoonish world with expressive characters and dramatic combat.

Avoid photorealism as a default objective. Prioritize immersion, coherence, and personality.

### 9.2 Quality benchmark

Use the polish and artistic ambition of outstanding stylized Nintendo Switch games as a reference.

This is **not a technical ceiling**.

Explore higher visual fidelity when feasible and when it improves the experience.

Do not sacrifice consistent art direction, clarity, or responsive gameplay merely to increase technical complexity.

### 9.3 Tournament environment

- Bright, welcoming daylight
- Colorful banners and decorations
- Expressive environmental details
- Clear movement paths
- Subtle ambient animations
- Visually prominent central arena
- Distinctive kaiju placement

### 9.4 Battle environment

- Cinematic perspective
- Convincing depth and scale
- Rich lighting and shadows where practical
- Lively stadium atmosphere
- Expressive character animation
- Dramatic but readable effects
- Strong visual hierarchy for characters and HP

### 9.5 Color

No rigid final palette is prescribed.

Favor vibrant, harmonious colors, with enough contrast to preserve character readability and UI clarity.

Avoid excessive neon, visual clutter, and uniformly saturated scenes.

### 9.6 Audio

Include appropriate music and sound effects for:

- Tournament exploration
- Battle introduction
- Attacks and defensive impacts
- Charged attacks
- Victory, defeat, and draw
- Final tournament results

Audio should reinforce personality and impact without becoming overwhelming.

Provide a mute or sound control.

## 10. Bilingual Experience

The entire game must support:

- English
- Traditional Chinese (繁體中文)

Include a visible **EN / 繁中** language toggle.

Language switching should work without restarting the game.

Localize:

- Menus and buttons
- Character descriptions and clan humor
- Challenge confirmations
- Combat messages
- Tutorial guidance
- Battle results
- Tournament standings
- Final results

Translations should sound natural in each language, especially jokes and character introductions.

The UI must accommodate different text lengths and remain legible on desktop and mobile.

Persist language preference where practical.

## 11. Controls and Accessibility

### Desktop

Support intuitive keyboard movement and combat controls.

### Mobile

Support touch-based movement and combat interactions with comfortably sized controls.

### General

- Make interactive elements visually obvious.
- Avoid requiring precise tapping on small targets.
- Maintain readable text and adequate contrast.
- Prevent accidental double activation.
- Provide clear feedback when an action is unavailable.
- Ensure essential gameplay information is not communicated through color alone.

A first-time child player should be able to select a kaiju, challenge an opponent, understand the two combat choices, and complete a match without extensive instruction.

## 12. Visual Proof-of-Concept Milestone

Before producing the entire game, build a representative battle scene featuring **Komodor versus Grumbongo**.

The prototype should demonstrate:

1. Consistent, expressive character designs
2. Player-from-behind and opponent-from-front battle composition
3. Convincing arena depth and atmosphere
4. Idle, Attack, Defend, Charged Attack, hit, and knockout animations
5. Lighting, impact effects, and sound
6. Readable bilingual interface
7. Desktop and mobile performance

The purpose is to establish the project's practical visual standard and identify constraints early.

Evaluate:

- Visual fidelity
- Artistic coherence
- Character expressiveness
- Immersion and feedback
- Animation quality
- Performance and responsiveness

Refine the representative scene before scaling production to the complete roster.

## 13. Implementation Principles

This GDD specifies the desired experience, behavior, and acceptance criteria.

The implementation agent may select the rendering technology, architecture, asset pipeline, and libraries, provided it can justify the choices against the requirements.

Priorities:

- Maintainable, modular implementation
- Clear separation of character data and combat rules
- Data-driven roster definitions
- Consistent localization system
- Responsive desktop and mobile layouts
- Reliable simultaneous combat resolution
- Efficient asset loading and rendering
- Avoidance of unnecessary dependencies and speculative systems

The architecture should allow future kaiju to be added without substantial rewriting, but no unrequested future gameplay mechanics should be built.

**Keep the doors open, but don't build rooms you may never enter.**

## 14. Acceptance Criteria

The initial complete game is acceptable when:

- A player can select any of six distinct kaiju.
- Each kaiju has the correct attributes, personality, and visual identity.
- The player can explore the tournament grounds and challenge remaining opponents in any order.
- A tournament consists of five independent matches.
- Every match begins with full HP.
- Attack and Defend behave according to the specified formulas.
- Defend charges the following Attack by ×1.5.
- The charged round requires Attack and disables Defend.
- Combat effects resolve simultaneously, including double knockouts.
- Draws count as losses for tournament scoring.
- Final placement is determined by the player's total victories.
- The interface supports English and Traditional Chinese throughout.
- The game is playable on desktop and mobile browsers.
- The visual presentation is cohesive, expressive, lively, and immersive.
- The implementation is stable and understandable enough to maintain and extend.

## 15. Known Risks and Provisional Decisions

### Combat balance

Equal attribute totals do not guarantee equal combat strength.

Test all six kaiju as player characters against the other five opponents.

Particular attention should be given to:

- Whether high Defense becomes disproportionately powerful
- Whether Hippocalypse's low Attack causes excessively long battles
- Whether Defend → Charged Attack becomes an automatic dominant strategy
- Whether all six characters have reasonable championship-winning potential
- Whether three-second button mashing feels fair across desktop and touch devices

Balance adjustments may be made after testing, without changing the core Guard & Counter philosophy.

### Visual production

The principal risk is consistency across character views, poses, animation, and environments.

The prototype must demonstrate a repeatable visual-production approach before the full roster is built.

### Scope

Avoid expanding into additional combat attributes, elaborate enemy AI, RPG progression, or unnecessary tournament systems during version 1.0.

## 16. Deferred Features

Not required for the initial release:

- Additional playable kaiju
- Agility or Speed statistics
- Shun / dodge action
- Enemy Defend or special moves
- RPG leveling or equipment
- Persistent HP between matches
- Multiplayer
- Complex simulated rankings among computer-controlled opponents

These may be reconsidered only if future playtesting establishes a clear benefit.

---

## Final Creative Direction

*World Kaiju Tournament* should feel like a small but thoughtfully crafted commercial game: colorful, humorous, accessible, and surprisingly spectacular.

Its central combat lesson is simple:

**Sometimes the strongest attack begins with the discipline to defend.**

And its production ambition is equally clear:

**Discover how far we can take visual immersion in a browser game—without mistaking technical complexity for quality.**