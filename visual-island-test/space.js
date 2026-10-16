let assetOwner=null;
﻿const $=selector=>document.querySelector(selector);

const avatarPalettes=[
  ['#6e43af','#aa8df0','#f3a6a0','#f0d77a'],
  ['#126e82','#4fb3bf','#a8d8c8','#e9c46a'],
  ['#b34d75','#e58a9f','#f3c4a8','#8d72c7'],
  ['#2f6690','#67a6c7','#b8d8d8','#f2b880'],
  ['#536b43','#91a86b','#d7b56d','#d98262'],
  ['#8d5a97','#c58fb0','#e9b4a8','#7f9dcc']
];

async function api(path,options={}){
  const response=await fetch(path,{headers:{'Content-Type':'application/json'},...options});
  let data={};
  try{data=await response.json()}catch{}
  if(!response.ok)throw new Error(data.error||'请求失败');
  return data;
}

function providerName(value){
  return value==='phone'?'手机号':'微信';
}

function applyAvatar(user){
  let hash=0;
  for(const ch of String(user.id||user.displayName||'member'))hash=(hash*31+ch.codePointAt(0))>>>0;
  const colors=avatarPalettes[hash%avatarPalettes.length];
  const avatar=$('#spaceAvatar');
  colors.forEach((color,index)=>avatar.style.setProperty(`--avatar-${String.fromCharCode(97+index)}`,color));
  avatar.dataset.palette=String(hash%avatarPalettes.length);
}

function savedJson(key){
  try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}
}

function collectAssets(){
  const assets=[],paletteSignatures=new Set(),paletteSignature=colors=>Array.isArray(colors)&&colors.length===4?colors.map(x=>String(x).toLowerCase()).join('|'):'';
  try{window.PlatformWorkspace.list(assetOwner).forEach(item=>{const route=item.module==='website'?'website-template-editor.html':item.module==='wechat'?'wechat-template-editor.html':item.module==='builder'?'builder.html':'wechat.html';assets.push({name:item.name||'未命名项目',href:route+(item.module==='wechat-classic'?'?':'?template='+encodeURIComponent(item.templateId)+'&')+'asset='+encodeURIComponent(item.id),savedAt:item.savedAt||''});});}catch{$('#assetEmpty').textContent='部分项目读取失败，原记录已保留。';}

  const comic=window.PlatformAccount.readComic(assetOwner);
  if(comic)assets.push({name:comic.inputDraft?.title||comic.strip?.title||comic.content?.title||comic.title||'未命名故事条漫',href:'comic.html',savedAt:comic.savedAt||''});

  try{window.PlatformAccount.readPalettes(assetOwner).forEach(item=>{const signature=paletteSignature(item.snapshot.colors);if(signature)paletteSignatures.add(signature);assets.push({name:item.snapshot.name||'未命名配色',href:`palette.html?asset=${encodeURIComponent(item.id)}`,savedAt:item.savedAt||''});});}
  catch{$('#assetEmpty').textContent='部分本地配色记录读取失败，原记录已保留。';}

  try{window.SavedPalettes?.list(assetOwner).forEach(item=>{const signature=paletteSignature(item.colors);if(signature&&paletteSignatures.has(signature))return;const tool=item.source?.tool,template=encodeURIComponent(item.source?.templateId||'');let href='palette.html';if(tool==='website'&&template)href=`website-template-editor.html?template=${template}&savedPalette=${encodeURIComponent(item.id)}`;else if(tool==='wechat'&&template)href=`wechat-template-editor.html?template=${template}&savedPalette=${encodeURIComponent(item.id)}`;assets.push({name:item.name||'未命名配色',href,savedAt:item.savedAt||''});if(signature)paletteSignatures.add(signature);});}
  catch{$('#assetEmpty').textContent='部分共享配色读取失败，原记录已保留。';}

  return assets.sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt)));
}

