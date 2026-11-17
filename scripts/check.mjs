import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const read = path => readFile(resolve(root, path), 'utf8');
const context = { window: {} };
const content = await read('content/site-data.js');
new vm.Script(content).runInNewContext(context);
const data = context.window.BERLIN_LISTING;
assert(data && data.apartment && data.contact && Array.isArray(data.items), 'Listing must contain apartment, contact and items');
if (data.apartment.rentGuide) {
  const { current, estimate } = data.apartment.rentGuide;
  for (const [label, costs] of Object.entries({ current, estimate })) {
    for (const key of ['baseCents', 'heatingCents', 'operatingCents', 'totalCents']) assert(Number.isSafeInteger(costs[key]) && costs[key] >= 0, `Invalid ${label} amount: ${key}`);
    assert.equal(costs.baseCents + costs.heatingCents + costs.operatingCents, costs.totalCents, `${label} components must equal warm rent`);
  }
  assert(Number.isSafeInteger(estimate.lowCents) && Number.isSafeInteger(estimate.highCents), 'Rent range must use integer cents');
  assert(estimate.lowCents <= estimate.totalCents && estimate.totalCents <= estimate.highCents, 'Central estimate must fall inside the range');
}
new vm.Script(await read('assets/app.js'));
const html = await read('index.html');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique');
for (const match of html.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
  const path = match[1];
  if (/^(https?:|mailto:|data:)/.test(path)) continue;
  assert(!path.startsWith('/'), `Use project-relative URLs: ${path}`);
  assert((await stat(resolve(root, path))).isFile(), `Missing asset: ${path}`);
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `Broken section link: ${match[1]}`);
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
for (const item of data.items) {
  assert(item.id && !itemIds.has(item.id), 'Every item needs a unique ID'); itemIds.add(item.id);
  assert(item.title && item.price && item.description, `Item ${item.id} needs title, price and description`);
  assert(['available', 'reserved', 'sold'].includes(item.status), `Invalid status for ${item.id}`);
  if (item.photo) await checkPhoto(item.photo);
}
console.log(`Site checks passed: links, assets, JavaScript, ${data.apartment.photos.length} apartment photos, ${data.items.length} items.`);
const missing = ['monthlyRent', 'serviceCharges', 'availableFrom', 'size', 'rooms'].filter(key => !data.apartment[key]);
if (!data.contact.email && !data.contact.whatsapp) missing.push('contact details');
if (!data.apartment.photos.length) missing.push('apartment photos');
if (!data.items.length) missing.push('sale items');
if (missing.length) console.log(`Content still to add: ${missing.join(', ')}.`);
