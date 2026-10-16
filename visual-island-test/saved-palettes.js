/* Account-scoped color assets shared by palette, website and WeChat tools. */
(()=>{'use strict';
 const roleKeys=['primary','soft','emphasis','paper'];
 const resolveOwner=id=>id||window.PlatformWorkspace?.owner()||null;
 const key=id=>{const owner=resolveOwner(id);if(!owner)throw Error('请先登录并打开自己的项目');return 'mengyu-shared-palettes:v2:'+encodeURIComponent(owner)};
 const hex=v=>{if(typeof v!=='string'||!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(v))throw Error('配色格式不正确，未保存');return (v.length===4?'#'+[...v.slice(1)].map(x=>x+x).join(''):v).toLowerCase()};
 const mix=(a,b,t)=>{a=hex(a);b=hex(b);return '#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('')};
 const lum=c=>{c=hex(c);return [1,3,5].map(i=>{const x=parseInt(c.slice(i,i+2),16)/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0)};
 const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 function clean(p){if(!p||!Array.isArray(p.colors)||p.colors.length!==4||!p.roles)throw Error('配色必须包含主色、辅助色、强调色和页面底色');
  const name=String(p.name||'').trim().slice(0,40);if(!name)throw Error('请先给这套配色起个名字');
  return {id:typeof p.id==='string'?p.id:'',name,colors:p.colors.map(hex),roles:Object.fromEntries(roleKeys.map(k=>[k,hex(p.roles[k])])),source:{tool:String(p.source?.tool||'').slice(0,24),templateId:String(p.source?.templateId||'').slice(0,80),paletteId:String(p.source?.paletteId||'').slice(0,80),label:String(p.source?.label||'').slice(0,80)},savedAt:String(p.savedAt||'')};
 }
 function list(ownerId){const owner=resolveOwner(ownerId);if(!owner)return[];try{const raw=localStorage.getItem(key(owner));if(!raw)return [];const data=JSON.parse(raw);if(data.schema!=='owned-shared-palettes/v2'||data.ownerId!==owner||!Array.isArray(data.items))throw Error();return data.items.map(clean)}catch{throw Error('本机配色暂时无法读取，原记录未覆盖')}}
 const signature=p=>JSON.stringify([p.colors,p.roles]);
 function write(items,ownerId){const owner=resolveOwner(ownerId);if(!owner)throw Error('请先登录');try{localStorage.setItem(key(owner),JSON.stringify({schema:'owned-shared-palettes/v2',ownerId:owner,items}));window.dispatchEvent(new CustomEvent('saved-palettes-change',{detail:{ownerId:owner}}))}catch{throw Error('浏览器无法保存配色，请检查存储空间与浏览器设置')}}
 async function assertOwner(ownerId){const user=window.PlatformWorkspace?.owner()?await PlatformWorkspace.checkSession():await PlatformAccount.currentUser();if(!user?.id||user.id!==ownerId)throw Error('账户状态已变化，请刷新后重试');return user}
 async function saveForOwner(raw,ownerId){const owner=resolveOwner(ownerId);if(!owner)throw Error('请先登录');await assertOwner(owner);const p=clean(raw),items=list(owner),old=items.find(x=>signature(x)===signature(p));if(!old&&items.length>=100)throw Error('已保存100套配色，请先删除不需要的配色');p.id=old?.id||'sp-'+crypto.randomUUID();p.savedAt=new Date().toISOString();write([p,...items.filter(x=>x.id!==p.id)],owner);return {palette:p,duplicate:!!old}}
 async function save(raw){const owner=resolveOwner();if(!owner)throw Error('请先登录并打开自己的项目');return saveForOwner(raw,owner)}
 async function removeForOwner(id,ownerId){const owner=resolveOwner(ownerId);await assertOwner(owner);write(list(owner).filter(x=>x.id!==id),owner)}
 async function remove(id){return removeForOwner(id,resolveOwner())}
 function reading(p){const r={...clean(p).roles};if(lum(r.paper)<.78)r.paper=mix(r.paper,'#ffffff',.94);if(lum(r.soft)<.6)r.soft=mix(r.soft,r.paper,.88);
  for(const k of ['primary','emphasis']){let t=0;const original=r[k];while(Math.min(contrast(r[k],r.paper),contrast(r[k],r.soft))<4.5&&t<1){t=Math.min(1,t+.04);r[k]=mix(original,'#16151b',t)}}
  return {roles:r,adjusted:roleKeys.some(k=>r[k]!==p.roles[k])};
 }
 function fromWebsite(t,p){const [a,b,c,d]=p.colors;let roles;
  if(t.id==='shen')roles={primary:a,soft:d,emphasis:b,paper:mix(c,'#ffffff',.6)};
  else if(t.id==='suye')roles={primary:a,soft:c,emphasis:b,paper:d};
  else if(t.id==='zhou')roles={primary:c,soft:a,emphasis:c,paper:d};
  else roles={primary:a,soft:c,emphasis:b,paper:d};
  if(p.readingRoles)roles={...p.readingRoles};
  return {name:p.name,colors:roleKeys.map(k=>roles[k]),roles,source:{tool:'website',templateId:t.id,paletteId:p.id,label:t.name+' · '+p.name}};
 }
 function fromPalette(snapshot){const [primary,soft,emphasis,paper]=snapshot.colors;return{name:snapshot.name,colors:[primary,soft,emphasis,paper],roles:{primary,soft,emphasis,paper},source:{tool:'palette',paletteId:snapshot.presetId||'',label:snapshot.name}}}
 function element(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
 function mount(host,options){host.classList.add('saved-palettes');host.replaceChildren();
  const title=element('h2',null,'我的配色'),hint=element('p','sp-hint','保存喜欢的配色，在网站和公众号里继续使用'),scope=element('p','sp-scope','仅当前账户可见，保存在当前浏览器；不跨设备同步');
  const label=element('label','sp-name','配色名称'),input=element('input');input.type='text';input.maxLength=40;input.autocomplete='off';input.value=options.current().name;label.append(input);
  const saveBtn=element('button','sp-save','保存到我的配色');saveBtn.type='button';const status=element('p','sp-status');status.setAttribute('role','status');const items=element('div','sp-items');items.setAttribute('aria-label','已保存的配色');
  host.append(title,hint,label,saveBtn,status,items,scope);
  function message(text){status.textContent=text;options.notify?.(text)}
  function refresh(){items.replaceChildren();try{const all=list();if(!all.length){items.append(element('p','sp-empty','还没有收藏，选好颜色后保存即可'));return}
    for(const p of all){const row=element('div','sp-item'),swatches=element('span','sp-swatches');swatches.setAttribute('aria-hidden','true');p.colors.forEach(c=>{const s=element('i');s.style.backgroundColor=c;swatches.append(s)});
     const sourceName={website:'网站',wechat:'公众号',palette:'配色工具'}[p.source.tool]||'配色工具',name=element('b',null,p.name),meta=element('small',null,'来自'+sourceName+(p.source.label?' · '+p.source.label:'')),main=element('div','sp-info');main.append(swatches,name,meta);row.append(main);
     const actions=element('div','sp-actions');if(options.apply){const use=element('button','sp-use','使用');use.type='button';use.setAttribute('aria-label','使用配色 '+p.name);use.onclick=()=>{try{options.apply(p);input.value=p.name;items.querySelectorAll('.sp-item').forEach(x=>x.removeAttribute('data-active'));row.dataset.active='true';}catch(e){message(e.message)}};actions.append(use)}
     const del=element('button','sp-delete','移除');del.type='button';del.setAttribute('aria-label','移除配色 '+p.name);del.onclick=async()=>{if(!confirm('从我的配色移除“'+p.name+'”？不会改变已经使用它的作品'))return;try{await remove(p.id);message('已移除收藏，已应用的作品不受影响')}catch(e){message(e.message)}};actions.append(del);row.append(actions);items.append(row);
    }
   }catch(e){items.append(element('p','sp-error',e.message))}}
  async function saveCurrent(){try{const result=await save({...options.current(),name:input.value});message(result.duplicate?'这套配色已收藏，名称已更新':'已保存到我的配色，可在网站和公众号中使用');return result}catch(e){message(e.message);return null}}
  saveBtn.onclick=saveCurrent;const changed=()=>refresh();window.addEventListener('saved-palettes-change',changed);window.addEventListener('storage',e=>{if(e.key?.startsWith('mengyu-shared-palettes:v2:')||e.key===null)refresh()});refresh();
  return {saveCurrent,refresh,setName:name=>input.value=name,message};
 }
 window.SavedPalettes={key,list,save,saveForOwner,remove,removeForOwner,reading,fromWebsite,fromPalette,mount,contrast};
})();
