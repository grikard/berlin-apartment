# Berlin apartment

A separate website for the Potsdamer Platz apartment rental and items for sale from the home. This folder is one independent project and Git repository. The parent `github` folder can hold future projects side by side.

## Preview

Node 20 or newer is required. No package installation or build is needed.

```powershell
cd C:\Users\garyr\dev\github\berlin-apartment
npm start
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C.

## Where everything lives

- `dist/content/site-data.js`: rental details and public contact method.
- `dist/content/inventory.js`: the public sale catalogue, proposed prices, English/German descriptions, condition notes and inventory IDs. Both pages share this file.
- `dist/photos/apartment/`: selected apartment and balcony photographs.
- `dist/photos/items/`: sale item photographs.
- `dist/index.html`: page structure and introductory copy.
- `dist/for-sale.html`: the dedicated, shareable belongings-for-sale page, using the same item inventory and contact details as the homepage.
- `dist/assets/`: styles, behaviour and the labelled decorative illustration used until real apartment photographs are added.
- `dist/assets/floor-plan.svg`: a simplified, unscaled layout guide redrawn from the supplied floor-plan screenshots. It is not the original floor-plan scan.
- `.github/workflows/pages.yml`: checks and publishes only `dist/` on pushes to `main`.
- `LISTING-DETAILS.txt`: a checklist of information still needed.

## Inventory synchronization

The private repository https://github.com/grikard/berlin-marketplace-master owns the inventory. Read CLAUDE.md in both repositories. Approved snapshots export to this site through reviewed commits or pull requests. The export preserves the design and galleries and excludes blocked device-label photos, including both their full-size files and thumbnails. Existing public Git history may retain earlier images; this change does not rewrite history.

## Add apartment photographs

Get a sharing link to the OneDrive folder from your phone, or copy selected photographs into `dist/photos/apartment/` when the folder is available. JPG, PNG, WebP and AVIF are supported; convert HEIC images before adding them. Use simple filenames such as `family-room.jpg`.

Add entries to the `apartment.photos` array in `dist/content/site-data.js`:

```javascript
photos: [
  {
    src: "photos/apartment/family-room.jpg",
    alt: "The family room in the Berlin apartment",
    caption: "The family room"
  },
  {
    src: "photos/apartment/balcony.jpg",
    alt: "The apartment's wrap-around balcony",
    caption: "The wrap-around balcony"
  }
]
```

The first photo becomes the hero image. All apartment photos appear in a gallery and can be enlarged. The two supplied balcony-view HEIC originals have been converted to JPEG copies in `dist/photos/apartment/`, with EXIF metadata omitted. The first is used as the main image; both appear in the apartment gallery at their original portrait ratio. The original phone files remain in ignored `photos/`. Copy only photographs intended for the public website; do not put the whole personal OneDrive folder into this repository. Before adding phone photos, remove location metadata and check for personal documents or identifying details in the frame.

## Add an item for sale

Edit proposed inventory and approved photos in the private marketplace master, then export to this repository through a reviewed branch. `dist/content/inventory.js` and `dist/content/inventory-manifest.json` are generated public outputs. Each listing has an ID, English/German titles and descriptions, a proposed price, condition disclosures and the inventory records it covers. Use an existing entry as the format reference. The simplified example below illustrates the core fields; match the full existing schema when adding a real listing:

```javascript
items: [
  {
    id: "KIT-12",
    title: "Name of the actual item",
    category: "Furniture",
    price: "€...",
    description: "Condition, material and any other useful details.",
    dimensions: "Width × depth × height in cm",
    status: "available",
    photo: "photos/items/KIT-12-01.jpg",
    photoAlt: "Description of the actual item in the photograph"
  }
]
```

Use `enquire`, `available`, `reserved`, or `sold`. Imported drafts use `enquire`, since condition, availability and the final price must be confirmed directly. Search covers IDs and both languages, with category, listing-language and reserved/sold filters. Enquiry links include the item title and ID. An empty items array shows a coming-soon message.

The dedicated sale link is https://grikard.github.io/berlin-apartment/for-sale.html. The catalogue was populated from the user's 17 November 2026 Word posting pack and 16 November 2026 Excel inventory. It has 23 primary listings covering 28 distinct inventory records: four primary bundles and 19 standalone offers. Nine component/alternate ad drafts are not separately advertised. The white-furniture bundle is presented as one alternative offer using five already-listed inventory records; it is not additional stock. Its enquiry link becomes unavailable if a component is marked reserved or sold.

The reviewed photo batches supply 67 photos across 25 listings, including the first three LGT-01 (Philips Hue Infuse L) packaging photos. New public JPEGs use inventory IDs, have a maximum edge of 2,000 pixels and omit EXIF metadata. Smaller thumbnail copies keep browsing light. Original uploads remain unchanged in ignored `photos/items/`; `photo-map.json` there records source names, hashes and public paths. `photo-review.json` records duplicates and held groups; `audit-reconciliation.json` records the follow-up audit and nine additional matched photos. Photos of packaging are explicitly labelled in both languages. Retail screenshots and photos of items without a confirmed sale entry/price remain local. Group future uploads in subfolders named with inventory IDs where convenient. The optional `photos` array supplies supporting images and can include a `thumbnail` path; `photo` remains the lead image. Do not rerun an older source-import helper over the catalogue without preserving subsequent photo matches and user updates.

Each item photo group has a counter, previous/next buttons, selectable thumbnails and a full-size link. Selecting a thumbnail updates the large image and caption within the item card. All group photos appear as thumbnails, including the lead image; duplicate source paths are shown once.

All imported prices remain explicitly proposed and negotiable. Known flaws and uncertainties are visible on the cards, including water marks on both bedside tables and the cutting board's possible crack. Manufacturer reference images, expected proceeds, negotiation floors, internal checks and unapproved stock are excluded from the export. Four listings still await matched photos: the Hario coffee bundle, MITTZON desk frame and two Nintendo consoles. Unapproved inventory, source office documents and valuation notes belong in the private master. Local migration material in ignored `docs/`, `photos/` and `.local/` is not an alternative editable master.

Collection is by appointment in Berlin-Mitte. The supplied posting copy specifies The Playce / Potsdamer Platz shopping level −4F as a parking option, buyer-paid parking, and buyer responsibility for carrying, transport and any disassembly unless otherwise agreed. The seller's public enquiry email is configured in `site-data.js`.

## Rental and contact details

Fill in the apartment fields in `site-data.js` using human-readable values, including currency and whether rent includes utilities. `monthlyRent` and `serviceCharges` are shown as approximate amounts. `currentWarmRent` is the separately labelled current monthly total. The listing explains that maintenance / service charges may be higher and final terms must be confirmed. Blank size, room count, deposit, furnishing and rental term fields are hidden. Blank rent, fees and availability date show pending messages. Change `apartment.status` when availability changes.

The user supplied current costs of €1,723.03 base rent, €87.85 heating/hot water and €301.21 other operating costs, totalling €2,112.09 warm. Their updated estimate for MVMG is between that current total and approximately €2,400 warm per month. The displayed headline rounds the lower bound to €2,112 and the explanation gives the exact current total. This replaces the earlier broader market estimate and its illustrative future component split. The table now shows only current payments; future component amounts remain unconfirmed. Numeric amounts are stored as integer euro cents in `apartment.rentGuide`; update the summary strings and HTML fallback if those amounts change. The checks verify the current breakdown and that the estimate starts at the current warm rent.

The tenant has lived in the apartment for almost four years and welcomes immediate takeover enquiries and offers. A furnished takeover may be possible, including the washer, dryer, TV and other household essentials; availability, contents and any furniture/appliance price are to be agreed separately from rent. This is a potential arrangement and does not add a confirmed standalone TV offer to the belongings catalogue. The alternative viewing queue is described as January 2027, interpreting the user's reference to the upcoming January. Final rent, charges and takeover arrangements remain subject to confirmation with MVMG. The site does not operate an automatic viewing queue or accept binding rental offers.

Electricity, internet and parking are excluded from the rent guide. The analysis's deposit, parking availability and household budget allowances are not agreed rental terms and are not advertised. Comparable listings from the supplied analysis are not republished or presented as newly verified market evidence.

The supplied plan, dated 13 November 1998, states 83.67 m² Wohnfläche and a 53.80 m² terrace. Its labelled indoor rooms total 70.22 m²; 70.22 + 25% × 53.80 = 83.67. The website describes the terrace allocation as an interpretation consistent with the plan, not as a verified measurement rule. All dimensions are approximate and need verification. The shared private hallway described by the user is separate from the small entrance hall inside the apartment.

Set `contact.email` and/or `contact.whatsapp` only to details you want to publish. WhatsApp uses the international number including the country code. Email links open the visitor's mail app; WhatsApp links open WhatsApp. There is no form or booking system, and enquiries are not stored by the website. Until contact information is supplied, the site shows a clear pending message. No contact information is inferred from your GitHub account.

## Check and publish

```powershell
npm run check
git add .
git commit -m "Update apartment listing"
git push
```

The repository should be named `berlin-apartment` in the `grikard` account. In repository Settings → Pages, select **GitHub Actions** as the source. The included workflow publishes only this project, without changing another repository or your main homepage.

GitHub Pages caches scripts for up to ten minutes. Both HTML pages use matching version queries on the stylesheet and scripts; update that version when changing shared styles, scripts or listing data so returning visitors load a consistent release.

The expected project URL is https://grikard.github.io/berlin-apartment/ unless the account's Pages configuration supplies a custom domain. A GitHub Pages project site is public. The page and source must contain only information you intend to share.

This is a static site. It uses no analytics, visitor accounts or cookies. Fonts load from Google Fonts with local font fallbacks. The neighbourhood map link opens OpenStreetMap; no map or tracking widget is embedded.
