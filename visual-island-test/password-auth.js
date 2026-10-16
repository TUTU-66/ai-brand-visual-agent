(()=>{
  const $=selector=>document.querySelector(selector);
  const page=document.body.dataset.accountPage;
  const form=$('#passwordAuthForm');
  const phone=$('#phone');
  const message=$('#formMessage');
  const query=new URLSearchParams(location.search);
  const requestedReturn=query.get('returnTo')||'/ai-brand-visual-agent/visual-island-test/space.html';
  const returnTo=/^\/(?!\/)[A-Za-z0-9_./?=&%-]*$/.test(requestedReturn)?requestedReturn:'/ai-brand-visual-agent/visual-island-test/space.html';
  // Keep the original tool destination when switching account entry methods.
  if(query.has('returnTo'))document.querySelectorAll('a[href]').forEach(link=>{
    const target=new URL(link.getAttribute('href'),location.href);
    if(target.origin===location.origin&&['/ai-brand-visual-agent/visual-island-test/login.html','/ai-brand-visual-agent/visual-island-test/register.html','/ai-brand-visual-agent/visual-island-test/forgot-password.html','/ai-brand-visual-agent/visual-island-test/auth.html'].includes(target.pathname)){
      target.searchParams.set('returnTo',returnTo);link.href=target.pathname+target.search+target.hash;
    }
  });
  let countdown=0,timer=null;

  const setMessage=(text,type='')=>{message.textContent=text;message.className='form-message'+(type?' '+type:'')};
  const cleanPhone=()=>phone.value.replace(/\D/g,'').slice(0,11);
  const api=async(path,options={})=>{const response=await fetch(path,{headers:{'Content-Type':'application/json'},...options});let data={};try{data=await response.json()}catch{}if(!response.ok)throw new Error(data.error||'请求失败，请稍后再试');return data};
  const validPhone=value=>/^1[3-9]\d{9}$/.test(value);
  const validPassword=value=>value.length>=8&&value.length<=64&&/[A-Za-z\p{L}]/u.test(value)&&/\d/.test(value);

  phone.addEventListener('input',()=>phone.value=cleanPhone());
  document.querySelectorAll('[data-password-toggle]').forEach(button=>button.addEventListener('click',()=>{
    const input=document.getElementById(button.dataset.passwordToggle);
    const showing=input.type==='text';
    input.type=showing?'password':'text';
    button.textContent=showing?'显示':'隐藏';
    button.setAttribute('aria-label',showing?'显示密码':'隐藏密码');
  }));

  function tick(){
    const send=$('#sendCode');
    if(countdown<=0){clearInterval(timer);send.disabled=false;send.textContent='重新获取';return}
    send.disabled=true;send.textContent=`${countdown}s 后重试`;countdown--;
  }

  async function loadConfig(){
    if(page!=='reset')return;
    try{
      const config=await api('/api/config');
      const note=$('#modeNote');
      if(config.smsMode==='dev'){note.hidden=false;$('#modeText').textContent='当前没有发送真实短信，验证码会直接显示在本页。';}
      else if(config.smsMode!=='tencent'){note.hidden=false;$('#modeText').textContent='手机号短信服务尚未启用。';$('#sendCode').disabled=true;}
    }catch{setMessage('账户服务未启动，请从能力网站启动器打开。','error')}
  }

  if(page==='reset'){
    const code=$('#code');
    code.addEventListener('input',()=>code.value=code.value.replace(/\D/g,'').slice(0,6));
    $('#sendCode').addEventListener('click',async()=>{
      const value=cleanPhone();
      if(!validPhone(value)){setMessage('请输入正确的 11 位手机号','error');phone.focus();return}
      const send=$('#sendCode');send.disabled=true;setMessage('正在获取验证码…');
      try{
        const data=await api('/api/auth/phone/start',{method:'POST',body:JSON.stringify({phone:value})});
        setMessage(data.message,'success');
        if(data.devCode){$('#devCode').hidden=false;$('#devCodeValue').textContent=data.devCode;code.value=data.devCode}
        countdown=60;tick();timer=setInterval(tick,1000);code.focus();
      }catch(error){send.disabled=false;setMessage(error.message,'error')}
    });
  }

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const p=cleanPhone();const password=$('#password').value;
    if(!validPhone(p)){setMessage('请输入正确的 11 位手机号','error');phone.focus();return}
    if(!validPassword(password)){setMessage('密码需要 8—64 位，并同时包含字母和数字','error');$('#password').focus();return}
    const payload={phone:p,password,returnTo};let endpoint='/api/auth/password/login';
    if(page!=='login'){
      const confirm=$('#confirmPassword').value;
      if(password!==confirm){setMessage('两次输入的密码不一致','error');$('#confirmPassword').focus();return}
      if(page==='reset'){
        const code=$('#code').value.trim();
        if(!/^\d{6}$/.test(code)){setMessage('请输入 6 位验证码','error');return}
        payload.code=code;
      }
      endpoint=page==='register'?'/api/auth/password/register':'/api/auth/password/reset';
    }
    const button=$('#submitPassword');button.disabled=true;button.textContent=page==='login'?'正在登录…':page==='register'?'正在注册…':'正在保存…';setMessage('');
    try{
      const data=await api(endpoint,{method:'POST',body:JSON.stringify(payload)});
      setMessage(page==='login'?'登录成功，正在进入':page==='register'?'注册成功，正在进入':'密码已更新，正在进入','success');
      location.href=data.redirect||returnTo;
    }catch(error){setMessage(error.message,'error');button.disabled=false;button.textContent=page==='login'?'登录':page==='register'?'注册并进入':'保存新密码并登录'}
  });

  fetch('/api/me').then(response=>response.ok?response.json():null).then(data=>{if(data?.authenticated&&data.user)location.replace(returnTo)}).catch(()=>{});
  loadConfig();
})();
