# Artwork provenance and source prompts

All three published samples were generated for this review using the image-generation tool on 2026-10-20. They are flattened 2D PNGs. No third-party character assets, commercial-game screenshots, stock models, photographs, or existing artist imagery were used as image references. The original game brief supplied the character identities; palette, scutes, mantle, charm, and the coastal arena are proposed design choices, not an approved model sheet.

The tool does not expose a reproducible seed or a model/version identifier here. The prompts below record intent and reference relationships, not a guarantee that another run will reproduce the pixels. Original generated files were left intact; repository files are byte-for-byte copies, with no paintover, cropping, layer extraction, animation, alpha cleanup, or Blender rendering performed.

Sample 02 was inspected and classified by its actual render-like appearance, even though its original prompt requested painting. Sample 01 is a reference-conditioned painterly edit. An intermediate reference-conditioned graphic edit was too close to 01; it is not one of the three published samples. The final 03 instead uses the written brief without an image reference to explore stronger graphic shapes and expression. Its anatomy/proportion differences are disclosed in the gallery. These decisions demonstrate art direction and generation variability, not a proven consistency pipeline.

See `ART-MANIFEST.json` for dimensions, hashes, file sizes, and the identity of each published image. There are no source rigs, layered painting files, action sprites, or 3D models behind these samples. Any future use as production artwork still needs asset preparation, consistency review, and animation validation.

## 02-sculpted-look.png

Initial shared scene; requested illustration but inspected as sculpted/render-like treatment.

Image reference: none; generated from the written brief.

<details>
<summary>Full generation prompt</summary>

```text
Create one exquisitely finished visual-development illustration for an original family-friendly browser game, WORLD KAIJU TOURNAMENT. This is a premium painted 2D game-art direction, NOT a 3D screenshot, not a concept sketch, not a storyboard, no geometric toy anatomy. Landscape 3:2 image, exceptionally polished character illustration with believable volume, sophisticated anatomy, lovely shapes and restrained surface detail. NO TEXT, no labels, no logos, no UI: leave a calm strip of sky along the upper 12% for a future real bilingual HUD, but the artwork must stand on its own.
BATTLE COMPOSITION: low cinematic camera immediately behind and to the right of the player's kaiju in the LEFT LOWER FOREGROUND, showing its back, rear shoulders, enormous tail curling across lower left foreground, and a small profile of the face looking into the arena. The enemy stands in the RIGHT UPPER MIDGROUND facing the player/camera, fully legible expressive face. These two kaiju dominate the image; the arena is a stage, not the main subject. Camera non-isometric, convincing ground-plane foreshortening and huge scale. No humans commanding them.
LOCK THESE TWO ORIGINAL DESIGNS:
KOMODOR: a muscular humanoid monitor-lizard kaiju, elongated wedge-shaped Komodo head, low heavy brow and a knowing golden eye; broad back, strong digitigrade hind legs, powerful clawed hands, long thick muscular S-curving tail. Deep petrol-teal back scales, jade-green side scales, warm ochre throat/belly, asymmetrical natural worn scale clusters, five broad backward-swept CORAL-ORANGE finlike dorsal scutes that taper into smaller tail scutes. Broad leathery neck and mature reptilian anatomy. No giraffe horns, no little dragon wings, no plastic round-ball joints, no superhero clothing. Sun-loving fierce but personable creature. Back muscles under overlapping scales must look sculptural and intentional.
GRUMBONGO: a massive silverback-inspired fantastical gorilla kaiju with huge low-hanging forearms, barrel chest and broad shoulder-to-waist taper; beautiful smoke-silver mantle flowing in broad elegant shaggy shapes over shoulders and upper back, near-black indigo underfur, weathered warm plum-gray face and palms. Intelligent amber eyes below heavy expressive brows; broad short nose, a stern but endearing closed-mouth half-smirk, small restrained lower canines. Thick knuckles, a natural irregular silver crown crest, subtle warm-tawny chest skin. Tiny simple banana-shaped carved amber charm on a thin dark cord, secondary not costume. Real primate-inspired facial anatomy, no ape in armor, no cinematic monster likeness, no human clothing.
WORLD / ART: sunlit coastal martial-arts tournament, cream sandstone circular fighting terrace with turquoise painted ring and a refined weathered sun medallion in the floor, vermilion and jade pagoda-roof architecture, tasteful saffron/coral festival banners, lush coastal trees and a luminous blue-green sea beyond distant stands. Dense cheering audience read as softly painted visual texture, never rows of floating spheres. Warm early-afternoon sun from upper left and cool skylight on shadow planes, soft contact shadows firmly grounding both kaiju, atmospheric perspective. Exquisite stylized illustrative painting: painterly edge control, confident hand-painted fur masses and scale groups, selective crisp detail on faces and hands, soft loose background depth; refined warm/cool color harmony. Finished premium animated-feature illustration craft translated to a readable game scene. Friendly sporting tension, no gore or violence. Make the final image dramatically superior to a procedural prototype. No confetti or effects hiding character anatomy.
```

</details>

## 01-painted-illustration.png

Painterly edit using 02 as a visual reference.

Image reference: 02-sculpted-look.png.

<details>
<summary>Full generation prompt</summary>

