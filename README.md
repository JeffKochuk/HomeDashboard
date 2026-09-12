# Home, after hours

An interactive home illustration with eight art styles, day and night, and five independent room lights. Click a room, its label, or its switch to change the light. The 16 artwork views each support all 32 lighting combinations: **512 views in total**.

## Styles

Original isometric, watercolor, Ghibli, abstract shapes and colors, synthwave, Dalí, minimalist Japanese ink-on-silk, and layered papercut. The Original / Day master is the user's updated 1536 × 1024 reference, copied without modification. All other masters are generated edits based on that reference; the room layout is retained while the medium changes.

## Run

Serve `dist` with any static HTTP server. No install or build is required. For example:

```sh
python3 -m http.server 4174 --directory dist
```

Open `http://localhost:4174`. The original Three.js experience remains available at `3d.html`.

## Controls and exports

- Tabs choose an art style. Day and Night choose ambient lighting. Changing either preserves all room switches.
- Five independent lights: living room, kitchen, bedroom, hallway, and study. All on/off controls the entire home.
- Room labels can be hidden. Native controls support touch and keyboard; the artwork areas respond to Enter and Space. Arrow keys, Home, and End move among tabs; Enter or Space activates the focused tab.
- Browse all 32 combinations for the selected style and time, then select a thumbnail to apply it. Escape closes the gallery.
- Save the current view as a full-resolution, lossless PNG without labels. Download all 32 images as a ZIP with a JSON manifest. Downloads retain the selection from when the action began, even if the controls change during preparation.
- The URL fragment retains style, time, and room lights on reload. Legacy five-bit links still work. Bit order is living room, kitchen, bedroom, hallway, study; `1` means on.

## Artwork and lighting

`dist/assets/styles/` contains sixteen all-on masters and sixteen generated all-off illumination references, each 1536 × 1024. Exact prompts and generation notes are recorded in [IMAGE_PROMPT.md](IMAGE_PROMPT.md) and `docs/image-prompts/`.

All 32 states within one style/time view are composed from the same master. The renderer transfers blurred illumination ratios from the paired all-off reference onto the master pixels, keeping furniture, linework, texture, and geometry spatially fixed. It does not display the reference's redrawn objects. Luminance limits retain daylight or readable nighttime ambient light while allowing warm lamp colors to cool. Room masks restrict each toggle to its own zone; exterior pixels remain unchanged. Sparse ink artwork has separately registered boundaries.

This is simulated room lighting from artwork, not physically measured light transport. Adjacent open-plan living/kitchen zones have an intentional boundary. Different generated styles and day/night masters can have small differences in illustrated details.

Rendering is local to the browser. Only two master renderers and six full-resolution previews are cached at a time; gallery thumbnails are generated at 320 pixels wide and released when closed. Exports are generated on demand. Visible loading errors restore the previous view and offer a retry. Optional WebMCP registration is feature-detected.

## Files

- `dist/index.html`, `lighting.css`, `lighting.js`: interface and behavior.
- `dist/styles.js`: style catalog and asset naming.
- `dist/rooms.js`: room boundaries, labels, and stable bit order.
- `dist/lighting-renderer.js`: master-preserving room lighting and PNG export.
- `dist/zip.js`: browser ZIP packaging.
- `dist/assets/styles/`: artwork and illumination references.
- `dist/3d.html`, `app.js`, `model.js`, `style.css`, `vendor/`: original 3D experience.
- `.openai/hosting.json`: existing private Sites registration.

## Verification

Browser checks cover all 512 distinct combinations, independent room pixel changes, exact all-on master pixels, unchanged exterior samples, accessible switch state and visible light counts. Additional checks cover keyboard navigation, mobile widths from 320 pixels, rapid selection changes, all 32 gallery previews, gallery selection, URL restoration, failed image loading and retry, and PNG/ZIP downloads. Archives are checked for PNG dimensions, bit order, manifest contents, and CRC integrity. WebMCP context validation requires a supporting browser and is not part of the standard browser check.
