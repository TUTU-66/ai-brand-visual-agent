(function(global){
  'use strict';
  const encoder=new TextEncoder();
  const crcTable=(()=>{const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xEDB88320^(c>>>1):c>>>1;table[n]=c>>>0}return table})();
  function bytes(value){
    if(value instanceof Uint8Array)return value;
    if(value instanceof ArrayBuffer)return new Uint8Array(value);
    if(ArrayBuffer.isView(value))return new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
    return encoder.encode(String(value));
  }
  function crc32(data){let c=0xFFFFFFFF;for(const b of data)c=crcTable[(c^b)&0xFF]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
  function dosDateTime(date=new Date()){
    const year=Math.max(1980,date.getFullYear());
    return{time:(date.getHours()<<11)|(date.getMinutes()<<5)|(date.getSeconds()>>1),date:((year-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate()};
  }
  function u16(view,offset,value){view.setUint16(offset,value,true)}
  function u32(view,offset,value){view.setUint32(offset,value>>>0,true)}
  async function normalize(file){
    let data=file.data;
    if(data instanceof Blob)data=new Uint8Array(await data.arrayBuffer());
    return{path:String(file.path).replace(/^\/+/,''),data:bytes(data),date:file.date||new Date()};
  }
  async function buildZip(files){
    const normalized=[];for(const file of files)normalized.push(await normalize(file));
    const localParts=[],centralParts=[];let offset=0;
    for(const file of normalized){
      const name=encoder.encode(file.path),data=file.data,crc=crc32(data),stamp=dosDateTime(file.date);
      const local=new Uint8Array(30+name.length),lv=new DataView(local.buffer);
      u32(lv,0,0x04034b50);u16(lv,4,20);u16(lv,6,0x0800);u16(lv,8,0);u16(lv,10,stamp.time);u16(lv,12,stamp.date);u32(lv,14,crc);u32(lv,18,data.length);u32(lv,22,data.length);u16(lv,26,name.length);u16(lv,28,0);local.set(name,30);
      localParts.push(local,data);
      const central=new Uint8Array(46+name.length),cv=new DataView(central.buffer);
      u32(cv,0,0x02014b50);u16(cv,4,0x0314);u16(cv,6,20);u16(cv,8,0x0800);u16(cv,10,0);u16(cv,12,stamp.time);u16(cv,14,stamp.date);u32(cv,16,crc);u32(cv,20,data.length);u32(cv,24,data.length);u16(cv,28,name.length);u16(cv,30,0);u16(cv,32,0);u16(cv,34,0);u16(cv,36,0);u32(cv,38,0);u32(cv,42,offset);central.set(name,46);centralParts.push(central);
      offset+=local.length+data.length;
    }
    const centralSize=centralParts.reduce((n,p)=>n+p.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer);
    u32(ev,0,0x06054b50);u16(ev,4,0);u16(ev,6,0);u16(ev,8,normalized.length);u16(ev,10,normalized.length);u32(ev,12,centralSize);u32(ev,16,offset);u16(ev,20,0);
    return new Blob([...localParts,...centralParts,end],{type:'application/zip'});
  }
  async function downloadZip(name,files){
    const blob=await buildZip(files),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=name.endsWith('.zip')?name:`${name}.zip`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);return blob;
  }
  async function fetchBinary(url){const response=await fetch(url);if(!response.ok)throw new Error(`资源读取失败 ${response.status}: ${url}`);return new Uint8Array(await response.arrayBuffer())}
  async function fetchText(url){const response=await fetch(url);if(!response.ok)throw new Error(`文本读取失败 ${response.status}: ${url}`);return response.text()}
  function json(value){return JSON.stringify(value,null,2)+'\n'}
  function sanitizeName(value,fallback='结果包'){return String(value||fallback).trim().replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,'-').slice(0,60)||fallback}
  global.PortablePackage={buildZip,downloadZip,fetchBinary,fetchText,json,sanitizeName};
})(window);
