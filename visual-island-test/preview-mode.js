(()=>{
  window.__MENGYU_STATIC_PREVIEW__=true;
  const originalFetch=window.fetch.bind(window);
  window.fetch=(input,init)=>{
    const raw=typeof input==='string'?input:input?.url||'';
    let path='';try{path=new URL(raw,location.href).pathname}catch{path=raw}
    if(path.includes('/api/')){
      const isMe=path.endsWith('/api/me');
      return Promise.resolve(new Response(JSON.stringify(isMe?{user:null}:{error:'临时预览不提供真实账户与下载服务'}),{
        status:isMe?401:503,headers:{'Content-Type':'application/json;charset=utf-8'}
      }));
    }
    return originalFetch(input,init);
  };
  const notice=()=>{
    let el=document.querySelector('#staticPreviewNotice');
    if(!el){el=document.createElement('div');el.id='staticPreviewNotice';el.textContent='临时预览：登录、短信、会员开通和服务端下载未启用';document.body.appendChild(el)}
    el.classList.add('show');clearTimeout(notice.timer);notice.timer=setTimeout(()=>el.classList.remove('show'),4200);
  };
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="/api/"]');if(link){event.preventDefault();notice()}
  },true);
  document.addEventListener('submit',event=>{
    if(event.target.matches('form')){event.preventDefault();event.stopImmediatePropagation();notice()}
  },true);
  document.addEventListener('DOMContentLoaded',()=>{
    const style=document.createElement('style');style.textContent=`#staticPreviewBadge{position:fixed;right:14px;bottom:14px;z-index:9999;padding:7px 10px;border:1px solid rgba(110,67,175,.22);border-radius:999px;background:rgba(255,255,255,.82);backdrop-filter:blur(12px);color:#6e43af;font:12px/1.2 system-ui,sans-serif;box-shadow:0 8px 26px rgba(69,48,92,.12)}#staticPreviewNotice{position:fixed;left:50%;bottom:56px;z-index:10000;max-width:calc(100vw - 32px);transform:translate(-50%,16px);padding:10px 14px;border-radius:10px;background:#17131f;color:#fff;font:13px/1.45 system-ui,sans-serif;opacity:0;pointer-events:none;transition:.2s}#staticPreviewNotice.show{opacity:1;transform:translate(-50%,0)}@media(max-width:620px){#staticPreviewBadge{right:10px;bottom:10px;font-size:11px}}`;document.head.appendChild(style);
    const badge=document.createElement('button');badge.id='staticPreviewBadge';badge.type='button';badge.textContent='临时预览';badge.addEventListener('click',notice);document.body.appendChild(badge);
  });
})();
