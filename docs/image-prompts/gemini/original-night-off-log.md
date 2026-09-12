# Gemini original-night lights-off reference

Method: built-in image_gen, lighting-weather edit.

Input edit target (read only, unchanged): dist/assets/gemini/original-night.jpeg

Input dimensions: 2528 x 1686 JPEG.

Output: dist/assets/gemini/original-night-off.png

Actual output dimensions: 1535 x 1024 PNG. The built-in tool returned near-3:2 landscape matching the input aspect closely; no resizing or image processing was applied to either input or output.

Original generated file: [generated output]

Inspection: both bedroom lamps, gallery track lights, both study lamps, living floor lamp, kitchen pendant and strip/task lighting are unlit. Warm light pools and reflections are removed. The five-room composition and major objects remain intact with cool readable night ambience. The supplied master source pixels remain untouched; output is intended only as an illumination reference.

## Exact prompt

```text
Use case: lighting-weather.
Input image 1 is the exact edit target. Produce ONE all-artificial-lights-OFF reference of this precise nighttime home diorama. Preserve the same near-3:2 aspect ratio, original FULL framing, exact camera and composition. Aim for 2528x1686 output, or retain the same aspect and whole crop if your output size differs. Do not crop any part of the home.
Change ONLY artificial illumination. Physically switch off every electric source in ALL FIVE room zones: (1) BOTH glowing bedside lamps in the upper-left bedroom; (2) ALL black overhead track spotlights and their picture/wall-light cones across the upper-middle gallery; (3) the desk lamp and right-side standing lamp in the upper-right study, plus any monitor/screen glow; (4) the tall glowing floor lamp left of the sofa and every general electric light in the lower-left living room; (5) the kitchen pendant lamp, ceiling strip light, undercabinet task strips, dining illumination and any appliance/indicator glow in the lower-right kitchen/dining. Also extinguish any cabinet/shelf electric illumination and stair lighting. Keep every fixture physically present in exactly its original shape and position, but each lampshade, bulb, track spot and pendant must be dull and unlit, never luminous white/yellow.
Remove ALL electric warm halos, orange/amber wall cones, light pools and reflected artificial light from floors, walls, furniture, cabinet tops and the exterior floor/background. Retain the existing deep midnight-blue surroundings and replace interior illumination only with soft, cool moonlit blue ambient that keeps every room and object readable. No warm artificial light source or glow remains anywhere. Preserve natural wood and fabric surface colors under cool nighttime ambient; do not make the image pitch black. Do NOT simply dim the whole existing lit image: specifically extinguish every lamp and remove all emitted and reflected artificial lighting.
Strict invariants: keep identical realistic isometric 3D style and materials, five room boundaries, floor platforms, stairs/railings, artworks, bed and bedside tables, sectional and triangular table, office desk/monitor/chair/cabinets/bookcase/pouf, all plants, kitchen/laundry appliances and dining table. Do not add, remove or move a single furnishing, plant or architectural element. Preserve every source object and edge, source crop and camera, existing night backdrop. No visible moon/sun, new object, UI, words, watermark or characters. This is solely a lights-off illumination edit of the exact supplied Gemini source.
```
