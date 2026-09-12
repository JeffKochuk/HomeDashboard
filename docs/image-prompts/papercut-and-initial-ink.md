# HomeDashboard style transfers: Japanese ink on silk and layered paper cut

The original detailed ink pair below is superseded by `japanese-ink-silk-minimal-day.png` and `japanese-ink-silk-minimal-night.png`. See `minimal-ink-prompts-and-review.md` for their exact prompts and review. The paper cut pair remains the selected paper output.

Method: built-in image_gen, style-transfer DAY edits from the original. NIGHT images are lighting-only edits of their selected DAY counterpart. No Site files were changed.

Original edit target: `/var/folders/9g/ckrllpw17_3285k1bq0v6tn00000gp/T/codex-clipboard-baa52c4c-f911-43a2-b5ec-a5b117de7dbd.png`

All four selected images are 1536 × 1024 pixels, PNG, landscape 3:2.

## Selected output files

- `japanese-ink-silk-day.png` — generated source `/Users/jeffk/.codex/generated_images/01a09358-9fc3-7900-8995-066e2d877f8d/exec-7075d135-6a12-457d-aea5-87d99daa0b1a.png`
- `japanese-ink-silk-night.png` — generated source `/Users/jeffk/.codex/generated_images/01a09358-9fc3-7900-8995-066e2d877f8d/exec-9d679c17-4b4e-420f-95d8-20c564d8a62c.png`
- `layered-paper-cut-day.png` — generated source `/Users/jeffk/.codex/generated_images/01a09358-9fc3-7900-8995-066e2d877f8d/exec-08192178-aace-4e45-b24f-8389a800aa09.png`
- `layered-paper-cut-night.png` — generated source `/Users/jeffk/.codex/generated_images/01a09358-9fc3-7900-8995-066e2d877f8d/exec-af9e8157-9f7a-4965-bfea-1984481a36b0.png`

## Visual review and limits

The outer silhouette, camera, five region boundaries, stair position and main furnishing placements remain visually very close to the source. No deliberate layout changes were made. These are generative style transfers rather than guaranteed pixel-perfect registration: thin contours and tiny details may vary. Ink simplifies colors and some tiny details, with visible woven substrate and dry-brush outlines; its detailed house drawing is less sparse than a highly abstract minimalist sumi painting. Paper translates folds, leaves and wall art into visibly simplified cardstock constructions while maintaining their placement. In the paper DAY, warm electric illumination is subtle relative to daylight; in NIGHT, all five warm room pools read clearly. The ink DAY introduced tiny light marks to establish warm pools; the NIGHT counterpart preserves these. No claim of deterministic alignment or exact tiny furnishing counts is made.

## Exact prompt: ink DAY

```
Use case: style-transfer.
Asset type: HomeDashboard full-home illustration, Japanese ink-on-silk DAY.
Input image: supplied original is the edit target and strict composition reference.
Primary request: Edit the supplied image, preserving the complete two-storey cutaway home's exact source camera, projected geometry, 3:2 crop, outer silhouette, wall/divider boundaries and furniture positions. Target 1536x1024 landscape. The original full house must remain wholly visible with the identical margins. Lock all five spatial regions: bedroom upper left with the same timber bed; long gallery upper center with the same framed art and exact black stair rail; study upper right with desk, chair, bookcase, cupboard, plants and pouf; living room lower left with the same sectional sofa, triangular coffee table and rug; kitchen/dining lower right with the same refrigerator, vertically stacked washer/dryer, cabinets and dining table. Preserve the precise stair geometry, stairwell opening, under-stair storage, open center floor, furniture counts, wall art placements and all room boundaries. Do not recompose, rearrange, expand rooms, add rooms, add furniture, alter viewing angle, replace furniture types or crop the house. No text, letters, labels, logos or watermarks.
Style/medium: exceptionally elegant minimalist Japanese sumi ink drawing painted on fine ivory silk. Transform every part of the pictured home into confident hand-drawn calligraphic brush linework and restrained monochrome ink washes, with sparse muted warm gold details. Visible subtle woven silk threads throughout the entire image, including pale background and furnishings. Carefully observed architectural contours, graceful variation in brush pressure, beautiful economical marks and negative space. Keep furniture and every room legible; simplify surface rendering only, never remove objects. This must clearly be ink on silk, not watercolor, not a 3D render, not vector art. Absolutely no seals, signatures or calligraphy lettering.
Lighting/mood: luminous gentle natural DAYLIGHT, airy ivory negative space, warm wood suggested with pale gold wash. All five rooms have their electric lights softly ON: bedroom, gallery, study, living, kitchen/dining. Indicate five restrained warm pools integrated into the drawn scene without adding furniture or changing architecture. Retain all geometry and positions.
```

