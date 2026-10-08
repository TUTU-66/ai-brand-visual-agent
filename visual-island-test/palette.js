const presets=[
 {id:'cool-wasabi',name:'冷蓝山葵',sourceName:'Pinterest Palette 2026 · Cool-Wasabi',source:'https://newsroom.pinterest.com/en-sg/news/from-cool-blue-to-persimmon-meet-the-2026-pinterest-palette/',colors:['#F7F8F2','#D7EFFF','#476B7C','#E9F056','#20242A'],tags:['knowledge','website','poster'],scenario:'知识内容 / 年轻科技',usage:'课程封面、知识卡片、工具网站',rule:'冷色同类＋黄绿补充对比',note:'知识内容 · 冷静底色＋醒目标记',previewTitle:'重点更醒目，阅读仍然安静。',previewBody:'冷蓝承担大面积信息，深色保证正文可读；山葵黄绿只标记按钮、数字和重点。'},
 {id:'persimmon-plum',name:'柿橙深梅',sourceName:'Pinterest Palette 2026 · Persimmon-Plum',source:'https://newsroom.pinterest.com/en-sg/news/from-cool-blue-to-persimmon-meet-the-2026-pinterest-palette/',colors:['#FFF4ED','#FFB59F','#FF5C34','#351E28','#7C5363'],tags:['lifestyle','poster','brand'],scenario:'生活方式 / 活动传播',usage:'小红书封面、美妆餐饮、活动海报',rule:'橙红同类＋深梅冷暖对比',note:'生活方式 · 温暖亲近＋深色支点',previewTitle:'有热度，但不把整张图喊满。',previewBody:'奶油色留出呼吸，柿橙负责吸引注意，深梅承担标题和信息骨架。'},
 {id:'jade-clay',name:'玉石陶土',sourceName:'Pinterest Palette 2026 · Jade',source:'https://business.pinterest.com/en-gb/pinterest-palette/?show_preview=true',colors:['#F5F1E8','#AEB8A0','#72806B','#351E28','#D2A96E'],tags:['lifestyle','website','brand'],scenario:'疗愈生活 / 自然品牌',usage:'健康内容、空间美学、手作品牌',rule:'绿色同类＋暖金邻近对比',note:'自然品牌 · 玉石绿不再单独成组',previewTitle:'绿色要有场景，也要有暖意。',previewBody:'玉石绿只负责自然气质，奶油底保证亲和，深梅与暖金补足文字和重点。'},
 {id:'navy-orange',name:'海军暖橙',sourceName:'Practical complementary palette',source:'https://color.adobe.com/create/color-wheel?version=published',colors:['#F7F2E8','#D9E5EA','#1E3548','#E07A3F','#8DA3B4'],tags:['website','knowledge','brand'],scenario:'专业服务 / 商业网站',usage:'个人主页、咨询服务、案例介绍',rule:'蓝橙补色＋低饱和中和',note:'专业网站 · 稳定可信＋一处行动色',previewTitle:'专业感来自秩序，不来自全灰。',previewBody:'海军蓝承担可信度，暖橙只用于行动按钮和关键数据，浅色负责大面积阅读。'},
 {id:'rose-teal',name:'粉土墨绿',sourceName:'Muted complementary palette',source:'https://www.canva.com/colors/color-wheel/',colors:['#FFF5EF','#E7B8AA','#B9654B','#2E4C46','#7D9289'],tags:['lifestyle','brand','website'],scenario:'个人表达 / 女性生活',usage:'人物故事、生活方式、个人品牌',rule:'红绿补色降饱和',note:'个人表达 · 温柔不甜腻',previewTitle:'柔和不是全浅，要留一个深支点。',previewBody:'粉土色制造亲近感，墨绿负责标题和结构；两边都降饱和，避免红绿直接冲撞。'},
 {id:'sand-indigo',name:'沙金靛蓝',sourceName:'Split-complementary editorial palette',source:'https://color.adobe.com/create/color-wheel?version=published',colors:['#F5EFE3','#E6DCC7','#B88A44','#36415E','#242631'],tags:['brand','website','knowledge'],scenario:'文化内容 / 高端品牌',usage:'品牌故事、编辑长图、文化项目',rule:'黄蓝补色＋深浅层次',note:'文化品牌 · 温润纸感＋克制金色',previewTitle:'让内容显得贵，不等于堆满金色。',previewBody:'沙色建立纸张感，靛蓝负责正文和版式骨架，金色只用于编号与细节。'},
 {id:'info-blue-gold',name:'信息蓝金',sourceName:'Accessible blue-orange palette',source:'https://color.adobe.com/create/color-wheel?version=published',colors:['#F5F7FA','#BFD7EA','#2A5CAA','#F2A541','#172033'],tags:['knowledge','website','poster'],scenario:'信息表达 / 数据内容',usage:'长图、报告、课程图表、发布页',rule:'蓝橙补色＋中性背景',note:'信息表达 · 层级清楚＋重点明确',previewTitle:'先把层级讲清，再让重点跳出来。',previewBody:'蓝色建立稳定的信息层级，橙金只标示关键数字；深色与浅底通过正文对比检查。'},
 {id:'violet-coral',name:'暮紫珊瑚',sourceName:'Analogous-plus-accent palette',source:'https://www.canva.com/colors/color-wheel/',colors:['#FBF7F3','#D6C6E1','#8467A7','#C96F5D','#2B2431'],tags:['lifestyle','poster','brand'],scenario:'创意表达 / 个人品牌',usage:'播客封面、个人栏目、创意活动',rule:'紫色同类＋珊瑚色强调',note:'创意表达 · 有个性但仍可阅读',previewTitle:'个性放在重点，不牺牲阅读。',previewBody:'紫色同类维持整体感，珊瑚色承担记忆点，深紫保证标题和正文稳定。'},
];

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clone=x=>JSON.parse(JSON.stringify(x));
const DEFAULT_PRESET=3, initial=presets[DEFAULT_PRESET];
const state={presetIndex:DEFAULT_PRESET,filter:'all',colors:[...initial.colors],locks:[false,false,false,false,false],preview:'light',name:initial.name,note:initial.note,source:initial.source,sourceName:initial.sourceName,scenario:initial.scenario,usage:initial.usage,rule:initial.rule,previewTitle:initial.previewTitle,previewBody:initial.previewBody,adjustment:'精选应用套色'};

