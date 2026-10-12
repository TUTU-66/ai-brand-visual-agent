(async()=>{
if(new URLSearchParams(location.search).has('template'))return;
const owned=await PlatformWorkspace.start('wechat-classic','classic','classic/v2');if(!owned)return;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

const slots=[
  {id:'title',name:'主标题',hint:'文章开场的第一层级',options:[['center','居中编辑','稳定、克制'],['left','左对齐大标题','更直接'],['block','深色标题块','强对比'],['tag','标签式开场','轻盈亲和']]},
  {id:'deck',name:'副标题／导语',hint:'补充主题或直接省略',options:[['plain','普通说明','低干扰'],['pill','胶囊副题','短句提示'],['rule','上下细线','信息说明'],['none','不使用','没有就省略']]},
  {id:'chapter',name:'章节标题',hint:'内容发生阶段变化时使用',options:[['split','编号分栏','CMP-H01'],['center','居中留白','CMP-H02'],['offset','错位标题','CMP-H03'],['dark','反白强标题','CMP-H04'],['badge','章节名牌','CMP-H05']]},
  {id:'subtitle',name:'小标题',hint:'正文内的局部转折',options:[['plain','自然小标题','只用字重'],['rule','下方细线','轻分隔'],['label','浅色标签','短标题'],['number','编号小标题','理性秩序'],['none','不使用','内容不需要']]},
  {id:'body',name:'正文结构',hint:'阅读优先，不靠字体制造风格',options:[['plain','自然左对齐','通用'],['justify','两端对齐','较正式'],['frame','整段细框','整章内容']]},
  {id:'emphasis',name:'正文强调',hint:'控制频率，避免整篇变花',options:[['marker','浅色下划线','短句强调'],['bold','主色加粗','关键词'],['highlight','浅色底标记','局部判断'],['quote','摘要卡','完整判断'],['compare','上下对照','不是／而是']]},
  {id:'media',name:'配图与图注',hint:'无图时自动退回纯文字',options:[['single','单图＋图注','默认稳定'],['double','等宽双图','两图相关'],['frame','单图细框','轻设计'],['none','纯文字','不留空槽']]},
  {id:'list',name:'引用／列表',hint:'只在内容存在关系时使用',options:[['standard','线性步骤','克制'],['cards','阶段卡片','CMP-L01'],['index','连续索引','CMP-L02'],['flow','三阶段流','CMP-L03'],['none','不使用','内容不需要']]},
  {id:'ending',name:'结尾引导',hint:'二维码使用用户自己的素材',options:[['rule','双细线结尾','纸本'],['card','索引边框','理性'],['dark','深色反白','强对比'],['soft','柔和卡片','亲和'],['minimal','极简结尾','无下边线']]}
];

const styles={
  green:{name:'橄榄舒展编注',desc:'橄榄套色、PART 章节、舒展长文',colors:['#72784f','#d6d9c5','#fbf8ef','#b96a3d'],defaults:{title:'center',deck:'pill',chapter:'center',subtitle:'plain',body:'plain',emphasis:'marker',media:'single',list:'index',ending:'card'}},
  paper:{name:'暖纸人文注释',desc:'疏朗、细线、浅标记',colors:['#a94f2d','#ead6b2','#f7f1e6','#c46d43'],defaults:{title:'center',deck:'plain',chapter:'split',subtitle:'plain',body:'plain',emphasis:'marker',media:'single',list:'standard',ending:'rule'}},
  index:{name:'墨绿信息索引',desc:'编号、对齐、信息秩序',colors:['#14735f','#dce4df','#ffffff','#b56f32'],defaults:{title:'left',deck:'rule',chapter:'split',subtitle:'number',body:'justify',emphasis:'bold',media:'frame',list:'index',ending:'card'}},
  bold:{name:'黑红强势编辑',desc:'大字、反白、强弱跳跃',colors:['#e94b2c','#ffd541','#f7f4ed','#b98200'],defaults:{title:'left',deck:'rule',chapter:'dark',subtitle:'rule',body:'plain',emphasis:'highlight',media:'single',list:'cards',ending:'dark'}},
  soft:{name:'柔紫轻盈叙事',desc:'低对比、柔和块面',colors:['#6b6aa9','#dfe8d2','#fbf7ef','#b96859'],defaults:{title:'tag',deck:'plain',chapter:'badge',subtitle:'label',body:'plain',emphasis:'marker',media:'single',list:'cards',ending:'soft'}},
  'mengyu-purple-editorial':{name:'紫调摄影编辑',desc:'白底紫色、摄影编辑与节奏强调',colors:['#6e43af','#e9e7f3','#ffffff','#171717'],density:'relaxed',decor:'none',defaults:{title:'center',deck:'plain',chapter:'center',subtitle:'plain',body:'plain',emphasis:'marker',media:'single',list:'index',ending:'soft'}},
  'pastel-art-editorial':{name:'粉彩艺术编辑',desc:'粉彩圆形、三点过渡与编辑留白',colors:['#c9d45a','#eef0df','#ffffff','#111111'],density:'relaxed',decor:'dots',defaults:{title:'left',deck:'plain',chapter:'offset',subtitle:'rule',body:'plain',emphasis:'highlight',media:'single',list:'index',ending:'soft'}},
  'monochrome-order':{name:'黑白留白秩序',desc:'黑白细线、方块秩序与高留白',colors:['#111111','#f1f1f1','#ffffff','#111111'],density:'relaxed',decor:'squares',defaults:{title:'center',deck:'plain',chapter:'center',subtitle:'rule',body:'plain',emphasis:'compare',media:'single',list:'index',ending:'minimal'}},
  'warm-orange-journal':{name:'暖橙旅行手账',desc:'暖橙编号、手账节奏与阶段叙事',colors:['#c45418','#f5dec8','#fff8e9','#b74812'],density:'balanced',decor:'none',defaults:{title:'left',deck:'plain',chapter:'split',subtitle:'rule',body:'plain',emphasis:'marker',media:'frame',list:'standard',ending:'soft'}},
  'warm-beige-lifestyle':{name:'暖米生活美学',desc:'暖米留白、菱形过渡与生活节奏',colors:['#a9773d','#efe1cf','#fffdf8','#a9773d'],density:'relaxed',decor:'none',defaults:{title:'center',deck:'plain',chapter:'center',subtitle:'plain',body:'justify',emphasis:'marker',media:'single',list:'standard',ending:'soft'}}
};

const initial={style:'paper',density:'balanced',decor:'dots',colors:[...styles.paper.colors],endingTitle:'扫码，继续关注',endingNote:'获取后续设计与 AI 实践更新',slots:{...styles.paper.defaults}};
let state=structuredClone(initial);
const article=$('#articlePreview');

function renderSlotList(){
  $('#slotList').innerHTML=slots.map((slot,i)=>`<section class="slot${i===0?' open':''}" data-slot-card="${slot.id}"><button class="slot-trigger" aria-expanded="${i===0}"><span class="slot-index">${String(i+1).padStart(2,'0')}</span><span class="slot-copy"><b>${slot.name}</b><small>${slot.hint}</small></span><span class="slot-arrow">›</span></button><div class="slot-options">${slot.options.map(o=>`<button class="option" data-slot="${slot.id}" data-value="${o[0]}"><b>${o[1]}</b><small>${o[2]}</small></button>`).join('')}</div></section>`).join('');
  $$('.slot-trigger').forEach(btn=>btn.addEventListener('click',()=>{
    const card=btn.closest('.slot'); const open=!card.classList.contains('open');
    $$('.slot').forEach(x=>{x.classList.remove('open');$('.slot-trigger',x).setAttribute('aria-expanded','false')});
    if(open){card.classList.add('open');btn.setAttribute('aria-expanded','true')}
  }));
  $$('.option').forEach(btn=>btn.addEventListener('click',()=>{state.slots[btn.dataset.slot]=btn.dataset.value;applyState();focusSlot(btn.dataset.slot)}));
}

function renderStyles(){
  $('#styleGrid').innerHTML=Object.entries(styles).map(([id,s])=>`<button class="style-choice" data-style="${id}" style="--swatch-a:${s.colors[0]};--swatch-b:${s.colors[1]};--swatch-c:${s.colors[3]}"><i><span></span></i><b>${s.name}</b><small>${s.desc}</small></button>`).join('');
  $$('.style-choice').forEach(btn=>btn.addEventListener('click',()=>{
    if(styles[btn.dataset.style]){location.href='wechat-template-editor.html?template='+encodeURIComponent(btn.dataset.style);return;}
    const preset=styles[btn.dataset.style]; state.style=btn.dataset.style;state.colors=[...preset.colors];state.slots={...preset.defaults};state.density=preset.density||'balanced';state.decor=preset.decor||'dots';
    applyState();toast(`已应用“${preset.name}”基础方向，可继续逐项调整`);
  }));
}

const classGroups={
  title:['title-left','title-block','title-tag'],deck:['deck-pill','deck-rule','deck-none'],chapter:['chapter-center','chapter-offset','chapter-dark','chapter-badge'],subtitle:['subtitle-rule','subtitle-label','subtitle-number','subtitle-none'],body:['body-plain','body-justify','body-frame'],emphasis:['emphasis-bold','emphasis-highlight','emphasis-quote','emphasis-compare'],media:['media-none','media-double','media-frame'],list:['list-cards','list-index','list-flow','list-none'],ending:['ending-card','ending-dark','ending-soft','ending-minimal']
};
function variantClass(slot,value){const defaults={title:'center',deck:'plain',chapter:'split',subtitle:'plain',body:'plain',emphasis:'marker',media:'single',list:'standard',ending:'rule'};return defaults[slot]===value?'':`${slot}-${value}`}

function applyState(){
  article.className=`wx-article style-${state.style} density-${state.density} decor-${state.decor}`;
  Object.values(classGroups).flat().forEach(c=>article.classList.remove(c));
  Object.entries(state.slots).forEach(([slot,value])=>{const c=variantClass(slot,value);if(c)article.classList.add(c)});
  article.style.setProperty('--accent',state.colors[0]);article.style.setProperty('--soft',state.colors[1]);article.style.setProperty('--paper',state.colors[2]);article.style.setProperty('--highlight',state.colors[3]||state.colors[0]);
  $('#primaryColor').value=state.colors[0];$('#softColor').value=state.colors[1];$('#paperColor').value=state.colors[2];$('#highlightColor').value=state.colors[3]||state.colors[0];
  $('#endingTitleInput').value=state.endingTitle;$('#endingNoteInput').value=state.endingNote;$('#endingTitle').textContent=state.endingTitle;$('#endingNote').textContent=state.endingNote;
  $$('.style-choice').forEach(b=>b.classList.toggle('active',b.dataset.style===state.style));
  $$('.option').forEach(b=>b.classList.toggle('active',state.slots[b.dataset.slot]===b.dataset.value));
  $$('#densityControl button').forEach(b=>b.classList.toggle('active',b.dataset.density===state.density));
  $$('#decorControl button').forEach(b=>b.classList.toggle('active',b.dataset.decor===state.decor));
  $('#outputName').textContent=`${styles[state.style].name} · 可执行文章 Skill`;
}

function focusSlot(id){
  $$('.slot').forEach(card=>card.classList.toggle('active',card.dataset.slotCard===id));
  $$('.preview-node').forEach(n=>n.classList.toggle('preview-focus',n.dataset.slot===id));
  const card=$(`[data-slot-card="${id}"]`); if(card){card.classList.add('open');$('.slot-trigger',card).setAttribute('aria-expanded','true');card.scrollIntoView({block:'nearest',behavior:'smooth'})}
  setTimeout(()=>$$('.preview-focus').forEach(n=>n.classList.remove('preview-focus')),1200);
}

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
async function save(){try{await PlatformWorkspace.save(state,'公众号经典排版');toast('项目已保存到我的资产')}catch(e){toast(e.message)}}
function styleProfile(){return{schema:'mengyu-wechat-style-package/v2',createdAt:new Date().toISOString(),scope:'wechat-article-style-and-layout',wechatBackend:false,imageGeneration:false,baseStyle:{id:state.style,name:styles[state.style].name},semanticSlots:state.slots,colors:{primary:state.colors[0],soft:state.colors[1],paper:state.colors[2],highlight:state.colors[3]||state.colors[0]},density:state.density,decoration:state.decor,ending:{title:state.endingTitle,note:state.endingNote,qrAsset:null,missingQrFallback:'Remove the QR block and keep a minimal text ending; never invent a code or contact.'},mediaPolicy:{withImages:['single','equal-double'],withoutImages:'text-only',fallbackOrder:['equal-double','single','text-only']},outputContract:{renderer:'scripts/render_article.py',input:'input/article.json',article:'output/article-fragment.html',preview:'output/article-preview.html',report:'output/render-report.json',articleIsFragment:true,previewIsReviewPageOnly:true},stabilityTarget:{rule:'Pass only when all 3 critical dimensions plus at least 4 of the 5 supporting dimensions are stable (7 of 8 total).',criticalDimensions:['title hierarchy','body readability and density','component geometry'],supportingDimensions:['color roles','emphasis grammar','image treatment','decoration language','ending module'],failureExamples:['turning the article into a landing page, poster or card wall','changing article width or title/body geometry','leaving empty media or QR placeholders']},truthBoundary:'This package renders an article fragment and review preview. It does not connect to WeChat backend, publish drafts, generate images or store credentials.'}}
async function download(){return PlatformWorkspace.download('wechat',{mode:'classic',profile:styleProfile()},$('#downloadBtn'),toast)}
function openDrawer(which){$('#controlPanel').classList.toggle('open',which==='control');$('#inspector').classList.toggle('open',which==='inspector');$('#drawerBackdrop').classList.add('show')}
function closeDrawers(){$('#controlPanel').classList.remove('open');$('#inspector').classList.remove('open');$('#drawerBackdrop').classList.remove('show')}

renderSlotList();renderStyles();
try{const saved=owned.entry?.data;if(saved&&saved.slots)state={...initial,...saved,slots:{...initial.slots,...saved.slots}}}catch{}
if(!styles[state.style])state=structuredClone(initial);
if(!state.colors[3])state.colors[3]=(styles[state.style]?.colors[3]||state.colors[0]);
const pageParams=new URLSearchParams(location.search);
const requestedTemplate=pageParams.get('template');
if(requestedTemplate&&styles[requestedTemplate]){
  const preset=styles[requestedTemplate];
  state={...state,style:requestedTemplate,colors:[...preset.colors],slots:{...preset.defaults},density:preset.density||'balanced',decor:preset.decor||'dots'};
}
applyState();

$$('[data-preview-view]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-preview-view]').forEach(b=>b.classList.toggle('active',b===btn));$('#phoneShell').classList.toggle('wide',btn.dataset.previewView==='wide')}));
$$('.preview-node').forEach(node=>node.addEventListener('click',e=>{e.stopPropagation();focusSlot(node.dataset.slot)}));
[['primaryColor',0],['softColor',1],['paperColor',2],['highlightColor',3]].forEach(([id,i])=>$('#'+id).addEventListener('input',e=>{state.colors[i]=e.target.value;applyState()}));
$$('#densityControl button').forEach(b=>b.addEventListener('click',()=>{state.density=b.dataset.density;applyState()}));
$$('#decorControl button').forEach(b=>b.addEventListener('click',()=>{state.decor=b.dataset.decor;applyState()}));
$('#endingTitleInput').addEventListener('input',e=>{state.endingTitle=e.target.value;applyState()});$('#endingNoteInput').addEventListener('input',e=>{state.endingNote=e.target.value;applyState()});
$('#saveBtn').addEventListener('click',save);$('#downloadBtn').addEventListener('click',download);$('#mobileDownloadBtn').addEventListener('click',download);
$('#helpBtn').addEventListener('click',()=>$('#helpModal').showModal());$$('[data-modal-close]').forEach(b=>b.addEventListener('click',()=>$('#helpModal').close()));
$('#editDrawerBtn').addEventListener('click',()=>openDrawer('control'));$('#mobileStructureBtn').addEventListener('click',()=>openDrawer('control'));$('#mobileStyleBtn').addEventListener('click',()=>openDrawer('inspector'));$('#drawerBackdrop').addEventListener('click',closeDrawers);$$('[data-close-panel],[data-close-inspector]').forEach(b=>b.addEventListener('click',closeDrawers));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawers();if($('#helpModal').open)$('#helpModal').close()}});
if(pageParams.get('download')==='1')setTimeout(async()=>{await download();pageParams.delete('download');history.replaceState({},'',`${location.pathname}?${pageParams.toString()}`)},500);

window.styleProfile=styleProfile;
})();
