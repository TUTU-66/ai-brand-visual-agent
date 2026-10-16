const presets=[
 {id:'cool-wasabi',name:'冷蓝山葵',sourceName:'Pinterest Palette 2026 · Cool-Wasabi',source:'https://newsroom.pinterest.com/en-sg/news/from-cool-blue-to-persimmon-meet-the-2026-pinterest-palette/',colors:['#476B7C','#D7EFFF','#E9F056','#F7F8F2'],tags:['knowledge','website','poster'],scenario:'知识内容 / 年轻科技',usage:'课程封面、知识卡片、工具网站',rule:'冷色同类＋黄绿补充对比',note:'知识内容 · 冷静底色＋醒目标记',previewTitle:'重点更醒目，阅读仍然安静。',previewBody:'冷蓝承担大面积信息，深色保证正文可读；山葵黄绿只标记按钮、数字和重点。'},
 {id:'persimmon-plum',name:'柿橙深梅',sourceName:'Pinterest Palette 2026 · Persimmon-Plum',source:'https://newsroom.pinterest.com/en-sg/news/from-cool-blue-to-persimmon-meet-the-2026-pinterest-palette/',colors:['#351E28','#FFB59F','#FF5C34','#FFF4ED'],tags:['lifestyle','poster','brand'],scenario:'生活方式 / 活动传播',usage:'小红书封面、美妆餐饮、活动海报',rule:'橙红同类＋深梅冷暖对比',note:'生活方式 · 温暖亲近＋深色支点',previewTitle:'有热度，但不把整张图喊满。',previewBody:'奶油色留出呼吸，柿橙负责吸引注意，深梅承担标题和信息骨架。'},
 {id:'jade-clay',name:'玉石陶土',sourceName:'Pinterest Palette 2026 · Jade',source:'https://business.pinterest.com/en-gb/pinterest-palette/?show_preview=true',colors:['#72806B','#AEB8A0','#D2A96E','#F5F1E8'],tags:['lifestyle','website','brand'],scenario:'疗愈生活 / 自然品牌',usage:'健康内容、空间美学、手作品牌',rule:'绿色同类＋暖金邻近对比',note:'自然品牌 · 玉石绿不再单独成组',previewTitle:'绿色要有场景，也要有暖意。',previewBody:'玉石绿只负责自然气质，奶油底保证亲和，深梅与暖金补足文字和重点。'},
 {id:'navy-orange',name:'海军暖橙',sourceName:'Practical complementary palette',source:'https://color.adobe.com/create/color-wheel?version=published',colors:['#1E3548','#D9E5EA','#E07A3F','#F7F2E8'],tags:['website','knowledge','brand'],scenario:'专业服务 / 商业网站',usage:'个人主页、咨询服务、案例介绍',rule:'蓝橙补色＋低饱和中和',note:'专业网站 · 稳定可信＋一处行动色',previewTitle:'专业感来自秩序，不来自全灰。',previewBody:'海军蓝承担可信度，暖橙只用于行动按钮和关键数据，浅色负责大面积阅读。'},
 {id:'rose-teal',name:'粉土墨绿',sourceName:'Muted complementary palette',source:'https://www.canva.com/colors/color-wheel/',colors:['#2E4C46','#E7B8AA','#B9654B','#FFF5EF'],tags:['lifestyle','brand','website'],scenario:'个人表达 / 女性生活',usage:'人物故事、生活方式、个人品牌',rule:'红绿补色降饱和',note:'个人表达 · 温柔不甜腻',previewTitle:'柔和不是全浅，要留一个深支点。',previewBody:'粉土色制造亲近感，墨绿负责标题和结构；两边都降饱和，避免红绿直接冲撞。'},
 {id:'sand-indigo',name:'沙金靛蓝',sourceName:'Split-complementary editorial palette',source:'https://color.adobe.com/create/color-wheel?version=published',colors:['#36415E','#E6DCC7','#B88A44','#F5EFE3'],tags:['brand','website','knowledge'],scenario:'文化内容 / 高端品牌',usage:'品牌故事、编辑长图、文化项目',rule:'黄蓝补色＋深浅层次',note:'文化品牌 · 温润纸感＋克制金色',previewTitle:'让内容显得贵，不等于堆满金色。',previewBody:'沙色建立纸张感，靛蓝负责正文和版式骨架，金色只用于编号与细节。'},
 {id:'info-blue-gold',name:'信息蓝金',sourceName:'Accessible blue-orange palette',source:'https://color.adobe.com/create/color-wheel?version=published',colors:['#2A5CAA','#BFD7EA','#F2A541','#F5F7FA'],tags:['knowledge','website','poster'],scenario:'信息表达 / 数据内容',usage:'长图、报告、课程图表、发布页',rule:'蓝橙补色＋中性背景',note:'信息表达 · 层级清楚＋重点明确',previewTitle:'先把层级讲清，再让重点跳出来。',previewBody:'蓝色建立稳定的信息层级，橙金只标示关键数字；深色与浅底通过正文对比检查。'},
 {id:'violet-coral',name:'暮紫珊瑚',sourceName:'Analogous-plus-accent palette',source:'https://www.canva.com/colors/color-wheel/',colors:['#8467A7','#D6C6E1','#C96F5D','#FBF7F3'],tags:['lifestyle','poster','brand'],scenario:'创意表达 / 个人品牌',usage:'播客封面、个人栏目、创意活动',rule:'紫色同类＋珊瑚色强调',note:'创意表达 · 有个性但仍可阅读',previewTitle:'个性放在重点，不牺牲阅读。',previewBody:'紫色同类维持整体感，珊瑚色承担记忆点，深紫保证标题和正文稳定。'},
];

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const DEFAULT_PRESET=3, initial=presets[DEFAULT_PRESET];
const SNAPSHOT_SCHEMA='mengyu-palette-draft/v2',LEGACY_SNAPSHOT_SCHEMA='mengyu-palette-draft/v1';
const PACKAGE_SCHEMA='mengyu-four-role-palette-package/v1';
const ACTION_KINDS=new Set(['save','copy-color','copy-all','download-package']);
const FILTERS=new Set(['all','knowledge','website','lifestyle','poster','brand']);
const PREVIEW_MODES=new Set(['light','dark']);
const TEXT_LIMITS={name:120,note:240,sourceName:240,scenario:160,usage:240,rule:240,previewTitle:240,previewBody:1200,adjustment:160};
const initConfig=window.PaletteModuleConfig&&typeof window.PaletteModuleConfig==='object'?window.PaletteModuleConfig:{};
const actionTimeoutMs=Number.isFinite(Number(initConfig.actionTimeoutMs))?Math.min(30000,Math.max(50,Number(initConfig.actionTimeoutMs))):8000;
let actionHandler=null;
const state={presetIndex:DEFAULT_PRESET,filter:'all',colors:[...initial.colors],locks:[false,false,false,false],preview:'light',name:initial.name,note:initial.note,source:initial.source,sourceName:initial.sourceName,scenario:initial.scenario,usage:initial.usage,rule:initial.rule,previewTitle:initial.previewTitle,previewBody:initial.previewBody,adjustment:'精选应用套色'};