function hexToRgb(hex){const v=String(hex).replace('#','');if(!/^[0-9a-f]{6}$/i.test(v))return null;return [0,2,4].map(i=>parseInt(v.slice(i,i+2),16))}
function rgbToHex(r,g,b){return '#'+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('').toUpperCase()}
function rgbToHsl([r,g,b]){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d){if(max===r)h=((g-b)/d)%6;else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}const l=(max+min)/2,s=d?d/(1-Math.abs(2*l-1)):0;return [h,s*100,l*100]}
function hslToHex(h,s,l){s/=100;l/=100;const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let r=0,g=0,b=0;if(h<60)[r,g,b]=[c,x,0];else if(h<120)[r,g,b]=[x,c,0];else if(h<180)[r,g,b]=[0,c,x];else if(h<240)[r,g,b]=[0,x,c];else if(h<300)[r,g,b]=[x,0,c];else [r,g,b]=[c,0,x];return rgbToHex((r+m)*255,(g+m)*255,(b+m)*255)}
function luminance(hex){const rgb=hexToRgb(hex).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]}
function contrast(a,b){const l1=luminance(a),l2=luminance(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)}
function bestOn(bg){return contrast('#FFFFFF',bg)>=contrast('#17171C',bg)?'#FFFFFF':'#17171C'}
function distance(a,b){const ar=hexToRgb(a),br=hexToRgb(b);return Math.sqrt(ar.reduce((sum,v,i)=>sum+(v-br[i])**2,0))}
function paletteDistance(a,b){const oneWay=(from,to)=>from.reduce((sum,c)=>sum+Math.min(...to.map(x=>distance(c,x))),0)/from.length;return(oneWay(a,b)+oneWay(b,a))/2}
function saturation(hex){return rgbToHsl(hexToRgb(hex))[1]}
function sortedByLight(colors){return [...colors].sort((a,b)=>luminance(a)-luminance(b))}

