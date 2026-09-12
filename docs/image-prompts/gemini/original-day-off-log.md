# Gemini original-day lights-off reference

Method: built-in image_gen, lighting-weather edit.

Input edit target, unchanged: dist/assets/gemini/original-day.jpeg

Input dimensions: 2528 x 1686 JPEG.

Output: dist/assets/gemini/original-day-off.png

Actual output dimensions: 1535 x 1025 PNG. No resizing or image processing was applied to input or output.

Output SHA256: 3b2fe9f59a9e647eb89dada3708ab3251cb886bcdba50f900ae4e4eabe9e00ee


Inspection: both bedside lamps, gallery track lights, study lamps, living floor lamp, kitchen pendant and cabinet strips are unlit. Warm electric pools and reflections are removed. All five zones remain clearly readable under natural daylight. Whole crop, camera and major furnishings retained. Reference intended only for illumination-field sampling; source master untouched.

## Exact prompt

```text
Use case: lighting-weather.
Input image 1 is the exact edit target. Make ONE all-artificial-lights-OFF version of this precise DAYTIME home diorama, preserving its exact realistic isometric style. Match the whole original near-3:2 framing and camera. Source is 2528x1686; output may be smaller with the same aspect and full crop, but no part of the home may be cropped.
Change ONLY artificial illumination: turn OFF both bedroom bedside lamps in the upper-left; ALL black track spotlights and gallery wall/picture illumination in the upper-middle; the study desk lamp and right-side standing lamp in upper-right, plus any screen glow; the tall floor lamp left of the downstairs sofa and all living-room electric lights; the kitchen pendant lamp, ceiling strip, undercabinet task strips, shelf/cabinet lighting, stair lighting and dining/general electric illumination downstairs right. Every physical fixture stays in exactly its original place, shape and material, but all bulbs/shades/track-light lenses are dull, opaque, unlit and non-emissive.
Remove ALL artificial amber/orange halos, warm cones on walls, localized golden electric pools on floors/counters, glowing strip-light lines and light emitted or reflected from powered lamps. This is not just a uniformly dimmer copy: each individual electrical light and its local lighting contribution must visibly switch OFF. Do not remove or add a single fixture.
Keep DAYTIME: retain bright, soft, neutral natural daylight, the original pale gray-white environment and all ordinary natural shadows/highlights. Every room stays clearly readable in daylight. Do not darken to night, introduce blue moonlight, or remove natural sunlight. Wood remains naturally warm wood, but no lamp produces a warm glow. Lamps should appear like unlit objects seen in daylight, especially the two bedside lamps, study lamps, living floor shade and kitchen pendant.
Strict invariants: preserve exact full composition, five room boundaries and every architectural edge, floor platforms, camera, bed and bedside tables, artwork arrangement and black gallery rail, staircase/storage, sectional and triangular coffee table, study desk/monitor/chair/cabinets/bookcase/pouf, all plants, rugs, stacked laundry machines, kitchen counters/fridge and dining table. No moved furnishings, missing plants, new objects, characters, sun/moon, text, UI or watermark. Lighting-only edit; same objects and details.
```