function resultError(code,message,details){return{ok:false,code,message,...(details===undefined?{}:{details})}}
function isPlainObject(value){return Boolean(value)&&typeof value==='object'&&!Array.isArray(value)}
function normalizeHex(value){if(typeof value!=='string')return null;const v=value.trim();return /^#[0-9a-f]{6}$/i.test(v)?v.toUpperCase():null}
function hexToRgb(hex){const normalized=normalizeHex(hex);if(!normalized)return null;const v=normalized.slice(1);return[0,2,4].map(i=>parseInt(v.slice(i,i+2),16))}
function rgbToHex(r,g,b){return'#'+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('').toUpperCase()}
function rgbToHsl(rgb){if(!Array.isArray(rgb)||rgb.length!==3)throw new TypeError('无效RGB');let[r,g,b]=rgb;r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d){if(max===r)h=((g-b)/d)%6;else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}const l=(max+min)/2,s=d?d/(1-Math.abs(2*l-1)):0;return[h,s*100,l*100]}
function hslToHex(h,s,l){s/=100;l/=100;const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let r=0,g=0,b=0;if(h<60)[r,g,b]=[c,x,0];else if(h<120)[r,g,b]=[x,c,0];else if(h<180)[r,g,b]=[0,c,x];else if(h<240)[r,g,b]=[0,x,c];else if(h<300)[r,g,b]=[x,0,c];else[r,g,b]=[c,0,x];return rgbToHex((r+m)*255,(g+m)*255,(b+m)*255)}
function luminance(hex){const source=hexToRgb(hex);if(!source)return NaN;const rgb=source.map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});return.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]}
function contrast(a,b){const l1=luminance(a),l2=luminance(b);if(!Number.isFinite(l1)||!Number.isFinite(l2))return NaN;return(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)}
function bestOn(bg){return contrast('#FFFFFF',bg)>=contrast('#17171C',bg)?'#FFFFFF':'#17171C'}
function distance(a,b){const ar=hexToRgb(a),br=hexToRgb(b);if(!ar||!br)return Infinity;return Math.sqrt(ar.reduce((sum,v,i)=>sum+(v-br[i])**2,0))}
function paletteDistance(a,b){const oneWay=(from,to)=>from.reduce((sum,c)=>sum+Math.min(...to.map(x=>distance(c,x))),0)/from.length;return(oneWay(a,b)+oneWay(b,a))/2}
function saturation(hex){const rgb=hexToRgb(hex);return rgb?rgbToHsl(rgb)[1]:0}
function sortedEntries(colors){return colors.map((color,index)=>({color,index,light:luminance(color),sat:saturation(color)})).sort((a,b)=>a.light-b.light||a.index-b.index)}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function escapeMarkdownText(value){return String(value).replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function safeHttpUrl(value){if(value==null||value==='')return'';if(typeof value!=='string'||value.length>1000)return null;try{const url=new URL(value);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)return null;return value}catch{return null}}

function deriveRoles(colors,mode){
  if(colors.length===4){
    const [primary,soft,accent,paper]=colors;
    return mode==='dark'
      ?{bg:primary,text:bestOn(primary),surface:soft,primary:soft,accent}
      :{bg:paper,text:bestOn(paper),surface:soft,primary,accent};
  }
  const sorted=sortedEntries(colors),bgEntry=mode==='dark'?sorted[0]:sorted[sorted.length-1],textEntry=mode==='dark'?sorted[sorted.length-1]:sorted[0];
  const middle=sorted.filter(entry=>entry.index!==bgEntry.index&&entry.index!==textEntry.index);
  const surfaceEntry=(mode==='dark'?[...middle].sort((a,b)=>a.sat-b.sat||a.index-b.index):[...middle].sort((a,b)=>b.light-a.light||a.index-b.index))[0]||bgEntry;
  const remaining=middle.filter(entry=>entry.index!==surfaceEntry.index).sort((a,b)=>b.sat-a.sat||a.index-b.index);
  const accentEntry=remaining[0]||surfaceEntry,primaryEntry=remaining[1]||remaining[0]||surfaceEntry;
  return{bg:bgEntry.color,text:textEntry.color,surface:surfaceEntry.color,primary:primaryEntry.color,accent:accentEntry.color};
}
function pairAdvice(colors,mode){
  const sorted=sortedEntries(colors),bgEntry=mode==='dark'?sorted[0]:sorted[sorted.length-1];
  const candidates=sorted.filter(entry=>entry.index!==bgEntry.index).map(entry=>({c:entry.color,ratio:contrast(entry.color,bgEntry.color),index:entry.index})).sort((a,b)=>b.ratio-a.ratio||a.index-b.index);
  const best=candidates[0]||{c:bgEntry.color,ratio:1};
  return{bg:bgEntry.color,fg:best.c,ratio:Number.isFinite(best.ratio)?best.ratio:1};
}

