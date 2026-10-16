/* CTRL-01 shared account adapter. Entitlements are never stored in localStorage. */
(() => {
  const comicKey = id => `mengyu-comic-project-v02:${encodeURIComponent(id)}`;
  async function currentUser() {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch('/api/me', {credentials:'same-origin', cache:'no-store', signal:controller.signal});
      if (!response.ok) throw new Error('暂时无法确认账户，请重试');
      const data = await response.json();
      if (!data.ok) throw new Error('账户服务暂不可用');
      return data.authenticated && data.user?.id ? data.user : null;
    } finally { clearTimeout(timer); }
  }
  function readComic(id) {
    if (!id) return null;
    try {
      const entry = JSON.parse(localStorage.getItem(comicKey(id)) || 'null');
      return entry?.ownerId === id && entry.project?.schema === 'mengyu-comic-calibration/v0.1' ? entry.project : null;
    } catch { return null; }
  }
  function writeComic(id, project) {
    if (!id) throw new Error('请先登录');
    localStorage.setItem(comicKey(id), JSON.stringify({schema:'mengyu-owned-draft/v1',ownerId:id,project}));
  }
  const paletteKey = id => `mengyu-owned-palettes-v1:${encodeURIComponent(id)}`;
  function readPalettes(id) {
    if (!id) return [];
    const raw=localStorage.getItem(paletteKey(id));
    if (!raw) return [];
    let data;try{data=JSON.parse(raw);}catch{throw new Error('配色记录损坏，原记录已保留');}
    if(data?.schema!=='mengyu-owned-palettes/v1'||data.ownerId!==id||!Array.isArray(data.items)||data.items.some(x=>!x||typeof x.id!=='string'||!x.snapshot||!['mengyu-palette-draft/v1','mengyu-palette-draft/v2'].includes(x.snapshot.schema)))throw new Error('配色记录格式异常，原记录已保留');
    return data.items;
  }
  function writePalette(id, assetId, snapshot) {
    if(!id||!assetId||!['mengyu-palette-draft/v1','mengyu-palette-draft/v2'].includes(snapshot?.schema))throw new Error('配色记录无效');
    const items=readPalettes(id), entry={id:assetId,snapshot,savedAt:new Date().toISOString()};
    const index=items.findIndex(x=>x.id===assetId);
    if(index<0)items.push(entry);else items[index]=entry;
    localStorage.setItem(paletteKey(id),JSON.stringify({schema:'mengyu-owned-palettes/v1',ownerId:id,items}));
    return entry;
  }
  const palettes = [
    ['#6e43af','#aa8df0','#f3a6a0','#f0d77a'],['#126e82','#4fb3bf','#a8d8c8','#e9c46a'],
    ['#b34d75','#e58a9f','#f3c4a8','#8d72c7'],['#2f6690','#67a6c7','#b8d8d8','#f2b880'],
    ['#536b43','#91a86b','#d7b56d','#d98262'],['#8d5a97','#c58fb0','#e9b4a8','#7f9dcc']
  ];
  function paintAvatar(element, user) {
    if (!element) return;
    let hash=0;
    for(const ch of String(user.id||user.displayName||'member'))hash=(hash*31+ch.codePointAt(0))>>>0;
    palettes[hash%palettes.length].forEach((v,i)=>element.style.setProperty(`--avatar-${String.fromCharCode(97+i)}`,v));
    element.dataset.palette=String(hash%palettes.length);
    element.setAttribute('aria-label',`${user.displayName}的个人空间`);
  }
  function notifyChanged() { try { localStorage.setItem('mengyu-account-change',String(Date.now())); } catch {} }
  function promptUpgrade(plan='pro') {
    let dialog=document.querySelector('#platformUpgradeDialog');
    if(!dialog){
      const style=document.createElement('style');
      style.textContent=`#platformUpgradeDialog{width:min(690px,calc(100% - 32px));padding:30px;border:1px solid #d8d3df;border-radius:22px;background:#fbfafc;color:#201d24;box-shadow:0 30px 100px rgba(0,0,0,.55);font:14px/1.7 PuHui,"Microsoft YaHei",sans-serif}#platformUpgradeDialog::backdrop{background:rgba(4,3,5,.76);backdrop-filter:blur(8px)}#platformUpgradeDialog[open]{display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:16px 26px}#platformUpgradeDialog h2{margin:7px 0 10px;font-size:28px;line-height:1.25}#platformUpgradeDialog p{margin:0;color:#6f6974}#platformUpgradeDialog .upgrade-plans{display:flex;gap:8px;margin:18px 0 0}#platformUpgradeDialog .upgrade-plans button{flex:1;padding:11px 12px;border:1px solid #cfc5da;border-radius:10px;background:#fff;color:#33293d;cursor:pointer}#platformUpgradeDialog .upgrade-plans button[aria-pressed="true"]{border-color:#7550a8;background:#eee6f8;color:#5e378f}#platformUpgradeDialog .upgrade-qr{grid-column:2;grid-row:1 / span 2;width:210px;aspect-ratio:1;border:1px solid #ded9e3;border-radius:16px;overflow:hidden;background:#fff}#platformUpgradeDialog .upgrade-qr img{display:block;width:100%;height:100%;object-fit:contain}#platformUpgradeDialog .upgrade-note{grid-column:2;text-align:center;font-size:12px}#platformUpgradeDialog .upgrade-close{grid-column:1;width:max-content;min-height:44px;padding:0 22px;border:0;border-radius:999px;background:#201d24;color:#fff;font-weight:700;cursor:pointer}@media(max-width:620px){#platformUpgradeDialog[open]{grid-template-columns:1fr}#platformUpgradeDialog .upgrade-qr,#platformUpgradeDialog .upgrade-note,#platformUpgradeDialog .upgrade-close{grid-column:1;grid-row:auto}#platformUpgradeDialog .upgrade-qr{width:min(230px,100%);margin:auto}#platformUpgradeDialog .upgrade-close{width:100%}}`;
      document.head.append(style);
      dialog=document.createElement('dialog');dialog.id='platformUpgradeDialog';dialog.setAttribute('aria-labelledby','platformUpgradeTitle');
      dialog.innerHTML=`<div><small>MEMBERSHIP</small><h2 id="platformUpgradeTitle">扫码联系工作人员开通 Pro</h2><p id="platformUpgradeText">添加工作人员并说明登录手机号。付款确认后，会在原账户上开通会员。</p><div class="upgrade-plans"><button type="button" data-upgrade-plan="pro">Pro · ¥99／半年</button><button type="button" data-upgrade-plan="max">Max · ¥169／年</button></div></div><div class="upgrade-qr"><img src="assets/membership-contact-qr.jpg" alt="添加梦玉的联系二维码"></div><p class="upgrade-note">联系二维码 · 确认后人工开通，不是登录或付款码</p><button class="upgrade-close" type="button">暂不升级</button>`;
      document.body.append(dialog);
      dialog.querySelector('.upgrade-close').onclick=()=>dialog.close();
      dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
      dialog.querySelectorAll('[data-upgrade-plan]').forEach(button=>button.onclick=()=>select(button.dataset.upgradePlan));
    }
    const select=value=>{
      const label=value==='max'?'Max':'Pro';
      dialog.querySelector('#platformUpgradeTitle').textContent=`扫码联系工作人员开通 ${label}`;
      dialog.querySelector('#platformUpgradeText').textContent=`添加工作人员并说明登录手机号和 ${label} 方案。付款确认后，会在原账户上开通会员。`;
      dialog.querySelectorAll('[data-upgrade-plan]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.upgradePlan===value)));
    };
    select(plan==='max'?'max':'pro');
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
  }
  window.PlatformAccount = {currentUser,comicKey,readComic,writeComic,paletteKey,readPalettes,writePalette,paintAvatar,notifyChanged,promptUpgrade};
})();
