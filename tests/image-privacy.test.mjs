import test from 'node:test';
import assert from 'node:assert/strict';
import {jpegParts,assertCleanJpeg,stripJpegMetadata,assertCleanSvg} from '../scripts/image-privacy.mjs';
const marker=(id,payload)=>{const header=Buffer.from([255,id,0,0]);header.writeUInt16BE(payload.length+2,2);return Buffer.concat([header,payload]);};
const jfif=marker(224,Buffer.from('4a46494600010100000100010000','hex'));
const start=Buffer.from([255,216]),end=Buffer.from([255,217]);
const plain=Buffer.concat([start,jfif,marker(218,Buffer.alloc(0)),Buffer.from([13,255,0,22,255,208,31]),end]);

test('clean JPEG permits only JFIF technical headers and scan data',()=>{assertCleanJpeg(plain);assert.deepEqual(stripJpegMetadata(plain),plain);});
test('reject and strip EXIF, XMP, ICC, IPTC, comments and unknown application data',()=>{
 for(const id of [225,226,237,238,239,254]){
  const dirty=Buffer.concat([start,marker(id,Buffer.from('private-data')),plain.subarray(2)]);
  assert.throws(()=>assertCleanJpeg(dirty),/metadata/);assert.deepEqual(stripJpegMetadata(dirty),plain);
 }
});
test('metadata hidden between progressive scans is checked and removed',()=>{
 const dirty=Buffer.concat([plain.subarray(0,-2),marker(225,Buffer.from('hidden-exif')),marker(218,Buffer.alloc(0)),Buffer.from([44,55]),end]);
 assert.throws(()=>assertCleanJpeg(dirty),/metadata/);
 const clean=stripJpegMetadata(dirty);assertCleanJpeg(clean);
 assert.deepEqual(jpegParts(clean).parts.filter(p=>p.marker===null).map(p=>[...p.bytes]),[[13,255,0,22,255,208,31],[44,55]]);
});
test('embedded JFIF thumbnails and data after end marker cannot pass',()=>{
 const thumbnail=Buffer.concat([start,marker(224,Buffer.concat([Buffer.from('4a46494600010100000100010101','hex'),Buffer.from([1,2,3])])),end]);
 assert.throws(()=>assertCleanJpeg(thumbnail),/metadata/);assertCleanJpeg(stripJpegMetadata(thumbnail));
 const trailing=Buffer.concat([plain,Buffer.from('private trailer')]);assert.throws(()=>assertCleanJpeg(trailing),/trailing/);assert.deepEqual(stripJpegMetadata(trailing),plain);
});
test('malformed JPEG lengths and missing end markers fail closed',()=>{
 for(const bytes of [plain.subarray(0,-2),Buffer.from([255,216,255,225,255,255,255,217]),Buffer.from('not-jpeg')])assert.throws(()=>assertCleanJpeg(bytes));
});
test('SVG allows intended artwork labels, rejects hidden/editor metadata',()=>{
 assertCleanSvg(Buffer.from('<svg><title>Apartment layout</title><text>Living room</text></svg>'));
 for(const text of ['<svg><metadata>private</metadata></svg>','<svg><!-- creator --></svg>','<svg xmlns:inkscape="editor"/>'])assert.throws(()=>assertCleanSvg(Buffer.from(text)),/metadata/);
});