function boundedText(value,field,fallback,legacy,defaultsApplied){
  if(value===undefined||value===null){if(legacy)defaultsApplied.push(field);return fallback}
  if(typeof value!=='string')throw new TypeError(`${field} 必须是文字`);
  if(value.length>TEXT_LIMITS[field]||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value))throw new TypeError(`${field} 超出允许范围`);
  return value;
}
function inferPresetId(colors){const exact=presets.find(p=>p.colors.every((color,index)=>color===colors[index]));return exact?exact.id:null}
function migrateLegacyColors(colors,presetId){
  const known={
   'cool-wasabi':[2,1,3,0],'persimmon-plum':[3,1,2,0],'jade-clay':[2,1,4,0],'navy-orange':[2,1,3,0],
   'rose-teal':[3,1,2,0],'sand-indigo':[3,1,2,0],'info-blue-gold':[2,1,3,0],'violet-coral':[2,1,3,0]
  },indices=known[presetId];
  if(indices)return{colors:indices.map(i=>colors[i]),indices};
  const roles=deriveRoles(colors,'light'),mapped=[roles.primary,roles.surface,roles.accent,roles.bg];
  return{colors:mapped,indices:mapped.map(color=>colors.indexOf(color))};
}
function normalizeSnapshot(input,{allowLegacy=true}={}){
  let source=input;
  if(isPlainObject(source)&&isPlainObject(source.palette)){source=source.palette}
  if(!isPlainObject(source))throw new TypeError('配色快照必须是对象');
  const legacy=!source.schema||source.schema===LEGACY_SNAPSHOT_SCHEMA;
  if(legacy&&!allowLegacy)throw new TypeError('缺少配色快照schema');
  if(source.schema&&![SNAPSHOT_SCHEMA,LEGACY_SNAPSHOT_SCHEMA].includes(source.schema))throw new TypeError('不支持的配色快照schema');
  let rawColors=source.colors;
  if(!Array.isArray(rawColors)&&legacy)rawColors=[source.bg,source.surface,source.primary,source.accent,source.text].filter(value=>value!==undefined);
  if(!Array.isArray(rawColors)||![4,5].includes(rawColors.length)||(rawColors.length===5&&!legacy))throw new TypeError('配色快照必须包含4个角色色');
  const originalColors=rawColors.map(normalizeHex);
  if(originalColors.some(color=>!color))throw new TypeError('配色快照包含非法HEX');
  const migrated=originalColors.length===5?migrateLegacyColors(originalColors,source.presetId):{colors:originalColors,indices:[0,1,2,3]},colors=migrated.colors;
  let presetId=source.presetId;
  if(presetId===undefined&&legacy)presetId=inferPresetId(colors);
  if(presetId!==null&&presetId!==undefined&&(typeof presetId!=='string'||!presets.some(p=>p.id===presetId)))throw new TypeError('presetId无效');
  if(!legacy&&presetId===undefined)throw new TypeError('配色快照缺少presetId');
  presetId=presetId||null;
  const preset=presets.find(p=>p.id===presetId)||presets.find(p=>p.id===inferPresetId(colors))||initial;
  const defaultsApplied=[];
  let locks=source.locks;
  if(locks===undefined&&legacy){locks=originalColors.map(()=>false);defaultsApplied.push('locks')}
  if(!Array.isArray(locks)||locks.length!==originalColors.length||locks.some(value=>typeof value!=='boolean'))throw new TypeError('locks数量必须与颜色一致');
  if(originalColors.length===5){locks=migrated.indices.map(index=>Boolean(locks[index]));defaultsApplied.push('legacy-five-to-four')}
  let preview=source.preview;
  if(preview===undefined&&legacy){preview='light';defaultsApplied.push('preview')}
  if(!PREVIEW_MODES.has(preview))throw new TypeError('preview无效');
  let filter=source.filter;
  if(filter===undefined&&legacy){filter='all';defaultsApplied.push('filter')}
  if(!FILTERS.has(filter))throw new TypeError('filter无效');
  const normalized={schema:SNAPSHOT_SCHEMA,presetId,colors:[...colors],locks:[...locks],preview,filter};
  for(const field of ['name','note','sourceName','scenario','usage','rule','previewTitle','previewBody','adjustment']){
    const fallback=field==='adjustment'?'浏览器旧版配色':preset[field]||'';
    normalized[field]=boundedText(source[field],field,fallback,legacy,defaultsApplied);
  }
  const rawSource=source.source===undefined&&legacy?preset.source:source.source;
  if(source.source===undefined&&legacy)defaultsApplied.push('source');
  const safeSource=safeHttpUrl(rawSource);
  if(safeSource===null)throw new TypeError('source仅允许安全的http(s)链接');
  normalized.source=safeSource;
  return{snapshot:normalized,legacy,defaultsApplied};
}
function getSnapshot(){
  const preset=presets[state.presetIndex];
  return clone({schema:SNAPSHOT_SCHEMA,presetId:preset?.id||null,colors:[...state.colors],locks:[...state.locks],preview:state.preview,filter:state.filter,name:state.name,note:state.note,source:state.source,sourceName:state.sourceName,scenario:state.scenario,usage:state.usage,rule:state.rule,previewTitle:state.previewTitle,previewBody:state.previewBody,adjustment:state.adjustment});
}
function applySnapshot(snapshot){
  state.presetIndex=snapshot.presetId?presets.findIndex(p=>p.id===snapshot.presetId):-1;
  state.colors=[...snapshot.colors];state.locks=[...snapshot.locks];state.preview=snapshot.preview;state.filter=snapshot.filter;
  for(const field of ['name','note','source','sourceName','scenario','usage','rule','previewTitle','previewBody','adjustment'])state[field]=snapshot[field];
}
function restoreSnapshot(input){
  const before=getSnapshot();
  try{
    const normalized=normalizeSnapshot(input,{allowLegacy:true});
    applySnapshot(normalized.snapshot);
    try{renderAll();syncControls()}catch(error){applySnapshot(before);renderAll();syncControls();throw error}
    return{ok:true,snapshot:getSnapshot(),legacy:normalized.legacy,defaultsApplied:[...normalized.defaultsApplied]};
  }catch(error){return resultError('invalid-snapshot',error.message)}
}

