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
  const enquiryUrl = subject => {
    if (email) return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    if (whatsapp) return `https://wa.me/${whatsapp}?text=${encodeURIComponent(subject)}`;
    return '#contact';
  };
  const localPhoto = value => typeof value === 'string' && /^photos\/[\w./ -]+\.(jpe?g|png|webp|avif)$/i.test(value) && !value.split('/').includes('..');
  const apartment = data.apartment || {};
  if (apartment.status) $('availability-label').textContent = apartment.status;
  if (apartment.description) $('apartment-description').textContent = apartment.description;
  const facts = [
    ['Location', 'Potsdamer Platz'], ['Floor', 'Top floor'], ['Outdoor space', 'Large wrap-around balcony'],
    ['Monthly rent', apartment.monthlyRent, 'Details to follow'], ['Available from', apartment.availableFrom, 'Date to be confirmed'],
    ['Size', apartment.size], ['Rooms', apartment.rooms], ['Deposit', apartment.deposit],
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
  document.querySelector('.rental-enquiry').href = enquiryUrl('Enquiry about the Potsdamer Platz apartment');

  const photos = (apartment.photos || []).filter(photo => localPhoto(photo.src) && photo.alt);
  if (photos.length) {
    const first = photos[0];
    $('hero-image').src = first.src;
    $('hero-image').alt = first.alt;
    $('hero-caption').textContent = first.caption || 'A home above the city.';
    $('hero-art').classList.add('has-photo');
    $('illustration-note').hidden = true;
    $('photo-pending').hidden = true;
    $('photo-gallery').hidden = false;
    for (const photo of photos) {
      const button = el('button', 'gallery-photo');
      button.type = 'button';
      button.setAttribute('aria-label', `Enlarge: ${photo.caption || photo.alt}`);
      const img = el('img');
      img.src = photo.src; img.alt = photo.alt; img.loading = 'lazy'; img.width = 800; img.height = 600;
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
  for (const category of [...new Set(items.map(item => item.category || 'Other'))].sort()) {
    const option = el('option', '', category); option.value = category; $('item-category').append(option);
  }
  const statusLabels = { available: 'Available', reserved: 'Reserved', sold: 'Sold' };
  const renderItems = () => {
    const query = $('item-search').value.trim().toLocaleLowerCase();
    const category = $('item-category').value;
    const matches = items.filter(item => {
      const status = item.status || 'available';
      return `${item.title} ${item.description || ''} ${item.category || 'Other'}`.toLocaleLowerCase().includes(query)
        && (category === 'all' || (item.category || 'Other') === category)
        && (!$('available-only').checked || status === 'available');
    });
    $('items-grid').replaceChildren();
    $('item-count').textContent = `${matches.length} ${matches.length === 1 ? 'item' : 'items'} shown`;
    $('no-results').hidden = matches.length !== 0;
    for (const item of matches) {
      const status = Object.hasOwn(statusLabels, item.status) ? item.status : 'available';
      const card = el('article', 'item-card'); card.dataset.status = status;
      const imageBox = el('div', 'item-image');
      if (localPhoto(item.photo)) {
        const img = el('img'); img.src = item.photo; img.alt = item.photoAlt || item.title; img.loading = 'lazy'; img.width = 800; img.height = 600;
        imageBox.append(img);
      } else imageBox.append(el('span', '', 'PHOTO COMING SOON'));
      const meta = el('div', 'item-meta');
      meta.append(el('span', '', item.category || 'Other'), el('span', 'item-status', statusLabels[status]));
      card.append(imageBox, meta, el('h3', '', item.title));
      if (item.description) card.append(el('p', '', item.description));
      if (item.dimensions) card.append(el('p', '', `Dimensions: ${item.dimensions}`));
      const bottom = el('div', 'item-bottom');
      bottom.append(el('span', 'item-price', item.price || 'Price on request'));
      if (status === 'available') {
        const link = el('a', 'item-ask', 'Ask about this ↗');
        link.href = enquiryUrl(`Enquiry: ${item.title}${item.id ? ` (${item.id})` : ''}`);
        bottom.append(link);
      }
      card.append(bottom); $('items-grid').append(card);
    }
  };
  $('item-search').addEventListener('input', renderItems);
  $('item-category').addEventListener('change', renderItems);
  $('available-only').addEventListener('change', renderItems);
  renderItems();
})();
