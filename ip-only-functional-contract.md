# OnlyEvent IP ONLY Functional Contract

Template 01 is the functional reference, not the visual base.

All IP ONLY templates must support the same organizer-owned content and visitor interactions. A template may completely change DOM structure, section order, navigation, layout, typography, decoration and motion as long as it preserves the semantic mount points and the behavior below.

## Organizer content / CMS capabilities

### Event identity
- Event name
- Three-line hero title
- Date / venue city / venue name
- Venue navigation URL
- Desktop KV image
- Mobile KV image
- Independent desktop/mobile focal point
- Theme / accent colors
- Event lifecycle
- SEO / share metadata
- Memorial-ticket entry animation

### Homepage modules
- Announcement ribbon
- Important updates
- Quick navigation
- Ticket / admission information
- Ticket gift images and lightbox
- External ticket URL
- Featured activities
- Venue map
- Map jump links
- Community / social links
- Sponsors
- Footer content
- Module visibility controls

### Booths / products
- Booth number
- Circle name / description / tags
- Booth logo
- Product name / tag / price / note / image
- Booth search
- Product search
- Booth / product mode
- Pagination
- Favorite booths
- Product wishlist
- Saved-item filter
- Product image lightbox
- Direct edit in Studio
- Full inspector editing

### Activities / schedule
- Activity records
- Activity type / title / description / rules
- Participation mode / requirements
- Featured activity images
- Schedule day
- Start and end time
- Stage / area
- Linked guests
- External registration / details URL
- Timeline / activity-detail switch
- Day filtering
- Direct edit / inspector edit

### Guests
- Person / group guest type
- Name / role
- Profile / members
- Works / introduction
- Guest image / lightbox
- Attendance note
- Social links
- Related activities and schedule links
- Direct edit / inspector edit

### Guide
- Traffic / access
- Admission
- Facilities
- Cosplay
- Safety
- Custom guide items
- Route / entrance image
- Venue navigation link
- Detail-page rendering
- Direct edit / inspector edit

### Extra pages
- Custom first-level pages
- Preset page types
- Custom gallery / people / product / place / showcase / reading / activity layouts
- Freewalk page
- Itasha page
- Create / delete / undo

## Visitor behavior
- Desktop / mobile responsive layout
- Standalone first-level pages
- Page navigation and back navigation
- Entry animation
- Image fallback
- Lazy image loading
- Reduced-motion support
- Favorites / wishlist persistence
- External links
- Lightboxes
- Lifecycle behavior
- SEO / Open Graph export
- Standalone HTML export
- Unified Studio Publisher integration (shared by every template)

## Required semantic mount points

Renderers must target semantic mounts instead of Template 01 visual classes. A template may wrap or position these mounts anywhere.

- data-oe-mount="ribbon"
- data-oe-mount="updates"
- data-oe-mount="quick"
- data-oe-mount="tickets"
- data-oe-mount="ticket-actions"
- data-oe-mount="featured-activities"
- data-oe-mount="map"
- data-oe-mount="map-links"
- data-oe-mount="booths"
- data-oe-mount="activity-days"
- data-oe-mount="schedule"
- data-oe-mount="activity-projects"
- data-oe-mount="guests"
- data-oe-mount="guide-detail"
- data-oe-mount="community"
- data-oe-mount="sponsors"
- data-oe-mount="footer-brand"
- data-oe-mount="footer-participate"
- data-oe-mount="footer-visit"
- data-oe-mount="footer-social"

Template 01 remains supported through legacy selector fallbacks, but new templates should be authored against semantic mounts.


## Publisher boundary

Publishing is a Studio-level system capability, not a visual-template capability.

Every template must:
- export a complete standalone visitor HTML
- preserve visitor interactions in that export
- work with the shared OnlyEvent Publisher

The shared Publisher owns:
- `https://[slug].onlyevent.cn` site address
- first publish
- update existing site at the same address
- open/copy published URL
- HTML download

Templates must not expose Cloudflare, GitHub, Vercel, or other deployment infrastructure to organizers.


## Template / Publisher responsibility split

### Template responsibilities
- generate the complete visitor website
- define visual structure and responsive presentation
- render organizer content and enabled modules
- render first-level pages and custom pages
- preserve all visitor interactions
- produce complete standalone HTML

### Publisher responsibilities
- manage the public site address
- publish the generated site
- update the same published address
- expose open/copy-link actions
- provide the shared download/publish workflow
- hide deployment infrastructure from organizers

In short:

**Template = Site Generator**

**Publisher = Deployment / Delivery Layer**