function deriveRoles(colors,mode){const sorted=sortedByLight(colors),dark=sorted[0],light=sorted[sorted.length-1];const bg=mode==='dark'?dark:light,text=mode==='dark'?light:dark,surface=mode==='dark'?sorted[1]:sorted[sorted.length-2];const rest=colors.filter(c=>![bg,text,surface].includes(c));const ranked=[...rest].sort((a,b)=>saturation(b)-saturation(a));return{bg,text,surface,primary:ranked[0]||sorted[2],accent:ranked[1]||ranked[0]||sorted[2]}}
function pairAdvice(colors,mode){const sorted=sortedByLight(colors),bg=mode==='dark'?sorted[0]:sorted[sorted.length-1];const candidates=colors.filter(c=>c!==bg).map(c=>({c,ratio:contrast(c,bg)})).sort((a,b)=>b.ratio-a.ratio);return{bg,fg:candidates[0].c,ratio:candidates[0].ratio}}

function renderPresets(){const items=presets.map((p,i)=>({p,i})).filter(({p})=>state.filter==='all'||p.tags.includes(state.filter));$('#presetList').innerHTML=items.map(({p,i})=>`<button class="preset-card ${i===state.presetIndex?'selected':''}" data-preset="${i}" aria-label="使用${p.name}"><span class="mini-palette">${p.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span><span class="preset-copy"><b>${p.name}</b><small>${p.scenario}<br>${p.rule}</small></span></button>`).join('');$$('[data-preset]').forEach(b=>b.onclick=()=>loadPreset(Number(b.dataset.preset)))}
function renderSwatches(){const labels=['颜色 1','颜色 2','颜色 3','颜色 4','颜色 5'];$('#swatchGrid').innerHTML=state.colors.map((color,i)=>`<article class="swatch" style="background:${color};color:${bestOn(color)}"><button class="lock ${state.locks[i]?'locked':''}" data-lock="${i}" aria-label="${state.locks[i]?'取消锁定':'锁定'}${labels[i]}"><span class="lock-icon" aria-hidden="true"></span><span>${state.locks[i]?'已锁定':'锁定'}</span></button><strong>${labels[i]}</strong><button class="copy-color" data-copy="${color}" aria-label="复制${color}"><code>${color}</code></button><label>修改<input type="color" value="${color}" data-color-input="${i}" aria-label="修改${labels[i]}"></label></article>`).join('');$$('[data-lock]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.lock);state.locks[i]=!state.locks[i];renderSwatches();toast(state.locks[i]?'已锁定这个颜色':'已取消锁定')});$$('[data-copy]').forEach(b=>b.onclick=()=>copy(b.dataset.copy,`${b.dataset.copy} 已复制`));$$('[data-color-input]').forEach(input=>input.oninput=e=>{const i=Number(input.dataset.colorInput);state.colors[i]=e.target.value.toUpperCase();state.adjustment='手动修改';renderAll(false)})}
function renderEvidence(){const light=pairAdvice(state.colors,'light'),dark=pairAdvice(state.colors,'dark');$('#scenarioText').textContent=state.scenario;$('#usageText').textContent=state.usage;$('#harmonyText').textContent=state.rule;$('#lightPair').textContent=`${light.bg} / ${light.fg}`;$('#darkPair').textContent=`${dark.bg} / ${dark.fg}`;setPair('#lightPass',light.ratio);setPair('#darkPass',dark.ratio)}
function setPair(sel,ratio){const el=$(sel),pass=ratio>=4.5;el.textContent=`${ratio.toFixed(2)}:1 · ${pass?'正文可用':'仅建议大字'}`;el.classList.toggle('fail',!pass)}
function renderPreview(){
 const r=deriveRoles(state.colors,state.preview),onAccent=bestOn(r.accent),ratio=contrast(r.bg,r.text),bodySafe=ratio>=4.5;
 document.documentElement.style.cssText+=`;--c-bg:${r.bg};--c-surface:${r.surface};--c-primary:${r.primary};--c-accent:${r.accent};--c-text:${r.text};--c-on-accent:${onAccent}`;
 const body=bodySafe?`<p class="copy-body">${state.previewBody}</p>`:`<p class="copy-body copy-body-blocked">当前五色缺少正文级明暗差，正文暂不进入画面。点击“对比更强”后再试。</p>`;
 $('#previewShell').innerHTML=`<div class="preview-board ${state.preview}">
   <article class="demo-card copy-demo">
    <header class="demo-caption"><span>文字海报</span><small>${bodySafe?'正文对比通过':'正文对比不足'} · ${ratio.toFixed(2)}:1</small></header>
    <div class="copy-poster">
     <div class="copy-rail"><span>${state.scenario}</span><i></i></div>
     <div class="copy-content"><p class="copy-kicker">这组颜色可以这样使用</p><h3>${state.previewTitle.replace('，','，<br>')}</h3>${body}<div class="copy-action"><b>${state.adjustment}</b><span>${state.usage.split('、')[0]}</span></div></div>
     <div class="copy-footer"><span>五色应用示例</span><strong>${state.name}</strong></div>
    </div>
   </article>
   <article class="demo-card graphic-demo">
    <header class="demo-caption"><span>图形构成</span><small>固定网格 · 五色面积有主次</small></header>
    <div class="graphic-poster" aria-label="使用当前五色生成的几何构成">
      <i class="geo geo-a"></i><i class="geo geo-b"></i><i class="geo geo-c"></i><i class="geo geo-d"></i><i class="geo geo-e"></i><i class="geo geo-f"></i><i class="geo geo-g"></i><i class="geo geo-h"></i>
    </div>
   </article>
  </div>`;
}
function renderAll(refreshList=true){$('#paletteName').textContent=state.name;$('#paletteBasis').textContent=state.note;$('#sourceLink').href=state.source||'https://color.adobe.com/create/color-wheel';$('#sourceLink').textContent='查看配色依据';if(refreshList)renderPresets();renderSwatches();renderEvidence();renderPreview()}

function loadPreset(index,keepLocks=false){const p=presets[index];state.presetIndex=index;state.name=p.name;state.note=p.note;state.source=p.source;state.sourceName=p.sourceName;state.scenario=p.scenario;state.usage=p.usage;state.rule=p.rule;state.previewTitle=p.previewTitle;state.previewBody=p.previewBody;state.adjustment='精选应用套色';if(keepLocks){p.colors.forEach((c,i)=>{if(!state.locks[i])state.colors[i]=c})}else{state.colors=[...p.colors];state.locks=[false,false,false,false,false]}renderAll()}
function nextBestPreset(){const locked=state.colors.filter((_,i)=>state.locks[i]);const candidates=presets.map((p,i)=>({i,score:locked.length?locked.reduce((sum,c)=>sum+Math.min(...p.colors.map(x=>distance(c,x))),0):paletteDistance(state.colors,p.colors)})).filter(x=>x.i!==state.presetIndex).sort((a,b)=>a.score-b.score);loadPreset(candidates[0].i,locked.length>0);state.adjustment=locked.length?'保留锁定色，替换其余颜色':'换用相近的精选套色';renderAll()}
function adjustColors(kind){state.colors=state.colors.map((color,i)=>{if(state.locks[i])return color;let[h,s,l]=rgbToHsl(hexToRgb(color));if(kind==='soft')s*=.72;if(kind==='bright')l=l+(100-l)*.13;if(kind==='deep'){s*=.82;l*=.86}if(kind==='contrast')l=l<50?Math.max(6,l-9):Math.min(96,l+9);return hslToHex(h,Math.min(100,s),Math.min(98,Math.max(4,l)))});state.adjustment={soft:'整体更柔和',bright:'整体更明亮',deep:'整体更稳重',contrast:'明暗对比更强'}[kind];state.name=`${state.name} · 已调整`;state.source='';renderAll(false)}
function applySeed(hex){let best={preset:0,color:0,score:Infinity};presets.forEach((p,pi)=>p.colors.forEach((c,ci)=>{const score=distance(hex,c);if(score<best.score)best={preset:pi,color:ci,score}}));loadPreset(best.preset);state.colors[best.color]=hex.toUpperCase();state.locks[best.color]=true;state.name=`${presets[best.preset].name} · 你的颜色`;state.note='从最接近的成熟套色开始';state.adjustment='已放入你的起始颜色';renderAll()}
function copy(text,msg){navigator.clipboard?.writeText(text).then(()=>toast(msg)).catch(()=>toast('复制失败，请手动复制'))}
function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),1900)}