function renderPresets(){
  const items=presets.map((p,i)=>({p,i})).filter(({p})=>state.filter==='all'||p.tags.includes(state.filter));
  $('#presetList').innerHTML=items.map(({p,i})=>`<button class="preset-card ${i===state.presetIndex?'selected':''}" data-preset="${i}" aria-label="使用${escapeHtml(p.name)}"><span class="mini-palette">${p.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span><span class="preset-copy"><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.scenario)}<br>${escapeHtml(p.rule)}</small></span></button>`).join('');
  $$('[data-preset]').forEach(button=>button.onclick=()=>loadPreset(Number(button.dataset.preset)));
}
function renderSwatches(){
  const labels=['主色','辅助色','强调色','页面底色'];
  $('#swatchGrid').innerHTML=state.colors.map((color,i)=>`<article class="swatch" style="background:${color};color:${bestOn(color)}"><button class="lock ${state.locks[i]?'locked':''}" data-lock="${i}" aria-label="${state.locks[i]?'取消锁定':'锁定'}${labels[i]}"><span class="lock-icon" aria-hidden="true"></span><span>${state.locks[i]?'已锁定':'锁定'}</span></button><strong>${labels[i]}</strong><button class="copy-color" data-copy-index="${i}" aria-label="复制${color}"><code>${color}</code></button><label>修改<input type="color" value="${color}" data-color-input="${i}" aria-label="修改${labels[i]}"></label></article>`).join('');
  $$('[data-lock]').forEach(button=>button.onclick=()=>{const i=Number(button.dataset.lock);state.locks[i]=!state.locks[i];renderSwatches();toast(state.locks[i]?'已锁定这个颜色':'已取消锁定')});
  $$('[data-copy-index]').forEach(button=>button.onclick=()=>void runUiAction('copy-color',{index:Number(button.dataset.copyIndex)},button,'正在复制…'));
  $$('[data-color-input]').forEach(input=>input.oninput=event=>{const i=Number(input.dataset.colorInput),color=normalizeHex(event.target.value);if(!color)return;state.colors[i]=color;state.adjustment='手动修改';state.presetIndex=-1;renderAll(false)});
}
function renderEvidence(){const light=pairAdvice(state.colors,'light'),dark=pairAdvice(state.colors,'dark');$('#scenarioText').textContent=state.scenario;$('#usageText').textContent=state.usage;$('#harmonyText').textContent=state.rule;$('#lightPair').textContent=`${light.bg} / ${light.fg}`;$('#darkPair').textContent=`${dark.bg} / ${dark.fg}`;setPair('#lightPass',light.ratio);setPair('#darkPass',dark.ratio)}
function setPair(selector,ratio){const el=$(selector),body=ratio>=4.5,large=ratio>=3;el.textContent=`${ratio.toFixed(2)}:1 · ${body?'正文可用':large?'仅建议大字':'对比不足'}`;el.classList.toggle('fail',!body)}
function renderPreview(){
  const roles=deriveRoles(state.colors,state.preview),onAccent=bestOn(roles.accent),ratio=contrast(roles.bg,roles.text),bodySafe=ratio>=4.5,root=document.documentElement;
  root.style.setProperty('--c-bg',roles.bg);root.style.setProperty('--c-surface',roles.surface);root.style.setProperty('--c-primary',roles.primary);root.style.setProperty('--c-accent',roles.accent);root.style.setProperty('--c-text',roles.text);root.style.setProperty('--c-on-accent',onAccent);
  const body=bodySafe?`<p class="copy-body">${escapeHtml(state.previewBody)}</p>`:`<p class="copy-body copy-body-blocked">当前四色缺少正文级明暗差，正文暂不进入画面。点击“对比更强”后再试。</p>`;
  const title=escapeHtml(state.previewTitle).replace('，','，<br>');
  $('#previewShell').innerHTML=`<div class="preview-board ${state.preview}">
   <article class="demo-card copy-demo">
    <header class="demo-caption"><span>文字海报</span><small>${bodySafe?'正文对比通过':'正文对比不足'} · ${ratio.toFixed(2)}:1</small></header>
    <div class="copy-poster">
     <div class="copy-rail"><span>${escapeHtml(state.scenario)}</span><i></i></div>
     <div class="copy-content"><p class="copy-kicker">这组颜色可以这样使用</p><h3>${title}</h3>${body}<div class="copy-action"><b>${escapeHtml(state.adjustment)}</b><span>${escapeHtml(state.usage.split('、')[0])}</span></div></div>
     <div class="copy-footer"><span>四色应用示例</span><strong>${escapeHtml(state.name)}</strong></div>
    </div>
   </article>
   <article class="demo-card graphic-demo">
    <header class="demo-caption"><span>图形构成</span><small>固定网格 · 四色面积有主次</small></header>
    <div class="graphic-poster" aria-label="使用当前四色生成的几何构成">
      <i class="geo geo-a"></i><i class="geo geo-b"></i><i class="geo geo-c"></i><i class="geo geo-d"></i><i class="geo geo-e"></i><i class="geo geo-f"></i><i class="geo geo-g"></i><i class="geo geo-h"></i>
    </div>
   </article>
  </div>`;
}
function renderAll(refreshList=true){$('#paletteName').textContent=state.name;$('#paletteBasis').textContent=state.note;$('#sourceLink').href=state.source||'https://color.adobe.com/create/color-wheel';$('#sourceLink').textContent='查看配色依据';if(refreshList)renderPresets();renderSwatches();renderEvidence();renderPreview()}
function syncControls(){$$('[data-filter]').forEach(button=>button.classList.toggle('selected',button.dataset.filter===state.filter));$$('[data-preview]').forEach(button=>button.classList.toggle('selected',button.dataset.preview===state.preview))}

