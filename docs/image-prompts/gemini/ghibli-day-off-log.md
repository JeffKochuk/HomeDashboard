# Gemini Ghibli day lights-off reference

Method: built-in image_gen, lighting-weather edit.

Input edit target, unchanged: dist/assets/gemini/ghibli-day.jpeg

Input dimensions: 2528 x 1686 JPEG.

Output: dist/assets/gemini/ghibli-day-off.png

Actual output dimensions: 1535 x 1025 PNG. No resizing or image processing applied to input or output.

Output SHA256: e1c9ba33c9660a5e069a32c5d82a68b879dd2ceb5688ec031eeaa0955e562d82


Inspection: bedside lamp, gallery lantern, study lamp, living floor lamp, kitchen pendant, cabinet illumination and stair markers are unlit. Electric warm halos and pools removed; natural daylight and study sunshine retained. Painted geometry and major objects preserved. Minor generation drift adds a faint strip of greenery visible through the bedroom window; reference intended for illumination sampling only, master remains untouched. Existing night source/reference files were preserved.

## Exact prompt

```text
Use case: lighting-weather.
Input image 1 is the precise edit target: a Studio Ghibli inspired painted DAYTIME isometric home. Create ONE all-artificial-lights-OFF illumination reference. Keep identical full near-3:2 framing and exact camera. The source is 2528x1686; a smaller same-aspect output is acceptable, but preserve the entire original crop and architecture.
Turn OFF EVERY electrical/artificial source in ALL FIVE zones: upper-left bedroom bedside lamp; upper-middle gallery lantern and picture-light washes; upper-right ornate study desk lamp and any monitor glow; lower-left living floor lamp; lower-right kitchen pendant, undercabinet task illumination and appliance/indicator glow. Also extinguish every tiny stair marker, glowing stair tread, cabinet/shelf light and indirect room light. Keep each fixture, lamp shade, bulb, pendant, lantern and marker shape unchanged and present in its original position, but visibly dull, unlit, opaque and non-emissive. Remove amber light within lantern glass and lamp shades.
Remove all artificial golden/yellow light pools, warm circular wall halos, electric cones on artwork, warm counter light, glowing cupboard strips and electrically created reflected highlights. Do NOT merely dim the full image. Each individual light source and its emitted/reflected glow must switch off visibly. Zero artificial emission remains anywhere.
Retain bright natural DAYLIGHT, blue sky visible through the bedroom window, natural sun patch in the study, and the same pale gray background. Ordinary natural shadows and daylight reflections remain. Every room is still clear and bright under natural ambient light; do not turn the scene into night, add blue moonlight or uniformly darken it. Warm wood/fabric colors remain natural but there are no glowing electric lights.
Strict invariants: identical Ghibli inspired hand-painted anime medium, contours and painterly textures; exact five room boundaries, walls/floor slabs/stairs/rails, every gallery artwork including the green character picture, bed/nightstand/window/curtains, study desk/chair/cabinets/bookcase/pouf, all plants and rugs, living sectional/blanket/triangular table/books/cups, laundry/kitchen fixtures and dining table/plates. No new, removed or moved objects, no composition change, no simplification, no new sun/moon, text, UI, watermark or characters. Lighting edit only.
```

