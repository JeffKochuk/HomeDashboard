# Home, after hours

A self-contained, static Three.js apartment demo based only on `../output/home-cute-isometric.png`, the latest output image at creation. Original image remains unmodified and is available in the reference dialog. All displayed architecture and furniture are real 3D geometry; no image swapping is used for lighting.

## Run locally

From this directory:

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. No install or build step is required. Three.js 0.180.0 and the required addons are vendored with their MIT license. Google Fonts is optional; system sans-serif fonts provide the offline fallback.

## Controls

- Click a room's geometry, its floating label, or its accessible switch to toggle lights.
- All lights on / All off control all seven zones.
- Drag to orbit, scroll or pinch to zoom; the +/− buttons also zoom.
- Focus the 3D canvas: arrow keys orbit, +/− zoom, Home resets the view.
- Whole home, Downstairs and Upstairs isolate the desired floor without changing the lights.
- Reference dialog closes with its close button, Escape, or clicking outside.
- Reduced-motion preferences disable lamp fades.

## Structure

- `dist/model.js`: apartment geometry, materials, fixtures and the seven lighting zones.
- `dist/app.js`: renderer, raycasting, lights, responsive camera and UI behavior.
- `dist/style.css`: responsive interface.
- `dist/index.html`: page shell and accessible controls.
- `.openai/hosting.json`: private Sites publication.

Geometry is merged per floor, room and material to reduce draw calls. Static shadows are cached and refreshed when floors change. Frames render on camera movement and during light fades. The model is an artistic reconstruction, not a measured architectural model.

## Verification

Browser checks cover loading without console errors, direct furniture picking, independent light switches, all lights on/off, orbit without accidental toggles, keyboard orbit, floor isolation, responsive 390px layout and reference dialog. JavaScript syntax and local asset references are checked before packaging. Optional WebMCP tools are feature-detected; a supporting browser context was unavailable for their execution test.
