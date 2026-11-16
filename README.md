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

- `dist/content/site-data.js`: rental details, contact method and sale items. This is the main file to edit.
- `dist/photos/apartment/`: selected apartment and balcony photographs.
- `dist/photos/items/`: sale item photographs.
- `dist/index.html`: page structure and introductory copy.
- `dist/assets/`: styles, behaviour and the labelled decorative illustration used until real apartment photographs are added.
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

The first photo becomes the hero image. All apartment photos appear in a gallery and can be enlarged. Copy only photographs intended for the public website; do not put the whole personal OneDrive folder into this repository. Before adding phone photos, remove location metadata and check for personal documents or identifying details in the frame.

## Add an item for sale

Copy its photograph into `dist/photos/items/`, then add an actual item to the `items` array. The following is a format example; replace every value with the real item details:

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

Use `available`, `reserved`, or `sold`. Search, category filtering and an available-only filter appear automatically when there are items. Enquiry links include the item title and ID. An empty items array shows an honest coming-soon message, with no example merchandise advertised.

## Rental and contact details

Fill in the apartment fields in `site-data.js` using human-readable values, including currency and whether rent includes utilities. Blank size, room count, deposit, furnishing and rental term fields are hidden. Blank rent and availability date show pending messages. Change `apartment.status` when availability changes.

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
