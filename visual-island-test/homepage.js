(()=>{
  const body=document.body,nav=document.querySelector('#siteNav'),toggle=document.querySelector('#navToggle');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}})}
  addEventListener('pageshow',()=>{if(nav)nav.classList.remove('open');if(toggle)toggle.setAttribute('aria-expanded','false');});
  const avatar=document.querySelector('#accountAvatar');
  const avatarPalettes=[['#6e43af','#aa8df0','#f3a6a0','#f0d77a'],['#126e82','#4fb3bf','#a8d8c8','#e9c46a'],['#b34d75','#e58a9f','#f3c4a8','#8d72c7'],['#2f6690','#67a6c7','#b8d8d8','#f2b880'],['#536b43','#91a86b','#d7b56d','#d98262'],['#8d5a97','#c58fb0','#e9b4a8','#7f9dcc']];
  function applyAvatar(user){if(!avatar)return;let hash=0;for(const ch of String(user.id||user.displayName||'member'))hash=(hash*31+ch.codePointAt(0))>>>0;const colors=avatarPalettes[hash%avatarPalettes.length];colors.forEach((color,index)=>avatar.style.setProperty(`--avatar-${String.fromCharCode(97+index)}`,color));avatar.dataset.palette=String(hash%avatarPalettes.length)}
  fetch('/api/me').then(r=>r.ok?r.json():null).then(data=>{const user=data?.user;if(!user)return;body.classList.remove('logged-out');body.classList.add('logged-in');applyAvatar(user)}).catch(()=>{});
  const stage=document.querySelector('.ambient-stage');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(stage&&!reduceMotion.matches){
    let frame=0;
    const move=e=>{
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        const x=((e.clientX/innerWidth)-.5)*-18;
        const y=((e.clientY/innerHeight)-.5)*-12;
        document.documentElement.style.setProperty('--ambient-x',`${x.toFixed(2)}px`);
        document.documentElement.style.setProperty('--ambient-y',`${y.toFixed(2)}px`);
        frame=0;
      });
    };
    window.addEventListener('pointermove',move,{passive:true});
    document.documentElement.addEventListener('mouseleave',()=>{
      document.documentElement.style.setProperty('--ambient-x','0px');
      document.documentElement.style.setProperty('--ambient-y','0px');
    });
  }
})();