function loadPreset(index,keepLocks=false){const p=presets[index];if(!p)return;state.presetIndex=index;state.name=p.name;state.note=p.note;state.source=p.source;state.sourceName=p.sourceName;state.scenario=p.scenario;state.usage=p.usage;state.rule=p.rule;state.previewTitle=p.previewTitle;state.previewBody=p.previewBody;state.adjustment='精选应用套色';if(keepLocks){p.colors.forEach((color,i)=>{if(!state.locks[i])state.colors[i]=color})}else{state.colors=[...p.colors];state.locks=[false,false,false,false]}renderAll();syncControls()}
function nextBestPreset(){const locked=state.colors.filter((_,i)=>state.locks[i]);const candidates=presets.map((p,i)=>({i,score:locked.length?locked.reduce((sum,c)=>sum+Math.min(...p.colors.map(x=>distance(c,x))),0):paletteDistance(state.colors,p.colors)})).filter(x=>x.i!==state.presetIndex).sort((a,b)=>a.score-b.score);if(candidates[0]){loadPreset(candidates[0].i,locked.length>0);state.adjustment=locked.length?'保留锁定色，替换其余颜色':'换用相近的精选套色';renderAll()}}
function adjustColors(kind){state.colors=state.colors.map((color,i)=>{if(state.locks[i])return color;let[h,s,l]=rgbToHsl(hexToRgb(color));if(kind==='soft')s*=.72;if(kind==='bright')l=l+(100-l)*.13;if(kind==='deep'){s*=.82;l*=.86}if(kind==='contrast')l=l<50?Math.max(6,l-9):Math.min(96,l+9);return hslToHex(h,Math.min(100,s),Math.min(98,Math.max(4,l)))});state.adjustment={soft:'整体更柔和',bright:'整体更明亮',deep:'整体更稳重',contrast:'明暗对比更强'}[kind];state.name=`${state.name} · 已调整`;state.source='';state.presetIndex=-1;renderAll(false)}
function applySeed(hex){const normalized=normalizeHex(hex);if(!normalized)return;let best={preset:0,color:0,score:Infinity};presets.forEach((p,pi)=>p.colors.forEach((color,ci)=>{const score=distance(normalized,color);if(score<best.score)best={preset:pi,color:ci,score}}));loadPreset(best.preset);state.colors[best.color]=normalized;state.locks[best.color]=true;state.name=`${presets[best.preset].name} · 你的颜色`;state.note='从最接近的成熟套色开始';state.adjustment='已放入你的起始颜色';state.presetIndex=-1;renderAll()}
function toast(text){const element=$('#toast');element.textContent=text;element.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>element.classList.remove('show'),1900)}

