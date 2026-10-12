/* Canonical template adapters. Same code runs in the browser and in downloaded packages. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./color-system.js'));else root.TemplateRenderer=factory(root.WechatColorSystem);})(globalThis,function(Colors){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const node=(tag,cls,children=[],attrs={})=>({tag,attrs:{...(cls?{class:cls}:{}),...attrs},children});
const rich=s=>String(s??'').split(/(\*\*[^*]+\*\*|\n)/g).filter(Boolean).map(v=>v==='\n'?node('br',''):v.startsWith('**')?node('b','',[v.slice(2,-2)]):v);
const role=n=>typeof n==='object'?n.attrs?.['data-role']:null;
const walk=(n,f)=>{if(!n||typeof n==='string')return;f(n);for(const child of n.children||[])walk(child,f);};
const raster=s=>typeof s==='string'&&s.length<=4200000&&/^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(s);
function create(data){
 const ID=data.id,defaults=data.defaults,F=data.family;
 function normalize(raw={}){
  const x={...defaults};for(const k of Object.keys(defaults))if(Object.hasOwn(raw,k))x[k]=raw[k];
  for(const k of ['primary','soft','emphasis','paper']){if(!/^#[0-9a-f]{6}$/i.test(x[k]))throw Error('颜色格式不正确：'+k);x[k]=x[k].toLowerCase();}
  for(const [k,lo,hi] of [['titleSize',20,37],['headingSize',16,32]])if(!Number.isInteger(x[k])||x[k]<lo||x[k]>hi)throw Error('字号超出范围：'+k);
  if(![400,500,600,700,800].includes(x.titleWeight))throw Error('不支持的字重');
  for(const k of ['subtitle','numbers','decor','captions'])if(typeof x[k]!=='boolean')throw Error('开关类型不正确');
  if(!['normal','compact','airy'].includes(x.density)||!['original','color','underline'].includes(x.emphasisMode))throw Error('阅读设置不正确');
  for(const k of ['endingTitle','endingNote','signature'])if(typeof x[k]!=='string'||x[k].length>160)throw Error('结尾字段应为160字以内文字');
  if(x.qr&&!raster(x.qr))throw Error('二维码仅支持嵌入PNG、JPEG、WebP');
  return x;
 }
 function profile(x){return {schema:'mengyu-wechat-template-style/v3',templateId:ID,baseStyle:{id:ID,name:data.name},renderer:'shared-renderer.js',settings:normalize(x),colorRoles:Colors.resolve(ID,normalize(x)),boundary:{wechatConnection:false,autoPublish:false,imageGeneration:false},mediaPolicy:{missing:'omit',newArticleLayout:'single-or-equal-pair',previewPlaceholdersOnly:true}};}
 function validate(a){
  if(!a||typeof a.title!=='string'||!a.title.trim()||a.title.length>300||!Array.isArray(a.sections)||a.sections.length>30)throw Error('需要标题和sections数组');
  const text=v=>{if(v!=null&&(typeof v!=='string'||v.length>30000))throw Error('文字字段不正确')};
  const im=v=>{if(v?.src&&!raster(v.src))throw Error('图片请先用CLI从文章目录读取');text(v?.caption);text(v?.alt);};
  ['subtitle','kicker','word','closing'].forEach(k=>text(a[k]));
  if(a.intro!=null&&!Array.isArray(a.intro))throw Error('intro应为数组');
  (a.intro||[]).forEach(p=>text(p.text));im(a.heroImage);
  a.sections.forEach(sec=>{text(sec.title);text(sec.label);if(!Array.isArray(sec.blocks)||sec.blocks.length>200)throw Error('blocks应为数组');
   sec.blocks.forEach(b=>{if(!['paragraph','quote','statement','list','image','images'].includes(b.type))throw Error('未知内容块');
    if(b.type==='images'){if(!Array.isArray(b.items)||b.items.length>9)throw Error('图片组最多9张');b.items.forEach(im);}
    else if(b.type==='image')im(b);else if(b.type==='list'){if(!Array.isArray(b.items)||b.items.length>50)throw Error('列表过长');b.items.forEach(i=>{text(i.title);text(i.text)});}
    else text(b.text);
   });
  });
 }
 function prepare(n,x,cal){
  if(typeof n==='string')return esc(n);
  const r=role(n),cls=n.attrs?.class||'';
  if((r==='subtitle'&&!x.subtitle)||(r==='number'&&!x.numbers)||(r==='decor'&&!x.decor)||(r==='caption'&&!x.captions))return '';
  if(r==='qrgroup'&&!cal&&!x.qr)return x.signature?'<p class="personal-signature">'+esc(x.signature)+'</p>':'';
  if(r==='qr'&&x.qr)return '<img class="personal-qr" src="'+esc(x.qr)+'" alt="用户自己的二维码">';
  if(r==='qr'&&!cal)return '';
  let children=n.children||[];
  if(r==='endingTitle')children=[x.endingTitle];
  if(r==='endingNote')children=[x.endingNote];
  if(r==='partlabel'&&!x.numbers)children=[children.join('').replace(/^PART\s*\d+\s*(?:\/\s*)?/i,'')];
  const attrs=Object.entries(n.attrs||{}).filter(([k])=>!/^on/i.test(k)).map(([k,v])=>' '+k+'="'+esc(v)+'"').join('');
  if(['img','br','hr'].includes(n.tag))return '<'+n.tag+attrs+'>';
  const signature=n.attrs?.['data-role-copy']==='ending'&&x.signature?'<p class="personal-signature">'+esc(x.signature)+'</p>':'';
  return '<'+n.tag+attrs+'>'+children.map(c=>prepare(c,x,cal)).join('')+signature+'</'+n.tag+'>';
 }
 function liveTree(a){
  const recipes=data.recipes,root=clone(recipes.root);root.children=[];
  const classes=n=>(n.attrs?.class||'').split(/\s+/);
  const fill=(n,r,value)=>walk(n,e=>{if(role(e)===r)e.children=rich(value)});
  const filter=(n,pred)=>{if(!n||typeof n==='string')return n;n.children=(n.children||[]).filter(c=>typeof c==='string'||pred(c)).map(c=>filter(c,pred));return n;};
  const media=im=>im?.src?node('figure','portable-media',[
   node('div','portable-image',[node('img','',[],{src:im.src,alt:im.alt||''})],{'data-captioned':im.caption?'true':'false'}),
   ...(im.caption?[node('figcaption','',rich(im.caption),{'data-role':'caption'})]:[]) ]):null;
  const hero=clone(recipes.hero);
  filter(hero,e=>!['image','caption'].includes(role(e))&&!classes(e).some(c=>['lead','topline','opening-en','opening-slogan','emphasis-marker'].includes(c)));
  fill(hero,'title',a.title);fill(hero,'subtitle',a.subtitle||'');
  walk(hero,e=>{
   if(classes(e).some(c=>['kicker','eyebrow','article-kicker'].includes(c)))e.children=rich(a.kicker||'');
   if(classes(e).includes('hero-word'))e.children=rich(a.word||'');
   if(e.tag==='h1'&&F==='purple'){const parts=a.title.split('\n');e.children=parts.map((p,i)=>node(i?'em':'span','',rich(p)));}
  });
  filter(hero,e=>!['subtitle'].includes(role(e))||!!a.subtitle);
  filter(hero,e=>!(classes(e).some(c=>['kicker','eyebrow','article-kicker','hero-word'].includes(c))&&!e.children.length));
  if(a.heroImage?.src)hero.children.push(media(a.heroImage));root.children.push(hero);
  if(a.intro?.length){const ps=a.intro.filter(p=>p.text?.trim()).map(p=>node('p',p.lead?'lead':'',rich(p.text)));
   if(ps.length)root.children.push(node('section',F==='green'?'live-intro':F==='legacy'?'article-section':F==='purple'?'opening':'intro',ps));}
  const block=b=>{
   if(b.type==='image')return media(b);
   if(b.type==='images'){const items=b.items.filter(i=>i.src),out=[];for(let i=0;i<items.length;i+=2){const chunk=items.slice(i,i+2);out.push(chunk.length===1?media(chunk[0]):node('div','portable-pair',chunk.map(media)));}return out;}
   if(b.type==='list'){
    if(!b.items.length)return null;
    if(F==='green')return node('div','index-list',b.items.map((li,i)=>node('div','item',[node('div','num',[String(i+1).padStart(2,'0')]),node('div','copy',[node('strong','',rich(li.title)),node('span','',rich(li.text))])])));
    if(F==='legacy')return node('section','list',b.items.map((li,i)=>node('div','',[node('span','',[String(i+1).padStart(2,'0')]),node('p','',[node('b','',rich(li.title)),node('small','',rich(li.text))])])));
    return node('ol','role-list',b.items.map((li,i)=>node('li','',[node('b','',[String(i+1).padStart(2,'0')]),node('div','',[node('strong','',rich(li.title)),node('p','',rich(li.text))])])));
   }
   if(!b.text?.trim())return null;
   if(b.type==='quote'){
    const q=clone(recipes.quote)||node('blockquote','');q.children=rich(b.text);
    return F==='green'?node('div','quote-note',[q]):q;
   }
   const p=node('p',b.type==='statement'?(F==='purple'?'key-sentence':'statement'):F==='green'?'body':'',rich(b.text));
   return F==='legacy'?node('section','article-section',[p]):p;
  };
  a.sections.forEach((sec,i)=>{
   const blocks=sec.blocks.flatMap(b=>block(b)||[]);if(!blocks.length)return;
   let head=clone(recipes.chapterHead);
   if(F==='legacy'){head.children=head.children.filter(c=>typeof c==='string'||!classes(c).includes('article-section'));}
   if(sec.title){fill(head,'heading',sec.title);
    walk(head,e=>{
     if(role(e)==='number')e.children=[F==='green'?'PART '+String(i+1).padStart(2,'0'):String(i+1).padStart(2,'0')];
     if(role(e)==='partlabel')e.children=['PART '+String(i+1).padStart(2,'0')+(sec.label?' / '+sec.label:'')];
     if((e.tag==='p'||e.tag==='small')&&!role(e))e.children=rich(sec.label||'');
     if(classes(e).includes('hint'))e.children=rich(sec.label||'');
    });
   }else head=null;
   if(F==='green'){if(head)root.children.push(head);root.children.push(node('section','chapter-card',blocks));}
   else if(F==='legacy'){if(head)root.children.push(head);root.children.push(...blocks);}
   else root.children.push(node('section','chapter'+(F==='editorial'?' chapter-'+Math.min(i+1,4):''),[...(head?[head]:[]),...blocks]));
  });
  const ending=clone(recipes.ending);
  filter(ending,e=>!['image'].includes(role(e))&&!classes(e).some(c=>['ghost','ending-en','slash'].includes(c))&&!(F==='purple'&&e.tag==='small'));
  walk(ending,e=>{if(classes(e).includes('ending-copy'))e.children=rich(a.closing||'');});
  if((F==='green'||F==='legacy')&&a.closing)root.children.push(node('p',F==='green'?'body':'article-lead',rich(a.closing)));
  root.children.push(ending);
  return root;
 }
 function styles(base,x,cal){
  const changed=k=>x[k]!==defaults[k];
  let css=base;
  if(changed('titleSize'))css+='#article h1{font-size:'+x.titleSize+'px!important}';
  if(changed('titleWeight'))css+='#article h1,#article h1 em,#article h1 span{font-weight:'+x.titleWeight+'!important}';
  if(changed('headingSize'))css+='#article h2{font-size:'+x.headingSize+'px!important}';
  if(!x.numbers&&F==='editorial')css+='#article .section-head{grid-template-columns:1fr}';
  if(!x.numbers&&F==='legacy')css+='#article .chapter{grid-template-columns:1fr}';
  if(x.numbers&&!defaults.numbers)css+='#article [data-role=number]{display:inline-block!important}';

  if(x.density!=='normal')css+='#article .chapter>p,#article .article-section>p,#article .body,#article .intro>p{line-height:'+(x.density==='airy'?2.08:1.78)+'!important;margin-bottom:'+(x.density==='airy'?28:16)+'px}';
  if(!x.decor){
   css+='#article .hero:before,#article .hero:after,#article .intro:before,#article .intro:after,#article .chapter:before,#article .chapter:after,#article .ending:before,#article .ending:after,#article .eyebrow:before,#article .eyebrow:after,#article .section-head:before,#article .section-head:after,#article h1:before,#article h1:after{content:none!important}';
   if(F==='editorial'||F==='purple')css+='#article .intro{padding-bottom:32px}#article .chapter{padding-top:28px;padding-bottom:38px}#article .section-head,#article .chapter-head{margin-bottom:28px}';
   if(F==='green')css+='#article .chapter-title{padding-top:34px}#article .chapter-card{margin-top:22px}';
   if(F==='legacy')css+='#article .chapter{margin-top:28px}#article .article-hero{padding-bottom:22px}';
  }
  css+='#article [data-role=caption]{font-size:11px!important;line-height:1.6!important;text-align:center!important;text-align-last:center!important;margin:8px 0 24px!important;padding:0!important;overflow-wrap:anywhere}';
  if(x.captions)css+='#article [data-captioned=true]{margin-bottom:0!important}#article .media:has(> [data-role=caption]){row-gap:0}';
  css+='#article .personal-qr{display:block;flex:0 0 76px;width:76px;height:76px;object-fit:contain;background:#fff}#article .personal-signature{font-size:11px;line-height:1.6;margin:10px 0 0;overflow-wrap:anywhere}#article [data-role=endingTitle],#article [data-role=endingNote]{overflow-wrap:anywhere}#article h1,#article h2{overflow-wrap:anywhere}';
  css+='#article .portable-media{margin:28px 0;min-width:0}#article .portable-image img{display:block;width:100%;height:auto;max-height:440px;object-fit:contain}#article .portable-pair{display:grid;grid-template-columns:1fr 1fr;gap:9px;align-items:start}#article .portable-pair .portable-media{margin-top:24px}#article .live-intro{padding:24px 8px}#article .live-intro p{font-size:14px;line-height:1.86}';
  if(!cal)css+='#article .hero,#article .poster-hero{min-height:0}#article .hero:after{height:auto}#article .chapter-2 .media-pair:after{content:none}#article .qr-group-centered{max-width:100%}';
  // One 343px article, no stage frame and no references outside the portable package.
  css+='html,body{margin:0!important;padding:0!important;min-height:0!important;height:auto!important;overflow:visible!important;background:transparent!important}body:before,body:after{display:none!important}#article{width:343px!important;max-width:343px!important;margin:0!important;transform:none!important}';
  return css+Colors.css(ID,x);
 }
 function render(a,raw,base,options={}){
  validate(a);const x=normalize(raw),cal=options.calibration===true;
  if(cal&&a.calibrationTemplate!==ID)throw Error('校准样稿不属于此模板');
  const tree=cal?data.tree:liveTree(a),article=prepare(tree,x,cal),css=styles(base,x,cal);
  return {article,css,html:'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(a.title)+'</title><style>'+css+'</style></head><body'+(data.bodyStyle?' data-style="'+data.bodyStyle+'"':'')+'>'+article+'</body></html>'};
 }
 return {ID,defaults,normalize,profile,render,raster};
}
return {create};
});
