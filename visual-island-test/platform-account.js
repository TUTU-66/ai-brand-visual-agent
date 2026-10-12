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
    if(data?.schema!=='mengyu-owned-palettes/v1'||data.ownerId!==id||!Array.isArray(data.items)||data.items.some(x=>!x||typeof x.id!=='string'||!x.snapshot||x.snapshot.schema!=='mengyu-palette-draft/v1'))throw new Error('配色记录格式异常，原记录已保留');
    return data.items;
  }
  function writePalette(id, assetId, snapshot) {
    if(!id||!assetId||snapshot?.schema!=='mengyu-palette-draft/v1')throw new Error('配色记录无效');
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
  window.PlatformAccount = {currentUser,comicKey,readComic,writeComic,paletteKey,readPalettes,writePalette,paintAvatar,notifyChanged};
})();
