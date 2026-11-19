import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join,extname} from 'node:path';

// Read every marker, including markers between progressive JPEG scans.
// Preserve compressed image data; removing metadata does not recompress pixels.
export function jpegParts(input){
 const bytes=Buffer.from(input),parts=[];
 assert(bytes.length>=4&&bytes[0]===255&&bytes[1]===216,'Invalid JPEG start');
 parts.push({marker:216,bytes:bytes.subarray(0,2)});
 let offset=2,ended=false;
 while(offset<bytes.length){
  const start=offset;assert.equal(bytes[offset++],255,'Invalid JPEG marker');
  while(bytes[offset]===255)offset++;
  assert(offset<bytes.length,'Truncated JPEG marker');
  const marker=bytes[offset++];
  assert(marker!==0&&marker!==216,'Unexpected JPEG marker');
  if(marker===217){parts.push({marker,bytes:bytes.subarray(start,offset)});ended=true;break;}
  if(marker===1||(marker>=208&&marker<=215)){parts.push({marker,bytes:bytes.subarray(start,offset)});continue;}
  assert(offset+2<=bytes.length,'Missing JPEG segment length');
  const length=bytes.readUInt16BE(offset);assert(length>=2&&offset+length<=bytes.length,'Invalid JPEG segment length');
  const payload=bytes.subarray(offset+2,offset+length);offset+=length;
  parts.push({marker,payload,bytes:bytes.subarray(start,offset)});
  if(marker===218){
   const scanStart=offset;
   while(offset<bytes.length){
    if(bytes[offset]!==255){offset++;continue;}
    let next=offset+1;while(bytes[next]===255)next++;
    assert(next<bytes.length,'Truncated JPEG scan');
    const code=bytes[next];
    if(code===0||(code>=208&&code<=215)){offset=next+1;continue;}
    break;
   }
   parts.push({marker:null,bytes:bytes.subarray(scanStart,offset)});
  }
 }
 assert(ended,'JPEG end marker missing');
 return {parts,trailingBytes:bytes.length-offset};
}
const isMetadata=marker=>(marker>=224&&marker<=239)||marker===254;
const safeJfif=part=>part.marker===224&&part.payload.length===14&&part.payload.subarray(0,5).equals(Buffer.from('JFIF\0'))&&part.payload[12]===0&&part.payload[13]===0;

export function assertCleanJpeg(bytes,label='JPEG'){
 const parsed=jpegParts(bytes);
 assert.equal(parsed.trailingBytes,0,`${label}: trailing data is not allowed`);
 for(const part of parsed.parts)if(isMetadata(part.marker))assert(safeJfif(part),`${label}: embedded metadata marker ${part.marker.toString(16)} is not allowed`);
 return parsed;
}
export function stripJpegMetadata(bytes){
 const {parts}=jpegParts(bytes);
 const clean=Buffer.concat(parts.filter(part=>!isMetadata(part.marker)||safeJfif(part)).map(part=>part.bytes));
 assertCleanJpeg(clean);return clean;
}
export function assertCleanSvg(bytes,label='SVG'){
 const source=bytes.toString('utf8');
 assert(/<svg\b/i.test(source),`${label}: invalid SVG`);
 assert(!/<metadata\b|<!--|<\?|\b(?:inkscape|sodipodi|rdf|exif|xmp):|xmlns:(?:inkscape|sodipodi|rdf|exif|xmp)\b/i.test(source),`${label}: embedded SVG/editor metadata is not allowed`);
}
export async function auditImageTree(root){
 const checked=[];
 for(const entry of await readdir(root,{recursive:true,withFileTypes:true})){
  if(!entry.isFile())continue;
  const path=join(entry.parentPath??entry.path,entry.name),extension=extname(entry.name).toLowerCase();
  if(!['.jpg','.jpeg','.svg','.png','.webp','.gif','.heic','.heif','.avif','.ico','.tif','.tiff','.bmp'].includes(extension))continue;
  const bytes=await readFile(path);
  if(['.jpg','.jpeg'].includes(extension))assertCleanJpeg(bytes,path);
  else if(extension==='.svg')assertCleanSvg(bytes,path);
  else assert.fail(`${path}: image format needs an explicit metadata review/check before publication`);
  checked.push(path);
 }
 return checked;
}
