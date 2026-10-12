/* CTRL-01: guest trials, account-owned projects, fresh entitlement checks and server-only delivery. */
(()=>{'use strict';
 const A=()=>window.PlatformAccount;let user=null,locked=true,context=null,ticket=0;
 const key=id=>'mengyu-owned-projects-v1:'+encodeURIComponent(id),guestKey='mengyu-guest-projects-v1';
 const validItem=x=>x&&typeof x.id==='string'&&['website','wechat','builder','wechat-classic'].includes(x.module)&&typeof x.templateId==='string';
 function list(id){if(!id)return[];const raw=localStorage.getItem(key(id));if(!raw)return[];const data=JSON.parse(raw);if(data?.schema!=='mengyu-owned-projects/v1'||data.ownerId!==id||!Array.isArray(data.items)||data.items.some(x=>!validItem(x)))throw Error('项目记录异常，原记录已保留');return data.items;}
 function guestList(){const raw=localStorage.getItem(guestKey);if(!raw)return[];const data=JSON.parse(raw);if(data?.schema!=='mengyu-guest-projects/v1'||!Array.isArray(data.items)||data.items.some(x=>!validItem(x)))throw Error('本机试用草稿异常，原记录已保留');return data.items;}
 function lock(message='正在确认账户…'){locked=true;document.body.classList.add('workspace-locked');document.querySelectorAll('[data-owned-workspace]').forEach(e=>e.inert=true);let box=document.querySelector('#workspaceGuard');if(!box){box=document.createElement('section');box.id='workspaceGuard';box.setAttribute('role','status');const p=document.createElement('p');p.id='workspaceGuardMessage';const b=document.createElement('button');b.textContent='重新载入';b.onclick=()=>location.reload();box.append(p,b);document.body.append(box);}box.hidden=false;box.querySelector('p').textContent=message;}
 function unlock(){locked=false;document.body.classList.remove('workspace-locked');document.querySelectorAll('[data-owned-workspace]').forEach(e=>e.inert=false);const box=document.querySelector('#workspaceGuard');if(box)box.hidden=true;}
 async function checkSession(){const fresh=await A().currentUser();if(context?.guest){if(fresh){lock('检测到已登录，请刷新后把草稿保存到当前账户。');throw Error('账户状态已变化');}if(locked)unlock();return null;}if(!fresh){lock('账户已退出，请重新登录后继续。');throw Error('请先登录');}if(user&&fresh.id!==user.id){lock('账户已变化，请重新打开。此前账户的内容不会带入。');throw Error('账户已变化');}if(locked)throw Error('账户尚未确认，请重新打开');return fresh;}
 async function start(module,templateId,revision){
  lock();try{user=await A().currentUser();const params=new URLSearchParams(location.search),asset=params.get('asset'),all=user?list(user.id):guestList();let entry=asset?all.find(x=>x.id===asset&&x.module===module&&x.templateId===templateId):params.get('new')==='1'?null:all.find(x=>x.module===module&&x.templateId===templateId);
   if(asset&&!entry){lock(user?'当前账户没有这份项目，请返回目录选择。':'这份保存记录属于登录账户；请登录后从个人空间打开。');return null;}
   if(entry&&entry.revision!==revision){lock('项目模板版本已变化，原记录已保留，暂不自动覆盖。');return null;}
   context={module,templateId,revision,id:entry?.id||'project-'+crypto.randomUUID(),guest:!user};unlock();return{user,entry,context,isGuest:!user};
  }catch(e){lock(e.message||'账户暂不可用，请重试');return null;}
 }
 async function save(data,name){const seq=++ticket,snapshot=structuredClone(data);if(!context)throw Error('工作区未就绪');const entry={...context,data:snapshot,name:String(name||'未命名项目').slice(0,100),savedAt:new Date().toISOString()};
  if(context.guest){const fresh=await checkSession();if(fresh||seq!==ticket)return null;const items=guestList();localStorage.setItem(guestKey,JSON.stringify({schema:'mengyu-guest-projects/v1',items:[entry,...items.filter(x=>x.id!==entry.id)]}));}
  else{const fresh=await checkSession();if(seq!==ticket)return null;const items=list(fresh.id);localStorage.setItem(key(fresh.id),JSON.stringify({schema:'mengyu-owned-projects/v1',ownerId:fresh.id,items:[entry,...items.filter(x=>x.id!==entry.id)]}));}
  const url=new URL(location.href);url.searchParams.set('asset',entry.id);url.searchParams.delete('new');history.replaceState({},'',url);return entry;
 }
 async function download(module,data,button,notify=()=>{}){const label=button?.textContent;if(button){if(button.dataset.exportBusy)return;button.dataset.exportBusy='true';button.disabled=true;button.textContent='正在确认…';}try{
   const current=await A().currentUser();if(!current){notify('可以继续在线试用；下载需要登录并开通 Pro / Max。');return {ok:false,error:'login-required'};}if(context&&!context.guest&&(locked||current.id!==user.id)){lock('账户已变化，请重新打开');return{ok:false,error:'account-changed'};}
   if(!current.membership?.canExport){notify('Free 可继续在线体验；下载需开通 Pro / Max。');return{ok:false,error:'membership-required'};}
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);let response,blob;
   try{response=await fetch('/api/'+module+'/export',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,ownerId:current.id}),signal:controller.signal});if(!response.ok){if(response.status===404)throw Error('下载服务尚未启用，请稍后再试');let error={};try{error=await response.json();}catch{}throw Error(error.error||'下载失败，请重试');}if(!response.headers.get('Content-Type')?.includes('application/zip'))throw Error('文件响应异常');blob=await response.blob();}finally{clearTimeout(timer);}
   const fresh=await A().currentUser();if(fresh?.id!==current.id||!fresh.membership?.canExport)throw Error('账户或会员状态已变化，未下载');const match=response.headers.get('Content-Disposition')?.match(/filename\*=UTF-8''([^;]+)/i),filename=match?decodeURIComponent(match[1]):module+'-package.zip';
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('已下载，可交给自己的 AI 继续使用');return{ok:true};
  }catch(e){notify(e.name==='AbortError'?'请求超时，请重试':e.message);return{ok:false,error:e.message};}finally{if(button){button.disabled=false;button.textContent=label;delete button.dataset.exportBusy;}}
 }
 async function refresh(){if(!context)return;try{const fresh=await A().currentUser();if(context.guest){if(fresh){lock('检测到已登录，请刷新后继续。');return;}unlock();return;}if(!fresh||fresh.id!==user.id){lock('账户已变化，请重新打开。此前内容不会带入。');return;}unlock();}catch{lock('无法确认账户，工作区已暂时锁定');}}
 addEventListener('blur',()=>{if(context&&!context.guest)lock('正在确认账户…');});addEventListener('focus',refresh);addEventListener('pageshow',refresh);addEventListener('storage',e=>{if(context&&e.key==='mengyu-account-change'){if(!context.guest)lock();void refresh();}});
 window.PlatformWorkspace={start,save,list,key,guestList,guestKey,download,checkSession,owner:()=>!locked?user?.id:null,refresh,lock,get context(){return context;}};
})();