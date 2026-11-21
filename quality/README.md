# Page regression tests

Run from the repo root with the preview server on port 4321
(`node cloud/scripts/preview-server.mjs 4321`).

| script | what it guards |
|---|---|
| `audit6.mjs` | renders templates 01–06 at 1440 and 390: horizontal overflow, broken images, duplicate ids, empty links, JS errors |
| `ux6.mjs` | heuristic pass: low-contrast text, tap-target size, h1 count, image alt, clipped text |
| `probe.mjs` | 05/06 layout invariants: hero box, ticket child order, map layout, bill position, setlist rows |
| `inspbase.mjs` | editor inspector metrics: header height, paddings, title size, input height, checkbox size |

These are throwaway probes with no external deps beyond `@playwright/test`
(resolved from the `quality/node_modules` install).
