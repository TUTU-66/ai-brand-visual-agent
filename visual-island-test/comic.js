const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const styleImages={p01:'assets/comic/xiaomiao-p01-v4.webp',p02:'assets/comic/xiaomiao-p02-v4.webp',p03:'assets/comic/xiaomiao-p03-v4.webp',p04:'assets/comic/xiaomiao-p04-v4.webp',p05:'assets/comic/xiaomiao-p05-v4.webp',p06:'assets/comic/xiaomiao-p06-v4.webp'};
const styleAlts={p01:'好奇小喵工具屋扁平编辑完整漫画',p02:'好奇小喵工具屋轻线条完整漫画',p03:'好奇小喵工具屋手绘日记完整漫画',p04:'好奇小喵工具屋黑白报刊完整漫画',p05:'好奇小喵工具屋孔版印刷完整漫画',p06:'好奇小喵工具屋剪纸拼贴完整漫画'};
const STORAGE_KEY='mengyu-comic-project-v01';
const styleNames={p01:'扁平编辑',p02:'轻线条',p03:'手绘日记',p04:'黑白报刊',p05:'孔版印刷',p06:'剪纸拼贴'};
const validFonts=new Set(['editorial','diary','news','bold']);
const validRoutes=new Set(['故事型内容','流程型内容','对比型内容','对话型内容','解释型内容']);
const colorPattern=/^#[0-9a-f]{6}$/i;
const state={style:'p01',styleName:'扁平编辑',title:'好奇小喵的工具屋',content:$('#contentInput').value,identity:false,colors:{primary:'#315cd6',accent:'#ef5a3c',paper:'#f6f2e9'},font:'editorial',route:'故事型内容',loadedStatus:'unvalidated-draft'};
function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
function analyze(text){if(/后来|然后|有一天|终于|故事|经历/.test(text))return'故事型内容';if(/步骤|首先|其次|最后|流程|第[一二三四五六]/.test(text))return'流程型内容';if(/之前|之后|对比|不同|变化|前后/.test(text))return'对比型内容';if(/[“”「」]|问：|答：|为什么.*\?/.test(text))return'对话型内容';return'解释型内容'}
function renderTitle(value){const title=(value||'未命名漫画').trim();const key=title.includes('漂移')?'漂移':title.includes('结果')?'结果':'';$('#previewTitle').innerHTML=key?escapeHtml(title).replace(escapeHtml(key),'<em>'+escapeHtml(key)+'</em>'):escapeHtml(title);requestAnimationFrame(fitComic)}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function update(){document.documentElement.style.setProperty('--primary',state.colors.primary);document.documentElement.style.setProperty('--accent',state.colors.accent);document.documentElement.style.setProperty('--comic-paper',state.colors.paper);document.body.classList.remove('font-editorial','font-diary','font-news','font-bold');document.body.classList.add(`font-${state.font}`);$('#previewImage').src=styleImages[state.style];$('#previewImage').alt=styleAlts[state.style];$('#styleState').textContent=`${state.styleName} · 好奇小喵完整样张`;$('#routeStatus').textContent=state.route;renderTitle(state.title)}
$$('.style-card').forEach(card=>card.onclick=()=>{$$('.style-card').forEach(x=>x.classList.remove('active'));card.classList.add('active');state.style=card.dataset.style;state.styleName=card.dataset.name;update()});
$('#titleInput').addEventListener('input',e=>{state.title=e.target.value;renderTitle(state.title)});$('#contentInput').addEventListener('input',e=>state.content=e.target.value);
$('#analyzeBtn').onclick=()=>{state.content=$('#contentInput').value;state.title=$('#titleInput').value;state.route=analyze(state.content);update();toast(`已判断为${state.route}，只记录内容关系，未生成新分镜`)};$('#refreshRoute').onclick=$('#analyzeBtn').onclick;
$('#identityToggle').onchange=e=>{state.identity=e.target.checked;$('#identityFields').hidden=!state.identity;update()};$('#portraitUpload').onchange=e=>{$('#uploadState').textContent=e.target.files[0]?.name||'仅用于当前会话；刷新后不保留';if(e.target.files[0])toast('已选择当前会话参考照片；不会保存、上传或进入结果包')};
$('#primaryColor').oninput=e=>{state.colors.primary=e.target.value;update()};$('#accentColor').oninput=e=>{state.colors.accent=e.target.value;update()};$('#paperColor').oninput=e=>{state.colors.paper=e.target.value;update()};$('#fontPair').onchange=e=>{state.font=e.target.value;update()};
function projectData(status='unvalidated-draft'){return{schema:'mengyu-comic-calibration/v0.1',savedAt:new Date().toISOString(),status,sampleIsReusableRule:false,capabilities:{imageGeneration:false,skillPackage:false,skillPackageMeaning:'no-standalone-generator-service',stylePackageDownload:true,skillInstructionsIncluded:true,crossContentStabilityValidated:false},content:{title:$('#titleInput').value,source:$('#contentInput').value,relation:state.route},identity:{enabled:state.identity,name:$('#characterName').value,traits:$('#characterTraits').value,photoStored:false,mode:state.identity?'personal':'style-only'},style:{id:state.style,name:state.styleName,colors:{...state.colors},fontPair:state.font},routing:{layout:'auto-from-content',newContentEachRun:true,outputProfiles:['xiaohongshu','wechat-image-text','moments-9x16']},nextGate:'character-continuity-and-second-content-regression'}}
const styleContracts={
 p01:{name:'扁平编辑',family:'P01',lineShape:'几何块面、清楚轮廓、二维扁平构成；形状优先于光影。',character:'人物比例概括，面部简化，动作清楚但不过度夸张。',scene:'场景由少量几何物件和明确前后层组成，不追求写实空间。',material:'纯色或轻颗粒，避免玻璃、3D 塑料和电影光效。',typography:'居中宽标题；编辑编号与短句承载；重点词用主色／强调色分开。',avoid:'写实皮肤、复杂渐变、统一 AI 脸、无意义装饰、同一字体包办全部层级'},
 p02:{name:'轻线条',family:'P02',lineShape:'连续细线、圆润转折、留白为主；线条不断裂、不变成锯齿。',character:'自然比例、轻表情、动作幅度小；固定角色时锁定发型、脸型和服装锚点。',scene:'用少量线条交代空间和道具，不填满背景。',material:'纸白底与低饱和小面积色块，整体轻。',typography:'居中标题、轻线圆标、窄正文段；避免粗重标题压住画面。',avoid:'粗黑描边、复杂阴影、全幅高饱和、过度可爱化、线条忽粗忽细'},
 p03:{name:'手绘日记',family:'P03',lineShape:'铅笔／彩铅式不规则线，允许手作误差但人体必须正确。',character:'生活化表情和姿态，比例稳定；不是儿童简笔画。',scene:'生活角落、桌面、窗边与小物形成叙事，不堆砌。',material:'纸张纹理、擦痕、胶带与手写感，质感克制。',typography:'居中标题＋手记纸条／下划线；正文像日记段落但保持手机可读。',avoid:'塑料光泽、电影灯光、过度精致、伪文字、随意涂鸦遮挡正文'},
 p04:{name:'黑白报刊',family:'P04',lineShape:'高对比黑白墨线、网点与栏线；结构清楚、边缘利落。',character:'人物轮廓和动作具有新闻插画力度，不做恐怖写实。',scene:'压缩报刊空间，以标题、栏线和图像块建立阅读秩序。',material:'黑白为主，可用一个强调色；保留印刷网点但不糊字。',typography:'居中宽标题、报刊栏线、编号和窄栏正文；标题与正文对比强。',avoid:'灰雾一片、赛博霓虹、漫画速度线滥用、正文过小、文字贴边'},
 p05:{name:'孔版印刷',family:'P05',lineShape:'图形化轮廓、两到三种专色、轻微套印偏移。',character:'人物由色块与简线共同塑造，表情简洁，身份锚点稳定。',scene:'大色块组织空间，物件数量少；允许形状叠压。',material:'可见纸张和油墨颗粒，偏移有控制，不影响识别。',typography:'居中套印标题、色块编号、短正文块；正文不能压在高噪点上。',avoid:'全彩渐变、逼真 3D、随机脏污、每个元素都错位、过多专色'},
 p06:{name:'剪纸拼贴',family:'P06',lineShape:'清楚的纸片轮廓、分层剪裁、少量手工不齐边。',character:'人物由稳定纸形组成；五官位置与身体比例跨格一致。',scene:'前中后景用纸层和遮叠建立，阴影只说明纸层高度。',material:'纸张纤维、裁切边和轻微投影，不做玻璃或黏土。',typography:'居中分层标题、剪纸卡片承载正文、重点色纸片强调。',avoid:'强烈立体渲染、厚重塑料阴影、纸片层级混乱、文字与纸边相撞'}
};
function comicProfile(){const d=projectData();d.schema='mengyu-comic-style-package/v1';d.status='portable-style-package';d.validationStatus='awaiting-cross-content-regression';d.capabilities={imageGenerationIncluded:false,siteGenerationServiceAvailable:false,skillInstructionsIncluded:true,selectedVisualSampleIncluded:true,identityReferenceIncluded:false,crossContentStabilityValidated:false};d.style.contract=styleContracts[state.style];d.precedence={visualSampleAuthority:['line and shape','character construction','scene modelling','material texture','typography relationships'],currentConfigAuthority:['primary/accent/paper colors for the next output'],notFixedBySample:['sample story text','composition','characters','sample colors when they conflict with current config']};d.routing.outputProfiles={xiaohongshu:{canvas:'1080×1440',ratio:'3:4'},wechatImageText:{canvas:'900px wide, variable height',ratio:'content-led vertical'},moments:{canvas:'1080×1920',ratio:'9:16'},note:'These are production starting profiles, not platform guarantees. Recheck current platform upload limits before delivery.'};d.stabilityGate={minimumDifferentContents:2,hardFailures:['extra or missing limbs','wrong grasping','identity drift','unreadable Chinese','style family drift','mobile text unreadable'],reviewAt:['original size','390px width']};delete d.nextGate;return d}
function comicReadme(){return`# 漫画风格包\n\n这是一套给另一位 AI 继续生产漫画的结果包，不只是配置 JSON。\n\n## 先看\n\n1. 打开 reference/selected-sample.html 或 selected-sample.webp，确认目标画面。\n2. 让 AI 先读 AI-HANDOFF.md、style/style-card.md 和 skill/SKILL.md。\n3. 提供新的真实内容；固定角色模式还要另外提供有授权的角色参考照。\n4. 生成前保存 analysis.md、storyboard.md 和 prompts.md；生成后按 QA-CHECKLIST.md 检查。\n\n所选样张用于约束视觉关系，不表示每次复制同一故事、构图或角色。包内不含图像生成服务，也不会自动带走浏览器里选择的私人参考照。\n`}
function comicHandoff(){const c=styleContracts[state.style];return`# AI-HANDOFF｜漫画风格接手合同

## 这是什么

这是“${c.name}”漫画风格包。目标是把新的文章、故事、观点或流程转成手机可读的分格漫画，不是给内容配一张泛化插图。先看 reference/selected-sample.webp，再读 config/profile.json。

## 样张与配置谁优先

样张负责约束线条、形状、人物构造、场景建模、材质和排版关系；当前 config/profile.json 中的主色／强调色／纸色是下一次输出的颜色覆盖层。若样张颜色与配置不同，以当前配置颜色为准。样张里的故事、构图、角色和文字都不是固定复用内容。

## 每次输入

真实原文、使用场景（小红书／公众号图文／朋友圈）、是否固定角色、角色参考照（如有）和不可改事实。输出起始规格见 profile.json 的 routing.outputProfiles；交付前仍要复核平台当期限制。

## 必须执行

先判断内容关系，再做分镜和动作预算；风格使用 style/style-card.md；提示词从 style/prompt-template.md 展开；关键中文不稳定时采用无字画面＋确定性排版；原尺寸与 390px 都要检查。

## 默认不得修改

不把本次测试故事锁成以后内容；不只写“${c.name}风格”就开始生成；不临场切换写实度、人物比例、场景语言或材质；不复制未知授权参考；不容忍多肢、错误抓握、伪文字和身份漂移。

## 固定角色边界

${state.identity?'当前选择了固定角色模式，但参考照片没有装包。开始前必须向用户索取有授权的参考照，并建立角色表。':'当前是只定风格模式；人物和场景可以随内容变化，但风格家族必须稳定。'}

## 完成定义

内容关系清晰；每屏一个主阅读中心；人物与道具连续；中文正确；手机可读；与所选样张在线条、人物、场景、材质和排版关系上保持一致，同时应用当前配置颜色且不复制样张故事。
`}
function styleCard(){const c=styleContracts[state.style];return`# STYLE CARD｜${c.family} ${c.name}

- 线条与形状：${c.lineShape}
- 人物：${c.character}
- 场景：${c.scene}
- 材质：${c.material}
- 当前输出配色：主色 ${state.colors.primary}；强调色 ${state.colors.accent}；纸色 ${state.colors.paper}。
- 排版：${c.typography}
- 禁止：${c.avoid}
- 视觉锚点：../reference/selected-sample.webp
- 优先级：样张约束线条／人物／场景／材质／排版关系；当前配置颜色覆盖样张颜色。
- 内容边界：锚点中的故事、构图、角色和文字不是复用规则；新任务必须重新分镜。
`}
function promptTemplate(){const c=styleContracts[state.style];return`# PROMPT TEMPLATE\n\n请根据已确认分镜生成【无字画面／单格或小组画面】。\n\n## 必填变量\n- 输出场景：{{小红书 / 公众号图文 / 朋友圈}}\n- 内容关系：{{故事 / 解释 / 对比 / 对话 / 流程}}\n- 本页主结论：{{一句话}}\n- 分格：{{逐格画面、动作、道具、镜头}}\n- 固定角色：{{无 / 角色表与身份锚点}}\n- 连续性：{{上一页必须保持的人物、服装、道具、方向}}\n\n## 固定视觉合同\n- 风格：${c.family} ${c.name}\n- 线条与形状：${c.lineShape}\n- 人物：${c.character}\n- 场景：${c.scene}\n- 材质：${c.material}\n- 配色：${state.colors.primary} / ${state.colors.accent} / ${state.colors.paper}\n\n## 禁止\n${c.avoid}；多手、多腿、缺肢、错误抓握、重复人物、伪中文、无意义符号、统一 AI 脸。\n\n画面生成后不要直接宣称完成；先执行人体、连续性、中文和 390px 阅读检查。\n`}
function comicQa(){return`# QA CHECKLIST\n\n- [ ] 新内容已保存来源与不可改事实\n- [ ] 已判断内容关系并完成逐格分镜\n- [ ] 每只手、每条腿、持物关系可解释\n- [ ] 固定角色的脸型、发型、服装和道具跨格一致\n- [ ] 人物、场景、线条、色板、材质和排版符合 style-card\n- [ ] 没有多肢、缺肢、错误抓握、重复人物或伪文字\n- [ ] 中文逐字正确；不稳定时已改为无字图＋确定性排版\n- [ ] 原尺寸检查通过\n- [ ] 390px 宽手机预览可读\n- [ ] 与 selected-sample 的风格关系一致，但没有复制测试故事\n- [ ] 至少用第二种结构不同内容做稳定性回归，才可称已验证风格\n`}
function samplePage(){return`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${state.styleName}漫画风格样张</title><style>html,body{margin:0;background:#202124;color:#fff;font-family:system-ui,sans-serif}header{padding:18px 24px;display:flex;justify-content:space-between}main{display:grid;place-items:center;padding:0 16px 40px}img{display:block;width:min(100%,700px);height:auto;background:#fff;box-shadow:0 22px 70px #0007}small{color:#b8bac2}</style></head><body><header><b>${state.styleName}｜完整风格样张</b><small>故事文字不是固定复用内容</small></header><main><img src="selected-sample.webp" alt="${styleAlts[state.style]}"></main></body></html>`}
function buildComicPackage(){return {profile:comicProfile(),texts:{
 'README.md':comicReadme(),'AI-HANDOFF.md':comicHandoff(),'QA-CHECKLIST.md':comicQa(),
 'style/style-card.md':styleCard(),'style/prompt-template.md':promptTemplate(),
 'input/test-content-not-a-rule.md':`# 本次校准内容（不是复用规则）\n\n标题：${$('#titleInput').value}\n\n${$('#contentInput').value}\n`
}}}
function parseStoredProject(raw){
 try{
  const saved=typeof raw==='string'?JSON.parse(raw):raw;
  if(!saved||Array.isArray(saved)||typeof saved!=='object'||saved.schema!=='mengyu-comic-calibration/v0.1')return{kind:'invalid',project:null};
  return{kind:'valid',project:saved};
 }catch{return{kind:'invalid',project:null}}
}
function textValue(value,fallback=''){return typeof value==='string'?value:fallback}
function colorValue(value,fallback){return typeof value==='string'&&colorPattern.test(value)?value:fallback}
function restoreProject(saved){
 const parsed=parseStoredProject(saved);if(parsed.kind!=='valid')return false;const data=parsed.project;
 state.style=styleImages[data.style?.id]?data.style.id:'p01';state.styleName=styleNames[state.style];
 state.colors={primary:colorValue(data.style?.colors?.primary,state.colors.primary),accent:colorValue(data.style?.colors?.accent,state.colors.accent),paper:colorValue(data.style?.colors?.paper,state.colors.paper)};
 state.font=validFonts.has(data.style?.fontPair)?data.style.fontPair:'editorial';state.route=validRoutes.has(data.content?.relation)?data.content.relation:'故事型内容';
 state.title=textValue(data.content?.title,state.title);state.content=textValue(data.content?.source,state.content);state.identity=!!data.identity?.enabled;state.loadedStatus=textValue(data.status,'unvalidated-draft');
 $('#titleInput').value=state.title;$('#contentInput').value=state.content;$('#identityToggle').checked=state.identity;$('#identityFields').hidden=!state.identity;
 $('#characterName').value=textValue(data.identity?.name);$('#characterTraits').value=textValue(data.identity?.traits);$('#portraitUpload').value='';$('#uploadState').textContent='仅用于当前会话；刷新后不保留';
 $('#primaryColor').value=state.colors.primary;$('#accentColor').value=state.colors.accent;$('#paperColor').value=state.colors.paper;$('#fontPair').value=state.font;
 $$('.style-card').forEach(x=>x.classList.toggle('active',x.dataset.style===state.style));update();return true;
}
// Fail closed until the shared account adapter is ready.
function loadSavedProject(){return false}
function saveProject(){toast('请等待账户验证');return null}
async function dispatchComicExport(){toast('请等待账户验证');return {ok:false,error:'account-not-ready'}}
window.ComicModule={storageKey:STORAGE_KEY,serializeProject:projectData,serializeStyleProfile:comicProfile,parseStoredProject,restoreProject,loadSavedProject,saveProject,buildStylePackage:buildComicPackage,dispatchExport:dispatchComicExport,getState:()=>({...state,colors:{...state.colors}})};
$('#saveProject').onclick=()=>window.ComicModule.saveProject();$('#exportProfile').onclick=()=>window.ComicModule.dispatchExport('package',$('#exportProfile'));
update();
window.comicToast=toast;

