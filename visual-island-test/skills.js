/* CTRL-01: real session checks. No public ZIP URL, no local entitlement cache. */
(() => {
 'use strict';
 const button=document.querySelector('#skillDownload'),status=document.querySelector('#skillDownloadStatus'),account=window.PlatformAccount;
 let busy=false,refreshing=false;
 const login='/login.html?returnTo=%2Fskills.html';
function paint(user){button.textContent=!user?'登录后下载安装包':user.membership?.canExport?'下载 Skill 安装包':'升级后下载安装包';button.disabled=false;}
 async function refresh(){if(busy||refreshing)return;refreshing=true;try{paint(await account.currentUser());}catch{button.textContent='重试账户连接';button.disabled=false;status.textContent='暂时无法确认账户，请重试。';}finally{refreshing=false;}}
 button.addEventListener('click',async()=>{
  if(busy)return;busy=true;button.disabled=true;button.textContent='正在确认…';status.textContent='';
  let user;
  try{
   user=await account.currentUser();
   if(!user){location.assign(login);return;}
   if(!user.membership?.canExport){location.assign('membership.html');return;}
button.textContent='正在准备安装包…';
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
   let blob;
   try{
    const response=await fetch('/api/skills/download',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({ownerId:user.id,skillId:button.dataset.skill}),signal:controller.signal});
    if(!response.ok){let error={};try{error=await response.json();}catch{}
     if(response.status===401){location.assign(login);return;}
     if(response.status===403){status.textContent='会员状态已变化，下载需要 Pro 或 Max。';return;}
     throw Error(response.status===404?'下载服务尚未启用，请稍后再试。':error.error||'下载失败，请重试。');
    }
    if(!response.headers.get('Content-Type')?.includes('application/zip'))throw Error('文件响应异常，未下载。');
    blob=await response.blob();
   }finally{clearTimeout(timer);}
   const latest=await account.currentUser();
   if(latest?.id!==user.id||!latest.membership?.canExport)throw Error('账户或会员状态已变化，未下载。');
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='wechatpublish.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   status.textContent='已下载。解压后先看 INSTALL.md，再交给 AI 使用。';
  }catch(error){status.textContent=error.name==='AbortError'?'请求超时，请重试。':error.message||'下载失败，请重试。';}
  finally{busy=false;paint(user);void refresh();}
 });
 addEventListener('focus',()=>void refresh());
 addEventListener('pageshow',()=>void refresh());
 addEventListener('storage',e=>{if(e.key==='mengyu-account-change')void refresh();});
 void refresh();
})();
