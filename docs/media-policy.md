# Media policy

## Current decision

OnlyEvent stores visitor-site media (key visuals, booth images, guide maps, sponsor logos) in R2 and serves it at `/media/uploads/...`.

That URL is intentionally a **public capability URL**:

- Uploads require a signed-in organizer.
- Visitor-site images must load without a session, including from cached/offline pages.
- The key contains a random UUID, so it is not enumerable, but possession of the URL is sufficient to read the object.
- Responses are immutable and may be cached for a year.

This is acceptable while every stored asset is intended for a public visitor site.

## Not covered

The current model does **not** protect:

- unpublished key visuals;
- private or embargoed material;
- copyrighted assets that must not be hotlinked.

If those become product requirements, add an explicit `visibility` field and serve private objects through short-lived signed URLs or an authenticated Worker route. Do not require a login for all `/media/` objects: that would break visitor sites.

## Tests

- `visitor site media is a public capability URL with safe headers`
- uploads require authentication
- unknown keys return 404
- responses include `x-content-type-options: nosniff`
