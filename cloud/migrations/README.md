# D1 migrations

`0001_init.sql` is the current schema captured as the initial migration.

Do not keep changing `0001_init.sql` after it has been applied to a shared database.
Add a new numbered migration instead:

```text
0002_add_example_column.sql
0003_add_example_index.sql
```

Commands (Wrangler 4 syntax may differ in this environment; verify before remote use):

```bash
npx wrangler d1 migrations create DB add_example
npx wrangler d1 migrations apply DB --local
npx wrangler d1 migrations apply DB --remote
```

Deployment order:

1. CI tests and architecture check.
2. Apply migrations to local/preview database.
3. Deploy Worker.
4. Verify `/health`, login, project create, publish, visitor site.
5. Apply to production.
6. Keep a backup and rollback point.

`schema.sql` remains for local bootstrap; new changes belong in numbered migrations.
