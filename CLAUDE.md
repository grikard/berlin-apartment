# Marketplace website operating rules

The canonical inventory is in the PRIVATE repository https://github.com/grikard/berlin-marketplace-master. Read its CLAUDE.md before changing inventory. This repository contains the public website only.

Do not edit generated `dist/content/inventory.js` or its approval manifest by hand. Inventory changes start as private master proposals, receive explicit owner approval and are exported onto a clean website review branch. Run `npm run check`, review the diff and open a PR. Do not merge existing draft PR #1 or copy its proposed price into the master as an approval; coordinate its overlapping files with the master approval first. Never paste internal notes from that draft into public content.

Preserve the website's typography, layout, `dist/assets/app.js`, gallery behavior and ID-numbered photograph naming. Use `dist/photos/items/` for selected public photos. The approved export manifest checks catalogue and photo hashes and rejects orphan item JPEGs. Review new or changed photos for unique serial numbers, private documents, addresses and unapproved items before export.

Owner privacy requirement: every published image must omit phone/personal metadata. JPEGs may contain only image encoding data and a technical JFIF header: no EXIF/GPS, capture timestamps, phone/camera/software fields, MakerNotes, XMP, IPTC, ICC profiles, comments, embedded thumbnails or trailing data. Keep originals private and ignored. `npm run check` audits the entire `dist/` image tree and blocks metadata or unreviewed formats; never bypass it. SVG artwork must have no hidden editor/metadata payloads. Visible scene content still needs separate privacy review. Historical public copies are not erased by replacing current assets.

Owner-approved display order: show numeric asking prices from highest to lowest, followed by price-on-request listings. Search, category and language changes preserve that order. Equal-price listings retain their source order. This presentation rule does not reorder the canonical inventory or change bundle accounting.

Owner-approved language default: open in English, with Deutsch available in the descriptions language selector. Keep the private catalogue export's default language and both HTML selectors aligned.

Owner-approved bundle photos: alternative bundles with an approved lead image use the same existing gallery controls as individual listings. Include all approved component photos in the bundle gallery, reusing their original numbered paths.

Owner-approved price clarity: every individual or alternative bundle card starts with one header containing its title, asking price and negotiability wording. Keep one visible price per card, above the gallery, inside a complete card border. Phone screens use one column up to 640px. Keep “Items for sale” prominent in navigation and home-page actions. Preserve inventory prices, established fonts, gallery behavior and descending-price ordering when refining this layout.

Owner-approved apartment photo experience: use terrace and neighbourhood photos within the page narrative, with a manually scrollable interior gallery. Clearly date the earlier unfurnished June 2023 interiors; do not present them as the current finish. Keep selected photos under `dist/photos/apartment/`, provide smaller responsive copies, strip phone metadata, and leave source originals in ignored `photos/`. No automatic slideshow or product-gallery changes are part of this apartment treatment.

Audience and tone: this personal home sale is being shared with the Max Delbrück community. Welcome visitors warmly, invite questions and offers, and make it easy to discuss several items together. Keep pricing and inclusion promises tied to the approved catalogue. Item contact links open editable offer/question drafts in German or English.

Do not add raw Excel/Word files, original phone folders, internal valuations, negotiation floors, retained relocation stock or buyer information. Gitignored `docs/`, `photos/` and `.local/` remain local working material, not an alternative editable master. Public commit messages, PR descriptions and comments must contain public information only. Private credentials and cross-repository tokens must never be committed.

After a public PR merges and deploys, reconcile the published state into the private master. An emergency website content fix must be reconciled into that master before the next export.
