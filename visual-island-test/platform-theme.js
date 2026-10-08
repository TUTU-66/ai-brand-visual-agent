(function(){
 const key='mengyu-platform-theme';let theme='light';try{theme=localStorage.getItem(key)==='dark'?'dark':'light'}catch{}
 const apply=value=>{document.documentElement.dataset.platformTheme=value;try{localStorage.setItem(key,value)}catch{};document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===value)))};
 apply(theme);
 addEventListener('storage',e=>{if(e.key===key)apply(e.newValue==='dark'?'dark':'light')});
 document.addEventListener('DOMContentLoaded',()=>{const host=document.querySelector('.topbar,.appbar');if(!host)return;const wrap=document.createElement('div');wrap.className='platform-theme-switch';wrap.setAttribute('role','group');wrap.setAttribute('aria-label','界面颜色');wrap.innerHTML='<button type="button" data-theme-choice="light">☀ 浅色</button><button type="button" data-theme-choice="dark">☾ 深色</button>';const before=host.querySelector('.top-actions,.top-spacer');host.insertBefore(wrap,before||null);wrap.addEventListener('click',e=>{const b=e.target.closest('[data-theme-choice]');if(b)apply(b.dataset.themeChoice)});apply(document.documentElement.dataset.platformTheme)})
})();
