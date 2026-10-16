(()=>{
  const dialog=document.querySelector('#upgradeDialog');
  const accountLink=document.querySelector('#accountLink');
  const title=document.querySelector('#upgradeTitle');
  const text=document.querySelector('#upgradeText');
  const actions=[...document.querySelectorAll('[data-plan-action]')];
  let user=null;

  const labels={free:'Free',pro:'Pro',max:'Max'};
  const authUrl=(mode='login')=>`${mode==='register'?'register':'login'}.html?returnTo=${encodeURIComponent('/ai-brand-visual-agent/visual-island-test/membership.html')}`;
  const showUpgrade=plan=>{
    title.textContent=`联系工作人员开通 ${labels[plan]}`;
    text.textContent=`扫码添加工作人员，说明你的登录手机号和要开通的 ${labels[plan]} 方案。确认后会在原账户上开通会员。`;
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
  };

  function applyAccountState(){
    const tier=user?.membership?.tier||'free';
    document.querySelectorAll('[data-plan-card]').forEach(card=>card.classList.toggle('current',!!user&&card.dataset.planCard===tier));
    if(user){
      accountLink.href='space.html';
      accountLink.textContent='个人空间';
    }
    actions.forEach(action=>{
      const plan=action.dataset.planAction;
      action.disabled=false;
      if(plan==='free'){
        if(user){action.textContent=tier==='free'?'当前方案':'Free 方案';action.removeAttribute('href');action.setAttribute('aria-disabled','true');}
        return;
      }
      if(!user){action.textContent='登录后升级';return;}
      action.textContent=tier===plan?'当前方案':'联系工作人员开通';
      action.disabled=tier===plan;
    });
  }

  actions.forEach(action=>action.addEventListener('click',event=>{
    const plan=action.dataset.planAction;
    if(plan==='free')return;
    if(!user){location.href=authUrl('login');return;}
    event.preventDefault();
    showUpgrade(plan);
  }));
  document.querySelector('#dialogClose').addEventListener('click',()=>dialog.close());
  document.querySelector('#dialogDone').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog.hasAttribute('open'))dialog.close()});

  fetch('/api/me').then(response=>response.ok?response.json():null).then(data=>{user=data?.authenticated?data.user:null;applyAccountState()}).catch(()=>applyAccountState());
})();
