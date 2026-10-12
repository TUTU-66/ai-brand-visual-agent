/* CTRL-01: guest trial, account-scoped assets and live server export. No paid rights cached. */
(() => {
  'use strict';
  const account=window.PlatformAccount, mod=window.PaletteModule, $=s=>document.querySelector(s);
  if(!account||!mod)return;
  const initial=mod.getSnapshot(), claimsKey='mengyu-palette-legacy-claims-v1';
  let owner=null, initialized=false, switched=false, locked=true, version=0, refreshing=null;
  const query=new URLSearchParams(location.search);
  let assetId=query.get('asset')||'', presetId=query.get('preset')||'', candidates=[];
  const returnPath=()=>location.pathname+location.search;
  const draftKey=()=>`mengyu-palette-session-v1:${encodeURIComponent(owner||'guest')}:${encodeURIComponent(assetId||(presetId?`preset:${presetId}`:'new'))}`;
  function stash(){if(initialized&&!switched)try{sessionStorage.setItem(draftKey(),JSON.stringify({ownerId:owner||'guest',snapshot:mod.getSnapshot()}));}catch{}}
  function lock(message){locked=true;document.body.classList.add('palette-account-locked');$('.palette-workspace').inert=true;$('.top-actions').inert=true;$('#paletteGuard').hidden=false;$('#paletteGuardMessage').textContent=message;}
  function unlock(user=null){locked=false;document.body.classList.remove('palette-account-locked');$('.palette-workspace').inert=false;$('.top-actions').inert=false;$('#paletteGuard').hidden=true;$('#paletteUpgrade').hidden=false;if(user){const tier=user.membership?.tier;$('#paletteTier').textContent=tier==='pro'?'Pro':tier==='max'?'Max':'Free';$('#paletteUpgrade').textContent=user.membership?.canExport?'查看会员':'升级会员';$('#paletteAvatar').hidden=false;account.paintAvatar($('#paletteAvatar'),user);}else{$('#paletteTier').textContent='试用';$('#paletteUpgrade').textContent='查看会员';$('#paletteAvatar').hidden=true;}}
  function changed(){stash();switched=true;version++;mod.restoreSnapshot(initial);$('#paletteLegacyList').replaceChildren();$('#paletteTier').textContent='';$('#paletteAvatar').hidden=true;lock('账户已变化，请刷新后继续。');$('#paletteRetry').textContent='刷新页面';}
  function ensureSame(user){if(!user){changed();throw new Error('请重新登录后继续');}if(owner!==user.id){changed();throw new Error('账户已变化，请刷新后继续');}}
  async function refresh(){
    if(switched)return;
    if(refreshing)return refreshing;
    const attempt=++version;
    refreshing=(async()=>{try{
      const user=await account.currentUser();if(attempt!==version)return;
      if(!user){if(owner){changed();return;}if(assetId){lock('请登录后从个人空间打开这条配色。');$('#paletteLogin').href='login.html?returnTo='+encodeURIComponent(returnPath());return;}if(!initialized){try{const draft=JSON.parse(sessionStorage.getItem(draftKey())||'null');if(draft?.ownerId==='guest')mod.restoreSnapshot(draft.snapshot);}catch{}initialized=true;}unlock();return;}
      if((owner&&owner!==user.id)||(!owner&&initialized)){changed();return;}
      owner=user.id;
      if(!initialized){
        if(assetId){const item=account.readPalettes(owner).find(x=>x.id===assetId);if(!item)throw new Error('当前账户没有这条配色，请从个人空间重新打开。');if(!mod.restoreSnapshot(item.snapshot).ok)throw new Error('配色格式异常，原记录已保留。');}
        try{const draft=JSON.parse(sessionStorage.getItem(draftKey())||'null');if(draft?.ownerId===owner)mod.restoreSnapshot(draft.snapshot);}catch{}
        initialized=true;await loadLegacy();if(attempt!==version)return;
      }
      unlock(user);
    }catch(error){lock(error.message||'暂时无法确认账户，请重试。');}finally{refreshing=null;}})();
    return refreshing;
  }
  async function requireUser(){if(locked||switched||!initialized)throw new Error('请先确认账户后重试');const user=await account.currentUser();ensureSame(user);return user;}
  function readClaims(){const raw=localStorage.getItem(claimsKey);if(!raw)return{};let value;try{value=JSON.parse(raw);}catch{throw new Error('旧记录归属表异常，未修改任何旧记录');}if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('旧记录归属表异常');return value;}
  async function fingerprint(text){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
  async function loadLegacy(){
    candidates=[];$('#paletteLegacyList').replaceChildren();
    try{
      const claims=readClaims(), records=[];
      const list=JSON.parse(localStorage.getItem('mengyu-saved-palettes')||'[]');
      if(Array.isArray(list))list.forEach((value,index)=>records.push({key:'mengyu-saved-palettes',index,value}));
      const project=JSON.parse(localStorage.getItem('mengyu-palette-project')||'null');
      if(project?.palette)records.push({key:'mengyu-palette-project',index:0,value:project.palette});
      for(const record of records){
        const fingerprintId=await fingerprint(JSON.stringify(record)), claim=claims[fingerprintId];
        if(claim&&(claim.ownerId!==owner||claim.status==='complete'))continue;
        const previous=mod.getSnapshot(), result=mod.restoreSnapshot(record.value);
        const snapshot=result.ok?mod.getSnapshot():null;mod.restoreSnapshot(previous);
        if(!snapshot)continue;
        const label=document.createElement('label'), input=document.createElement('input'), text=document.createElement('span');
        input.type='checkbox';input.value=fingerprintId;text.textContent=snapshot.name||'未命名配色';label.append(input,text);$('#paletteLegacyList').append(label);
        candidates.push({id:fingerprintId,snapshot});
      }
      $('#paletteLegacy').hidden=!candidates.length;
    }catch{ $('#paletteLegacy').hidden=false;$('#paletteLegacyMessage').textContent='旧记录读取失败，原数据已保留；不会自动导入。'; }
  }
  $('#paletteImport').onclick=async()=>{
    const button=$('#paletteImport');button.disabled=true;
    try{
      const selected=new Set(Array.from($('#paletteLegacyList').querySelectorAll('input:checked'),x=>x.value));
      if(!selected.size)throw new Error('请先勾选属于你的旧配色');
      if(!navigator.locks)throw new Error('此浏览器暂不支持安全导入，旧记录已保留');
      await navigator.locks.request('mengyu-palette-legacy-import',async()=>{
        const user=await requireUser(), claims=readClaims();let count=0;
        for(const item of candidates.filter(x=>selected.has(x.id))){
          const claim=claims[item.id];if(claim?.ownerId&&claim.ownerId!==user.id)throw new Error('所选记录已被其他账户认领');
          if(claim?.status==='complete')continue;
          const id='legacy-'+item.id;
          claims[item.id]={ownerId:user.id,assetId:id,status:'reserved'};localStorage.setItem(claimsKey,JSON.stringify(claims));
          account.writePalette(user.id,id,item.snapshot);
          claims[item.id].status='complete';localStorage.setItem(claimsKey,JSON.stringify(claims));count++;
        }
        $('#paletteLegacyMessage').textContent=`已存入 ${count} 项；原记录保留。`;
      });
      await loadLegacy();
    }catch(error){$('#paletteLegacyMessage').textContent=error.message||'导入失败，原记录保留';}finally{button.disabled=false;}
  };
  async function perform({kind,payload,snapshot}){
    const start=performance.now(), stamp=version;
    const valid=()=>{if(switched||locked||stamp!==version||performance.now()-start>25000)throw new Error('账户状态已变化或操作超时，请重试');};
    try{
      let user=null;
      if(owner){user=await requireUser();valid();}
      else{if(locked||switched||!initialized)throw new Error('工具尚未准备好，请重试');user=await account.currentUser();if(user){changed();throw new Error('已检测到登录状态，请刷新后继续');}valid();}
      if(kind==='save'){
        if(!user){sessionStorage.setItem(draftKey(),JSON.stringify({ownerId:'guest',snapshot}));return{ok:true,message:'已保存为本机试用草稿'};}
        const save=()=>{valid();const id=assetId||crypto.randomUUID();const previousKey=draftKey();account.writePalette(user.id,id,snapshot);assetId=id;const url=new URL(location.href);url.searchParams.set('asset',id);history.replaceState(null,'',url.pathname+url.search);try{sessionStorage.removeItem(previousKey);sessionStorage.removeItem(draftKey());}catch{}return{ok:true,message:'已保存到我的资产（仅此浏览器）',assetId:id};};
        return navigator.locks?await navigator.locks.request('mengyu-palette-save:'+user.id,save):save();
      }
      if(kind==='copy-color'||kind==='copy-all'){
        const text=kind==='copy-color'?snapshot.colors[payload.index]:snapshot.colors.join(' ');
        if(typeof text!=='string')throw new Error('色值无效');
        await navigator.clipboard.writeText(text);return{ok:true,message:'已复制色值'};
      }
      if(kind!=='download-package')throw new Error('不支持的操作');
      if(!user){$('#paletteUpgrade').focus();return{ok:false,code:'login-required',message:'可以继续在线试用；下载需要登录并开通 Pro 或 Max。'};}
      if(!user.membership?.canExport){$('#paletteUpgrade').focus();return{ok:false,code:'membership-required',message:'Free 可体验；下载请升级 Pro 或 Max。'};}
      const controller=new AbortController(), remaining=Math.max(1,23000-(performance.now()-start));
      const timer=setTimeout(()=>controller.abort(),remaining);
      try{
        const response=await fetch('/api/palette/export',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({ownerId:user.id,snapshot}),signal:controller.signal,cache:'no-store'});
        if(!response.ok){let data={};try{data=await response.json();}catch{}throw new Error(response.status===404?'配色下载服务尚未启用，请稍后再试。':data.error||'下载失败，请重试');}
        const blob=await response.blob();valid();
        const latest=await account.currentUser();ensureSame(latest);valid();if(!latest.membership?.canExport)throw new Error('会员状态已变化，未下载');
        const url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download=`五色配色应用包_${snapshot.name.replace(/[\\/:*?"<>|]/g,'_').slice(0,60)}.zip`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
        return{ok:true,message:'配色应用包已下载'};
      }finally{clearTimeout(timer);}
    }catch(error){return{ok:false,message:error.name==='AbortError'?'操作超时，请重试':error.message||'操作失败，请重试'};}
  }
  mod.setActionHandler(perform);
  $('#paletteRetry').onclick=()=>switched?location.reload():void refresh();
  $('#paletteLogin').href='login.html?returnTo='+encodeURIComponent(returnPath());
  addEventListener('blur',()=>{stash();if(owner){version++;lock('正在确认账户…');}});
  addEventListener('focus',()=>void refresh());
  addEventListener('pageshow',()=>void refresh());
  addEventListener('pagehide',stash);
  addEventListener('storage',event=>{if(event.key==='mengyu-account-change'){version++;if(owner)lock('账户状态已变化，正在确认…');void refresh();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stash();if(owner){version++;lock('正在确认账户…');}}else void refresh();});
  setInterval(()=>{if(!document.hidden&&!switched)void refresh();},30000);
  void refresh();
})();
