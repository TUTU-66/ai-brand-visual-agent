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
  paper:{name:'纸本注释',desc:'疏朗、细线、浅标记',colors:['#a94f2d','#ead6b2','#f7f1e6'],defaults:{title:'center',deck:'plain',chapter:'split',subtitle:'plain',body:'plain',emphasis:'marker',media:'single',list:'standard',ending:'rule'}},
  index:{name:'精密索引',desc:'编号、对齐、信息秩序',colors:['#14735f','#dce4df','#ffffff'],defaults:{title:'left',deck:'rule',chapter:'split',subtitle:'number',body:'justify',emphasis:'bold',media:'frame',list:'index',ending:'card'}},
  bold:{name:'强势编辑',desc:'大字、反白、强弱跳跃',colors:['#e94b2c','#ffd541','#f7f4ed'],defaults:{title:'left',deck:'rule',chapter:'dark',subtitle:'rule',body:'plain',emphasis:'highlight',media:'single',list:'cards',ending:'dark'}},
  soft:{name:'轻盈叙事',desc:'低对比、柔和块面',colors:['#6b6aa9','#dfe8d2','#fbf7ef'],defaults:{title:'tag',deck:'plain',chapter:'badge',subtitle:'label',body:'plain',emphasis:'marker',media:'single',list:'cards',ending:'soft'}}
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
  $('#styleGrid').innerHTML=Object.entries(styles).map(([id,s])=>`<button class="style-choice" data-style="${id}" style="--swatch-a:${s.colors[0]};--swatch-b:${s.colors[1]}"><i></i><b>${s.name}</b><small>${s.desc}</small></button>`).join('');
  $$('.style-choice').forEach(btn=>btn.addEventListener('click',()=>{
    const preset=styles[btn.dataset.style]; state.style=btn.dataset.style;state.colors=[...preset.colors];state.slots={...preset.defaults};
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
  article.style.setProperty('--accent',state.colors[0]);article.style.setProperty('--soft',state.colors[1]);article.style.setProperty('--paper',state.colors[2]);
  $('#primaryColor').value=state.colors[0];$('#softColor').value=state.colors[1];$('#paperColor').value=state.colors[2];
  $('#endingTitleInput').value=state.endingTitle;$('#endingNoteInput').value=state.endingNote;$('#endingTitle').textContent=state.endingTitle;$('#endingNote').textContent=state.endingNote;
  $$('.style-choice').forEach(b=>b.classList.toggle('active',b.dataset.style===state.style));
  $$('.option').forEach(b=>b.classList.toggle('active',state.slots[b.dataset.slot]===b.dataset.value));
  $$('#densityControl button').forEach(b=>b.classList.toggle('active',b.dataset.density===state.density));
  $$('#decorControl button').forEach(b=>b.classList.toggle('active',b.dataset.decor===state.decor));
  $('#outputName').textContent=`${styles[state.style].name} · 个人风格配置`;
}

function focusSlot(id){
  $$('.slot').forEach(card=>card.classList.toggle('active',card.dataset.slotCard===id));
  $$('.preview-node').forEach(n=>n.classList.toggle('preview-focus',n.dataset.slot===id));
  const card=$(`[data-slot-card="${id}"]`); if(card){card.classList.add('open');$('.slot-trigger',card).setAttribute('aria-expanded','true');card.scrollIntoView({block:'nearest',behavior:'smooth'})}
  setTimeout(()=>$$('.preview-focus').forEach(n=>n.classList.remove('preview-focus')),1200);
}

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
function save(){localStorage.setItem('mengyu-wechat-style-project',JSON.stringify(state));toast('项目已保存在当前浏览器')}
function download(){
  const payload={schema:'mengyu-wechat-style-profile/v0.1',createdAt:new Date().toISOString(),scope:'style-and-layout-only',wechatBackend:false,imageGeneration:false,baseStyle:{id:state.style,name:styles[state.style].name},semanticSlots:state.slots,colors:{primary:state.colors[0],soft:state.colors[1],paper:state.colors[2]},density:state.density,decoration:state.decor,ending:{title:state.endingTitle,note:state.endingNote,qrAsset:'user-provided'},mediaPolicy:{withImages:['single','equal-double'],withoutImages:'text-only',fallback:['equal-double','single','text-only']},status:{skillPackage:'not-implemented',crossArticleRegression:'pending'}};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='公众号个人风格配置.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('已下载风格配置；这不是 Skill 包')
}
function openDrawer(which){$('#controlPanel').classList.toggle('open',which==='control');$('#inspector').classList.toggle('open',which==='inspector');$('#drawerBackdrop').classList.add('show')}
function closeDrawers(){$('#controlPanel').classList.remove('open');$('#inspector').classList.remove('open');$('#drawerBackdrop').classList.remove('show')}

renderSlotList();renderStyles();
try{const saved=JSON.parse(localStorage.getItem('mengyu-wechat-style-project'));if(saved&&saved.slots)state={...initial,...saved,slots:{...initial.slots,...saved.slots}}}catch{}
applyState();

$$('[data-preview-view]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-preview-view]').forEach(b=>b.classList.toggle('active',b===btn));$('#phoneShell').classList.toggle('wide',btn.dataset.previewView==='wide')}));
$$('.preview-node').forEach(node=>node.addEventListener('click',e=>{e.stopPropagation();focusSlot(node.dataset.slot)}));
['primaryColor','softColor','paperColor'].forEach((id,i)=>$('#'+id).addEventListener('input',e=>{state.colors[i]=e.target.value;applyState()}));
$$('#densityControl button').forEach(b=>b.addEventListener('click',()=>{state.density=b.dataset.density;applyState()}));
$$('#decorControl button').forEach(b=>b.addEventListener('click',()=>{state.decor=b.dataset.decor;applyState()}));
$('#endingTitleInput').addEventListener('input',e=>{state.endingTitle=e.target.value;applyState()});$('#endingNoteInput').addEventListener('input',e=>{state.endingNote=e.target.value;applyState()});
$('#saveBtn').addEventListener('click',save);$('#downloadBtn').addEventListener('click',download);$('#mobileDownloadBtn').addEventListener('click',download);
$('#helpBtn').addEventListener('click',()=>$('#helpModal').showModal());$$('[data-modal-close]').forEach(b=>b.addEventListener('click',()=>$('#helpModal').close()));
$('#editDrawerBtn').addEventListener('click',()=>openDrawer('control'));$('#mobileStructureBtn').addEventListener('click',()=>openDrawer('control'));$('#mobileStyleBtn').addEventListener('click',()=>openDrawer('inspector'));$('#drawerBackdrop').addEventListener('click',closeDrawers);$$('[data-close-panel],[data-close-inspector]').forEach(b=>b.addEventListener('click',closeDrawers));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawers();if($('#helpModal').open)$('#helpModal').close()}});