function paletteProfile(snapshot){
  const enrich=roles=>({...roles,onBg:bestOn(roles.bg),onSurface:bestOn(roles.surface),onPrimary:bestOn(roles.primary),onAccent:bestOn(roles.accent)}),lightRoles=enrich(deriveRoles(snapshot.colors,'light')),darkRoles=enrich(deriveRoles(snapshot.colors,'dark')),pairs={light:pairAdvice(snapshot.colors,'light'),dark:pairAdvice(snapshot.colors,'dark')},pairContrast=roles=>({textOnBg:contrast(roles.text,roles.bg),onBg:contrast(roles.onBg,roles.bg),onSurface:contrast(roles.onSurface,roles.surface),onPrimary:contrast(roles.onPrimary,roles.primary),onAccent:contrast(roles.onAccent,roles.accent)});
  return{schema:PACKAGE_SCHEMA,draftSchema:SNAPSHOT_SCHEMA,tool:'四色配色卡',presetId:snapshot.presetId,name:snapshot.name,colors:[...snapshot.colors],scenario:snapshot.scenario,usage:snapshot.usage,harmony:snapshot.rule,source:snapshot.source||null,adjustment:snapshot.adjustment,recommendedRoles:{light:lightRoles,dark:darkRoles},recommendedPairs:pairs,contrast:{light:pairContrast(lightRoles),dark:pairContrast(darkRoles)},accessibilityNeutrals:{allowed:['#17171C','#FFFFFF'],scope:'Foreground text and essential icons only, used when none of the four role colors reaches the required contrast. They do not become decorative palette colors and are not adjusted.'},applicationGuidance:{base:'55–75% starting range',supporting:'15–35% starting range',accent:'5–15% starting range',note:'These are composition starting ranges, not rigid quotas.'},adjustmentGuardrails:{colorSpace:'HSL',compareAgainst:'Always compare with the original four role tokens, not the previous revision.',perRevision:{hue:'≤12°',saturation:'≤15 percentage points',lightness:'≤15 percentage points'},cumulative:'The same limits also apply to total drift from the original token.',afterEveryAdjustment:['recheck every actual foreground/background pair','recheck hierarchy in grayscale'],beyondGuardrail:'Ask for user confirmation and record the reason.'},rolePolicy:'Four colors are stable role tokens: primary, soft, emphasis and paper. Keep these roles when handing off to another tool and recheck contrast in the actual layout.',generatedAt:new Date().toISOString()};
}
function tokensCss(profile){const lines=profile.colors.map((color,i)=>`  --palette-${i+1}: ${color};`).join('\n'),light=profile.recommendedRoles.light,dark=profile.recommendedRoles.dark;const block=roles=>`  --color-bg: ${roles.bg};\n  --color-on-bg: ${roles.onBg};\n  --color-surface: ${roles.surface};\n  --color-on-surface: ${roles.onSurface};\n  --color-text: ${roles.text};\n  --color-primary: ${roles.primary};\n  --color-on-primary: ${roles.onPrimary};\n  --color-accent: ${roles.accent};\n  --color-on-accent: ${roles.onAccent};`;return`:root {\n${lines}\n${block(light)}\n}\n[data-theme="dark"] {\n${block(dark)}\n}\n/* 四个 token 固定对应主色、辅助色、强调色和页面底色；每个真实前景／背景组合仍需重新检查。 */\n`}
function paletteReadme(){return`# 四色配色应用包\n\n这不是只列四个角色 HEX 的 JSON。包内同时给出双场景样张、CSS tokens、推荐明／暗角色、搭配依据和 AI 接手规则。\n\n## 先看\n\n- sample/preview.html：同一四色在浅底与深底场景中的真实关系\n- config/palette.json：四色、用途、依据、推荐角色和对比数据\n- assets/tokens.css：可直接引入的颜色变量\n- AI-HANDOFF.md：另一位 AI 应怎样使用\n\n四个颜色固定对应主色、辅助色、强调色和页面底色。跨工具沿用同一角色；正文可另外使用合格的中性文字色。\n`}
function paletteHandoff(snapshot){return`# AI-HANDOFF｜四色配色接手合同\n\n## 这是什么\n\n这是一组用于“${escapeMarkdownText(snapshot.scenario)}”的四色应用包，不是让你把四个角色色平均铺满画面。先打开 sample/preview.html，再读 config/palette.json。\n\n## 使用原则\n\n- 先确定具体作品是浅底还是深底，再从 recommendedRoles 选择起点。\n- 面积只作起始参考：基础色 55–75%、辅助色 15–35%、强调色 5–15%，根据真实内容调整，不当成机械配额。\n- 大面积使用稳定背景与表面色；正文使用通过对比检查的深／浅文字色；高饱和或补色只用于按钮、数字、标签和重点。\n- 四个角色不要静默互换；跨工具继续沿用主色、辅助色、强调色和页面底色的对应关系。\n- 以原始四色为 HSL 比较基准；单轮和累计漂移都建议限制在色相 12°、饱和度或明度 15 个百分点以内；每次调整后重查所有实际前景／背景对比与灰度层级。超出时必须让用户确认并记录原因。\n- 使用 onBg／onSurface／onPrimary／onAccent 作为起点；每个真实前景／背景组合都要单独检查，不能只用页面大背景的比值代替。#17171C／#FFFFFF 仅是无四色可达标时的文字与必要图标辅助色，不进入装饰色板，也不参与调色。\n- 正文对比低于 4.5:1 时必须换组合或调色，不能只靠字重。\n\n## 默认不得修改\n\n不把场景说明删除后当成万能配色；不使用渐变制造不存在的综合色；不把强调色用于大段正文；不因“品牌感”编造 LOGO、数据或案例。\n\n## 完成定义\n\n作品层级在灰度下仍清楚；正文对比达到 4.5:1；强调色面积克制；浅／深场景至少各检查一次；最终使用的角色映射与超限调整写入交付说明。\n`}
function paletteQa(){return`# QA CHECKLIST\n\n- [ ] 已明确具体作品和浅底／深底模式\n- [ ] 四色原值均可追溯，没有随意新增强色\n- [ ] 背景、表面、正文、主色、强调色的角色已记录\n- [ ] 面积比例以 55–75%／15–35%／5–15% 为起点而非机械配额\n- [ ] textOnBg、onBg、onSurface、onPrimary、onAccent 及作品中的实际配对均已检查，普通正文对比至少 4.5:1\n- [ ] 颜色不是唯一的信息区分方式\n- [ ] 强调色只用于少量按钮、数字、标签和焦点\n- [ ] 已按 HSL 与原始 token 比较；单轮或累计超出色相 12°、饱和度／明度 15 个百分点时已由用户确认\n- [ ] 调色后已重查对比与灰度层级\n- [ ] 浅底与深底样张均检查过\n- [ ] 没有把场景配色冒充万能品牌规范\n`}
function palettePreview(profile,snapshot){
  const section=(label,roles)=>`<section style="--bg:${roles.bg};--on-bg:${roles.onBg};--surface:${roles.surface};--on-surface:${roles.onSurface};--primary:${roles.primary};--accent:${roles.accent};--accent-on:${roles.onAccent};--primary-on:${roles.onPrimary}"><span class="mode">${label}</span><div class="poster"><small>${escapeHtml(snapshot.scenario)}</small><h2>${escapeHtml(snapshot.previewTitle)}</h2><p>${escapeHtml(snapshot.previewBody)}</p><div><button>主要行动</button><b>01</b><i></i><i></i><i></i></div></div><div class="ui"><header><strong>案例标题</strong><button>查看详情</button></header><article><span>重点标签</span><h3>颜色先服务信息层级</h3><p>背景承担阅读，主色建立识别，强调色只指出真正重要的动作。</p></article></div></section>`;
  return`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(snapshot.name)}配色应用样张</title><link rel="stylesheet" href="../assets/tokens.css"><style>*{box-sizing:border-box}body{margin:0;background:#e9e9e6;font-family:system-ui,sans-serif;color:#17171c}body>header{padding:24px max(20px,5vw);display:flex;justify-content:space-between;background:#17171c;color:#fff}main{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:20px}section{position:relative;min-height:620px;padding:54px 28px 28px;background:var(--bg);color:var(--on-bg);border:1px solid #0002}.mode{position:absolute;top:20px;left:28px;font-size:12px;font-weight:700;letter-spacing:.12em}.poster{min-height:300px;padding:34px;background:var(--surface);color:var(--on-surface);display:flex;flex-direction:column;justify-content:center}.poster small{font-weight:800}.poster h2{font-size:38px;line-height:1.1;margin:14px 0}.poster p{line-height:1.7;max-width:520px}.poster>div{display:flex;align-items:center;gap:10px;margin-top:18px}.poster button,.ui button{border:0;background:var(--accent);color:var(--accent-on);padding:11px 16px;font-weight:700}.poster b{font-size:32px;color:var(--primary);margin-left:auto}.poster i{width:18px;height:18px;border-radius:50%;background:var(--primary)}.ui{margin-top:18px;border:1px solid currentColor}.ui header{padding:15px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid currentColor}.ui article{padding:24px}.ui article span{background:var(--primary);color:var(--primary-on);padding:5px 8px;font-size:12px}.ui h3{font-size:25px;margin:18px 0 8px}.ui p{line-height:1.7}@media(max-width:760px){main{grid-template-columns:1fr;padding:12px}section{min-height:auto}.poster h2{font-size:31px}body>header span{display:none}}</style></head><body><header><b>${escapeHtml(snapshot.name)}｜四色应用样张</b><span>${escapeHtml(snapshot.scenario)}</span></header><main>${section('LIGHT APPLICATION',profile.recommendedRoles.light)}${section('DARK APPLICATION',profile.recommendedRoles.dark)}</main></body></html>`;
}
async function buildPackage(input=getSnapshot()){
  const normalized=normalizeSnapshot(clone(input),{allowLegacy:true}).snapshot,profile=paletteProfile(normalized);
  return[{path:'README.md',data:paletteReadme(normalized)},{path:'AI-HANDOFF.md',data:paletteHandoff(normalized)},{path:'QA-CHECKLIST.md',data:paletteQa(normalized)},{path:'config/palette.json',data:PortablePackage.json(profile)},{path:'assets/tokens.css',data:tokensCss(profile)},{path:'sample/preview.html',data:palettePreview(profile,normalized)}];
}

