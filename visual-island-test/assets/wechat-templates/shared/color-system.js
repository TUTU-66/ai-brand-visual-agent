/* Template-specific color roles. Browser and portable Node share this implementation. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.WechatColorSystem=factory();})(globalThis,function(){
'use strict';
const VERSION='template-color-roles/1', rgb=h=>h.slice(1).match(/../g).map(v=>parseInt(v,16)),hex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>hex(rgb(a).map((v,i)=>v*t+rgb(b)[i]*(1-t)));
const lum=h=>rgb(h).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
function fit(c,bg,target=4.6){if(contrast(c,bg)>=target)return c;const end=contrast('#111111',bg)>contrast('#ffffff',bg)?'#111111':'#ffffff';for(let i=1;i<=100;i++){const v=mix(end,c,i/100);if(contrast(v,bg)>=target)return v;}return end;}
const on=bg=>contrast('#ffffff',bg)>=contrast('#171717',bg)?'#ffffff':'#171717';
const recipes={
'mengyu-purple-editorial':{description:'首屏保留柔和渐变，黑色标题搭配彩色第二行；标题签与浅引文分层，不把浅引文改成深色块。',ink:'#171717',muted:'#6d6872',surface:.48,labels:['标题基色','标题签底','文字重点','页面底色']},
'pastel-art-editorial':{description:'粉彩圆形、浅引文、三圆分隔分层配色；深墨判断卡始终配反白字，不用文字重点色涂底纹。',ink:'#171717',muted:'#666666',surface:1,labels:['标题墨色','浅引文底','文字重点','页面底色']},
'monochrome-order':{description:'大面积保持中性；标题、编号和细线轻染套色，不把黑白秩序铺成彩色页面。',ink:'#181818',muted:'#666666',surface:.88,labels:['标题与编号','引用浅底','文字重点','页面底色']},
'warm-orange-journal':{description:'暖纸底、白照片衬、暖色章节线与浅色结尾分开；标题用深墨，装饰另取浅阶。',ink:'#261b13',muted:'#79604e',surface:.86,labels:['手账线条','浅底板','文字重点','暖纸底色']},
'warm-beige-lifestyle':{description:'首尾保留多段柔和渐变；深棕标题、浅金线条、菱形装饰不是同一个颜色。',ink:'#161616',muted:'#595959',surface:.44,labels:['标题基色','渐变基色','文字重点','页面底色']},
green:{description:'橄榄标题、胶囊反白、中层细框与浅下划线分开，保留轻框的感觉。',ink:'#30312d',muted:'#74766e',surface:.68,labels:['标题与胶囊','浅下划线','文字重点','页面底色']},
paper:{description:'暖纸与墨色阅读为底；注释细线、赭色重点和浅下划线各司其职，不把正文染成主色。',ink:'#292721',muted:'#777064',surface:.7,labels:['注释线色','浅下划线','文字重点','纸张底色']},
index:{description:'中性标题、深色眉题、实色编号块；编号按底色反白，辅助色只用于索引和阴影。',ink:'#171a18',muted:'#58605c',surface:.72,labels:['编号底色','索引浅底','文字重点','页面底色']},
bold:{description:'黑白章节与结尾维持强对比；冲击色用于标记，深底上的文字另用反白色阶。',ink:'#171614',muted:'#68635b',surface:.4,labels:['冲击色','浅下划线','文字重点','页面底色']},
soft:{description:'柔色标题、浅泡泡章节、另一层引用底并存；同系不等于把所有浅底合并。',ink:'#33323d',muted:'#817c86',surface:.85,labels:['标题色','引用浅底','文字重点','页面底色']}
};
const pastelDecor={
'#171717|#eef0df|#78820b|#ffffff':['#e5eb77','#c9d45a','#e8edb4'],
'#644b42|#f7e5dc|#a45f46|#fffdf9':['#edc1ae','#ce957e','#f3ded2'],
'#574765|#eee4f4|#806393|#fffefe':['#d9c3e7','#b899cd','#eadcf1'],
'#405950|#e4eee4|#5b7d62|#fcfefb':['#bfd8b8','#92b184','#dce9d6']
};
function resolve(id,x){
const d=recipes[id];if(!d)throw Error('Missing template color recipe: '+id);
const p=x.paper.toLowerCase(),s=x.soft.toLowerCase(),a=x.primary.toLowerCase(),e=x.emphasis.toLowerCase(),light=lum(p)>.4;
const soft=light&&lum(s)<.42?mix(s,p,.24):!light&&lum(s)>.45?mix(s,p,.24):s;
const surface=mix(soft,p,d.surface),opening=mix(soft,p,.48),ink=fit(d.ink,p,7),muted=fit(d.muted,p),accent=fit(a,p),emphasis=fit(e,p);
const c={paper:p,ink,muted,accent,emphasis,soft,surface,opening,line:mix(a,p,.32),dark:d.ink,onDark:'#ffffff',onAccent:on(accent),surfaceInk:fit(ink,surface,7),surfaceAccent:fit(a,surface),surfaceEmphasis:fit(e,surface),title:accent,decor:mix(a,p,.3),decorMid:mix(a,p,.52),decorPale:mix(a,p,.18)};
if(id==='mengyu-purple-editorial'){
 c.gradientStops=[mix(soft,p,.9),mix(soft,p,.12),mix(a,p,.1)];
 c.heroGradient='linear-gradient(135deg,'+c.gradientStops[0]+' 0%,'+c.gradientStops[1]+' 48%,'+c.gradientStops[2]+' 100%)';
}
if(id==='pastel-art-editorial'){[c.decor,c.decorMid,c.decorPale]=pastelDecor[[a,s,e,p].join('|')]||[mix(e,soft,.32),mix(e,soft,.6),mix(e,soft,.14)];c.decor=mix(c.decor,p,168/255);}
if(id==='warm-beige-lifestyle'){
 c.title=fit(mix(a,ink,.64),opening);c.gradientStops=[mix(soft,p,.56),mix(soft,p,.14),mix(soft,p,.7),mix(soft,p,.18)];
 if(a==='#6d4d27'&&s==='#efe1cf'&&p==='#ffffff'){c.gradientStops=['#f3eee7','#faf8f4','#eee9e2','#faf8f4'];c.title='#3a2207';}
 c.heroGradient='linear-gradient(125deg,'+c.gradientStops.map((v,i)=>v+' '+[0,36,55,100][i]+'%').join(',')+')';
 c.endGradient='linear-gradient(125deg,'+mix(soft,p,.28)+','+mix(soft,p,.66)+','+mix(soft,p,.12)+')';
}
if(id==='soft'){c.bubble=mix(a,p,.12);c.kickerSurface=mix(a,p,.075);c.bubbleInk=fit(ink,c.bubble,7);c.bubbleAccent=fit(a,c.bubble);}
if(id==='warm-orange-journal')c.photoShadow=mix(a,p,.28);
if(id==='soft'||id==='bold')c.listSurface=mix(soft,p,.34);
if(id==='green'){c.decorMid=mix(a,p,.58);c.decorPale=mix(soft,p,.78);}
c.description=d.description;c.labels=d.labels;c.version=VERSION;
const chips=[['正文墨色',c.ink],['主色应用',c.accent],['文字重点',c.emphasis],['页面底色',c.paper]];
if(id==='pastel-art-editorial')chips.push(['圆形装饰',c.decor],['圆点中层',c.decorMid],['圆点浅层',c.decorPale],['引用浅底',c.surface],['判断深底',c.dark],['深底反白',c.onDark]);
else if(id==='soft')chips.push(['眉题浅底',c.kickerSurface],['柔和底板',c.bubble],['引用浅底',c.surface],['列表浅底',c.listSurface]);
else if(id==='green')chips.push(['细框中层',c.decorMid],['浅线层',c.decorPale],['编号浅底',c.surface],['胶囊文字',c.onAccent]);
else if(id==='mengyu-purple-editorial')chips.push(['结尾浅底',c.opening],['标题签底',c.soft],['引用浅底',c.surface]);
else if(id==='bold')chips.push(['深色块',c.dark],['反白文字',c.onDark],['列表浅底',c.listSurface],['下划浅底',c.soft]);
else if(id==='index')chips.push(['眉题深底',c.dark],['反白文字',c.onDark],['索引浅底',c.soft],['编号文字',c.onAccent]);
else if(id==='monochrome-order')chips.push(['编号深底',c.dark],['反白文字',c.onDark],['引用浅底',c.surface]);
else if(id==='paper')chips.push(['下划浅底',c.soft]);
else if(id==='warm-orange-journal')chips.push(['引用浅底',c.surface],['照片白衬',mix(c.paper,'#ffffff',.12)],['装饰浅阶',c.decor],['照片阴影',c.photoShadow]);
else chips.push(['标题深阶',c.title],['菱形浅芯',c.soft],['装饰浅阶',c.decor],['细线层',c.line]);
c.swatches=chips.map(([label,color])=>({label,color}));return c;
}
function css(id,x){
const c=resolve(id,x);let out='\n/* '+VERSION+' / '+id+' */\n';
const rule=(sel,v)=>{out+=sel.split(',').map(s=>'#article '+s.trim()).join(',')+'{'+v.split(';').filter(Boolean).map(d=>d.replace(/!important/g,'')+'!important').join(';')+'}\n';};
const vars={accent:c.accent,soft:c.soft,highlight:c.emphasis,paper:c.paper,ink:c.ink,black:c.ink,muted:c.muted,'accent-soft':c.soft,opening:c.opening,wash:c.surface,line:c.line,green:c.accent,'green-2':c.decorMid,'green-3':c.decorPale};
out+='#article{'+Object.entries(vars).map(([k,v])=>'--'+k+':'+v+'!important').join(';')+';background-color:'+c.paper+'!important;color:'+c.ink+'!important}\n';
const emp='.intro b,.opening>p strong,.chapter>p:not(.statement):not(.emphasis-band) b,.chapter>p:not(.statement):not(.emphasis-band) strong,.article-lead b,.article-section p>b,.keyword';
rule(emp,x.emphasisMode==='underline'?'color:'+c.ink+';background:linear-gradient(transparent 68%,'+c.soft+' 68%)':'color:'+c.emphasis);
rule('.role-list>li>b,.list>div>span','color:'+c.emphasis);
rule('[data-role=caption],.media-caption,.media-note','color:'+c.muted);
if(id==='pastel-art-editorial'){
 rule('h1,.section-head h2','color:'+c.title);
 rule('.subtitle,.hero-word,.topline,.intro,.chapter>p','color:'+c.ink);
 rule('.kicker,.section-head p,.role-list li p','color:'+c.muted);
 rule('.hero:before,.hero:after','background:'+c.decor);
 rule('.intro:before,.chapter:before,.ending:before','background:radial-gradient(circle at 10px 18px,'+c.decorPale+' 0 4px,transparent 5px),radial-gradient(circle at 32px 18px,'+c.decorMid+' 0 6px,transparent 7px),radial-gradient(circle at 54px 18px,'+c.decorPale+' 0 4px,transparent 5px)');
 rule('.chapter blockquote,.qr-panel','background:'+c.surface+';color:'+c.surfaceInk);
 rule('.chapter blockquote b,.chapter blockquote strong','color:'+c.surfaceEmphasis);
 rule('.qr-panel p','color:'+fit(c.muted,c.surface));
 rule('.chapter>p.statement','background:'+c.dark+';color:'+c.onDark);
 rule('.statement b,.statement strong,.statement span','color:'+c.onDark+';background:transparent');
 rule('.section-head,.role-list','border-color:'+c.ink);
}
if(id==='mengyu-purple-editorial'){
 rule('.poster-hero','background:'+c.heroGradient);
 rule('.personal-ending','background:'+c.opening);
 rule('.poster-caption h1 span,.chapter-head h2','color:'+fit(c.ink,c.opening,7));
 rule('.poster-caption h1 em','color:'+fit(x.primary,c.opening));
 rule('.chapter-head mark','background:'+c.soft+';color:'+fit(x.primary,c.soft));
 rule('.chapter blockquote,.emphasis-band','background:'+c.surface+';color:'+c.surfaceInk+';border-color:'+c.accent);
 rule('.chapter blockquote b,.chapter blockquote strong,.emphasis-band b,.emphasis-band strong','color:'+c.surfaceEmphasis);
 rule('.key-sentence,.opening-slogan,.role-list strong','color:'+c.ink);
 rule('.opening>p.emphasis-marker strong,.chapter>p:not(.statement):not(.emphasis-band).emphasis-marker strong,.chapter>p:not(.statement):not(.emphasis-band).key-sentence b,.emphasis-marker strong','color:'+fit(x.emphasis,c.soft)+';background:linear-gradient(transparent 62%,'+c.soft+' 62%)');
 rule('.personal-ending-copy strong','color:'+fit(c.ink,c.opening));
 rule('.personal-ending-copy small','color:'+fit(x.primary,c.opening));
 rule('.chapter-head small,.ending-copy,.personal-ending-copy p,.role-list p,.opening-en','color:'+fit(c.muted,c.opening));
}
if(id==='monochrome-order'){
 rule('h1,.section-head h2','color:'+c.title);
 rule('.subtitle,.intro,.chapter>p,.ending-copy,.role-list strong','color:'+c.ink);
 rule('.kicker,.section-head p,.role-list p','color:'+c.muted);
 rule('.section-head .index','background:'+c.dark+';color:'+c.onDark);
 rule('.chapter blockquote,.qr-panel','background:'+c.surface+';color:'+c.surfaceInk+';border-color:'+c.dark);
 rule('.chapter blockquote b,.chapter blockquote strong','color:'+c.surfaceEmphasis);
 rule('.qr-panel p','color:'+fit(c.muted,c.surface));
 rule('.statement','color:'+c.ink+';border-color:'+c.line);
 rule('.statement b,.statement strong','color:'+c.emphasis);
 rule('.intro:before,.chapter:before,.ending:before','background:linear-gradient('+c.line+','+c.line+') left center/24px 1px no-repeat,linear-gradient('+c.dark+','+c.dark+') 32px center/4px 4px no-repeat,linear-gradient('+c.dark+','+c.dark+') center center/8px 8px no-repeat,linear-gradient('+c.dark+','+c.dark+') right 32px center/4px 4px no-repeat,linear-gradient('+c.line+','+c.line+') right center/24px 1px no-repeat');
}
if(id==='warm-orange-journal'){
 const mat=mix(c.paper,'#ffffff',.12);
 rule('.hero:after','background:'+mat+';box-shadow:0 4px 9px '+c.photoShadow);
 rule('h1,.subtitle','color:'+fit(c.ink,mat,7));
 rule('.topline,.kicker','color:'+fit(fit(x.primary,mat),c.paper));
 rule('.lead,.section-head,.section-head h2,.chapter blockquote,.statement,.ending-copy','color:'+c.emphasis+';border-color:'+c.accent);
 rule('.section-head p','color:'+fit(mix(x.primary,c.paper,.7),c.paper));
 rule('.chapter-4 blockquote,.qr-panel','background:'+c.surface+';color:'+c.surfaceInk);
 rule('.chapter blockquote b,.chapter blockquote strong,.statement b,.statement strong','color:'+c.emphasis);
 rule('.chapter-4 blockquote b,.chapter-4 blockquote strong','color:'+c.surfaceEmphasis);
 rule('.qr-panel p','color:'+fit(c.muted,c.surface));
 rule('.role-list,.hero-media,.qr-panel','border-color:'+c.accent);
 rule('.media-single','box-shadow:4px 5px 0 '+c.accent);
 rule('.media-wide','box-shadow:3px 3px 0 '+c.accent);
 rule('.chapter:before,.ending:before','color:'+c.decor+';background:linear-gradient('+c.accent+','+c.accent+') center 34px/1px 28px no-repeat');
}
if(id==='warm-beige-lifestyle'){
 rule('.hero','background:'+c.heroGradient);rule('.ending','background:'+c.endGradient);
 rule('h1','color:'+c.title);rule('.subtitle,.kicker','color:'+fit(x.primary,c.gradientStops[2]));
 rule('.hero-word,.section-head,.lead,.chapter>p.statement,.ending-copy','color:'+fit(c.ink,c.gradientStops[2]));
 rule('.intro,.chapter>p:not(.statement),.role-list p','color:'+c.muted);
 rule('.chapter blockquote,.statement','border-color:'+c.line);
 rule('.chapter-4 blockquote','background:'+c.surface+';color:'+c.surfaceInk);
 rule('.chapter blockquote b,.chapter blockquote strong','color:'+c.emphasis);
 rule('.chapter-4 blockquote b,.chapter-4 blockquote strong','color:'+c.surfaceEmphasis);
 rule('.chapter:before','border-color:'+c.accent+';background:'+c.soft+';box-shadow:12px -12px 0 -3px '+c.decor+',-12px 12px 0 -3px '+c.decor);
 rule('.qr-panel','background:'+c.paper+';border-color:'+c.line+';color:'+c.ink);
 rule('.qr-panel p','color:'+c.muted);
}
if(id==='green'){
 rule('h1,.chapter-title,.quote-note .label,.index-list .num,.open-quote .mark','color:'+c.accent);
 rule('.pill,.compare .keys','background:'+c.accent+';color:'+c.onAccent);
 rule('.pill b,.pill strong,.compare .keys span','color:'+c.onAccent);
 rule('.lead,.body,.compare .values','color:'+c.ink);
 rule('.chapter-title .hint,.quote-note .note,.index-list .copy span,.cta span,.footnote','color:'+c.muted);
 rule('.chapter-card','background:'+mix(c.paper,'#ffffff',.9));
 rule('.index-list .num','background:'+c.surface+';color:'+c.surfaceEmphasis);
 rule('.highlight','color:'+fit(x.emphasis,c.soft)+';background:linear-gradient(transparent 62%,'+c.soft+' 62%,'+c.soft+' 91%,transparent 91%)');
 rule('.compare .values p+p','color:'+c.accent);
 rule('.qr-sleeve','background:'+c.decorMid);
}
if(['paper','index','bold','soft'].includes(id)){
 rule('.article-hero h1,.chapter h2','color:'+c.ink);
 rule('.article-deck,.chapter small,.list small,.ending p','color:'+c.muted);
 rule('.keyword','color:'+c.emphasis);
 rule('.marker','color:'+fit(x.emphasis,c.soft)+';background:linear-gradient(transparent 62%,'+c.soft+' 62%,'+c.soft+' 91%,transparent 91%)');
 rule('.quote','color:'+c.ink);
 if(id==='bold'||id==='soft'){
  rule('.list>div','background:'+c.listSurface);
  rule('.list>div>span','color:'+fit(x.emphasis,c.listSurface));
  rule('.list small','color:'+fit(c.muted,c.listSurface));
 }
 if(id==='paper'){rule('.article-kicker,.chapter-index,.ending small','color:'+c.accent);rule('.ending','background:transparent');}
 if(id==='index'){
  rule('.article-kicker','background:'+c.dark+';color:'+c.onDark);
  rule('.chapter-index','background:'+c.accent+';color:'+c.onAccent);
  rule('.list>div>span','background:'+c.soft+';color:'+fit(x.emphasis,c.soft));
  rule('.quote','border-color:'+c.ink+';box-shadow:5px 5px 0 '+c.soft);
 }
 if(id==='bold'){
  rule('.chapter,.ending','background:'+c.dark+';color:'+c.onDark);
  rule('.chapter h2,.ending b,.chapter b,.chapter strong','color:'+c.onDark);
  rule('.chapter small,.ending p','color:'+mix(c.onDark,c.dark,.8));
  rule('.chapter-index,.ending small','color:'+fit(x.primary,c.dark));
  rule('.article-kicker','color:'+c.accent);
 }
 if(id==='soft'){
  rule('.article-kicker,.chapter,.ending','background:'+c.bubble+';color:'+c.bubbleInk);
  rule('.article-kicker','background:'+c.kickerSurface);
  rule('.article-kicker,.chapter-index,.ending small','color:'+c.bubbleAccent);
  rule('.chapter-index','background:'+c.bubble+';color:'+c.bubbleAccent);
  rule('.chapter h2,.ending b','color:'+c.bubbleInk);
  rule('.chapter small,.ending p','color:'+fit(c.muted,c.bubble));
  rule('.quote','background:'+c.surface+';color:'+c.surfaceInk);
  rule('.quote .marker,.quote b,.quote strong','color:'+fit(x.emphasis,c.soft));
 }
}
return out;
}
return {VERSION,recipes,resolve,css,mix,fit,contrast};
});
