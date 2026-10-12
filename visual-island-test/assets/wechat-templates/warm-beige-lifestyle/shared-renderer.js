/* One renderer for the editor and portable package. No network or dependencies. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory((()=>{try{return require('./color-system.js')}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;return require('../shared/color-system.js')}})());else root.BeigeRenderer=factory(root.WechatColorSystem);})(typeof globalThis!=='undefined'?globalThis:this,function(Colors){
'use strict';
const ID='warm-beige-lifestyle';
const defaults={primary:'#6d4d27',soft:'#efe1cf',emphasis:'#9f7442',paper:'#ffffff',titleSize:29,titleWeight:400,headingSize:21,subtitle:true,numbers:true,density:'normal',emphasisMode:'original',decor:true,captions:false,endingTitle:'扫码查看完整内容',endingNote:'二维码位置 · 替换为用户自己的链接',signature:'',qr:''};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=s=>esc(s).replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
const raster=s=>typeof s==='string'&&s.length<=4200000&&/^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(s);
function normalize(raw={}){
 const x={...defaults}; for(const k of Object.keys(defaults))if(Object.hasOwn(raw,k))x[k]=raw[k];
 for(const k of ['primary','soft','emphasis','paper'])if(!/^#[0-9a-f]{6}$/i.test(x[k]))throw Error('颜色格式不正确：'+k);
 for(const [k,lo,hi] of [['titleSize',27,31],['headingSize',19,23]])if(!Number.isInteger(x[k])||x[k]<lo||x[k]>hi)throw Error('字号超出微调范围：'+k);
 if(![400,500,600].includes(x.titleWeight))throw Error('标题字重不支持');
 if(!['normal','compact','airy'].includes(x.density)||!['original','color','underline'].includes(x.emphasisMode))throw Error('不支持的阅读设置');
 for(const k of ['subtitle','numbers','decor','captions'])if(typeof x[k]!=='boolean')throw Error('开关类型不正确');
 for(const k of ['endingTitle','endingNote','signature'])if(typeof x[k]!=='string'||x[k].length>160)throw Error('结尾文字过长或格式不正确');
 if(x.qr&&!raster(x.qr))throw Error('二维码仅支持本地PNG、JPEG、WebP图片');
 return x;
}
function validate(a){
 if(!a||typeof a.title!=='string'||!a.title.trim())throw Error('文章需要非空 title');
 if(a.title.length>300||!Array.isArray(a.sections)||a.sections.length>30)throw Error('文章章节格式不正确');
 const str=v=>{if(v!=null&&(typeof v!=='string'||v.length>30000))throw Error('文字字段格式不正确');};
 ['kicker','subtitle','word','closing'].forEach(k=>str(a[k]));
 if(a.intro!=null&&!Array.isArray(a.intro))throw Error('intro 应为数组');
 (a.intro||[]).forEach(p=>str(p.text));
 const im=x=>{if(x&&x.src&&!raster(x.src))throw Error('配图需要本地嵌入图片；请先由CLI读取input目录中的图片');if(x){str(x.caption);str(x.alt);}};
 im(a.heroImage);
 a.sections.forEach(s=>{str(s.title);str(s.label);if(!Array.isArray(s.blocks)||s.blocks.length>200)throw Error('blocks 应为数组');
  s.blocks.forEach(b=>{if(!['paragraph','quote','statement','list','image','images'].includes(b.type))throw Error('未知内容块：'+b.type);
   if(b.type==='list'){if(!Array.isArray(b.items)||b.items.length>50)throw Error('列表不正确');b.items.forEach(i=>{str(i.title);str(i.text);});}
   else if(b.type==='image')im(b);
   else if(b.type==='images'){if(!Array.isArray(b.items)||b.items.length>9)throw Error('图片组最多9张');b.items.forEach(im);}
   else str(b.text);
  });
 });
}
function profile(raw){return {schema:'mengyu-wechat-template-style/v3',templateId:ID,baseStyle:{id:ID,name:'暖米生活美学'},renderer:'shared-renderer.js',settings:normalize(raw),colorRoles:Colors.resolve(ID,normalize(raw)),boundary:{wechatConnection:false,autoPublish:false,imageGeneration:false},mediaPolicy:{missing:'omit',newArticleLayout:'single-or-equal-pair',previewPlaceholdersOnly:true}};}
function css(base,x){
 let extra='body[data-style="s4"] h1{font-size:'+x.titleSize+'px;font-weight:'+x.titleWeight+'}body[data-style="s4"] .section-head h2{font-size:'+x.headingSize+'px}';




 if(x.density!=='normal'){const airy=x.density==='airy';extra+='body[data-style="s4"] .intro>p,body[data-style="s4"] .chapter>p:not(.statement){line-height:'+(airy?'2.05':'1.8')+';margin-bottom:'+(airy?28:18)+'px}body[data-style="s4"] .chapter{padding-top:'+(airy?48:36)+'px;padding-bottom:'+(airy?70:54)+'px}';}

 if(!x.decor){
  const spacing={normal:[28,40],compact:[24,36],airy:[34,48]}[x.density];
  extra+='body[data-style="s4"] .chapter:before,body[data-style="s4"] h1:before,body[data-style="s4"] h1:after,body[data-style="s4"] .intro:after{content:none}body[data-style="s4"] .intro{padding-bottom:40px}body[data-style="s4"] .chapter{padding-top:'+spacing[0]+'px;padding-bottom:'+spacing[1]+'px}body[data-style="s4"] .section-head{margin-bottom:28px}';
 }
 extra+='.media-real:before,.media-real:after{display:none}.media-real img{display:block;width:100%;height:100%;object-fit:cover}.media-caption{font-size:11px!important;line-height:1.6!important;color:#777;text-align:center!important;padding:6px 0!important;margin:0 0 20px!important}.qr-real{display:block;flex:0 0 76px;width:76px;height:76px;object-fit:contain;background:#fff}.qr-panel .personal-signature{font-size:11px;line-height:1.6;margin-top:10px}.qr-panel b,.qr-panel p{overflow-wrap:anywhere}.no-qr{text-align:center}.live-gallery{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:30px 0}.live-gallery .media-placeholder{height:220px}.section-head h2,h1{overflow-wrap:anywhere}';
 extra+='body[data-style="s4"] .has-caption{margin-bottom:0!important}body[data-style="s4"] .article .media-caption{font-size:11px!important;line-height:1.6!important;text-align:center!important;text-align-last:center!important;padding:0!important;margin:8px 0 24px!important;overflow-wrap:anywhere}body[data-style="s4"] .live-gallery .media-caption{margin-bottom:0!important}';
 return base+'\n/* Personal micro-adjustments. Baseline geometry remains canonical. */\n'+extra+Colors.css(ID,x);
}
function render(a,raw,base,options={}){
 validate(a);const x=normalize(raw),cal=options.calibration===true;
 const cap=im=>x.captions&&im?.caption?'<p class="media-caption">'+rich(im.caption)+'</p>':'';
 function media(im,cls='',includeCaption=true){
  if(!im?.src&&!cal)return '';
  const caption=includeCaption?cap(im):'';
  return '<div class="media-placeholder '+cls+(im?.src?' media-real':'')+(caption?' has-caption':'')+'">'+(im?.src?'<img src="'+esc(im.src)+'" alt="'+esc(im.alt||'')+'">':'<span>图片位置</span>')+'</div>'+caption;
 }
 function block(b){
  if(b.type==='image')return media(b,'media-single');
  if(b.type==='images'){
   if(cal){const v=['media-pair','media-stack','media-pair final-pair'].includes(b.variant)?b.variant:'media-pair';const caption=cap({caption:b.items.map(im=>im.caption).filter(Boolean).join(' / ')});return '<div class="'+v+(caption?' has-caption':'')+'">'+b.items.map((im,i)=>media(im,v==='media-stack'?['media-wide','media-small','media-tall'][i]||'':'',false)).join('')+'</div>'+caption;}
   const items=b.items.filter(im=>im.src);let out='';
   for(let i=0;i<items.length;i+=2){const pair=items.slice(i,i+2);out+=pair.length===1?media(pair[0],'media-single'):'<div class="live-gallery">'+pair.map(im=>'<div>'+media(im)+'</div>').join('')+'</div>';}return out;
  }
  if(b.type==='list')return b.items.length?'<ol class="role-list">'+b.items.map((li,i)=>'<li><b>'+String(i+1).padStart(2,'0')+'</b><div><strong>'+rich(li.title)+'</strong><p>'+rich(li.text)+'</p></div></li>').join('')+'</ol>':'';
  if(!b.text?.trim())return '';
  return b.type==='quote'?'<blockquote>'+rich(b.text)+'</blockquote>':'<p'+(b.type==='statement'?' class="statement"':'')+'>'+rich(b.text)+'</p>';
 }
 const hero='<header class="hero"><div class="topline"><span>设计与协作</span><span>DESIGN</span></div>'+(a.kicker?'<p class="kicker">'+rich(a.kicker)+'</p>':'')+'<h1>'+rich(a.title)+'</h1>'+(x.subtitle&&a.subtitle?'<p class="subtitle">'+rich(a.subtitle)+'</p>':'')+(a.word?'<div class="hero-word" aria-hidden="true">'+rich(a.word)+'</div>':'')+media(a.heroImage,'hero-media')+'</header>';
 const intro=(a.intro||[]).filter(p=>p.text?.trim()).map(p=>'<p'+(p.lead?' class="lead"':'')+'>'+rich(p.text)+'</p>').join('');
 const chapters=a.sections.map((s,i)=>{
  const content=s.blocks.map(block).join('');if(!content)return '';
  const head=s.title?'<header class="section-head">'+(x.numbers?'<span class="index">'+String(i+1).padStart(2,'0')+'</span>':'')+'<div>'+(s.label?'<p>'+rich(s.label)+'</p>':'')+'<h2>'+rich(s.title)+'</h2></div></header>':'';
  return '<section class="chapter chapter-'+Math.min(i+1,4)+'">'+head+content+'</section>';
 }).join('');
 // Placeholder QR is for the calibration view only. Never invent a user's contact asset.
 const qr=x.qr?'<img class="qr-real" src="'+esc(x.qr)+'" alt="用户提供的二维码">':cal?'<div class="qr-placeholder unified-qr-block" aria-label="二维码占位，不可扫码">二维码占位</div>':'';
 const endingText=(qr&&x.endingTitle?'<b>'+esc(x.endingTitle)+'</b>':'')+(qr&&x.endingNote?'<p>'+esc(x.endingNote)+'</p>':'')+(x.signature?'<p class="personal-signature">'+esc(x.signature)+'</p>':'');
 const ending=(a.closing||qr||endingText)?'<footer class="ending">'+(a.closing?'<p class="ending-copy">'+rich(a.closing)+'</p>':'')+((qr||endingText)?'<div class="qr-panel qr-group-centered'+(!qr?' no-qr':'')+'">'+qr+'<div>'+endingText+'</div></div>':'')+'</footer>':'';
 const article='<article class="article" id="article">'+hero+(intro?'<section class="intro">'+intro+'</section>':'')+chapters+ending+'</article>';
 const styles=css(base,x);
 return {article,css:styles,html:'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(a.title.replace(/\n/g,''))+'</title><style>'+styles+'</style></head><body data-style="s4">'+article+'</body></html>'};
}
return {ID,defaults,normalize,profile,render,raster};
});
