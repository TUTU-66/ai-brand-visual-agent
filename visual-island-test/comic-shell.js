(() => {
  const tabs=[...document.querySelectorAll('.comic-view-tabs [role=tab]')];
  function setView(value){
    document.body.dataset.comicView=value;
    tabs.forEach(t=>{const active=t.dataset.comicView===value;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
    requestAnimationFrame(()=>window.fitComicPreview());
  }
  tabs.forEach(t=>{
    t.onclick=()=>setView(t.dataset.comicView);
    t.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
      e.preventDefault();const target=e.key==='Home'?tabs[0]:e.key==='End'?tabs[1]:tabs.find(x=>x!==t);
      setView(target.dataset.comicView);target.focus();
    }};
  });
  const panel=document.querySelector('.style-panel'),intro=panel.querySelector('.flow-intro');
  intro.after(document.querySelector('#flow-style')); // Style first, optional identity second.
  [...panel.querySelectorAll('.step-number')].forEach((n,i)=>n.textContent=String(i+1).padStart(2,'0'));
  const note=document.querySelector('#comicExportNote');note.hidden=false;
  document.querySelector('#flow-export .step-body').prepend(note);
  document.querySelector('#flow-export .step-body').append(document.querySelector('#comicLegacy'));
  document.querySelectorAll('.style-card').forEach(card=>{
    card.setAttribute('aria-pressed',String(card.classList.contains('active')));
    card.addEventListener('click',()=>{
      document.querySelectorAll('.style-card').forEach(c=>c.setAttribute('aria-pressed',String(c===card)));
      if(matchMedia('(max-width: 900px)').matches)setView('preview');
    });
  });
  ['fitPreview','zoomPreview'].forEach(id=>document.querySelector('#'+id).addEventListener('click',()=>{
    ['fitPreview','zoomPreview'].forEach(x=>document.querySelector('#'+x).setAttribute('aria-pressed',String(x===id)));
  }));
  document.querySelector('#fitPreview').setAttribute('aria-pressed','true');
  const toggle=document.querySelector('#toolNavToggle'),nav=document.querySelector('#toolNav');
  function menu(open){toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);toggle.setAttribute('aria-label',open?'关闭导航':'打开导航');}
  toggle.onclick=()=>menu(toggle.getAttribute('aria-expanded')!=='true');
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){menu(false);toggle.focus();}});
  document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))menu(false);});
})();
