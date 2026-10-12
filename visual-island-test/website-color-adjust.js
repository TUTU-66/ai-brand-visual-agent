/* Per-template colour fields; no geometry, content, source files or shared presets are mutated. */
(()=>{'use strict';
 const hex=v=>typeof v==='string'&&/^#[\da-f]{6}$/i.test(v)?v.toLowerCase():null;
 const lum=c=>[1,3,5].map(i=>{let v=parseInt(c.slice(i,i+2),16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 const on=c=>contrast(c,'#ffffff')>contrast(c,'#191a1e')?'#ffffff':'#191a1e';
 const readable=(fg,bg)=>contrast(fg,bg)>=4.5?fg:on(bg);
 const originals={
  shen:[['ice','首屏背景','#f5efe3'],['blue','品牌主色','#36415e'],['yellow','按钮点缀','#b88a44'],['aqua','浅色分区','#e6dcc7'],['paper','页面底色','#fbf8f2'],['ink','正文文字','#242631']],
  suye:[['purple','首屏与主色','#8a5ac7'],['lime','按钮点缀','#d8f56c'],['aqua','辅助分区','#6ad4d4'],['paper','页面底色','#f4f2ed'],['peach','浅色分区','#eeaa91'],['ink','正文文字','#1f2024']],
  zhou:[['heroStart','首屏起色','#f29f8d'],['heroEnd','首屏尾色','#d8b6dc'],['green','按钮主色','#8daa57'],['cream','页面底色','#f4eee6'],['pink','浅色分区','#f0b7b1'],['ink','正文文字','#181817'],['heroMid','首屏中间色','#efc1d8'],['lilac','辅助分区','#d9d9f4']],
  lin:[['brown','首屏与主色','#665b51'],['rose','点缀色','#ad8f85'],['cream','浅色分区','#f2ede6'],['white','页面底色','#fffdfa'],['ink','正文文字','#302f2d']]
 };
 const names={hero:'首屏背景',heroEnd:'首屏渐变尾色',brand:'品牌主色',accent:'按钮点缀',soft:'浅色分区',paper:'页面底色',ink:'正文文字',deep:'深色分区',surface:'卡片底色',secondary:'辅助分区'};
 function fields(t,p,css=''){
  if(p.roles){const keys=t.id==='zhou'?['hero','heroEnd','brand','soft','paper','ink','deep','secondary']:['hero','brand','accent','soft','paper','ink','deep',t.id==='suye'?'secondary':'surface'];return keys.filter(k=>hex(p.roles[k])).map(key=>({key,label:names[key],value:p.roles[key]}));}
  const vars=Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map(m=>[m[1],m[2].toLowerCase()]));
  if(t.id==='zhou'&&p.id!=='original'){const g=css.match(/\.melyssa-hero\{background:linear-gradient\([^}]+/);const colors=g?.[0].match(/#[\da-f]{6}/gi);if(colors?.length===3)[vars.heroStart,vars.heroMid,vars.heroEnd]=colors;}
  return originals[t.id].map(([key,label,v])=>({key,label,value:vars[key]||v}));
 }
 function clean(t,p,raw,css=''){const defs=fields(t,p,css),result={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return result;for(const f of defs){const value=hex(raw[f.key]);if(value&&value!==f.value.toLowerCase())result[f.key]=value;}return result;}
 function originalCss(t,v,o){let css=':root{'+Object.entries(o).filter(([k])=>!k.startsWith('hero')).map(([k,val])=>'--'+k+':'+val).join(';')+'}';
  if(t.id==='shen'){
   if(o.ice)css+=`.hero,.hero-copy .display,.hero-copy p,.hero .eyebrow{color:${readable(v.blue,v.ice)}}`;
   if(o.yellow)css+=`.btn:not(.blue):not(.outline),.phone-visual::after,.demo-phone-copy button,.phone-episode-link{color:${on(v.yellow)}}`;
   if(o.blue)css+=`.btn.blue,.freebie,.site-footer{color:${on(v.blue)}}.freebie p,.footer-grid p,.footer-grid a,.footer-bottom{color:${on(v.blue)}}`;
  }else if(t.id==='suye'){
   if(o.purple)css+=`.site-header,.charli-hero,.subhero,.site-footer{color:${on(v.purple)}}.site-header nav a:hover,.site-header nav a[aria-current=page],.site-footer .text-link{color:${readable(v.lime,v.purple)}}`;
   if(o.purple||o.lime)css+=`.scribble{color:${readable(v.lime,v.purple)}}`;
   if(o.lime)css+=`.header-cta,.button,.newsletter,.numbers{color:${on(v.lime)}}`;
   if(o.aqua)css+=`.wide-cta,.workshop .button{color:${readable(v.ink,v.aqua)}}`;
  }else if(t.id==='zhou'){
   if(o.heroStart||o.heroMid||o.heroEnd){const dark=contrast(v.ink,v.heroStart)>=4.5&&contrast(v.ink,v.heroMid)>=4.5&&contrast(v.ink,v.heroEnd)>=4.5;css+=`.melyssa-hero{background:linear-gradient(125deg,${v.heroStart},${v.heroMid} 45%,${v.heroEnd});color:${dark?v.ink:on(v.heroMid)}}`;}
   if(o.green)css+=`.header-cta,.button{color:${on(v.green)}}`;
  }else if(o.brown){css+=`.blair-hero,.subhero,.wide-cta{color:${on(v.brown)}}`;}
  return css;
 }
 function adjust(t,p,raw,baseCss){const defs=fields(t,p,baseCss),o=clean(t,p,raw,baseCss);if(!Object.keys(o).length)return p;const v=Object.fromEntries(defs.map(f=>[f.key,o[f.key]||f.value]));let css,readingRoles;
  if(p.roles){const r={...p.roles,...o};if(o.brand)r.onBrand=on(r.brand);if(o.accent)r.onAccent=on(r.accent);if(o.deep)r.onDeep=on(r.deep);if(o.hero||o.heroEnd)r.heroText=readable(r.heroText,r.hero);if(o.heroEnd&&contrast(r.heroText,r.heroEnd)<4.5)r.heroText=on(r.heroEnd);css=WebsitePaletteV2.css(t,{...p,roles:r});readingRoles={primary:r.brand,soft:r.soft,emphasis:r.accent,paper:r.paper};
  }else{css=baseCss+originalCss(t,v,o);if(t.id==='shen')readingRoles={primary:v.blue,soft:v.aqua,emphasis:v.yellow,paper:v.paper};else if(t.id==='suye')readingRoles={primary:v.purple,soft:v.peach,emphasis:v.lime,paper:v.paper};else if(t.id==='zhou')readingRoles={primary:v.green,soft:v.pink,emphasis:v.green,paper:v.cream};else readingRoles={primary:v.brown,soft:v.cream,emphasis:v.rose,paper:v.white};}
  return {...p,name:p.name+' · 自定义',colors:[...new Set(defs.map(f=>v[f.key]))],readingRoles,overrides:o,customCss:css};
 }
 function warnings(t,p,raw,css=''){const f=fields(t,p,css),v=Object.fromEntries(f.map(x=>[x.key,hex(raw?.[x.key])||x.value]));const paper=v.paper||v.white||v.cream,soft=v.soft||v.aqua||v.peach||v.cream;const issues=[];if(paper&&contrast(v.ink,paper)<4.5)issues.push('正文与页面底色');if(soft&&contrast(v.ink,soft)<4.5)issues.push('正文与浅色分区');if(v.heroStart&&[v.heroStart,v.heroMid,v.heroEnd].some(c=>contrast(v.ink,c)<4.5))issues.push('首屏渐变与文字');if(p.roles&&v.heroEnd){const fg=readable(p.roles.heroText,v.hero);if(contrast(fg,v.heroEnd)<4.5)issues.push('首屏渐变与文字');}return [...new Set(issues)];}
 window.WebsiteColorAdjust={fields,clean,adjust,warnings};
})();