## Exact prompt: ink NIGHT

```
Use case: lighting-weather.
Asset type: HomeDashboard Japanese ink-on-silk NIGHT illustration.
Input image: the supplied Japanese ink-on-silk DAY illustration is the edit target.
Primary request: produce the NIGHT counterpart by changing lighting and ambient color treatment ONLY. Retain the fine ivory silk weave, hand-drawn sumi brush linework, restrained ink washes, sparse gold detailing and exactly the same composition. Replace bright daytime ambient light with deep blue/indigo evening ink wash in the background and unlit surfaces, while retaining clear legibility and the physical silk texture. Warm golden electric illumination visibly ON in ALL FIVE rooms: bedroom upper left, long gallery upper center, study upper right, living lower left and kitchen/dining lower right. Make each room's warm pool distinct yet natural; practical lamplight casts cozy warm illumination on furniture and floors. Night must read clearly but not become so dark that details disappear. The silk background may take on deep indigo while showing its weave.
Invariants: lighting-only edit; lock every contour and position. Same exact 1536x1024 3:2 crop, camera, house silhouette, walls, five region boundaries, furnishings and furnishing counts, precise staircase geometry, black rail, stairwell opening, art frames, under-stair storage and open center floor. Do not add or remove objects, alter textures into photorealism, move walls/furniture or recompose. No text, seals, calligraphic lettering, labels, logos or watermarks.
```

## Exact prompt: paper DAY (selected second pass)

```
Use case: style-transfer.
Asset type: HomeDashboard full-home PAPER CUT diorama DAY.
Input image: original full home is a strict geometry and location guide, but all of its photographic materials MUST be replaced.
Primary request: remake this entire image as an unmistakable handcrafted layered CUT PAPER illustration. The foremost goal is the distinct physical paper art medium. Eliminate EVERY smooth realistic material. Bed blankets are accordion-folded ivory paper with sharp paper folds, sofa cushions are folded boxes of cardstock with clearly visible tabs and stacked cut-paper seams, plants are flat cut-paper leaves on paper stems, cabinetry and the desk are visibly folded kraft card, art is layered paper collage, walls and the edges of floors reveal thick sheets of stacked paper, appliances are geometric white cardstock constructions with cutout circular doors. Paper fibres and die-cut edges throughout. An extremely tactile miniature papercraft diorama with strong little cast shadows between stacked layers. Keep rich but restrained ivory, kraft tan, teal, navy, terracotta, sage, mustard colored paper. Absolutely NO realistic cloth, realistic leaves, real wood, polished photographic furniture, watercolor, ink outlines, or 3D realism. It should look like an artist painstakingly constructed every object out of cut paper.
Composition locked to source: exactly the same complete two-storey cutaway home, same camera, projected positions, silhouette and crop, landscape 3:2,1536x1024. All five regions are in their original places: timber-bed bedroom upper left; long framed-art gallery upper center with exact black stair rail; plant-filled study upper right with desk, chair, cupboard, bookcase and pouf; sectional-sofa living room lower left; kitchen/dining lower right with refrigerator, stacked laundry, counters and dining table. Preserve the precise staircase shape, openings and under-stair storage and the open center floor. Every furnishing remains the same size in the same position and with the same count; only its material and rendering medium change. Do not recompose, relocate furniture or walls, expand/crop house, add or remove objects.
Lighting: luminous soft natural daylight with softly ON electric light in each of the five rooms, five subtle warm light pools. Pale ivory paper background. NO text, letters, labels, logos or watermark.
```

