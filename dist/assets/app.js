(() => {
  'use strict';
  const data = window.BERLIN_LISTING;
  if (!data) return;
  const $ = id => document.getElementById(id);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const contact = data.contact || {};
  const email = typeof contact.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? contact.email : '';
  const phone = typeof contact.whatsapp === 'string' ? contact.whatsapp.replace(/[\s()+.-]/g, '') : '';
  const whatsapp = /^\d{7,15}$/.test(phone) ? phone : '';
  const enquiryUrl = (subject, message = '') => {
    if (email) return `mailto:${email}?subject=${encodeURIComponent(subject)}${message ? `&body=${encodeURIComponent(message)}` : ''}`;
    if (whatsapp) return `https://wa.me/${whatsapp}?text=${encodeURIComponent([subject, message].filter(Boolean).join('\n\n'))}`;
    return '#contact';
  };
  const localPhoto = value => typeof value === 'string' && /^photos\/[\w./ -]+\.(jpe?g|png|webp|avif)$/i.test(value) && !value.split('/').includes('..');
  // Apartment-only sections are absent from the dedicated belongings page.
  if ($('rental-facts')) {
    const apartment = data.apartment || {};
    if (apartment.status) $('availability-label').textContent = apartment.status;
    if (apartment.description) $('apartment-description').textContent = apartment.description;
    const facts = [
      ['Location', 'Potsdamer Platz'], ['Floor', apartment.floor || 'Top floor'],
      ['Living area', apartment.size], ['Rooms', apartment.rooms],
      ['Terrace', apartment.terrace || 'Large wrap-around balcony'],
      ['Lift access', apartment.liftAccess], ['Hallway', apartment.hallway],
      ['Estimated warm rent', apartment.monthlyRent, 'Details to follow'],
      ['Estimated charges', apartment.serviceCharges, 'To be confirmed'],
      ['Current warm rent', apartment.currentWarmRent],
      ['Available from', apartment.availableFrom, 'Date to be confirmed'], ['Deposit', apartment.deposit],
      ['Furnishing', apartment.furnished], ['Rental term', apartment.rentalTerm]
    ];
    $('rental-facts').replaceChildren();
    for (const [label, value, fallback] of facts) {
      if (!value && !fallback) continue;
      const row = el('div');
      row.append(el('dt', '', label), el('dd', value ? '' : 'pending', value || fallback));
      $('rental-facts').append(row);
    }
    $('rental-note').textContent = apartment.note || '';
    $('rental-note').hidden = !apartment.note;
    for (const link of document.querySelectorAll('.rental-enquiry')) link.href = enquiryUrl(apartment.enquirySubject || 'Enquiry about the Potsdamer Platz apartment');

    const guide = apartment.rentGuide;
    if (guide) {
      const money = (cents, decimals = 0) => new Intl.NumberFormat('en-IE', {
        style: 'currency', currency: 'EUR', minimumFractionDigits: decimals, maximumFractionDigits: decimals
      }).format(cents / 100);
      $('rent-guide-period').textContent = `ESTIMATED TOTAL WARM RENT · ${guide.manager || 'BERLIN'}`;
      $('rent-guide-range').textContent = `${money(guide.estimate.lowCents)}–${money(guide.estimate.highCents)}`;
      const basis = $('rent-guide-basis') || $('rent-guide-central');
      if (basis) basis.textContent = `From the current ${money(guide.current.totalCents, 2)} up to approximately ${money(guide.estimate.highCents)} per month.`;
      const components = [
        ['Base rent (Kaltmiete)', 'baseCents'],
        ['Heating & hot water (Heizkosten)', 'heatingCents'],
        ['Other operating costs (Nebenkosten)', 'operatingCents'],
        ['Total warm rent (Warmmiete)', 'totalCents']
      ];
      $('rent-breakdown').replaceChildren();
      for (const [label, key] of components) {
        const row = el('tr', key === 'totalCents' ? 'cost-total' : '');
        const heading = el('th', '', label); heading.scope = 'row';
        row.append(heading, el('td', '', money(guide.current[key], 2)));
        $('rent-breakdown').append(row);
      }
    }

    const photos = (apartment.photos || []).filter(photo => localPhoto(photo.src) && photo.alt);
    if (photos.length) {
      const first = photos[0];
      $('hero-image').src = first.src;
      $('hero-image').alt = first.alt;
      $('hero-image').width = first.width || 800;
      $('hero-image').height = first.height || 900;
      $('hero-caption').textContent = first.caption || 'A home above the city.';
      $('hero-art').classList.add('has-photo');
      $('illustration-note').hidden = true;
      $('photo-pending').hidden = true;
      $('photo-gallery').hidden = false;
      $('photo-gallery').dataset.count = String(photos.length);
      for (const photo of photos) {
        const button = el('button', 'gallery-photo');
        button.type = 'button';
        button.setAttribute('aria-label', `Enlarge: ${photo.caption || photo.alt}`);
        const img = el('img');
        img.src = photo.src; img.alt = photo.alt; img.loading = 'lazy'; img.width = photo.width || 800; img.height = photo.height || 600;
        button.append(img, el('span', '', photo.caption || photo.alt));
        button.addEventListener('click', () => {
          $('dialog-image').src = photo.src;
          $('dialog-image').alt = photo.alt;
          $('dialog-caption').textContent = photo.caption || photo.alt;
          $('photo-dialog').showModal();
        });
        $('photo-gallery').append(button);
      }
    }
    $('close-photo').addEventListener('click', () => $('photo-dialog').close());
    $('photo-dialog').addEventListener('click', event => { if (event.target === $('photo-dialog')) $('photo-dialog').close(); });
  }

  if (email) {
    const link = el('a', 'button button-dark', 'Send an email ↗');
    link.href = enquiryUrl('Berlin apartment / items for sale');
    $('contact-links').append(link);
  }
  if (whatsapp) {
    const link = el('a', 'text-link', 'Message on WhatsApp ↗');
    link.href = `https://wa.me/${whatsapp}`;
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    $('contact-links').append(link);
  }
  $('contact-pending').hidden = Boolean(email || whatsapp);
  if (contact.note) { $('contact-note').textContent = contact.note; $('contact-note').hidden = false; }

  const items = (data.items || []).filter(item => item.title);
  if (!items.length) return;
  $('empty-listings').hidden = true;
  $('sale-controls').hidden = false;
  $('item-count').hidden = false;
  $('sale-note').hidden = false;
  if ($('inventory-notice')) $('inventory-notice').hidden = false;
  if ($('item-language')) $('item-language').value = data.sale?.defaultLanguage || 'en';
  for (const category of [...new Set(items.map(item => item.category || 'Other'))].sort()) {
    const option = el('option', '', category); option.value = category; $('item-category').append(option);
  }
  const statusLabels = {
    en: { available: 'Available', enquire: 'Enquire', reserved: 'Reserved', sold: 'Sold' },
    de: { available: 'Verfügbar', enquire: 'Anfragen', reserved: 'Reserviert', sold: 'Verkauft' }
  };
  const isOpen = item => ['available', 'enquire'].includes(item.status || 'enquire');
  const priceDescending = (a, b) => {
    const aPriced = a.priceKind !== 'on-request' && Number.isFinite(a.priceEur) && a.priceEur >= 0;
    const bPriced = b.priceKind !== 'on-request' && Number.isFinite(b.priceEur) && b.priceEur >= 0;
    if (aPriced !== bPriced) return aPriced ? -1 : 1;
    return aPriced ? b.priceEur - a.priceEur : 0;
  };
  const textFor = (item, key, language) => language === 'de' ? (item[key + 'De'] || item[key] || '') : (item[key] || '');
  const searchText = item => [item.id, item.title, item.titleDe, item.description, item.descriptionDe, item.condition, item.conditionDe, item.category, ...(item.inventoryIds || [])].filter(Boolean).join(' ').normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();
  const makeCard = (item, language, optional = false) => {
    const title = textFor(item, 'title', language);
    const labels = statusLabels[language] || statusLabels.en;
    const status = Object.hasOwn(labels, item.status) ? item.status : 'enquire';
    const card = el('article', optional ? 'item-card optional-bundle-card' : 'item-card');
    card.dataset.status = status;
    card.dataset.category = item.category || 'Other';
    card.lang = language;
    card.id = `item-${item.id}`;
    if (!optional) {
      const photoGroup = new Map();
      if (localPhoto(item.photo)) photoGroup.set(item.photo, { src: item.photo, alt: item.photoAlt || title });
      for (const photo of item.photos || []) if (localPhoto(photo.src)) photoGroup.set(photo.src, photo);
      const groupPhotos = [...photoGroup.values()];
      const hasPhoto = groupPhotos.length > 0;
      const imageBox = el(hasPhoto ? 'a' : 'div', hasPhoto ? `item-image${item.photoEvidence === 'packaging' ? ' item-photo-packaging' : ''}` : 'item-image item-image-pending');
      if (hasPhoto) {
        imageBox.href = groupPhotos[0].src; imageBox.target = '_blank'; imageBox.rel = 'noopener noreferrer';
        imageBox.setAttribute('aria-label', `${language === 'de' ? 'Foto vergrößern' : 'Enlarge photo'}: ${title}`);
        const img = el('img'); img.src = groupPhotos[0].src; img.alt = groupPhotos[0].alt || title; img.loading = 'lazy'; img.width = 800; img.height = 600;
        imageBox.append(img);
      } else {
        imageBox.append(el('span', 'pending-photo-id', item.id), el('span', 'pending-photo-note', language === 'de' ? 'Originalfotos folgen' : 'Actual photos coming soon'));
      }
      card.append(imageBox);
      if (hasPhoto) {
        let selectedPhoto = 0;
        const controls = el('div', 'item-photo-controls');
        const previous = el('button', 'item-photo-step', '←'); previous.type = 'button';
        previous.setAttribute('aria-label', language === 'de' ? 'Vorheriges Foto' : 'Previous photo');
        const next = el('button', 'item-photo-step', '→'); next.type = 'button';
        next.setAttribute('aria-label', language === 'de' ? 'Nächstes Foto' : 'Next photo');
        const counter = el('span', 'item-photo-counter'); counter.setAttribute('aria-live', 'polite');
        controls.append(previous, counter, next);
        const caption = el('p', 'item-photo-caption');
        const thumbnails = el('div', 'item-photo-thumbs');
        thumbnails.setAttribute('role', 'group');
        thumbnails.setAttribute('aria-label', `${language === 'de' ? 'Fotos' : 'Photos'}: ${title}`);
        const fullSize = el('a', 'item-photo-full', language === 'de' ? 'Foto vergrößern ↗' : 'View full size ↗');
        fullSize.target = '_blank'; fullSize.rel = 'noopener noreferrer';
        const buttons = [];
        const showPhoto = index => {
          selectedPhoto = (index + groupPhotos.length) % groupPhotos.length;
          const photo = groupPhotos[selectedPhoto];
          imageBox.href = photo.src;
          const mainImage = imageBox.querySelector('img'); mainImage.src = photo.src; mainImage.alt = photo.alt || title;
          fullSize.href = photo.src;
          counter.textContent = language === 'de' ? `Foto ${selectedPhoto + 1} von ${groupPhotos.length}` : `Photo ${selectedPhoto + 1} of ${groupPhotos.length}`;
          caption.textContent = textFor(photo, 'caption', language) || title;
          buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === selectedPhoto)));
        };
        groupPhotos.forEach((photo, index) => {
          const button = el('button', 'item-photo-thumb'); button.type = 'button';
          button.setAttribute('aria-label', `${language === 'de' ? 'Foto' : 'Photo'} ${index + 1}: ${textFor(photo, 'caption', language) || title}`);
          const img = el('img'); img.src = localPhoto(photo.thumbnail) ? photo.thumbnail : photo.src; img.alt = ''; img.loading = 'lazy'; img.width = 80; img.height = 80;
          button.append(img); button.addEventListener('click', () => showPhoto(index));
          buttons.push(button); thumbnails.append(button);
        });
        previous.addEventListener('click', () => showPhoto(selectedPhoto - 1));
        next.addEventListener('click', () => showPhoto(selectedPhoto + 1));
        previous.disabled = next.disabled = groupPhotos.length === 1;
        card.append(controls, caption, thumbnails, fullSize);
        showPhoto(0);
      }
      const photoNote = textFor(item, 'photoNote', language);
      if (photoNote) card.append(el('p', 'item-photo-note', photoNote));
    }
    const meta = el('div', 'item-meta');
    meta.append(el('span', '', item.category || 'Other'), el('span', 'item-status', labels[status]));
    card.append(meta, el('h3', '', title));
    if (item.dimensions) card.append(el('p', 'item-dimensions', `${language === 'de' ? 'Maße / Inhalt' : 'Dimensions / capacity'}: ${item.dimensions}`));
    const condition = textFor(item, 'condition', language);
    if (condition) card.append(el('p', 'item-disclosure', condition));
    const description = textFor(item, 'description', language);
    if (description) {
      const details = el('details', 'item-description');
      details.append(el('summary', '', language === 'de' ? 'Beschreibung lesen' : 'Read description'), el('p', '', description));
      card.append(details);
    }
    if (optional) {
      const components = el('ul', 'bundle-components');
      for (const id of item.inventoryIds || []) {
        const owner = items.find(candidate => (candidate.inventoryIds || [candidate.id]).includes(id));
        components.append(el('li', '', `${id} · ${owner ? textFor(owner, 'title', language) : id}`));
      }
      card.append(components);
    }
    const bottom = el('div', 'item-bottom');
    const price = el('div', 'item-price-group');
    const pricePending = item.priceKind === 'on-request';
    price.append(el('span', 'item-price-label', pricePending ? (language === 'de' ? 'Fragt uns gern' : 'Ask us about it') : (language === 'de' ? 'Preisvorstellung · Angebote willkommen' : 'Asking price · offers welcome')), el('span', 'item-price', pricePending ? (language === 'de' ? 'Preis auf Anfrage' : 'Price on request') : (item.price || (language === 'de' ? 'Preis auf Anfrage' : 'Price on request'))));
    bottom.append(price);
    if (isOpen(item)) {
      const link = el('a', 'item-ask', language === 'de' ? 'Angebot senden ↗' : 'Make an offer ↗');
      const message = language === 'de'
        ? `Hallo,\n\nich interessiere mich für ${title} (${item.id}).\n\nMein Angebot / meine Frage:\n\nMögliche Abholzeiten:\n\nViele Grüße`
        : `Hello,\n\nI'm interested in ${title} (${item.id}).\n\nMy offer / question:\n\nPossible collection times:\n\nThank you!`;
      link.href = enquiryUrl(`Berlin: ${item.id} — ${title}`, message);
      link.setAttribute('aria-label', `${language === 'de' ? 'Angebot oder Frage zu' : 'Offer or ask about'}: ${title} (${item.id})`);
      bottom.append(link);
    }
    card.append(bottom);
    return card;
  };
  const renderItems = () => {
    const query = $('item-search').value.trim().normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();
    const category = $('item-category').value;
    const language = $('item-language')?.value || 'en';
    const matchesFilters = item => searchText(item).includes(query)
        && (category === 'all' || (item.category || 'Other') === category)
        && (!$('available-only').checked || isOpen(item));
    const matches = items.filter(matchesFilters).sort(priceDescending);
    const optional = (data.optionalBundles || []).map(bundle => {
      const open = (bundle.inventoryIds || []).every(id => {
        const owner = items.find(item => (item.inventoryIds || [item.id]).includes(id));
        return owner && isOpen(owner);
      });
      return { ...bundle, status: open ? (bundle.status || 'enquire') : 'reserved' };
    }).filter(matchesFilters).sort(priceDescending);
    $('items-grid').replaceChildren();
    $('item-count').textContent = `${matches.length} ${matches.length === 1 ? 'listing' : 'listings'} shown${optional.length ? ' · 1 alternative bundle option' : ''}`;
    $('no-results').hidden = matches.length !== 0 || optional.length !== 0;
    for (const item of matches) $('items-grid').append(makeCard(item, language));
    if ($('optional-bundle-list')) {
      $('optional-bundles').hidden = optional.length === 0;
      $('optional-bundle-list').replaceChildren();
      for (const bundle of optional) $('optional-bundle-list').append(makeCard(bundle, language, true));
    }
  };
  $('item-search').addEventListener('input', renderItems);
  $('item-category').addEventListener('change', renderItems);
  $('item-language')?.addEventListener('change', renderItems);
  $('available-only').addEventListener('change', renderItems);
  renderItems();
})();
