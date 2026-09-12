# Home, after hours

A clickable watercolor lighting app built from the user's original 1024 × 682 image. Five rooms yield all 32 binary on/off combinations: living room, kitchen, bedroom, hallway, study.

## Use

Run a static HTTP server with `dist` as its document root. Open the root page, click any room, its label, or the accessible switch. All on/off controls the whole home. Hide labels for an unobstructed view. Browse all 32 combinations and select one to apply it. Save an individual image or download a ZIP of 32 lossless PNGs and a JSON manifest. The five-bit URL fragment retains the current combination on refresh.

The previous Three.js model remains available at `3d.html` with its original controls and assets.

## Image fidelity and lighting

`dist/assets/watercolor-original.jpeg` is a byte-for-byte copy of the user's Watercolor image.jpeg. The all-on display uses that exact source. The all-on PNG export preserves its decoded pixels exactly.

One all-off edit was made using the built-in image generation tool. Because that edit reinterpreted some fine brushwork, its pixels are **not** used as replacement furniture or room detail. `lighting-renderer.js` transfers only its blurred, low-frequency illumination ratios onto the original source pixels. Room polygons limit each change to its room. No original objects are added, removed, moved, or geometrically transformed. This produces simulated independent room lighting, not a physical light-transport simulation. The open-plan living/kitchen boundary is an intentional zone split, and illumination outside the room masks remains unchanged.

The 32 images are generated from one source and stable room masks, rather than 32 separate AI redraws. PNG export is lossless and has no labels or interface overlays. The archive is generated in the browser so all 32 source-resolution PNGs need not be downloaded before using the app. The delivered archive and individual PNGs are also saved under the parent workspace's `output` directory.

## Files

- `dist/index.html`, `lighting.css`, `lighting.js`: interface and controls.
- `dist/rooms.js`: bit order, hit boundaries, labels, and filenames.
- `dist/lighting-renderer.js`: original-preserving lighting compositor.
- `dist/assets/watercolor-original.jpeg`: unchanged source.
- `dist/assets/watercolor-unlit-reference.png`: generated lighting reference.
- `dist/3d.html`, `app.js`, `model.js`, `style.css`, `vendor/`: preserved 3D experience.
- `.openai/hosting.json`: existing private Site registration.

No install or build is needed. Google Fonts is optional; system fonts are the fallback. Keyboard Enter and Space operate the room shapes; native buttons and switches work with keyboard and touch. The combinations dialog supports Escape, and reduced-motion preferences are respected. Rendering errors are visible and restore the last displayed state.

## Verification

Behavioral browser checks cover all 32 unique rendered combinations, accessible switch and picture state synchronization, exact all-on source pixels, unchanged exterior pixels, direct furniture clicks in all five rooms, exterior clicks, keyboard toggles, rapid changes, gallery dimensions/selection, state restoration, single-image and archive downloads, mobile layouts at 390 and 320 pixels, and visible asset-error recovery. ZIP CRC and contents are checked independently. WebMCP registration is optional and feature-detected; supported browser context validation is unavailable.
