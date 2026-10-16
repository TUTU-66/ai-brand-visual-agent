/* CTRL-01: login-required tools, account-owned projects and server-only paid delivery. */
(()=>{'use strict';
 const A=()=>window.PlatformAccount;let user=null,locked=true,context=null,ticket=0;
 const key=id=>'mengyu-owned-projects-v1:'+encodeURIComponent(id),guestKey='mengyu-guest-projects-v1';
 const validItem=x=>x&&typeof x.id==='string'&&['website','wechat','builder','wechat-classic'].includes(x.module)&&typeof x.templateId==='string';
 function list(id){if(!id)return[];const raw=localStorage.getItem(key(id));if(!raw)return[];const data=JSON.parse(raw);if(data?.schema!=='mengyu-owned-projects/v1'||data.ownerId!==id||!Array.isArray(data.items)||data.items.some(x=>!validItem(x)))throw Error('项目记录异常，原记录已保留');return data.items;}
 function guestList(){const raw=localStorage.getItem(guestKey);if(!raw)return[];const data=JSON.parse(raw);if(data?.schema!=='mengyu-guest-projects/v1'||!Array.isArray(data.items)||data.items.some(x=>!validItem(x)))throw Error('本机试用草稿异常，原记录已保留');return data.items;}
 function lock(message='正在确认账户…'){locked=true;document.body.classList.add('workspace-locked');document.querySelectorAll('[data-owned-workspace]').forEach(e=>e.inert=true);let box=document.querySelector('#workspaceGuard');if(!box){box=document.createElement('section');box.id='workspaceGuard';box.className='platform-login-guard';box.setAttribute('role','status');const p=document.createElement('p');p.id='workspaceGuardMessage';const actions=document.createElement('div');actions.className='platform-login-actions';const login=document.createElement('a');login.id='workspaceLogin';login.className='platform-login-button';login.textContent='登录';const target=location.pathname+location.search;login.href='/login.html?returnTo='+encodeURIComponent(target);const hint=document.createElement('span');hint.className='platform-login-hint';hint.textContent='登录后继续';const b=document.createElement('button');b.className='platform-login-retry';b.textContent='重新载入';b.onclick=()=>location.reload();actions.append(login,hint,b);box.append(p,actions);document.body.append(box);}box.dataset.mode=message.startsWith('请先登录')?'login':'retry';box.hidden=false;box.querySelector('p').textContent=message;}
 function unlock(){locked=false;document.body.classList.remove('workspace-locked');document.querySelectorAll('[data-owned-workspace]').forEach(e=>e.inert=false);const box=document.querySelector('#workspaceGuard');if(box)box.hidden=true;}
 async function checkSession(){const fresh=await A().currentUser();if(!fresh){lock('请先登录。Free 账户可以使用、编辑、预览和保存。');throw Error('请先登录');}if(user&&fresh.id!==user.id){lock('账户已变化，请重新打开。此前账户的内容不会带入。');throw Error('账户已变化');}if(locked)throw Error('账户尚未确认，请重新打开');return fresh;}
 async function start(module,templateId,revision){
  lock();try{user=await A().currentUser();if(!user){lock('请先登录。注册 Free 账户后即可使用全部工具，下载和导出需开通 Pro / Max。');return null;}const params=new URLSearchParams(location.search),asset=params.get('asset'),all=list(user.id);let entry=asset?all.find(x=>x.id===asset&&x.module===module&&x.templateId===templateId):params.get('new')==='1'?null:all.find(x=>x.module===module&&x.templateId===templateId);
   if(asset&&!entry){lock('当前账户没有这份项目，请返回目录选择。');return null;}
   if(entry&&entry.revision!==revision){lock('项目模板版本已变化，原记录已保留，暂不自动覆盖。');return null;}
   context={module,templateId,revision,id:entry?.id||'project-'+crypto.randomUUID(),guest:false};unlock();return{user,entry,context,isGuest:false};
  }catch(e){lock(e.message||'账户暂不可用，请重试');return null;}
 }
 async function save(data,name){const seq=++ticket,snapshot=structuredClone(data);if(!context)throw Error('工作区未就绪');const entry={...context,data:snapshot,name:String(name||'未命名项目').slice(0,100),savedAt:new Date().toISOString()};
  const fresh=await checkSession();if(seq!==ticket)return null;const items=list(fresh.id);localStorage.setItem(key(fresh.id),JSON.stringify({schema:'mengyu-owned-projects/v1',ownerId:fresh.id,items:[entry,...items.filter(x=>x.id!==entry.id)]}));
  const tracked=module==='builder'?'website':module==='wechat-classic'?'wechat':module;void window.PlatformActivity?.track('project.save',tracked);
  const url=new URL(location.href);url.searchParams.set('asset',entry.id);url.searchParams.delete('new');history.replaceState({},'',url);return entry;
 }
 async function download(module,data,button,notify=()=>{}){const label=button?.textContent;if(button){if(button.dataset.exportBusy)return;button.dataset.exportBusy='true';button.disabled=true;button.textContent='正在确认…';}try{
   const current=await A().currentUser();if(!current){notify('请先登录。Free 可以使用工具，下载需开通 Pro / Max。');return {ok:false,error:'login-required'};}if(context&&(locked||current.id!==user.id)){lock('账户已变化，请重新打开');return{ok:false,error:'account-changed'};}
   if(!current.membership?.canExport){A().promptUpgrade?.('pro');notify('扫码联系工作人员开通 Pro 或 Max 后即可下载。');return{ok:false,error:'membership-required'};}
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);let response,blob;
   try{response=await fetch('/api/'+module+'/export',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,ownerId:current.id}),signal:controller.signal});if(!response.ok){if(response.status===404)throw Error('下载服务尚未启用，请稍后再试');let error={};try{error=await response.json();}catch{}throw Error(error.error||'下载失败，请重试');}if(!response.headers.get('Content-Type')?.includes('application/zip'))throw Error('文件响应异常');blob=await response.blob();}finally{clearTimeout(timer);}
   const fresh=await A().currentUser();if(fresh?.id!==current.id||!fresh.membership?.canExport)throw Error('账户或会员状态已变化，未下载');const match=response.headers.get('Content-Disposition')?.match(/filename\*=UTF-8''([^;]+)/i),filename=match?decodeURIComponent(match[1]):module+'-package.zip';
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('已下载，可交给自己的 AI 继续使用');return{ok:true};
  }catch(e){notify(e.name==='AbortError'?'请求超时，请重试':e.message);return{ok:false,error:e.message};}finally{if(button){button.disabled=false;button.textContent=label;delete button.dataset.exportBusy;}}
 }
 async function refresh(){if(!context)return;try{const fresh=await A().currentUser();if(!fresh||fresh.id!==user.id){lock('账户已变化，请重新登录后打开。此前内容不会带入。');return;}unlock();}catch{lock('无法确认账户，工作区已暂时锁定');}}
 // Moving focus into an article iframe is not leaving the workspace.
 document.addEventListener('visibilitychange',()=>{if(!context)return;if(document.hidden)lock('正在确认账户…');else void refresh();});addEventListener('focus',refresh);addEventListener('pageshow',refresh);addEventListener('storage',e=>{if(context&&e.key==='mengyu-account-change'){lock();void refresh();}});
 window.PlatformWorkspace={start,save,list,key,guestList,guestKey,download,checkSession,owner:()=>!locked?user?.id:null,refresh,lock,get context(){return context;}};
})();