function renderAssets(){
  const assets=collectAssets();
  const list=$('#assetList');
  const empty=$('#assetEmpty');
  $('#assetTotal').textContent=`${assets.length} 项`;
  list.innerHTML='';

  if(!assets.length){
    list.hidden=true;
    empty.hidden=false;
    return;
  }

  assets.forEach(item=>{
    const row=document.createElement('a');
    row.className='asset-row';
    row.href=item.href;
    const name=document.createElement('span'),action=document.createElement('small');
    name.textContent=String(item.name);action.textContent='打开';row.append(name,action);
    list.append(row);
  });
  list.hidden=false;
  empty.hidden=true;
}

function render(user){
  assetOwner=user.id;
  applyAvatar(user);
  $('#profileName').textContent=user.displayName;
  $('#displayName').value=user.displayName;

  const rawTier=user.membership?.tier||'free';
  const tier=['pro','max'].includes(rawTier)?rawTier:'free';
  const displayTier=tier[0].toUpperCase()+tier.slice(1);
  $('#tierBadge').textContent=`${displayTier} 成员`;
  $('#upgradeAction').textContent=tier==='free'?'升级会员':'查看会员';

  const primaryIdentity=user.identities?.[0];
  const identityText=primaryIdentity?`${providerName(primaryIdentity.provider)} ${primaryIdentity.label}`:'已登录账户';
  const expiry=tier!=='free'&&user.membership?.expiresAt?` · 有效期至 ${user.membership.expiresAt}`:'';
  $('#identitySummary').textContent=identityText+expiry;

  const hasPassword=!!user.security?.hasPassword;
  $('#passwordStatus').textContent=hasPassword?'已设置，可使用手机号和密码登录':'尚未设置，当前只能使用验证码登录';
  $('#passwordAction').textContent=hasPassword?'重置密码':'设置密码';
  $('#passwordAction').href=hasPassword?'forgot-password.html':'register.html';

  const identities=$('#identityList');
  identities.innerHTML='';
  (user.identities||[]).forEach(item=>{
    const row=document.createElement('div');
    row.className='identity-item';
    const state=item.assurance==='internal-test'?'内部测试':item.assurance==='local-unverified'?'登录账号':'已验证';
    row.innerHTML=`<b>${providerName(item.provider)}</b><span>${item.label} · ${state}</span>`;
    identities.append(row);
  });

  renderAssets();
  $('#loading').classList.add('hide');
}

async function load(){
  try{
    const user=await window.PlatformAccount.currentUser();
    const data={authenticated:!!user,user};
    if(!data.authenticated||!data.user){
      location.replace('/ai-brand-visual-agent/visual-island-test/login.html?returnTo=/ai-brand-visual-agent/visual-island-test/space.html');
      return;
    }
    render(data.user);
  }catch{
    location.replace('/ai-brand-visual-agent/visual-island-test/login.html?returnTo=/ai-brand-visual-agent/visual-island-test/space.html');
  }
}

$('#logout').addEventListener('click',async()=>{
  try{await api('/api/logout',{method:'POST',body:'{}'});}
  finally{window.PlatformAccount.notifyChanged();location.replace('/ai-brand-visual-agent/visual-island-test/index.html');}
});

$('#profileForm').addEventListener('submit',async event=>{
  event.preventDefault();
  const button=event.currentTarget.querySelector('button');
  const message=$('#profileMessage');
  button.disabled=true;
  message.textContent='正在保存…';
  try{
    const data=await api('/api/profile',{method:'POST',body:JSON.stringify({displayName:$('#displayName').value})});
    render(data.user);
    message.textContent='名称已保存';
  }catch(error){
    message.textContent=error.message;
  }finally{
    button.disabled=false;
  }
});

load();


addEventListener('focus',load);
addEventListener('pageshow',()=>{if(assetOwner)load();});
addEventListener('storage',e=>{if(e.key==='mengyu-account-change')load();});
addEventListener('blur',()=>{assetOwner=null;$('#assetList').replaceChildren();$('#loading').classList.remove('hide');});