```text
EDIT THE PROVIDED REFERENCE into a materially different, exquisitely hand-painted 2D GAME ILLUSTRATION. Keep the two original character designs, their battle identities, their anatomical proportions, the huge foreground Komodor seen from the rear on the left, front-facing Grumbongo on the right farther away, the curling tail, and the coastal festival arena composition. This is visual style exploration, not a screenshot.
CRITICAL CHANGE: replace the detailed render-like surface treatment with confident, sophisticated painterly stylization. This must look unmistakably DRAWN AND PAINTED BY A GREAT ILLUSTRATOR: broad gouache-like brush planes, deliberate lost-and-found edges, simplified beautiful mass design, warm/cool color blocking, rhythmic graphic highlights, rich reflected light. No photographic pore texture, no strand-by-strand realistic fur, no uniformly tiled tiny scales. Character forms remain convincing and volumetric, with carefully designed muscle planes, hand-painted scale GROUPS and large graceful silver-fur locks. Selective fine marks only near eyes, expressive brows, and knuckles. Feature-animation-level appeal, NOT cute chibi mascots or rounded plastic toys. No artist/franchise imitation.
Design clarity: Komodor has a mature angular elongated monitor-lizard head, fierce intelligent golden eye seen in profile, deep petrol teal/jade back, ochre throat, broad coral dorsal fins, thick tapering tail with weight, muscular reptilian hindquarters, and curved ivory claws. No separate geometric ball joints, horns, wings, clothes, or armor. Grumbongo is charcoal-indigo and warm plum-gray with a magnificent smoke-silver shoulder mantle, an expressive slightly lifted brow, a confident warm lopsided smirk, massive rounded-square knuckles and forearms, a tiny carved amber banana charm. Make him an ORIGINAL fantastical silverback sporting rival, approachable but imposing, not a literal photo of a gorilla.
Arena/background: painterly cream sandstone terrace with elegant turquoise/sun patterns, warm coral/jade roof silhouettes and banners, layered palm islands, a jewel-toned sea and luminous pale sky, softer crowd brushwork and atmosphere. A warm honey sunlight key from upper left, lavender/teal reflected shadows and grounded contact shadows. Make characters highest contrast/detail and allow the lovely setting to recede. Keep a quiet sky strip near the upper center for a future HUD, but add NO actual HUD or typography. No text anywhere, no logo, no border, no effect bloom hiding anatomy. Landscape full-scene image, a premium finished illustrated game image with emotional appeal and beautiful controlled shapes.
```

</details>

## 03-graphic-animation.png

Graphic illustration from the shared written character brief; stronger shape/expression exploration.

Image reference: none; generated from the written brief.

<details>
<summary>Full generation prompt</summary>

```text
Create a stunning FINISHED HAND-DRAWN 2D ANIMATION GAME KEYFRAME for an original game, World Kaiju Tournament. Landscape 3:2. This direction must be obviously illustrated, with wonderful expressive shape design, bold readable graphic shadow planes, warm/cool color harmony, sophisticated tapered ink accents, subtle paper/pigment brushwork, NO photographic detail and NO 3D rendering appearance. Make something much more characterful and appealing than a generic fantasy monster illustration. Large readable shape language, not childish chibi or simple clip art, not a storyboard. Limit surface detail to carefully chosen clusters: the body volumes, silhouette, faces and gesture are the stars.
Battle camera: low perspective, non-isometric, player Komodor in the LEFT LOWER FOREGROUND seen from BEHIND in three-quarter rear view; opponent Grumbongo in RIGHT UPPER BACKGROUND facing the player and camera. Both are giant kaiju fighting independently, no human trainers. Komodor's long heavy tail curls across the bottom left, with his two feet and full muscular back grounded on the arena. Grumbongo's expressive face and huge arms read clearly. Dynamic sporting tension before a strike, not a violent impact. Both faces invite affection and recognition.
KOMODOR design: muscular fantastical humanoid Komodo monitor lizard, broad wedge-shaped long reptilian head visible in small right-facing profile, one expressive golden eye with clear cream sclera, angular brow with personality. Powerful shoulders, narrower waist, bent muscular hind legs, strong clawed hands partly lifted into an alert fighter stance. Petrol blue-teal back, jade sides, ochre belly, a row of five large sculptural CORAL-ORANGE dorsal sail plates flowing into small tail scutes. Do NOT render hundreds of individual realistic scales; use selected graphic scute clusters, large clean muscle planes and painted light shapes. Distinct angular mature monitor-lizard anatomy, no horns, wings, armor or clothing.
GRUMBONGO design: an original silverback-inspired fantastical gorilla kaiju, huge squared forearms and knuckles, an exaggerated shoulder-to-waist taper and solid heavy feet. Charcoal/indigo body and warm plum-gray face, pale smoke-silver mane over shoulders and crest. Draw the silver mane as a few elegant flame-like angular tufts, not realistic hair. His intelligent face is beautifully simplified with expressive thick brows, cream sclera with amber pupils, a warm mischievous asymmetrical grin, one raised brow, broad short flat nose, discreet small canines. Give him weight, personality and slightly comical self-confidence; do not draw a literal natural-history gorilla or a familiar movie monster. A tiny banana-shaped amber charm on thin cord is his only accessory.
Shared world: a gorgeous layered hand-painted coastal tournament arena, warm cream sandstone circular terrace with turquoise sun markings, jade pagoda-roof pavilions and vermilion pillars, coral and saffron banners, a cheering crowd suggested as loose painted color bands, luminous turquoise sea and lush palm islands receding through atmosphere. Warm sunlight from upper left, rich cool blue-violet shadow planes, controlled reflected light and elegant dark contact shadows anchor the bodies. Their cast shadows match the floor perspective. Simplify architecture and texture where necessary so characters have visual priority. Compose some calm upper sky for a future bilingual HUD but include NO UI, NO LETTERING, NO TEXT, NO WATERMARKS or borders. Visually polished contemporary illustrated game art, highly coherent art direction, big expressive character shapes with beautiful design taste.
```

</details>
