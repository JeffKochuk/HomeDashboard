# Home dashboard, v2

A second front end for the same home-lighting artwork, kept separate from the original at `/` so the two can be compared side by side. Serve `dist` as before and open `/v2/`.

The brief: the room image and its interactions are good; everything around it was too much. Simplify, mobile first, and leave room for this to become a home-assistant dashboard.

## What is on screen

- **Header.** One style chip (thumbnail, style name, chevron) that opens the style sheet; a Day | Night pill; a More button.
- **Artwork.** Same image, same room polygons, same canvas relighting. Framed with a radius, hairline and shadow. Tapping a room switches its light and flashes the polygon.
- **Status line.** "3 of 5 lights on" with All on / All off.
- **Five room tiles** laid out like the floor plan: Bedroom, Hallway, Study upstairs; Living room and Kitchen downstairs. Each tile is a switch with a name, an On/Off word and a lamp-colored dot. Hovering a tile highlights its room in the picture and vice versa.

Everything else is one tap away:

- **Style sheet** (from the chip): Original | Gemini collection, a grid of the eight styles as thumbnails for the current time, a "2" badge on styles with more than one version, and version chips when the selected style has variants. On phones the sheet stops above the artwork so the house is visible while browsing.
- **More sheet**: favorite this view, the favorites list, all 32 combinations, save image (PNG), download all 32 (ZIP with manifest), room markers toggle, follow-the-clock toggle, the 3D model, and a link that opens the same view in the original app.

## The wall

The page color is sampled from the artwork itself: a trimmed mean of the image's edge ring, desaturated and clamped to a light band (lightness 92%) or a dark band (13%) depending on the sample's luminance. Text, surfaces and focus rings are ink on that wall. Lamp amber is used for exactly one meaning: a light is on. The wall of the last artwork is remembered, keyed by artwork, so a return visit paints in the right mode before the image arrives. `WALL_OVERRIDES` in `app.js` is the escape hatch for any artwork the sampler gets wrong; all 35 current artworks classify cleanly.

## Deliberate changes from the original

- On-image labels are indicators, not buttons: a lit dot on phones, a named pill on wider screens. Keyboard access to rooms goes through the polygons (`role="switch"`, Enter/Space, a two-tone focus ring that reads on pale and dark art). This removes ten redundant tab stops.
- The mood sentence ("Every room, glowing.") is gone; the status line is a plain count.
- Light toggles swap the image instantly. Nothing crossfades. The all-on master is shown as soon as it decodes; the relighting renderer warms up behind it.
- Day/Night can follow the clock (7 to 19 is day). Choosing any time that disagrees with the clock turns that off, with a toast.
- Collections are labeled "Original" and "Gemini"; the isometric style is labeled "Isometric" so the two never read as one word.
- The star lives in the More sheet, not on the picture.

## Compatibility

- The URL hash is the same format as the original (`#collection=…&style=…&time=…&lights=…[&artwork=…]`), plus an optional `&auto=1`. Legacy five-bit hashes still work. A link opens the same view in either app.
- Favorites use the original's `localStorage` key, so a view saved in one app appears in the other.

## Files

- `index.html`, `app.css`, `app.js`: the interface.
- `catalog.js`: rooms, styles, artworks and hash helpers, with asset paths resolved from this folder.
- `mcp.js`: optional WebMCP tool registration.
- `rooms.js`, `styles.js`, `gemini-artworks.js`, `renderer.js`, `zip.js`: copied unchanged from the original (`renderer.js` was `lighting-renderer.js`). `favorites.js` differs only in its import path.
- `thumbs/`: 360px thumbnails of every artwork for the style chip and picker.
- `manifest.webmanifest`, `icon-180.png`, `icon-512.png`: add-to-home-screen support.
