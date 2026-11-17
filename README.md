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

Copy its photograph into `dist/photos/items/`, then edit the catalogue in `dist/content/inventory.js`. Each listing has an ID, English/German titles and descriptions, a proposed price, condition disclosures and the inventory records it covers. Use an existing entry as the format reference. The simplified example below illustrates the core fields; match the full existing schema when adding a real listing:

```javascript
items: [
  {
    id: "item-001",
    title: "Name of the actual item",
    category: "Furniture",
    price: "€...",
    description: "Condition, material and any other useful details.",
    dimensions: "Width × depth × height in cm",
    status: "available",
    photo: "photos/items/item-001.jpg",
    photoAlt: "Description of the actual item in the photograph"
  }
]
```

Use `enquire`, `available`, `reserved`, or `sold`. Imported drafts use `enquire`, since condition, availability and the final price must be confirmed directly. Search covers IDs and both languages, with category, listing-language and reserved/sold filters. Enquiry links include the item title and ID. An empty items array shows a coming-soon message.

The dedicated sale link is https://grikard.github.io/berlin-apartment/for-sale.html. The catalogue was populated from the user's 17 November 2026 Word posting pack and 16 November 2026 Excel inventory. It has 23 primary listings covering 28 distinct inventory records: four primary bundles and 19 standalone offers. Nine component/alternate ad drafts are not separately advertised. The white-furniture bundle is presented as one alternative offer using five already-listed inventory records; it is not additional stock. Its enquiry link becomes unavailable if a component is marked reserved or sold.

All imported prices remain explicitly proposed and negotiable. Known flaws and uncertainties are visible on the cards, including water marks on both bedside tables and the cutting board's possible crack. Manufacturer images, old retail references, expected sale prices, negotiation floors, internal checks and scope-watchlist items are not published. Neither source file contains embedded product photos; actual-photo placeholders remain until the user's photos are supplied. The source documents stay in ignored `docs/`, and extraction/audit work stays in ignored `.local/`.

Collection is by appointment in Berlin-Mitte. The supplied posting copy specifies The Playce / Potsdamer Platz shopping level −4F as a parking option, buyer-paid parking, and buyer responsibility for carrying, transport and any disassembly unless otherwise agreed. The seller's public enquiry email is configured in `site-data.js`.

## Rental and contact details

Fill in the apartment fields in `site-data.js` using human-readable values, including currency and whether rent includes utilities. `monthlyRent` and `serviceCharges` are shown as approximate amounts. `currentWarmRent` is the separately labelled current monthly total. The listing explains that maintenance / service charges may be higher and final terms must be confirmed. Blank size, room count, deposit, furnishing and rental term fields are hidden. Blank rent, fees and availability date show pending messages. Change `apartment.status` when availability changes.

The user supplied current costs of €1,723.03 base rent, €87.85 heating/hot water and €301.21 other operating costs, totalling €2,112.09 warm. Their supplied November 2026 estimate is €2,200–€2,650 warm, centred on €2,400 (€1,800 cold + €210 heating + €390 operating costs). These are two distinct sets of figures. Numeric table amounts are stored as integer euro cents in `apartment.rentGuide`; update the summary strings and HTML fallback if those amounts change. The checks verify that each breakdown adds up and that the central estimate lies within its range. The central €600 in charges is already included in €2,400 warm and must not be added again.

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

The expected project URL is https://grikard.github.io/berlin-apartment/ unless the account's Pages configuration supplies a custom domain. A GitHub Pages project site is public. The page and source must contain only information you intend to share.

This is a static site. It uses no analytics, visitor accounts or cookies. Fonts load from Google Fonts with local font fallbacks. The neighbourhood map link opens OpenStreetMap; no map or tracking widget is embedded.
