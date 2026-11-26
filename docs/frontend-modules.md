# Frontend modules

The editor entry is still `v8/app.js`, but presentation and pure helpers are being moved out incrementally.

## Rules

- Pure HTML builders receive data and an escape function; they do not bind events.
- Pure config modules do not read `window`, `document`, or global `state`.
- DOM ownership stays in `app.js` until a controller interface is explicitly defined.
- Do not split a function that mixes HTML generation, event binding, async opening, and state mutation.
- Every extracted module must be imported by `app.js`; `node --check` is not enough because it does not resolve imports.
- Prefer `return '…'` on the same line; avoid a newline after `return` before a template string.

## Modules

| Module | Responsibility |
|---|---|
| `studio-admin-cache.js` | Admin project cache upsert |
| `studio-canvas-download.js` | Canvas blob and SVG download |
| `studio-cloud-sync.js` | Debounced cloud save controller |
| `studio-collection-page.js` | Collection → editor page |
| `studio-collection.js` | Collection array/path lookup |
| `studio-content-counts.js` | `[data-content-count]` sync |
| `studio-content-manager.js` | Content manager metadata |
| `studio-content-thumb.js` | Content thumbnail HTML |
| `studio-cropped-image.js` | Cropped image cloud/local storage |
| `studio-custom-page-item-html.js` | Custom item inspector HTML |
| `studio-custom-page-items-html.js` | Custom items panel HTML |
| `studio-custom-page-nav-html.js` | Custom page nav HTML |
| `studio-custom-page-rows.js` | Custom page row HTML |
| `studio-custom-page-settings-html.js` | Custom page settings HTML |
| `studio-custom-page.js` | Preset lookup / starter items |
| `studio-entry-animation-html.js` | Entry animation inspector HTML |
| `studio-extra-inspector.js` | Collection extra fields HTML |
| `studio-field-inspector-html.js` | Generic text field HTML |
| `studio-format.js` | HTML escaping |
| `studio-guide-label.js` | Guide label by template |
| `studio-hero-title-inspector-html.js` | Hero title inspector HTML |
| `studio-history-ui.js` | Undo/redo button state |
| `studio-image-slot-config.js` | Crop ratio/label rules |
| `studio-image-slot-resolve.js` | Measured frame override |
| `studio-item-inspector-html.js` | Item inspector head/fields/actions |
| `studio-item-media-html.js` | Item media panel HTML |
| `studio-lifecycle-inspector-html.js` | Event status HTML |
| `studio-module-controls.js` | Module visibility DOM |
| `studio-optional-page-html.js` | Optional page inspector HTML |
| `studio-page-content-active.js` | Nav active state |
| `studio-page-content.js` | Page content config |
| `studio-page-label.js` | Custom page key/title |
| `studio-page-nav-html.js` | Content nav button HTML |
| `studio-page-nav.js` | Content nav item calculation |
| `studio-palettes.js` | Template palettes |
| `studio-preset-entries.js` | Guide/activity preset lists |
| `studio-presets.js` | Preset data |
| `studio-product-inspector-html.js` | Product inspector HTML |
| `studio-publish-flow.js` | Publish network flow |
| `studio-publish-record.js` | Publish record persistence |
| `studio-publish-share.js` | Share preview |
| `studio-publish-ui.js` | Publish dialog controller |
| `studio-recap-dialog-html.js` | Recap dialog HTML |
| `studio-share-dialog-html.js` | Share dialog HTML |
| `studio-share-text.js` | Share message |
| `studio-stage-html.js` | Stage row HTML |
| `studio-stage-state.js` | Staged publish state |
| `studio-stage-ui.js` | Stage UI controller |
| `studio-state-paths.js` | Deep get/set |
| `studio-storage.js` | localStorage helpers |
| `studio-street-manager-html.js` | Street manager HTML |
| `studio-ticket-inspector-html.js` | Ticket settings HTML |
| `studio-toast.js` | Toast helper |
| `studio-address-inspector-html.js` | Address inspector HTML |
