/* CTRL-01 binding: login-required Free use, one owner, protected paid export. */
(() => {
  const account=window.PlatformAccount, mod=window.ComicModule;
  const guard=document.querySelector('#comicAccountGuard'), message=document.querySelector('#comicAccountMessage');
  const workspace=document.querySelector('.workspace'), actions=document.querySelector('.comic-toolbar');
  const legacyKey='mengyu-comic-project-v01', claimKey='mengyu-comic-legacy-owner-v1', guestKey='mengyu-comic-guest-draft-v1';
  let owner=null, dirty=false, refreshing=null, initialized=false, switched=false;
  const initial=mod.serializeProject(), pendingKey=id=>`mengyu-comic-unsaved:${id}`;
  function stash() { if(dirty&&!switched&&owner)try{sessionStorage.setItem(pendingKey(owner.id),JSON.stringify(mod.serializeProject()));}catch{} }
  function cover(text) {
    stash(); guard.hidden=false; message.textContent=text;
    guard.dataset.mode=text.startsWith('请先登录')?'login':'retry';
    workspace.inert=true; actions.inert=true;
    document.body.classList.add('comic-account-locked');
  }
  function uncover() {
    guard.hidden=true; workspace.inert=false; actions.inert=false;
    document.body.classList.remove('comic-account-locked');
  }
  function restore(data) { const ok=mod.restoreProject(data);window.syncComicRole?.();return ok; }
  function showUser(user=null) {
    const avatar=document.querySelector('#toolAvatar');
    if(user){avatar.hidden=false;account.paintAvatar(avatar,user);document.querySelector('#comicTier').textContent=({free:'Free',pro:'Pro',max:'Max'})[user.membership?.tier]||'Free';document.querySelector('#comicUpgrade').textContent=user.membership?.canExport?'会员详情':'升级会员';document.querySelector('#comicExportNote').textContent=user.membership?.canExport?'会员有效期内可下载、导出':'Free 可体验和保存；下载、导出需升级';}
    else{avatar.hidden=true;document.querySelector('#comicTier').textContent='试用';document.querySelector('#comicUpgrade').textContent='查看会员';document.querySelector('#comicExportNote').textContent='可在线体验和保存本机草稿；下载、导出需登录并开通 Pro / Max';}
  }
  async function refresh({initialVisit=false}={}) {
    if(refreshing)return refreshing;
    refreshing=(async()=>{
      try {
        const user=await account.currentUser();
        if(!user){
          if(owner){switched=true;}
          showUser();cover('请先登录。Free 账户可以制作、预览和保存条漫；下载与导出需开通 Pro / Max。');return null;
        }
        if(switched){cover('账户已变化。请载入当前账户的设定。');return null;}
        if(owner&&owner.id!==user.id){
          cover('账户已切换。请重新打开，载入当前账户的设定。');
          switched=true;
          restore(initial); dirty=false; document.querySelector('#comicReload').hidden=false;
          return null;
        }
        owner=user; showUser(user);
        if(!initialized){
          initialized=true;
          let pending=null;try{pending=sessionStorage.getItem(pendingKey(user.id));}catch{}
          const saved=account.readComic(user.id);
          if(pending&&mod.parseStoredProject(pending).kind==='valid'){
            restore(JSON.parse(pending));dirty=true;window.comicToast('已恢复本标签页未保存的设定');
          }else if(saved){restore(saved);}
          let legacy=null,claimed=null;try{legacy=localStorage.getItem(legacyKey);claimed=localStorage.getItem(claimKey);}catch{}
          document.querySelector('#comicLegacy').hidden=!(legacy&&!claimed);
        }
        uncover();return user;
      }catch{
        cover('暂时无法确认账户，已暂停操作。请检查网络后重试。');return null;
      }finally{refreshing=null;}
    })();return refreshing;
  }
  async function save() {
    const button=document.querySelector('#saveProject');button.disabled=true;button.textContent='正在保存…';
    try{
      const user=await refresh();if(!user)return null;
      const project=mod.serializeProject();
      account.writeComic(user.id,project);try{sessionStorage.removeItem(pendingKey(user.id));}catch{}window.comicToast('已保存到我的资产 · 仅当前浏览器');
      dirty=false;return project;
    }catch{window.comicToast('保存失败，请检查浏览器存储空间后重试');return null;}
    finally{button.disabled=false;button.textContent='保存项目';}
  }
  async function exportFile(kind,button) {
    if(!['json','package'].includes(kind))return {ok:false,error:'unknown-export-kind'};
    const label=button?.textContent;
    if(button){button.disabled=true;button.textContent='正在确认权限…';}
    try{
      const user=await refresh();if(!user)return {ok:false,error:'login-required'};
      if(!user.membership?.canExport){
        account.promptUpgrade?.('pro');window.comicToast('扫码联系工作人员开通会员后即可下载或导出');
        return {ok:false,error:'membership-required'};
      }
      if(button)button.textContent='正在准备下载…';
      const response=await fetch('/api/comic/export',{method:'POST',credentials:'same-origin',cache:'no-store',
        headers:{'Content-Type':'application/json'},body:JSON.stringify({...mod.buildStylePackage(),format:kind,ownerId:user.id})});
      if(!response.ok){
        const data=await response.json();
        if([401,409].includes(response.status))cover(data.error||'请重新登录');
        if(response.status===403)await refresh();
        throw new Error(data.error||'下载失败，请重试');
      }
      const blob=await response.blob();
      // Recheck before exposing a response that arrived after an account switch.
      const live=await refresh();if(!live||live.id!==user.id||!live.membership?.canExport)return {ok:false,error:'account-changed'};
      const filename=kind==='json'?'我的漫画风格_配置.json':`漫画风格包_${mod.getState().styleName}.zip`;
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      window.comicToast(kind==='json'?'配置已下载':'风格包已下载 · 包含已有样张与操作说明');
      return {ok:true,kind,filename};
    }catch(error){window.comicToast(error.message||'下载失败，请重试');return {ok:false,error:String(error)};}
    finally{if(button){button.disabled=false;button.textContent=label;}}
  }
  mod.saveProject=save;
  mod.loadSavedProject=()=>owner?restore(account.readComic(owner.id)):false;
  mod.dispatchExport=exportFile;
  document.querySelector('#comicRetry').onclick=()=>refresh();
  document.querySelector('#comicReload').onclick=()=>location.reload();
  document.querySelector('#comicImportLegacy').onclick=async()=>{
    if(!document.querySelector('#comicClaimCheck').checked){window.comicToast('请先确认旧草稿属于你');return;}
    const user=await refresh();if(!user)return;
    try{
      if(localStorage.getItem(claimKey)){window.comicToast('旧草稿已认领，请使用对应账户');return;}
      const old=mod.parseStoredProject(localStorage.getItem(legacyKey));
      if(old.kind!=='valid'){window.comicToast('旧草稿无法读取；原记录未删除');return;}
      if((dirty||account.readComic(user.id))&&!confirm('导入将替换当前账户的漫画设定。原始旧草稿仍保留，是否继续？'))return;
      account.writeComic(user.id,old.project);localStorage.setItem(claimKey,user.id);
      restore(old.project);dirty=false;sessionStorage.removeItem(pendingKey(user.id));
      document.querySelector('#comicLegacy').hidden=true;window.comicToast('旧草稿已归入我的资产，原记录保留');
    }catch{window.comicToast('导入失败，原记录未删除');}
  };
  ['input','change'].forEach(event=>workspace.addEventListener(event,()=>{if(owner)dirty=true;}));
  workspace.addEventListener('click',e=>{if(owner&&e.target.closest('.style-card'))dirty=true;});
  addEventListener('pagehide',stash);
  addEventListener('blur',()=>{if(initialized&&owner)cover('正在确认账户…');else stash();});
  addEventListener('focus',()=>refresh());
  addEventListener('pageshow',()=>{if(initialized)refresh();});
  addEventListener('storage',e=>{if(e.key==='mengyu-account-change')refresh();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stash();if(owner)cover('正在确认账户…');}else refresh();});
  setInterval(()=>{if(!document.hidden)refresh();},30000);
  refresh({initialVisit:true});
})();
