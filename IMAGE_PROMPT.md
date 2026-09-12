# Artwork generation

The updated user-provided reference is the 1536 × 1024 isometric home with bedroom upper left, gallery hallway upper center, study upper right, living room lower left, and kitchen lower right. `dist/assets/styles/original-day.png` is an unchanged copy of that source.

Every generated asset used the built-in image generation tool. Each style has a day and night all-on master and a corresponding all-off lighting reference. The eighth style is layered papercut. The sparse ink and Ghibli masters were refined to make their visual media more distinct; the logs retain the exact prompts and iteration lineage.

## Exact prompts and provenance

- [Original, watercolor, and Ghibli](docs/image-prompts/isometric-watercolor-ghibli.md)
- [Abstract, synthwave, and Dalí](docs/image-prompts/abstract-synthwave-dali.md)
- [Papercut and initial ink exploration](docs/image-prompts/papercut-and-initial-ink.md)
- [Final minimalist ink](docs/image-prompts/minimal-ink.md)
- [Original, watercolor, and Ghibli lights-off references](docs/image-prompts/isometric-watercolor-ghibli-off.md)
- [Abstract, synthwave, and Dalí lights-off references](docs/image-prompts/abstract-synthwave-dali-off.md)
- [Ink and papercut lights-off references](docs/image-prompts/ink-papercut-off.md)

Asset naming is `{style}-{day|night}.png` for a displayed master and `{style}-{day|night}-off.png` for its lighting reference. Style IDs are `original`, `watercolor`, `ghibli`, `abstract`, `synthwave`, `dali`, `ink`, and `papercut`. All 32 files are 1536 × 1024.

## Compositing

The generated all-off references have minor contour drift. Their pixels are not used to replace illustrated objects. The app transfers their blurred RGB illumination fields onto each matching all-on master, constrained by five room polygons. All 32 lighting combinations share fixed source geometry and detail. The all-on display and PNG export preserve the decoded master pixels; pixels outside room masks remain unchanged in every state.

Natural ambient light remains in daytime. Nighttime is dimmer and cooler. These are artistic lighting simulations, not physical light-transport renders. The app produces all 512 combinations on demand and exports 32 per selected style/time, avoiding a large download before interaction.
