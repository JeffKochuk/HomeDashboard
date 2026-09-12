# Gemini ink night lights-off reference

Method: built-in image_gen, lighting-weather edit.

Input unchanged: dist/assets/gemini/ink-night.jpeg

Input dimensions: 2528 x 1686 JPEG.

Output: dist/assets/gemini/ink-night-off.png

Actual output dimensions: 1535 x 1025 PNG. No input/output resizing applied.

Output SHA256: bc3a784b0957e986e2348eedcf34bb5a06773fb34b8597899ea0bfe6917f7a09


Inspection: all bedroom/gallery/study/living/kitchen/dining lamps, pendants and cabinet illumination are unlit. Amber glows/pools removed. Mostly monochrome night ambient, dark surrounding ink wash, silk weave, brushstrokes and major room geometry preserved visually. Source master untouched; reference for illumination sampling only.

## Exact prompt

```text
Use case: lighting-weather.
Input image 1 is the exact edit target: a Japanese ink-on-silk isometric home at NIGHT with small amber lamps. Create ONE all-artificial-lights-OFF illumination reference. Keep identical complete near-3:2 framing, camera, ink architecture and every object. Source2528x1686; smaller matching-aspect output is fine, no crop/reframing.
Turn OFF all artificial light sources in ALL FIVE zones: upper-left bedside lamp; upper-middle gallery hanging pendant over the mountain scroll; upper-right study desk lamp and monitor glow; lower-left BOTH living-room floor lamps beside the sofa; lower-right kitchen hanging bulb/pendants, cabinet/task illumination, glowing shelf/cubby lamp and dining-table lamp. Also extinguish any appliance indicators, stair light or hidden electric lighting.
Retain every fixture/bulb/shade as exactly the same drawn object, but dull, opaque, unlit and non-emissive. Remove ALL amber/yellow painted glows, shade interiors, warm wall halos, warm floor/counter pools, lamp-created highlights, reflected electric illumination and any remaining artificial bloom. Do not merely darken the complete lit image; visibly extinguish each light and its localized illumination. No powered warm glow remains anywhere.
Retain cool readable NIGHT ambience through restrained neutral charcoal/blue-gray ink washes. Preserve the original nearly black surrounding ink-wash background exactly, including woven silk texture. The interior stays visible as subtle gray silk and black brushwork in dim natural ambient light; no pitch-black loss of details. Keep the mostly monochrome palette; do not recolor the whole painting vivid blue or add new colored materials.
Strict invariants: preserve identical Japanese ink brushstroke style, irregular calligraphic contours, drybrush edges, ink bleeds and silk weave texture; exact five-room boundaries, floor slabs/rails/stairs, bedroom bedding/nightstand/plants, mountain scroll and bedroom triptych, study desk/chair/cabinet/bookcase/pouf, every plant, living sectional/triangular table/rug, kitchen/laundry shelving/appliances and dining table. No moving/adding/removing furniture or fixtures, no missing brushstrokes, no style change or photorealistic rendering, no new sun/moon/text/UI/watermark/characters. ONLY remove artificial illumination from the exact supplied ink painting.
```

