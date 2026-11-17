/* Edit the listing here. Only put information in this file that may be public.
   Paths are relative to dist/index.html. See README.md for examples. */
window.BERLIN_LISTING = {
  apartment: {
    status: "Available to rent",
    description: "An eighth-floor, top-floor home at Potsdamer Platz with a large wrap-around terrace. The supplied floor plan shows one bedroom, a living room, a separate kitchen, a bathroom, a guest WC and a utility room. A private door off the lift landing opens into a long private hallway serving just two apartments.",
    floor: "8th / top floor",
    terrace: "Approx. 53.80 m² · wrap-around",
    liftAccess: "Private door from lift landing",
    hallway: "Long private hall · 2 apartments",
    monthlyRent: "€2,200–€2,650 / month (estimated warm rent)",
    serviceCharges: "Approx. €600 incl. heating, included in warm rent",
    currentWarmRent: "€2,112.09 / month",
    // Currency amounts below are integer euro cents. Current costs are supplied
    // by the occupant; the guide is the supplied November 2026 estimate.
    rentGuide: {
      period: "November 2026",
      current: { baseCents: 172303, heatingCents: 8785, operatingCents: 30121, totalCents: 211209 },
      estimate: { baseCents: 180000, heatingCents: 21000, operatingCents: 39000, totalCents: 240000, lowCents: 220000, highCents: 265000 }
    },
    availableFrom: "",
    size: "Approx. 83.67 m² Wohnfläche (per plan)",
    rooms: "2 rooms · 1 bedroom",
    deposit: "",
    furnished: "",
    rentalTerm: "",
    note: "The estimated range is an indicative November 2026 guide. Operating / maintenance and heating charges may be higher. Warm rent includes the listed operating costs and heating; electricity, internet and parking are excluded from the guide. Final rent, charges and rental terms will be confirmed.",
    // Example: { src: "photos/apartment/balcony.jpg", alt: "The wrap-around balcony", caption: "The balcony" }
    photos: []
  },
  contact: {
    // Leave blank until you choose the contact details to publish.
    email: "",
    whatsapp: "", // International number with country code, e.g. +49...
    note: ""
  },
  // The public catalogue is loaded next from content/inventory.js.
  items: []
};
