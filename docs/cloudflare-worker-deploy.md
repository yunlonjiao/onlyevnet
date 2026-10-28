# convention-publisher Worker — deployment runbook

Prepared 2026-10-28 against the live account. **Nothing here has been deployed yet.**
Run every command from `cloud/`. Do not deploy without the owner's go-ahead.

## What is live today (verified through the Cloudflare API)
| Item | Live state |
|---|---|
| Account | `e69e76da006944147a644df57dc25f57` (yjiao019@ucr.edu), wrangler OAuth login works |
| Worker | `convention-publisher`, last deployed 2026-09-30 03:17 UTC, code = v7.25.0 |
| Custom domain | `onlyevent.cn` → `convention-publisher` (production), set in the dashboard, **not** in `wrangler.jsonc` |
| Route | `*.onlyevent.cn/*` → `convention-publisher` (serves visitor sites) |
| Zone | `onlyevent.cn` active, nameservers `achiel` / `nola.ns.cloudflare.com` |
| Bindings | `DB` (D1 `convention-publisher-db`), `SITES` (R2 `convention-publisher-sites`), `ASSETS`, vars `BASE_DOMAIN` `SESSION_DAYS` `INACTIVE_DAYS` |
| Cron | `17 3 * * *` |
| D1 data | 1 user, 26 projects (v7-era tests such as "COMIC DAY"), 8 media rows, 0 sites, 1 session |

`wrangler.jsonc` matches these bindings, vars and cron exactly, so `wrangler deploy`
neither drops nor renames anything. It does not manage routes or custom domains and
leaves the existing ones alone. The only new binding is the var `ALLOWED_ORIGINS`.

## Backup (done 2026-10-28)
`C:\Users\32224\Documents\OnlyEvent-backups\2026-10-28\d1-convention-publisher-db.sql`
(sha256 starts `330c971ae0f8e3d2`). Restores into an empty SQLite with the same row counts.
It holds password hashes and a session row: keep it out of the repo and off shared drives.
Take a fresh one right before deploying:

```powershell
npx wrangler d1 export convention-publisher-db --remote --output="$HOME\Documents\OnlyEvent-backups\<date>\d1.sql"
```

R2 objects are not exported by that command. The 8 `project_media` rows point at R2 keys
under `uploads/`; deployment never deletes R2 data.

## Verified before asking
- `npx wrangler deploy --dry-run`: builds, bindings as listed above.
- Real workerd runtime with a local D1/R2 (config copy without `remote: true`, so production
  was never touched): schema applies, then register (Chinese name), project create, config
  save, template in list, R2 upload and readback, publish, visitor on `<slug>` host, update,
  takedown (404), unauthenticated publish returns 401 with CORS (was error 1101), preflight,
  unknown origin gets no CORS header, login/registration/recovery rate limits return 429,
  `/admin/` assets served.
- CI on `preview/guide-sakura-access` @ `528b6f6`: green.

## Deploy steps (in this order)
1. **Fresh backup** (command above).
2. **Add the new table first.** The new Worker needs `rate_limits`; the old Worker ignores it,
   so this step is safe on its own and easy to roll back by simply not continuing.
   ```powershell
   npx wrangler d1 execute convention-publisher-db --remote --command "CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, window_start TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0); CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);"
   ```
   (`npm run db:remote` runs the whole `schema.sql`; every statement is `IF NOT EXISTS`, so that is also safe.)
3. **Deploy the Worker.**
   ```powershell
   npm run check
   npx wrangler deploy
   ```
4. **Smoke test production** (a throwaway slug; remove it afterwards):
   - `https://onlyevent.cn/health` shows `"version":"7.26.0"`.
   - Register a test organizer from the v8 editor on the Pages preview, publish `smoke-test`,
     open `https://smoke-test.onlyevent.cn`, update, take down, confirm 404.
   - Sign in on a second browser and confirm the project appears.
5. **Remove the test account's data** (the account can stay; delete its project and site in the UI).

## Rollback
- Worker: `npx wrangler rollback` (restores the previous version; v7.25.0 ignores `rate_limits`).
- D1: nothing destructive runs, so no restore is needed. If it ever is, import the backup into a
  new D1 database and point the binding at it; do not import over the live one.

## Things deployment does not change
- `https://onlyevent.cn/admin/` keeps serving the v7 admin from `cloud/web/` (the Worker
  serves `/admin/` first). The v8 editor lives on Cloudflare Pages
  (`onlyevent-preview.pages.dev`) and talks to the Worker over CORS with a Bearer token.
  Moving the v8 editor onto `onlyevent.cn` itself is a separate decision.
- CORS allows `onlyevent.cn`, `www.onlyevent.cn`, localhost and the origins in
  `ALLOWED_ORIGINS` (Pages production and branch previews). A new Pages domain must be added there.

## Known gaps after deploying
- Images uploaded while signed in are links to `convention-publisher.onlyevents.workers.dev/media/...`,
  so an exported single-file HTML shows them only while online.
- The 26 old cloud projects have no template and are not restored into the v8 editor (intended).
- Email sign-up and email password recovery are not implemented in the Worker.
- Rate limits are per D1 row (fixed windows), not Cloudflare's WAF; heavy abuse still needs a
  dashboard rate-limiting rule on `onlyevent.cn/api/*`.
