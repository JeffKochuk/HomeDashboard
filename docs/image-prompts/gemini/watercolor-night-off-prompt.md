# Gemini watercolor NIGHT: lights-off illumination reference

Source: `dist/assets/gemini/watercolor-night.jpeg` (2528 x 1686).

Output: `watercolor-night-off.png` (1535 x 1025 PNG). Slight aspect rounding from generation; normalize the illumination field to the 2528 x 1686 source without changing master pixels.

Generated original: `[internal generation output]`.

Method: built-in image_gen lighting-only edit after inspecting the source. One generation. Artificial glow is visibly off in all five rooms and hanging pendant lamps; cool night illumination and watercolor appearance are retained. Minor generative detail shifts can occur in areas previously obscured by bright light, especially kitchen surfaces. Use this as a broad illumination reference transferred to the unchanged master. Source remains unmodified.

## Exact prompt

```
Use case: lighting-weather.
Asset type: all-electric-lights-OFF illumination reference for a Gemini watercolor NIGHT home illustration.
Input image: the supplied 2528x1686 watercolor-night starter is the exact edit target. Preserve its complete crop and approximately 3:2 landscape aspect ratio. A 1536x1024 rendition is acceptable if the source composition and margins remain unchanged.
Primary request: turn OFF all artificial illumination in all five rooms, and change nothing else. Remove warm white/yellow/gold/orange light pools, glowing cores, bloom, and their reflected light. Specifically extinguish the bedside/headboard light in the upper-left bedroom, BOTH hanging pendant lamps and any lit gallery pictures in the long upper-center gallery, the desk/ceiling lamps and monitor emission in the upper-right study, the broad lamps and wall/sofa light pool in the lower-left living room, and all under-cabinet/ceiling/task light and warm dining-table pools in the lower-right kitchen/dining room. Every lamp fixture, pendant shade, cord, screen and wall picture remains the exact same object in the same position, rendered dull and non-emissive. Screens go dark. Intrinsic warm pigments in wood, rugs and cushions may remain subdued natural colors but must not glow.
Ambient lighting: preserve NIGHT. Replace the artificial warm illumination only with the scene's existing dim, cool indigo/blue/violet ambient light. All five rooms remain softly readable in that cool night ambience; do not make the entire home black. The existing dark blue-purple outer background and watercolor wash boundaries must remain unchanged. Do not change the surrounding background brightness, invent moonbeams, add stars, brighten into daylight, or introduce a new light source.
Medium: preserve this exact watercolor-on-paper illustration, the same soft translucent pigment washes, irregular wet watercolor edges, paper grain, loose furniture brushwork and existing subtle shadow shapes. Do not restyle into ink, papercraft, smooth 3D, photorealism, line art or cartoon.
Strict invariants: identical camera, outer house silhouette, framing, complete two-storey cutaway, walls and five room boundaries, all furnishings and details, exact stairs and black rail, stairwell opening, under-stair storage, art frame arrangement, plants, bed, sectional sofa, coffee table, kitchen/laundry/fridge, study and dining table. No object additions, removal, relocation, resizing, new contours, changed room sizes or recropping. Retain the exact projected geometry and material textures. Remove artificial illumination only. No text, labels, logos or watermark.
```