$$('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('selected',x===b));renderPresets()});
$$('[data-adjust]').forEach(b=>b.onclick=()=>adjustColors(b.dataset.adjust));
$$('[data-preview]').forEach(b=>b.onclick=()=>{state.preview=b.dataset.preview;$$('[data-preview]').forEach(x=>x.classList.toggle('selected',x===b));renderPreview()});
$('#shuffleBtn').onclick=nextBestPreset;
$('#seedColor').oninput=e=>{$('#seedHex').value=e.target.value.toUpperCase()};
$('#seedHex').onchange=e=>{let v=e.target.value.trim();if(!v.startsWith('#'))v='#'+v;if(hexToRgb(v)){e.target.value=v.toUpperCase();$('#seedColor').value=v}else{e.target.value=$('#seedColor').value.toUpperCase();toast('请输入 6 位 HEX 色值')}};
$('#buildFromSeed').onclick=()=>{const v=$('#seedHex').value;if(hexToRgb(v))applySeed(v)};
$('#copyAllBtn').onclick=()=>copy(state.colors.join(' '),'整组五色已复制');
$('#saveBtn').onclick=()=>{const key='mengyu-saved-palettes';const list=JSON.parse(localStorage.getItem(key)||'[]');list.unshift({id:`palette-${Date.now()}`,name:state.name,colors:[...state.colors],scenario:state.scenario,rule:state.rule,source:state.source,savedAt:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(list.slice(0,30)));toast('已保存到当前浏览器；账号空间尚未接入')};
$('#downloadBtn').onclick=()=>{const pairs={light:pairAdvice(state.colors,'light'),dark:pairAdvice(state.colors,'dark')};const data={tool:'五色配色卡',version:3,name:state.name,colors:[...state.colors],scenario:state.scenario,usage:state.usage,harmony:state.rule,source:state.source||null,adjustment:state.adjustment,recommendedPairs:pairs,generatedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`五色配色_${state.name.replace(/\s+/g,'-')}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('配色 JSON 已下载')};

try{const old=JSON.parse(localStorage.getItem('mengyu-palette-project')||'null');if(old?.palette){const p=old.palette;state.colors=p.colors?.slice(0,5)||[p.bg,p.surface,p.primary,p.accent,p.text].filter(Boolean);while(state.colors.length<5)state.colors.push(presets[0].colors[state.colors.length]);state.name=p.name||'已保存配色';state.note='从旧版配色迁移';state.source='';state.adjustment='浏览器旧版配色';}}catch{}
renderAll();