// Four steps, two identity paths. Existing form nodes are moved, never duplicated.
const panel=$('.style-panel'),heading=$('.panel-heading'),grid=$('#styleGrid');
const sections=$$('.inspector .control-section');
heading.remove();panel.innerHTML='<div class="flow-intro"><h1>制作设定</h1><p>选一张样张，记录下一次制作的要求。</p></div>';
function addStep(id,num,title,summary){const d=document.createElement('details');d.className='flow-step';d.id='flow-'+id;d.open=id==='style';const s=document.createElement('summary');s.innerHTML='<span class="step-number">'+num+'</span><span><b>'+title+'</b><small>'+summary+'</small></span>';d.append(s);const body=document.createElement('div');body.className='step-body';d.append(body);panel.append(d);return body}
const roleBody=addStep('role','01','角色参考','可选 · 不上传或保存照片');
sections.forEach(s=>s.querySelector('.section-title')?.remove());
const choices=document.createElement('fieldset');choices.className='role-choices';choices.innerHTML='<legend class="sr-only">角色使用方式</legend><label><input type="radio" name="roleMode" value="style"><span><b>只定风格</b><small>人物和场景随内容安排</small></span></label><label><input type="radio" name="roleMode" value="personal"><span><b>固定我的形象</b><small>让同一个我出现在不同内容里</small></span></label>';roleBody.append(choices,sections[1]);
$('.toggle-row',sections[1]).hidden=true;
function syncRole(){const mode=state.identity?'personal':'style';$$('[name=roleMode]').forEach(r=>r.checked=r.value===mode)}
$$('[name=roleMode]').forEach(r=>r.onchange=()=>{const toggle=$('#identityToggle');toggle.checked=r.value==='personal';toggle.dispatchEvent(new Event('change'));syncRole()});syncRole();
const styleBody=addStep('style','02','选择画风','点击样张查看完整画面');styleBody.append(grid);$$('.style-card small').forEach(n=>n.remove());
const trialBody=addStep('trial','03','内容与配色','可选 · 仅记录设定，不重绘样张');trialBody.append(sections[0],sections[2]);
const hint=document.createElement('p');hint.className='hint';hint.id='generationStatusNote';hint.textContent='当前只支持选择样张与记录设定。';trialBody.append(hint);
const generate=document.createElement('button');generate.id='generateSample';generate.className='unavailable-action';generate.disabled=true;generate.setAttribute('aria-describedby','generationStatusNote');generate.textContent='在线生成尚未接入';trialBody.append(generate);
const exportBody=addStep('export','04','导出与说明','风格包在顶部下载');exportBody.append(sections[3]);
const exportButton=document.createElement('button');exportButton.id='downloadDraft';exportButton.className='wide-button secondary';exportButton.textContent='单独下载配置 JSON';exportButton.onclick=()=>window.ComicModule.dispatchExport('json',exportButton);exportBody.append(exportButton);
var previewZoom=false;
function fitComic(){const canvas=$('#comicCanvas'),wrap=$('.canvas-wrap'),stage=$('.preview-stage');if(!canvas||!wrap)return;canvas.style.zoom=1;stage?.classList.toggle('is-zoomed',previewZoom);const scale=previewZoom?Math.min(2.4,Math.max(.2,(wrap.clientWidth-32)/500)):Math.max(.15,Math.min(2.4,(wrap.clientWidth-32)/500,(wrap.clientHeight-32)/canvas.scrollHeight));canvas.style.zoom=scale}
$('#fitPreview').onclick=()=>{previewZoom=false;fitComic()};$('#zoomPreview').onclick=()=>{previewZoom=true;fitComic()};$('#previewImage').addEventListener('load',fitComic);new ResizeObserver(()=>requestAnimationFrame(fitComic)).observe($('.canvas-wrap'));document.fonts.ready.then(fitComic);


window.syncComicRole=syncRole;

window.fitComicPreview=fitComic;
