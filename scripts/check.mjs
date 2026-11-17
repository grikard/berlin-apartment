import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import './verify-inventory.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const read = path => readFile(resolve(root, path), 'utf8');
const context = { window: {} };
const content = await read('content/site-data.js');
new vm.Script(content).runInNewContext(context);
new vm.Script(await read('content/inventory.js')).runInNewContext(context);
const data = context.window.BERLIN_LISTING;
assert(data && data.apartment && data.contact && Array.isArray(data.items), 'Listing must contain apartment, contact and items');
if (data.apartment.rentGuide) {
  const { current, estimate } = data.apartment.rentGuide;
  for (const key of ['baseCents', 'heatingCents', 'operatingCents', 'totalCents']) assert(Number.isSafeInteger(current[key]) && current[key] >= 0, `Invalid current amount: ${key}`);
  assert.equal(current.baseCents + current.heatingCents + current.operatingCents, current.totalCents, 'Current components must equal warm rent');
  assert(Number.isSafeInteger(estimate.lowCents) && Number.isSafeInteger(estimate.highCents), 'Rent range must use integer cents');
  assert.equal(estimate.lowCents, current.totalCents, 'The updated rent guide starts at the current warm rent');
  assert(estimate.lowCents <= estimate.highCents, 'Rent range endpoints must be in order');
}
new vm.Script(await read('assets/app.js'));
for (const page of (await readdir(root)).filter(name => name.endsWith('.html'))) {
  const html = await read(page);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${page}: HTML IDs must be unique`);
  for (const match of html.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
    const path = match[1];
    if (/^(https?:|mailto:|data:)/.test(path)) continue;
    assert(!path.startsWith('/'), `${page}: use project-relative URLs: ${path}`);
    assert((await stat(resolve(root, path))).isFile(), `${page}: missing asset: ${path}`);
  }
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `${page}: broken section link: ${match[1]}`);
}
const checkPhoto = async path => {
  assert(/^photos\/[\w./ -]+\.(jpe?g|png|webp|avif)$/i.test(path) && !path.split('/').includes('..'), `Invalid photo path: ${path}`);
  const absolute = resolve(root, path);
  assert(absolute.startsWith(resolve(root) + sep));
  assert((await stat(absolute)).isFile(), `Missing photo: ${path}`);
};
for (const photo of data.apartment.photos || []) {
  assert(photo.alt, 'Apartment photos need alternative text');
  await checkPhoto(photo.src);
}
if (data.contact.email) assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email), 'Invalid contact email');
if (data.contact.whatsapp) assert(/^\d{7,15}$/.test(data.contact.whatsapp.replace(/[\s()+.-]/g, '')), 'WhatsApp needs an international phone number');
const itemIds = new Set();
const primaryInventoryIds = new Set();
for (const item of [...data.items, ...(data.optionalBundles || [])]) {
  assert(item.id && !itemIds.has(item.id), 'Every item needs a unique ID'); itemIds.add(item.id);
  assert(item.title && item.price && item.description, `Item ${item.id} needs title, price and description`);
  assert(item.titleDe && item.descriptionDe, `German copy is missing for ${item.id}`);
  assert(['available', 'enquire', 'reserved', 'sold'].includes(item.status), `Invalid status for ${item.id}`);
  if(item.priceKind === 'on-request') {
    assert(item.priceEur === null && item.price === 'Preis auf Anfrage', `${item.id}: unpriced enquiry card must not invent a price`);
    assert(item.status === 'enquire' && !item.photo && !(item.photos || []).length, `${item.id}: enquiry card cannot publish unreviewed photos or sale status`);
  } else {
    assert(Number.isFinite(item.priceEur) && item.priceEur > 0, `Invalid proposed price for ${item.id}`);
    assert(item.priceKind === 'proposed', `${item.id}: preserve proposed-price qualification`);
  }
  assert(Array.isArray(item.inventoryIds) && item.inventoryIds.length, `${item.id}: missing inventory coverage`);
  for (const text of [item.description, item.descriptionDe, item.condition, item.conditionDe]) assert(!/INTERNAL CHECK|Quick Floor|Expected Low|before publication|before posting|vor Veröffentlichung/i.test(text || ''), `${item.id}: internal editorial notes must stay out of public copy`);
  if (item.photo) await checkPhoto(item.photo);
  for (const photo of item.photos || []) {
    assert(photo.alt, `${item.id}: gallery photos need alternative text`);
    await checkPhoto(photo.src);
    if (photo.thumbnail) await checkPhoto(photo.thumbnail);
  }
  if (item.photoEvidence === 'packaging') assert(item.photoNote && item.photoNoteDe, `${item.id}: packaging photos need a clear disclosure in both languages`);
}
for (const item of data.items) for (const id of item.inventoryIds) {
  assert(!primaryInventoryIds.has(id), `Inventory record ${id} is advertised twice`);
  primaryInventoryIds.add(id);
}
assert.equal(primaryInventoryIds.size, data.sale.inventoryRecordCount, 'Public catalogue must cover the expected distinct inventory records');
for (const bundle of data.optionalBundles || []) for (const id of bundle.inventoryIds) assert(primaryInventoryIds.has(id), `Alternative bundle references unknown inventory: ${id}`);
console.log(`Site checks passed: links, assets, JavaScript, rent arithmetic, ${data.items.length} listings covering ${primaryInventoryIds.size} distinct inventory records, ${(data.optionalBundles || []).length} alternative bundle.`);
const missing = ['monthlyRent', 'serviceCharges', 'availableFrom', 'size', 'rooms'].filter(key => !data.apartment[key]);
if (!data.contact.email && !data.contact.whatsapp) missing.push('contact details');
if (!data.apartment.photos.length) missing.push('apartment photos');
if (!data.items.length) missing.push('sale items');
else if (data.items.some(item => !item.photo)) missing.push('product photos');
if (missing.length) console.log(`Content still to add: ${missing.join(', ')}.`);
