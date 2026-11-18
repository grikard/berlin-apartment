/* Edit the listing here. Only put information in this file that may be public.
   Paths are relative to dist/index.html. See README.md for examples. */
window.BERLIN_LISTING = {
  apartment: {
    status: "Available now",
    description: "An eighth-floor, top-floor home at Potsdamer Platz with a large wrap-around terrace. The supplied floor plan shows one bedroom, a living room, a separate kitchen, a bathroom, a guest WC and a utility room. A private door off the lift landing opens into a long private hallway serving just two apartments.",
    floor: "8th / top floor",
    terrace: "Approx. 53.80 m² · wrap-around",
    liftAccess: "Private door from lift landing",
    hallway: "Long private hall · 2 apartments",
    monthlyRent: "Approx. €2,112–€2,400 / month (warm)",
    serviceCharges: "Final amounts to be confirmed by MVMG",
    currentWarmRent: "€2,112.09 / month",
    // Currency amounts below are integer euro cents. The tenant's updated MVMG
    // total-rent estimate runs from the current warm rent to approximately €2,400.
    rentGuide: {
      period: "November 2026",
      manager: "MVMG",
      current: { baseCents: 172303, heatingCents: 8785, operatingCents: 30121, totalCents: 211209 },
      estimate: { lowCents: 211209, highCents: 240000 }
    },
    enquirySubject: "Apartment takeover / offer — Alte Potsdamer Str. 11, Berlin",
    availableFrom: "Now",
    size: "Approx. 83.67 m² Wohnfläche (per plan)",
    rooms: "2 rooms · 1 bedroom",
    deposit: "",
    furnished: "Potential furnished takeover, by separate agreement",
    rentalTerm: "",
    note: "The expected total warm rent with MVMG is between the current €2,112.09 and approximately €2,400 per month, as reported by the current tenants. Operating / maintenance and heating charges may change. Electricity, internet and parking are excluded. Final rent, charges and takeover arrangements remain to be confirmed with MVMG. Offers are welcome.",
    photos: [
      {
        "src": "photos/apartment/terrace-life-01.jpg",
        "preview": "photos/apartment/previews/terrace-life-01.jpg",
        "alt": "The wrap-around terrace with outdoor furniture and views across Potsdamer Platz",
        "caption": "Room outside, above the city",
        "role": "hero",
        "width": 1500,
        "height": 2000,
        "previewWidth": 720,
        "previewHeight": 960,
        "srcset": "photos/apartment/previews/terrace-life-01.jpg 720w, photos/apartment/terrace-life-01.jpg 1500w"
      },
      {
        "src": "photos/apartment/evening-view-01.jpg",
        "preview": "photos/apartment/previews/evening-view-01.jpg",
        "alt": "Evening light between the rooftops seen from the apartment terrace",
        "caption": "Evening light from the terrace",
        "role": "story",
        "width": 1200,
        "height": 1600,
        "previewWidth": 720,
        "previewHeight": 960,
        "srcset": "photos/apartment/previews/evening-view-01.jpg 720w, photos/apartment/evening-view-01.jpg 1200w"
      },
      {
        "src": "photos/apartment/neighbourhood-01.jpg",
        "preview": "photos/apartment/previews/neighbourhood-01.jpg",
        "alt": "Street-level view of architecture at Potsdamer Platz with Alte Potsdamer Straße signs",
        "caption": "Potsdamer Platz at street level",
        "role": "neighbourhood",
        "width": 1500,
        "height": 2000,
        "previewWidth": 720,
        "previewHeight": 960,
        "srcset": "photos/apartment/previews/neighbourhood-01.jpg 720w, photos/apartment/neighbourhood-01.jpg 1500w"
      },
      {
        "src": "photos/apartment/neighbourhood-02.jpg",
        "preview": "photos/apartment/previews/neighbourhood-02.jpg",
        "alt": "The Playce shopping entrance beneath the Potsdamer Platz sign",
        "caption": "The Playce, in the neighbourhood",
        "role": "neighbourhood",
        "width": 1500,
        "height": 2000,
        "previewWidth": 720,
        "previewHeight": 960,
        "srcset": "photos/apartment/previews/neighbourhood-02.jpg 720w, photos/apartment/neighbourhood-02.jpg 1500w"
      },
      {
        "src": "photos/apartment/interior-01.jpg",
        "preview": "photos/apartment/previews/interior-01.jpg",
        "alt": "Earlier unfurnished interior with corner windows and doors opening onto the terrace",
        "caption": "Corner windows and terrace doors · June 2023",
        "role": "interior",
        "width": 2000,
        "height": 1500,
        "previewWidth": 960,
        "previewHeight": 720,
        "srcset": "photos/apartment/previews/interior-01.jpg 960w, photos/apartment/interior-01.jpg 2000w"
      },
      {
        "src": "photos/apartment/interior-02.jpg",
        "preview": "photos/apartment/previews/interior-02.jpg",
        "alt": "Earlier unfurnished interior looking towards the corner glazing and open terrace door",
        "caption": "The connection to the terrace · June 2023",
        "role": "interior",
        "width": 2000,
        "height": 1500,
        "previewWidth": 960,
        "previewHeight": 720,
        "srcset": "photos/apartment/previews/interior-02.jpg 960w, photos/apartment/interior-02.jpg 2000w"
      },
      {
        "src": "photos/apartment/interior-03.jpg",
        "preview": "photos/apartment/previews/interior-03.jpg",
        "alt": "Earlier unfurnished room showing terrace access and unfinished floor surfaces",
        "caption": "Another interior view · June 2023",
        "role": "interior",
        "width": 1500,
        "height": 2000,
        "previewWidth": 720,
        "previewHeight": 960,
        "srcset": "photos/apartment/previews/interior-03.jpg 720w, photos/apartment/interior-03.jpg 1500w"
      }
    ]
  },
  contact: {
    // Public enquiry address supplied by the seller.
    email: "ports_dashers.4n@icloud.com",
    whatsapp: "", // International number with country code, e.g. +49...
    note: ""
  },
  // The public catalogue is loaded next from content/inventory.js.
  items: []
};
