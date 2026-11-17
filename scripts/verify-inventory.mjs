import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../dist/',import.meta.url);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const manifest=JSON.parse(await readFile(new URL('content/inventory-manifest.json',root),'utf8'));
assert.equal(manifest.schemaVersion,1);
assert.equal(hash(await readFile(new URL('content/inventory.js',root))),manifest.catalogueSha256,'Catalogue differs from approved master export');
const approved=new Set();
for(const photo of manifest.photos){
 assert(/^photos\/items\/(?:thumbs\/)?[A-Z]{3}-\d{2}-\d{2}\.jpg$/.test(photo.path));
 assert(!approved.has(photo.path));approved.add(photo.path);
 assert.equal(hash(await readFile(new URL(photo.path,root))),photo.sha256,`Photo differs from approved master export: ${photo.path}`);
}
for(const file of await readdir(new URL('photos/items/',root),{recursive:true}))if(/\.jpe?g$/i.test(file))assert(approved.has('photos/items/'+file.replaceAll('\\','/')),`Unapproved orphan item photo: ${file}`);
console.log(`Approved export verified: catalogue hash and ${approved.size} selected photo files.`);
