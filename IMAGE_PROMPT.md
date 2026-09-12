# Lighting reference

Mode: built-in `image_gen` edit, one source image and one generated all-off lighting reference. The generated reference is `dist/assets/watercolor-unlit-reference.png`; the unchanged source is `dist/assets/watercolor-original.jpeg`.

The reference introduced small detail changes. The app therefore uses only its low-frequency illumination, transferred onto the original pixels. Its redrawn objects are not shown. All 32 lossless final PNGs and their ZIP are saved in the parent workspace's `output` directory. This preserves the original composition and painted detail while simulating lighting; it is not a physically exact relighting of a measured 3D scene.

## Exact image-generation prompt

Use case: lighting-weather
Asset type: exact-alignment alternate state for an interactive watercolor home illustration.
Input image: the attached /Users/jeffk/Downloads/Watercolor image.jpeg is the EDIT TARGET, not a style reference.
Primary request: Make exactly one lighting-only edit of this existing watercolor cutaway home: turn ALL artificial lights OFF in all five rooms. Preserve the complete composition and all visual content with exceptionally high fidelity so this edited image can be layered over the original.

The five areas are:
1. Bedroom, top left: bedside lamp off; remove the warm lamp glow from the bed, walls, and floor.
2. Gallery hallway, upper center: every picture light off; remove all warm illumination pools over the artwork, walls, and wood floor.
3. Study, top right: desk lamp and computer display off; eliminate artificial warm illumination and monitor emission.
4. Living room, bottom left: curved floor lamp off; no glowing bulb, no warm light pool on wall, sofa, rug, or floor.
5. Kitchen and dining room, bottom right: all ceiling, pendant, cabinet, and task illumination off; bulbs and fixtures no longer emit light; no warm illumination pools on cupboards, counters, table, or floor.

Lighting/mood: Cool, dim nighttime moonlight and soft blue ambient illumination remain, enough to see the watercolor objects and room boundaries clearly. Every electric light is completely off. Keep the actual warm material colors of wood and textiles where naturally visible, but remove artificial warm yellow cast, luminous bulbs, and emitted pools. The dark rooms should be visibly darker and cooler than the original.

Strict invariants: Change ONLY interior lighting and its directly cast illumination. Preserve EXACT camera, crop, house geometry, silhouette, room divisions, wall edges, stair railings, every stair tread, artwork, frames, furniture, plants, desk, monitor, kitchen units, dining table and chairs, small objects, proportions, and positions. No objects may be moved, removed, added, redrawn, or reimagined. Preserve the source watercolor brushwork, paper grain, textures, painted detail, and illustrative style. Preserve exterior night sky, crescent moon, outside background, house exterior, and white watercolor paper edges exactly as in the original. Do not darken the full canvas or alter the exterior. No text, labels, overlays, new decorations, or watermark.

Composition/framing: Same landscape image, full original framing, same approximately 3:2 aspect ratio as the 1024x682 source. This is the same image with only all interior artificial lighting switched off, not a new rendition of the house.
