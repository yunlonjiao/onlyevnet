# Frontend split status

## Completed

- Pure HTML builders moved to `v8/editor/studio-*-html.js`.
- Pure configuration moved to `studio-presets.js`, `studio-collection-meta.js`, `studio-palettes.js`, `studio-image-slot-config.js`, `studio-page-content.js`.
- Pure helpers moved to `studio-format.js`, `studio-storage.js`, `studio-state-paths.js`, `studio-stage-state.js`, `studio-reference-cleanup.js`, `studio-share-text.js`.
- Controllers extracted:
  - publish dialog
  - publish flow
  - stage UI
  - cloud sync
  - custom pages
  - share dialog
  - recap dialog
- `v8/app.js` reduced from about 2061 lines to about 1338 lines.

## Still in app.js

These are not pure HTML and require explicit controller interfaces before moving:

- collection manager and item inspector
- booth/product item mutations
- image inspector and cropper workflow
- canvas/frame communication and boot wiring
- page-tool dispatch and canvas selection
- undo/redo binding and save orchestration

## Rule

Do not move a function that combines state mutation, event binding, async work and DOM lookup by cutting its source block. Define the controller inputs first, then move it.

## Deployment

Do not deploy intermediate extractions. After the remaining controllers are split:
1. verify offline
2. deploy once
3. run the 17-item online regression