function validateSavedEntries(list){
  if(!Array.isArray(list))return resultError('saved-data-not-array','已有本机配色不是列表，未覆盖原数据');
  for(let i=0;i<list.length;i++){
    const item=list[i];
    if(!isPlainObject(item)||typeof item.id!=='string'||!item.id||!Array.isArray(item.colors)||![4,5].includes(item.colors.length)||item.colors.some(color=>!normalizeHex(color)))return resultError('saved-data-invalid',`第${i+1}条本机配色无效，未覆盖原数据`);
  }
  return{ok:true};
}
function localSave(snapshot){
  const key='mengyu-saved-palettes';let raw,list;
  try{raw=localStorage.getItem(key)}catch(error){return resultError('storage-read-failed','无法读取本机配色，原数据未改',error.message)}
  if(raw===null)list=[];else{try{list=JSON.parse(raw)}catch(error){return resultError('storage-json-invalid','已有本机配色已损坏，未覆盖原数据',error.message)}}
  const valid=validateSavedEntries(list);if(!valid.ok)return valid;
  const record={...clone(snapshot),id:`palette-${Date.now()}`,savedAt:new Date().toISOString()};
  const next=[record,...list];
  try{localStorage.setItem(key,JSON.stringify(next))}catch(error){return resultError('storage-write-failed','本机空间不足或禁止写入，原数据未改',error.message)}
  return{ok:true,mode:'local-fallback',status:'permission-pending',record:clone(record),message:'已保存到当前浏览器；权限待接入'};
}
async function localCopy(text){
  if(!navigator.clipboard||typeof navigator.clipboard.writeText!=='function')return resultError('clipboard-unavailable','当前浏览器不能自动复制，请手动复制');
  try{await navigator.clipboard.writeText(text);return{ok:true,mode:'local-fallback',status:'permission-pending',message:'已复制；权限待接入'}}catch(error){return resultError('clipboard-denied','复制失败，请手动复制',error.message)}
}
async function localAction(kind,payload,snapshot){
  if(kind==='save')return localSave(snapshot);
  if(kind==='copy-color')return localCopy(snapshot.colors[payload.index]);
  if(kind==='copy-all')return localCopy(snapshot.colors.join(' '));
  if(kind==='download-package'){
    if(!window.PortablePackage||typeof PortablePackage.downloadZip!=='function')return resultError('package-runtime-missing','配色应用包暂时无法生成');
    try{const files=await buildPackage(snapshot);await PortablePackage.downloadZip(`四色配色应用包_${PortablePackage.sanitizeName(snapshot.name)}.zip`,files);return{ok:true,mode:'local-fallback',status:'permission-pending',message:'配色应用包已下载；权限待接入'}}catch(error){return resultError('package-failed','配色应用包生成失败，请稍后重试',error.message)}
  }
  return resultError('unsupported-action','不支持的配色动作');
}
function normalizeActionPayload(kind,payload,snapshot){
  const value=payload===undefined?{}:payload;if(!isPlainObject(value))throw new TypeError('动作参数必须是对象');
  if(kind==='copy-color'){const index=Number(value.index);if(!Number.isInteger(index)||index<0||index>=snapshot.colors.length)throw new TypeError('复制颜色位置无效');return{index}}
  return clone(value);
}
function withTimeout(promise,ms){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('adapter-timeout')),ms);Promise.resolve(promise).then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)})})}
async function dispatchAction(kind,payload={}){
  if(!ACTION_KINDS.has(kind))return resultError('unsupported-action','不支持的配色动作');
  const snapshot=getSnapshot();let safePayload;
  try{safePayload=normalizeActionPayload(kind,payload,snapshot)}catch(error){return resultError('invalid-action-payload',error.message)}
  if(actionHandler){
    const request=clone({kind,payload:safePayload,snapshot});
    try{
      const response=await withTimeout(Promise.resolve().then(()=>actionHandler(request)),actionTimeoutMs);
      if(!isPlainObject(response)||typeof response.ok!=='boolean')return resultError('adapter-invalid-result','配色适配器返回了无效结果');
      return clone({...response,mode:'adapter'});
    }catch(error){return resultError(error?.message==='adapter-timeout'?'adapter-timeout':'adapter-failed',error?.message==='adapter-timeout'?'操作超时，请稍后重试':'操作失败，请稍后重试',error?.message)}
  }
  if(initConfig.requireActionHandler===true)return resultError('adapter-required','账户适配器未就绪，请刷新后重试');
  return localAction(kind,safePayload,snapshot);
}
function setActionHandler(handler){if(handler!==null&&typeof handler!=='function')throw new TypeError('配色动作适配器必须是函数或null');actionHandler=handler;return{ok:true,active:Boolean(actionHandler)}}
async function runUiAction(kind,payload,button,busyLabel){
  if(button?.disabled)return resultError('action-busy','操作进行中');
  const label=button?.textContent||'';
  if(button){button.disabled=true;button.setAttribute('aria-busy','true');if(busyLabel)button.textContent=busyLabel}
  try{const result=await dispatchAction(kind,payload);toast(result.message||(result.ok?'操作完成':'操作未完成'));return result}
  finally{if(button){button.disabled=false;button.removeAttribute('aria-busy');if(busyLabel)button.textContent=label}}
}

