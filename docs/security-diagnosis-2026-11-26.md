# Security & data-boundary diagnosis — 2026-11-26

Scope: Worker API/auth, published HTML, R2 media, project lifecycle, current tests. Read-only unless noted.

## Verified / already addressed in this pass

| Area | Finding | Status |
|---|---|---|
| Error responses | `catch` returned `e.message` for any error with `status` | Fixed: `ApiError` + `errorPayload`; unknown errors return generic 500 |
| API error shape | mixed `{error}` / plain text | Improved: all `json({ok:false,error})` now also get `code` + `message`; `error` kept for compatibility |
| CSRF | no write-origin check | Fixed: unsafe `/api/*` with a foreign `Origin` gets 403; no-Origin API clients remain allowed |
| Cookies | `Secure`, `HttpOnly`, `SameSite=Lax` present | Verified, no change |
| Upload types | extension allow-list; SVG rejected | Verified |
| Media cleanup | `deleteProjectMedia` checks tracked media and config references | Verified for purge path |
| Generated assets | `cloud/web/` git-ignored; source zip previously included it | Fixed: packaging script excludes it and uses `/` entries |
| DB schema | only `CREATE TABLE IF NOT EXISTS` | Scaffolded `cloud/migrations/0001_init.sql` + README; remote apply not automated |

## Open findings

### P0 — CSP missing

`/admin/` and `/v8/` responses set `nosniff`, `Referrer-Policy`, `X-Frame-Options`, but no Content-Security-Policy.
Risk: XSS impact is larger; no explicit script/style/connect/frame allow-list.
Plan: add a conservative CSP to admin/editor HTML/asset responses; allow `'unsafe-inline'` initially because current pages rely on inline boot scripts, and tighten later.

### P1 — media is a capability URL

`/media/<key>` checks only the key shape, not project ownership. Keys contain random UUIDs, so this is effectively a public capability URL used by visitor sites.
Risk: anyone with the URL can fetch/hotlink; no anti-hotlink or expiry.
Do not “fix” by requiring login without checking how visitor sites load images. Needs product decision: public images vs signed URLs.

### P1 — Worker is still monolithic

`cloud/src/worker.js` still holds routes, auth, media, sites, forms, analytics and jobs.
This is a maintainability risk, not an exploitable defect; split after API contract tests and migration flow are stable.

### P1 — published HTML XSS boundary

Visitor HTML is organizer-controlled and served as HTML. It is not sanitized; CSP for visitor sites is separate from the admin CSP.
Needs a product decision: trusted organizer HTML vs sanitized/iframe-isolated publishing.

### P2 — Service worker image cache

`oe-visitor-v1` caches images up to a count and may cache opaque responses; updated images can remain stale.
Plan: version cache name and avoid opaque caching / use network-first for images.

## Test gaps

- CSP header assertion for `/admin/` and `/v8/`.
- Session expiry/concurrent login/password change invalidation.
- Media unauthorized/hotlink behavior (needs product decision).
- Migration dry-run in preview.
- E2E publish → visitor fetch.

## Next two P0 patches

1. Already applied in this pass: API error safety + CSRF origin guard.
2. Add CSP baseline to admin/editor asset responses and test headers.

The remaining structural items (worker split, Vite, TypeScript, CSS split) are intentionally not part of this pass.
