/* CTRL-01 visual shell; never changes palette snapshots or entitlements. */
(() => {
  const tabs=[...document.querySelectorAll('.palette-view-tabs [role=tab]')], mobile=matchMedia('(max-width:900px)');
  function setView(value){document.body.dataset.paletteView=value;tabs.forEach(t=>{const active=t.dataset.paletteView===value;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});}
  tabs.forEach(t=>{t.onclick=()=>setView(t.dataset.paletteView);t.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?tabs[0]:e.key==='End'?tabs[1]:tabs.find(x=>x!==t);setView(next.dataset.paletteView);next.focus();}};});
  document.querySelector('#presetList').addEventListener('click',e=>{if(mobile.matches&&e.target.closest('[data-preset]'))setView('preview');});
  const toggle=document.querySelector('#toolNavToggle'),nav=document.querySelector('#toolNav');
  function menu(open){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'关闭导航':'打开导航');nav.classList.toggle('is-open',open);}
  toggle.onclick=()=>menu(toggle.getAttribute('aria-expanded')!=='true');
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){menu(false);toggle.focus();}});
  document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))menu(false);});
})();