$$('[data-filter]').forEach(button=>button.onclick=()=>{state.filter=button.dataset.filter;syncControls();renderPresets()});
$$('[data-adjust]').forEach(button=>button.onclick=()=>adjustColors(button.dataset.adjust));
$$('[data-preview]').forEach(button=>button.onclick=()=>{state.preview=button.dataset.preview;syncControls();renderPreview()});
$('#shuffleBtn').onclick=nextBestPreset;
$('#seedColor').oninput=event=>{$('#seedHex').value=event.target.value.toUpperCase()};
$('#seedHex').onchange=event=>{let value=event.target.value.trim();if(!value.startsWith('#'))value='#'+value;const normalized=normalizeHex(value);if(normalized){event.target.value=normalized;$('#seedColor').value=normalized}else{event.target.value=$('#seedColor').value.toUpperCase();toast('请输入 6 位 HEX 色值')}};
$('#buildFromSeed').onclick=()=>{const value=normalizeHex($('#seedHex').value);if(value)applySeed(value)};
$('#copyAllBtn').onclick=event=>void runUiAction('copy-all',{},event.currentTarget,'正在复制…');
$('#saveBtn').onclick=event=>void runUiAction('save',{},event.currentTarget,'正在保存…');
$('#downloadBtn').onclick=event=>void runUiAction('download-package',{},event.currentTarget,'正在生成…');

window.PaletteModule=Object.freeze({getSnapshot,restoreSnapshot,buildPackage,dispatchAction,setActionHandler});
const requestedPresetId=new URLSearchParams(location.search).get('preset');
const requestedPresetIndex=presets.findIndex(preset=>preset.id===requestedPresetId);
if(requestedPresetIndex>=0)loadPreset(requestedPresetIndex);
if(initConfig.autoRestoreLegacy!==false){
  try{const raw=localStorage.getItem('mengyu-palette-project');if(raw){const old=JSON.parse(raw);if(old?.palette){const restored=restoreSnapshot(old.palette);if(!restored.ok)console.warn('旧配色未自动恢复：',restored.code)}}}catch(error){console.warn('旧配色读取失败，未修改原数据：',error?.message)}
}
renderAll();syncControls();

