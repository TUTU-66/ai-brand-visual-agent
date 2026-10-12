(function(global){
 'use strict';
 const pages=[['index.html','首页'],['about.html','人物介绍'],['programs.html','课程与服务'],['program-detail.html','课程详情'],['content.html','内容列表'],['article.html','文章详情'],['contact.html','联系与预约']];
 const list=[
  {id:'shen',name:'沈知微',title:'职场表达与训练营',desc:'清晰的课程展示，温暖而有分量',source:'references/amy-porterfield-20261010/prototype/',palettes:[
   {id:'original',name:'墨蓝麦金',note:'原配色 · 沉稳温暖',colors:['#36415e','#b88a44','#f5efe3','#e6dcc7']},
   {id:'forest',name:'松绿奶油',note:'安静自然，亲切可信',colors:['#344b43','#c4a569','#f1f0e5','#dae2d7']},
   {id:'wine',name:'梅棕玫瑰',note:'柔和细腻，保留专业感',colors:['#62434c','#cbac91','#f5ebeb','#e8d8db']},
   {id:'clay',name:'陶土燕麦',note:'暖调质朴，舒展耐看',colors:['#754c3b','#d0b889','#f6eee3','#e9d8c6']}]},
  {id:'suye',name:'苏野',title:'内容创作者与知识产品',desc:'鲜明的拼贴与色彩，多种内容有序展开',source:'references/personal-ip-trio-20261010/charli-su-ye/',palettes:[
   {id:'original',name:'紫藤青柠',note:'原配色 · 轻快鲜明',colors:['#8a5ac7','#d8f56c','#6ad4d4','#f4f2ed']},
   {id:'forest',name:'苔绿杏黄',note:'自然与活力的平衡',colors:['#3b6455','#f1d685','#b5d2c5','#f5f2e9']},
   {id:'ink',name:'靛蓝蜜桃',note:'清爽理性，一点温暖',colors:['#465b83','#f4be9f','#a7c9d4','#f3f2ec']},
   {id:'rose',name:'莓红浅杏',note:'温暖明快，更有亲和力',colors:['#855266','#f3d29a','#c5d5c1','#f7f1eb']}]},
  {id:'zhou',name:'周慕白',title:'咨询与个人成长',desc:'柔和渐变与叙事留白，适合深度服务',source:'references/personal-ip-trio-20261010/melyssa-zhou-mubai/',palettes:[
   {id:'original',name:'霞粉鼠尾草',note:'原配色 · 柔和舒展',colors:['#f0b7b1','#d9d9f4','#8daa57','#f4eee6']},
   {id:'sage',name:'雾绿麦田',note:'轻盈自然，平静从容',colors:['#cedbc9','#e5dfce','#4b6652','#f2f0e8']},
   {id:'lavender',name:'紫雾暖米',note:'含蓄柔软，细腻有层次',colors:['#d9cee5','#e8d9da','#695678','#f5f0ea']},
   {id:'sand',name:'杏沙陶棕',note:'暖而不艳，朴素安定',colors:['#e8c9b4','#e4d5c3','#855b45','#f6f0e7']}]},
  {id:'lin',name:'林知秋',title:'教学与课程辅导',desc:'克制的图文秩序，清楚呈现教学方法',source:'references/personal-ip-trio-20261010/blair-lin-zhiqiu/',palettes:[
   {id:'original',name:'可可暖米',note:'原配色 · 克制温和',colors:['#665b51','#ad8f85','#f2ede6','#fffdfa']},
   {id:'sage',name:'茶绿亚麻',note:'自然安静，清新耐看',colors:['#4b5c51','#8e9d87','#efefe5','#fdfdf8']},
   {id:'slate',name:'雾蓝灰砂',note:'理性清爽，层级分明',colors:['#495a69','#99a8ae','#eceff0','#fcfdfd']},
   {id:'mauve',name:'烟紫燕麦',note:'柔和内敛，保留书卷感',colors:['#655665','#b39ca9','#f0e9ed','#fffafa']}]}
 ];
 for(const t of list){t.legacyPalettes=t.palettes;t.archivedPalettes=global.WebsitePaletteV2?.archived?.[t.id]||[];t.palettes=global.WebsitePaletteV2?.data[t.id]||t.palettes;t.version='20261011-v1';t.pages=pages;t.preview=`assets/website-templates/${t.id}-home.jpg`;t.manifest=`assets/website-templates/${t.id}-manifest.json`}
 const get=id=>list.find(t=>t.id===id);
 const preset=(t,id)=>[...t.palettes,...t.legacyPalettes,...t.archivedPalettes].find(p=>p.id===id)||t.palettes[0];
 const cache=new Map();
 async function read(url){if(!cache.has(url))cache.set(url,fetch(url).then(r=>{if(!r.ok)throw Error(`读取失败 ${r.status}`);return r.text()}).catch(e=>{cache.delete(url);throw e}));return cache.get(url)}
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function mix(a,b,k=.5){const rgb=s=>s.match(/\w\w/g).map(x=>parseInt(x,16));return '#'+rgb(a.slice(1)).map((v,i)=>Math.round(v*(1-k)+rgb(b.slice(1))[i]*k).toString(16).padStart(2,'0')).join('')}
 function presetCss(t,id){
  const p=preset(t,id);if(p.id==='original')return '';
  if(p.edition==='v2')return global.WebsitePaletteV2.css(t,p);
  const [a,b,c,d]=p.colors;let vars={},extra='';
  if(t.id==='suye'){
   vars={purple:a,lime:b,aqua:c,paper:d,peach:mix(b,d,.3),soft:mix(a,d,.91),link:mix(a,'#16171b',.25),surface:mix(d,'#ffffff',.65),ink:'#1f2024',line:'#2c2d31'};
   extra='.creator-copy,.detail-hero,.contact-grid{background:var(--soft)}.product-cards a,.article-grid a,.program-grid article a{color:var(--link)}input,textarea{background:var(--surface);color:var(--ink);border-color:var(--link)}';
  }else if(t.id==='zhou'){
   vars={pink:a,lilac:b,green:c,cream:d,sand:mix(a,d,.5),surface:mix(d,'#ffffff',.4),ink:'#181817',hover:mix(c,'#121512',.2),border:mix(c,d,.35)};
   extra=`.melyssa-hero{background:linear-gradient(125deg,${mix(a,c,.14)},${a} 45%,${b})}.program-feature{background:linear-gradient(135deg,${a},${b})}.contact-grid{background:linear-gradient(120deg,${d},${b})}.site-header,.site-footer,.program-grid article,.steps article,.contact-grid form{background:var(--surface)}.site-footer .text-link,.site-header nav a:hover,.site-header nav a[aria-current="page"],.metric-item:hover{color:var(--hover)}.header-cta,.button{color:#fff}.header-cta:hover,.button:hover{background:var(--hover)}.steps b{color:var(--green)}.steps article,input,textarea{border-color:var(--border)}.metric-item{color:var(--ink)}@media(max-width:800px){.site-header nav{background:var(--surface)}}`;
  }else if(t.id==='lin'){
   vars={brown:a,rose:b,cream:c,white:d,ink:'#302f2d',line:mix(a,c,.55),muted:mix(a,c,.85)};
   extra='.site-header,.service-cards,.service-cards article{border-color:var(--line)}.newsletter{background:var(--muted)}.site-footer .text-link{color:var(--cream)}';
  }else{
   vars={blue:a,'blue-dark':mix(a,'#16151b',.35),yellow:b,ice:c,aqua:d,paper:mix(c,'#ffffff',.6),ink:'#242631',muted:'#62616a',line:mix(a,c,.78)};
   extra='.content-feature{background:var(--paper)}.newsletter{background:var(--aqua)}.inner-hero{background:linear-gradient(110deg,var(--ice),var(--aqua))}.inner-section.tint{background:var(--ice)}.program-image{background:var(--aqua)}.contact-form input,.contact-form textarea{background:var(--paper);color:var(--ink)}';
  }
  return ':root{'+Object.entries(vars).map(([k,v])=>`--${k}:${v}`).join(';')+'}'+extra;
 }
 function palette(t,ref){const p=preset(t,ref&&typeof ref==='object'?ref.paletteId:ref);return ref&&typeof ref==='object'&&global.WebsiteColorAdjust?WebsiteColorAdjust.adjust(t,p,ref.overrides,presetCss(t,p.id)):p}
 function colorFields(t,id){const p=preset(t,id);return WebsiteColorAdjust.fields(t,p,presetCss(t,p.id))}
 function cleanOverrides(t,id,raw){const p=preset(t,id);return WebsiteColorAdjust.clean(t,p,raw,presetCss(t,p.id))}
 function colorWarnings(t,id,raw){const p=preset(t,id);return WebsiteColorAdjust.warnings(t,p,raw,presetCss(t,p.id))}
 function themeCss(t,ref){const p=palette(t,ref);return p.customCss??presetCss(t,p.id)}
 function decorated(raw,t,pid,base){const doc=new DOMParser().parseFromString(raw,'text/html');
  if(base){const b=doc.createElement('base');b.href=base;doc.head.prepend(b)}
  const s=doc.createElement('style');s.id='website-template-palette';s.textContent=themeCss(t,pid);doc.head.append(s);
  if(base){const fonts=doc.createElement('style');fonts.id='website-offline-fonts';fonts.textContent=['PuHui','Alibaba PuHuiTi','AlibabaPuHuiTi','Alibaba PuHui','AlibabaPuHui'].flatMap(family=>[400,500,700].map(weight=>'@font-face{font-family:"'+family+'";src:url("'+new URL('assets/fonts/PuHui-'+weight+'.woff2',location.href).href+'");font-weight:'+weight+';font-display:swap}')).join('');doc.head.append(fonts)}
  return '<!doctype html>\n'+doc.documentElement.outerHTML;
 }
 async function preview(t,pid,page='index.html'){
  if(!pages.some(([f])=>f===page))throw Error('页面不存在');
  const raw=await read(t.source+page);return decorated(raw,t,pid,new URL(t.source,location.href).href);
 }
 function mount(frame,t,getPalette,onNavigate,onReady){
  frame.onload=()=>{const doc=frame.contentDocument;if(!doc||!doc.body)return;
   doc.addEventListener('click',event=>{const a=event.target.closest('a[href]');if(!a)return;const href=a.getAttribute('href');
    if(href.startsWith('#'))return;const url=new URL(href,doc.baseURI),base=new URL(t.source,location.href);
    if(url.origin===base.origin&&url.pathname.startsWith(base.pathname)){
     const filename=url.pathname.slice(base.pathname.length);if(pages.some(([p])=>p===filename)){event.preventDefault();onNavigate(filename,url.hash);}
    }
   });onReady?.(doc);
  };
 }
 function sizeFrame(frame,host,mode='desktop'){
  const width=mode==='mobile'?390:1440,w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  const scale=Math.min(1,w/width);frame.style.width=width+'px';frame.style.height=Math.ceil(h/scale)+'px';frame.style.transform=`scale(${scale})`;frame.style.left=Math.max(0,(w-width*scale)/2)+'px';
 }
 async function buildPackage(){throw Error('完整交付仅由已登录的服务端下载接口提供')}
 async function download(t,pid,button,notify){const ref=typeof pid==='object'?pid:{paletteId:pid,overrides:{}};return PlatformWorkspace.download('website',{templateId:t.id,paletteId:ref.paletteId||'original',overrides:ref.overrides||{}},button,notify)}
 global.WebsiteTemplates={list,get,palette,colorFields,cleanOverrides,colorWarnings,themeCss,preview,mount,sizeFrame,buildPackage,download,esc};
})(window);
