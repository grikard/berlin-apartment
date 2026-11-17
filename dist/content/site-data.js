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
        src: "photos/apartment/balcony-view-01.jpg",
        alt: "View from the apartment balcony over Potsdamer Platz rooftops, with orange clouds and the balcony railing in the foreground",
        caption: "The view from the balcony",
        width: 4284,
        height: 5712
      },
      {
        src: "photos/apartment/balcony-view-02.jpg",
        alt: "A second view from the apartment balcony across nearby rooftops and the street below at Potsdamer Platz",
        caption: "Potsdamer Platz from above",
        width: 4284,
        height: 5712
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
