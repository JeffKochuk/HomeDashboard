# Gemini Ghibli night lights-off reference

Method: built-in image_gen, lighting-weather edit.

Input edit target, unchanged: dist/assets/gemini/ghibli-night.jpeg

Input dimensions: 2528 x 1686 JPEG.

Output: dist/assets/gemini/ghibli-night-off.png

Actual output dimensions: 1535 x 1025 PNG. No resizing or image processing applied to input or output.

Output SHA256: ebb02349d47638620ffe7168f941de33926712d70753964fe0f30d44f52c9ed4


Inspection: bedside lamp, gallery lantern, study lamp, living floor lamp, kitchen pendant, cabinet lights and stair markers are unlit. Warm artificial light pools removed. Cool blue-purple night ambience and pale exterior background retained. Whole composition, painted texture and major objects preserved. Source master untouched; reference is for illumination-field sampling only.

## Exact prompt

```text
Use case: lighting-weather.
Input image 1 is the exact edit target: a Studio Ghibli inspired hand-painted nighttime isometric home. Create ONE ALL-ARTIFICIAL-LIGHTS-OFF illumination reference. Keep the input's full near-3:2 framing, camera and composition unchanged. Input is 2528x1686; a smaller output with the same aspect and whole crop is acceptable. No crops or reframing.
Physically turn OFF every artificial source in every room: upper-left bedroom bedside lamp; upper-middle gallery wall lantern and picture lighting; upper-right study ornate desk lamp and any monitor/device glow; lower-left living room floor lamp; lower-right kitchen pendant, undercabinet task lighting and any appliance/indicator glow; all tiny stair marker lights, illuminated stair treads, shelf/cabinet lights and ambient electric lighting. Keep every lamp, lantern, fixture, bulb, pendant and stair-light shape physically present exactly where it is, but visibly dull, unlit and non-emissive. Remove the yellow/orange translucent glow within shades and lantern glass; retain their original materials and drawn contours.
Remove ALL artificial warm wall circles/halos, amber/orange light pools across floors/counters/furniture, glowing cupboard strips, warm reflections and lamp-lit highlights. Do not merely dim the complete lit picture: individually extinguish each lighting source and remove its emitted/reflected illumination. No powered glow remains anywhere in the five rooms.
Retain cool readable NIGHTTIME ambience, using only soft blue-purple moonlit ambient light, with every object still clearly discernible. Preserve the original white/pale-gray exterior backdrop exactly; it is a background and must not be changed to a dark sky. Keep the starry bedroom window unchanged. Wood/fabric colors remain recognizable under cool night ambient; do not make the interior pitch black.
Strict invariants: preserve identical hand-painted anime medium, ink outlines, painterly textures and brush detail; all five room boundaries, architecture/platforms, exact rails and stairs, every wall artwork including the green framed character painting, bed/bedside table/curtains, study desk/chair/cabinets/bookcase/pouf, every plant, living sectional/throw/triangle table/books/cups, kitchen/laundry appliances and dining table/plates. Do not add, remove or shift objects or simplify/repaint the style. No new moon/sun, UI, text, watermark or characters. This is ONLY a lighting edit of the exact supplied source.
```