## Exact prompt: paper NIGHT

```
Use case: lighting-weather.
Asset type: HomeDashboard layered cut-paper diorama NIGHT illustration.
Input image: supplied final paper diorama DAY is the edit target.
Primary request: produce the matching NIGHT image by changing illumination and ambient color ONLY. Preserve the unmistakable tactile cut-paper craft medium of this exact image: sharp folded ivory paper bedcovers, cardstock sofa boxes and cushions, flat cut-paper leaves, paper collage pictures, layered paper edges, grain and physical miniature shadows. Replace daylight with deep midnight blue/indigo ambient illumination on unlit surfaces and the backdrop, while the home's electric lights are warmly ON in all five rooms. Five clear golden pools: bedroom upper left warmly lights the bed; long gallery upper center warmly lights the framed art and stair rail; study upper right warmly lights desk, cupboard and pouf; living lower left warmly lights the sofa and coffee table; kitchen/dining lower right warmly lights cabinets, counter and dining table. Natural cozy warm-to-cool contrast, distinct night reading, every room and all furnishings remain legible. The backdrop is deep indigo fibrous paper and still looks physical.
Invariants: this is strictly a lighting-only edit of the supplied paper DAY artwork. Lock exact 1536x1024 landscape 3:2 crop, complete two-storey house silhouette, fixed camera, margins, all five room boundaries, dividers, exact projected staircase geometry, black rail, stairwell opening, under-stair shelves, open center floor, all existing furniture positions and counts, all wall art and plants. No added lamps or new objects. No rearrangement, changed object size, changed room size, altered angles or cropping. Maintain paper materials; no photorealistic cloth or wood, no watercolor or ink drawing. No text, labels, logos, letters, or watermarks.
```

## Exact prompt: paper DAY first pass (rejected)

Rejected because it retained too much of the original realistic render. Retained only at the default generated location: `/Users/jeffk/.codex/generated_images/01a09358-9fc3-7900-8995-066e2d877f8d/exec-b835add4-6848-4ae4-8b1c-aa5a87bc5fb6.png`.

```
Use case: style-transfer.
Asset type: HomeDashboard full-home illustration, layered PAPER CUT diorama DAY.
Input image: supplied original is the edit target and strict composition reference.
Primary request: Edit the supplied image, preserving the complete two-storey cutaway home's exact source camera, projected geometry, 3:2 crop, outer silhouette, wall/divider boundaries and furniture positions. Target 1536x1024 landscape. The original full house must remain wholly visible with the identical margins. Lock all five spatial regions: bedroom upper left with the same timber bed; long gallery upper center with the same framed art and exact black stair rail; study upper right with desk, chair, bookcase, cupboard, plants and pouf; living room lower left with the same sectional sofa, triangular coffee table and rug; kitchen/dining lower right with the same refrigerator, vertically stacked washer/dryer, cabinets and dining table. Preserve the precise stair geometry, stairwell opening, under-stair storage, open center floor, furniture counts, wall art placements and all room boundaries. Do not recompose, rearrange, expand rooms, add rooms, add furniture, alter viewing angle, replace furniture types or crop the house. No text, letters, labels, logos or watermarks.
Style/medium: a lovingly handmade, highly tactile miniature diorama constructed entirely from layered cut paper and folded cardstock. Every wall, floorboard, leaf, cushion, piece of furniture, art frame and stair is visibly made of fine thick colored paper. Crisp cut edges, exposed pale paper thickness, subtle fibrous grain, folded cardstock planes and carefully stacked relief layers. Soft tiny contact and cast shadows reveal paper construction. Restrained rich palette of warm ivory, natural kraft wood tones, sage, muted teal, ochre and terracotta. Architectural detail remains refined and clear. No photorealistic furniture or real wood grain; the entire home is physical cut paper, including all furnishings. No cartoon outlines, no watercolor.
Lighting/mood: luminous natural DAYLIGHT illuminating the paper scene, soft believable shadows and pale ivory paper background. All five rooms' electric lights are softly ON: bedroom, gallery, study, living, kitchen/dining, expressed as five gentle warm light pools without extra furniture or changes to room geometry.
```
