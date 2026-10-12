/* Edition 2: template-specific color roles. Previous palette IDs and CSS remain in the library. */
(()=>{'use strict';
 const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
 const mix=(a,b,t)=>'#'+rgb(a).map((v,i)=>Math.round(v*(1-t)+rgb(b)[i]*t).toString(16).padStart(2,'0')).join('');
 const lum=c=>rgb(c).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 const on=c=>contrast(c,'#ffffff')>contrast(c,'#191a1e')?'#ffffff':'#191a1e';
 function preset(id,name,note,colors,s){const r={...s};r.surface=r.surface||'#fffefa';r.muted=mix(r.ink,r.paper,.20);r.line=mix(r.ink,r.paper,.65);r.onBrand=on(r.brand);r.onAccent=on(r.accent);r.onDeep=on(r.deep);r.heroText=r.heroText||on(r.hero);r.heroEnd=r.heroEnd||r.hero;
  return {id:'v2-'+id,edition:'v2',name,note,colors,roles:r,readingRoles:{primary:r.brand,soft:r.soft,emphasis:r.accent,paper:r.paper}};
 }
 const data={
  shen:[
   preset('ink','墨白朱砂','留白与墨色 · 朱砂只点亮行动',['#252725','#c14e36','#f7f4ee','#dfddd5'],{brand:'#252725',accent:'#c14e36',hero:'#f7f4ee',heroText:'#252725',paper:'#fbfaf7',soft:'#e4e1d8',surface:'#fffefa',ink:'#272825',deep:'#252725'}),
   preset('olive','橄榄柠檬','明亮自然 · 黄绿首屏与橄榄支点',['#344535','#e8d76f','#e3e8c8','#faf9ef'],{brand:'#344535',accent:'#e8d76f',hero:'#e3e8c8',heroText:'#344535',paper:'#faf9ef',soft:'#edf0dc',surface:'#fffef6',ink:'#29382c',deep:'#344535'}),
   preset('night','午夜香槟','深色首屏 · 香槟细节与浅纸阅读',['#24283f','#d9b57a','#eeeadf','#fffaf0'],{brand:'#303751',accent:'#d9b57a',hero:'#24283f',heroText:'#fff6e2',paper:'#faf7ef',soft:'#e8dfcd',surface:'#fffdf7',ink:'#292d3d',deep:'#24283f'}),
   preset('coral','珊瑚海盐','暖珊瑚大底 · 深海绿清晰收束',['#164951','#bf563e','#f4c5b5','#e5eee9'],{brand:'#164951',accent:'#bf563e',hero:'#f4c5b5',heroText:'#164951',paper:'#fbf5ed',soft:'#e5eee9',surface:'#fffcf5',ink:'#203b3e',deep:'#164951'})
  ],
  suye:[
   preset('cobalt','群青柠黄','强图形感 · 群青与亮黄的正面碰撞',['#2349b2','#e8f05c','#c0d3ec','#f7f8f2'],{brand:'#2349b2',accent:'#e8f05c',hero:'#2349b2',paper:'#f7f8f2',soft:'#e6ebf8',surface:'#ffffff',secondary:'#c0d3ec',ink:'#20232b',deep:'#182342'}),
   preset('orange','炭黑橘汽','黑色舞台 · 橘色按钮和杏色内容块',['#252624','#ffad69','#f39164','#f8f0e2'],{brand:'#252624',accent:'#ffad69',hero:'#252624',paper:'#f8f0e2',soft:'#f3dbc4',surface:'#fffaf0',secondary:'#f39164',ink:'#252624',deep:'#3b2923'}),
   preset('pink','樱粉墨绿','粉色首屏 · 墨绿线条与植物浅绿',['#244c40','#f4a9bc','#d8e4bb','#faf5ee'],{brand:'#244c40',accent:'#f4a9bc',hero:'#f4c4d2',heroText:'#183d32',paper:'#faf5ee',soft:'#e3eddb',surface:'#fffaf6',secondary:'#d8e4bb',ink:'#243a30',deep:'#244c40'}),
   preset('violet','电紫薄荷','浓紫主场 · 冷薄荷与丁香分区',['#6c3ed0','#beedce','#c5adf0','#f7f4fb'],{brand:'#6c3ed0',accent:'#beedce',hero:'#6c3ed0',paper:'#f7f4fb',soft:'#ebe3f6',surface:'#fefbff',secondary:'#c5adf0',ink:'#282237',deep:'#302448'})
  ],
  zhou:[
   preset('plum','梅酒玫瑰','深梅渐变 · 奶油圆卡和浅玫瑰叙事',['#6b354c','#af7b90','#4d243b','#fcf4ef'],{brand:'#6b354c',accent:'#4d243b',hero:'#6b354c',heroEnd:'#956275',heroText:'#fff7ef',paper:'#fcf4ef',soft:'#ecd6da',surface:'#fff9f0',secondary:'#d8bccb',ink:'#37252e',deep:'#442338'}),
   preset('sage','青瓷乌龙','黄绿渐变 · 清透、平静、有呼吸',['#a9c4b1','#ece4b3','#334c42','#f7f5eb'],{brand:'#334c42',accent:'#334c42',hero:'#a9c4b1',heroEnd:'#ece4b3',heroText:'#233d32',paper:'#f7f5eb',soft:'#dce5cf',surface:'#fffdf4',secondary:'#e8e4be',ink:'#28382f',deep:'#304438'}),
   preset('copper','赤陶奶油','陶土暖光 · 像一本温厚的人物杂志',['#d59975','#f1d5ba','#75402b','#fbf3e5'],{brand:'#75402b',accent:'#75402b',hero:'#d59975',heroEnd:'#f1d5ba',heroText:'#482e23',paper:'#fbf3e5',soft:'#edcfb7',surface:'#fffaed',secondary:'#e3c5a4',ink:'#3e3027',deep:'#5c3628'}),
   preset('blue','月白深海','冷蓝渐变 · 理性、清透、安静',['#b6cfdf','#e7edf8','#253e67','#f6f8fb'],{brand:'#253e67',accent:'#253e67',hero:'#b6cfdf',heroEnd:'#e7edf8',heroText:'#253e67',paper:'#f6f8fb',soft:'#dce6ef',surface:'#ffffff',secondary:'#ccd9e9',ink:'#263448',deep:'#253e67'})
  ],
  lin:[
   preset('chalk','墨白课堂','近黑与白纸 · 最克制的课堂秩序',['#26312c','#a14e3e','#e9e7df','#fffefa'],{brand:'#26312c',accent:'#a14e3e',hero:'#26312c',paper:'#fffefa',soft:'#e9e7df',surface:'#fffefa',ink:'#272c29',deep:'#1e2521'}),
   preset('oxford','牛津蓝金','海军蓝与暖金 · 清楚、稳重、专业',['#203f62','#926923','#e8eef4','#fbfcfc'],{brand:'#203f62',accent:'#926923',hero:'#203f62',paper:'#fbfcfc',soft:'#e8eef4',surface:'#ffffff',ink:'#253649',deep:'#152c43'}),
   preset('bamboo','竹青米纸','竹青与米纸 · 温和、有耐心的教学感',['#426246','#90612e','#e9edd8','#faf9ef'],{brand:'#426246',accent:'#90612e',hero:'#426246',paper:'#faf9ef',soft:'#e9edd8',surface:'#fffef5',ink:'#303b2d',deep:'#2d412e'}),
   preset('claret','栗红燕麦','栗红与燕麦 · 温暖而有分量',['#733a40','#a65e4c','#f2e3de','#fffaf4'],{brand:'#733a40',accent:'#a65e4c',hero:'#733a40',paper:'#fffaf4',soft:'#f2e3de',surface:'#fffcf6',ink:'#3a2b2a',deep:'#492b2e'})
  ]
 };
 // Keep the previous IDs intact for existing drafts and saved palettes, not as a browsing menu.
 const archived={suye:data.suye,lin:data.lin};
 data.suye=[
  preset('forest','苔绿奶油','深苔绿主场 · 奶油黄与植物灰绿',['#355846','#edd9a2','#b4c4ac','#f7f4ed'],{brand:'#355846',accent:'#edd9a2',hero:'#355846',paper:'#f7f4ed',soft:'#e3e8db',secondary:'#b4c4ac',surface:'#fffdf7',ink:'#293d34',deep:'#293f37'}),
  preset('clay','陶橘燕麦','浅燕麦首屏 · 陶橘按钮与麦色分区',['#874c35','#b05b3b','#ead8c4','#faf6ef'],{brand:'#874c35',accent:'#b05b3b',hero:'#ead8c4',heroText:'#352f27',paper:'#faf6ef',soft:'#f0e4d4',secondary:'#d9b787',surface:'#fffaf3',ink:'#352f27',deep:'#594432'}),
  preset('lilac','雾紫黄油','雾紫大底 · 黄油点色与柔和灰绿',['#574767','#f0df9d','#bcb1cf','#d6d5bb'],{brand:'#574767',accent:'#f0df9d',hero:'#bcb1cf',heroText:'#312c38',paper:'#faf7f2',soft:'#e8e3ec',secondary:'#d6d5bb',surface:'#fffdf7',ink:'#312c38',deep:'#3e354c'}),
  preset('sea','海盐砖红','浅海盐绿 · 少量砖红点亮行动',['#355559','#b54f3d','#bdd5d1','#e9ceb1'],{brand:'#355559',accent:'#b54f3d',hero:'#bdd5d1',heroText:'#253d40',paper:'#f8f7ef',soft:'#e4efeb',secondary:'#e9ceb1',surface:'#fffefa',ink:'#253d40',deep:'#2d4446'})
 ];
 data.lin=[
  preset('paper','石墨白纸','浅灰白首屏 · 石墨文字与温暖纸感',['#333d37','#ecece6','#8e613b','#fffefb'],{brand:'#333d37',accent:'#8e613b',hero:'#ecece6',heroText:'#303b34',paper:'#fffefb',soft:'#e8e8df',surface:'#fffefb',ink:'#303630',deep:'#29322c'}),
  preset('mist','海盐雾蓝','清透雾蓝首屏 · 冷暖平衡的阅读感',['#3e5864','#cddfe1','#8a642d','#f8fbfa'],{brand:'#3e5864',accent:'#8a642d',hero:'#cddfe1',heroText:'#294650',paper:'#f8fbfa',soft:'#e6edef',surface:'#ffffff',ink:'#293c43',deep:'#334750'}),
  preset('olive','橄榄麦田','柔和橄榄主场 · 麦色纸张与自然光',['#626b46','#eceddf','#756040','#fbfaf3'],{brand:'#626b46',accent:'#756040',hero:'#626b46',paper:'#fbfaf3',soft:'#eceddf',surface:'#fffef6',ink:'#36402d',deep:'#3e4933'}),
  preset('apricot','陶土暖杏','暖杏首屏 · 陶土深线条与奶白留白',['#765043','#bf8069','#f2e4db','#fff9f3'],{brand:'#765043',accent:'#964e39',hero:'#bf8069',heroText:'#281f1b',paper:'#fff9f3',soft:'#f2e4db',surface:'#fffaf5',ink:'#49362f',deep:'#593e35'})
 ];
 for(const id of ['suye','lin'])for(const p of data[id])p.id=p.id.replace(/^v2-/,'v3-');
 function css(t,p){const r=p.roles,vars={};for(const [k,v]of Object.entries(r))vars['v2-'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())]=v;
  let rules=`body{background:var(--v2-paper);color:var(--v2-ink)}input,textarea{background:var(--v2-surface);color:var(--v2-ink);border-color:var(--v2-line)}input::placeholder,textarea::placeholder{color:var(--v2-muted);opacity:1}input:focus-visible,textarea:focus-visible{outline-color:var(--v2-brand)}a:focus-visible,button:focus-visible{outline-color:currentColor}`;
  if(t.id==='shen'){
   Object.assign(vars,{blue:r.brand,'blue-dark':r.deep,yellow:r.accent,ice:r.hero,aqua:r.soft,paper:r.paper,ink:r.ink,muted:r.muted,line:r.line});
   rules+=`.site-header,.intro,.testimonial,.contact-form,.metric-card,.program-card,.content-card{background:var(--v2-surface)}.hero{background:var(--v2-hero);color:var(--v2-hero-text)}.hero-copy .display,.hero-copy p,.hero .eyebrow{color:var(--v2-hero-text)}.btn{background:var(--v2-accent);color:var(--v2-on-accent)}.btn.blue{background:var(--v2-brand);color:var(--v2-on-brand)}.site-nav .btn:hover{color:var(--v2-on-accent)}.btn.outline{background:transparent;color:var(--v2-brand)}.freebie,.site-footer{background:var(--v2-deep);color:var(--v2-on-deep)}.freebie p{color:var(--v2-on-deep)}.intro-copy .lead{color:var(--v2-ink)}.content-feature{background:var(--v2-paper)}.feature-actions a{background:var(--v2-surface);color:var(--v2-brand)}.phone-visual::before,.program-image,.newsletter{background:var(--v2-soft)}.phone-visual::after,.demo-phone-copy button{background:var(--v2-accent);color:var(--v2-on-accent)}.inner-hero{background:linear-gradient(110deg,var(--v2-paper),var(--v2-soft))}.inner-section.tint,.contact-page{background:var(--v2-soft)}.contact-form input,.contact-form textarea,.inline-form input{background:var(--v2-surface);color:var(--v2-ink)}.site-nav a[aria-current=page]{color:var(--v2-brand)}@media(max-width:800px){.site-nav{background:var(--v2-surface)}}`;
  }else if(t.id==='suye'){
   Object.assign(vars,{purple:r.brand,lime:r.accent,aqua:r.secondary,paper:r.paper,peach:r.soft,ink:r.ink,line:r.ink});
   rules+=`.site-header,.subhero,.site-footer{background:var(--v2-brand);color:var(--v2-on-brand)}.charli-hero{background:var(--v2-hero);color:var(--v2-hero-text)}.scribble{color:${contrast(r.accent,r.hero)>=3?r.accent:r.heroText}}.header-cta,.button{background:var(--v2-accent);color:var(--v2-on-accent)}.creator-copy,.detail-hero,.contact-grid{background:var(--v2-soft)}.product-cards article,.program-grid article,.article-grid article,.steps article,.contact-grid form{background:var(--v2-surface)}.product-cards a,.article-grid a,.program-grid article a{color:var(--v2-brand)}.quote-band{background:var(--v2-deep);color:var(--v2-on-deep)}.newsletter,.numbers{background:var(--v2-accent);color:var(--v2-on-accent)}.wide-cta{background:var(--v2-secondary);color:var(--v2-ink)}.workshop .button{background:var(--v2-secondary);color:var(--v2-ink)}.newsletter input{background:var(--v2-surface)}@media(max-width:800px){.site-header nav{background:var(--v2-deep);color:var(--v2-on-deep)}}`;
  }else if(t.id==='zhou'){
   Object.assign(vars,{pink:r.soft,lilac:r.secondary,green:r.brand,cream:r.paper,sand:r.soft,ink:r.ink});
   rules+=`.site-header,.site-footer,.program-grid article,.steps article,.contact-grid form{background:var(--v2-surface)}.melyssa-hero{background:linear-gradient(125deg,var(--v2-hero),var(--v2-hero-end));color:var(--v2-hero-text)}.quiz-orb{background:var(--v2-surface);color:var(--v2-ink)}.header-cta,.button{background:var(--v2-brand);color:var(--v2-on-brand)}.header-cta:hover,.button:hover{background:var(--v2-deep);color:var(--v2-on-deep)}.program-feature,.wide-cta{background:linear-gradient(135deg,var(--v2-soft),var(--v2-paper));color:var(--v2-ink)}.quote-band{background:var(--v2-deep);color:var(--v2-on-deep)}.contact-grid{background:linear-gradient(120deg,var(--v2-paper),var(--v2-secondary))}.site-footer .text-link,.site-header nav a:hover,.site-header nav a[aria-current=page],.metric-item:hover,.steps b{color:var(--v2-brand)}.metric-item{color:var(--v2-ink)}.steps article{border-color:var(--v2-line)}.photo-collage img{border-color:var(--v2-surface)}@media(max-width:800px){.site-header nav{background:var(--v2-surface)}}`;
  }else{
   Object.assign(vars,{brown:r.brand,rose:r.accent,cream:r.soft,white:r.paper,ink:r.ink,line:r.line});
   rules+=`.site-header{background:var(--v2-paper);border-color:var(--v2-line)}.blair-hero,.subhero,.wide-cta{background:var(--v2-hero);color:var(--v2-hero-text)}.services-dark,.site-footer{background:var(--v2-deep);color:var(--v2-on-deep)}.services-dark .service-cards,.services-dark .service-cards article{border-color:${mix(r.deep,'#ffffff',.4)}}.newsletter{background:var(--v2-soft)}.site-footer .text-link{color:var(--v2-on-deep)}.contact-grid form{background:var(--v2-surface)}.program-grid article span{color:var(--v2-brand)}`;
  }
  if(t.id==='suye'&&p.id.startsWith('v3-')){
   vars['v3-nav-accent']=contrast(r.accent,r.brand)>=4.5?r.accent:r.onBrand;
   rules+='.site-header nav a:hover,.site-header nav a[aria-current=page],.site-footer .text-link{color:var(--v3-nav-accent)}';
  }
  return ':root{'+Object.entries(vars).map(([k,v])=>'--'+k+':'+v).join(';')+'}'+rules;
 }
 window.WebsitePaletteV2={data,archived,css};
})();
