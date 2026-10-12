/* Local, explicitly saved color assets. Not an account or entitlement store. */
(()=>{'use strict';
 const legacyKEY='mengyu-shared-palettes:v1',KEY=()=>{const id=window.PlatformWorkspace?.owner();if(!id)throw Error('请先登录并打开自己的项目');return 'mengyu-shared-palettes:v2:'+encodeURIComponent(id)},roleKeys=['primary','soft','emphasis','paper'];
 const hex=v=>{if(typeof v!=='string'||!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(v))throw Error('配色格式不正确，未保存');return (v.length===4?'#'+[...v.slice(1)].map(x=>x+x).join(''):v).toLowerCase()};
 const mix=(a,b,t)=>{a=hex(a);b=hex(b);return '#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('')};
 const lum=c=>{c=hex(c);return [1,3,5].map(i=>{const x=parseInt(c.slice(i,i+2),16)/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0)};
 const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 function clean(p){if(!p||!Array.isArray(p.colors)||p.colors.length<2||p.colors.length>8||!p.roles)throw Error('配色数据不完整，未保存');
  const name=String(p.name||'').trim().slice(0,40);if(!name)throw Error('请先给这套配色起个名字');
  return {id:typeof p.id==='string'?p.id:'',name,colors:p.colors.map(hex),roles:Object.fromEntries(roleKeys.map(k=>[k,hex(p.roles[k])])),source:{tool:String(p.source?.tool||'').slice(0,24),templateId:String(p.source?.templateId||'').slice(0,80),paletteId:String(p.source?.paletteId||'').slice(0,40),label:String(p.source?.label||'').slice(0,80)},savedAt:String(p.savedAt||'')};
 }
 function list(){try{const raw=localStorage.getItem(KEY());if(!raw)return [];const data=JSON.parse(raw);if(data.schema!=='owned-shared-palettes/v2'||data.ownerId!==PlatformWorkspace.owner()||!Array.isArray(data.items))throw Error();return data.items.map(clean)}catch{throw Error('本机配色暂时无法读取，原记录未覆盖')}}
 const signature=p=>JSON.stringify([p.colors,p.roles]);
 function write(items){try{localStorage.setItem(KEY(),JSON.stringify({schema:'owned-shared-palettes/v2',ownerId:PlatformWorkspace.owner(),items}));window.dispatchEvent(new CustomEvent('saved-palettes-change'))}catch{throw Error('浏览器无法保存配色，请检查存储空间与浏览器设置')}}
 async function save(raw){await PlatformWorkspace.checkSession();const p=clean(raw),items=list(),old=items.find(x=>signature(x)===signature(p));if(!old&&items.length>=100)throw Error('已保存100套配色，请先删除不需要的配色');p.id=old?.id||'sp-'+crypto.randomUUID();p.savedAt=new Date().toISOString();write([p,...items.filter(x=>x.id!==p.id)]);return {palette:p,duplicate:!!old}}
 async function remove(id){await PlatformWorkspace.checkSession();const items=list();write(items.filter(x=>x.id!==id))}
 function reading(p){const r={...clean(p).roles};if(lum(r.paper)<.78)r.paper=mix(r.paper,'#ffffff',.94);if(lum(r.soft)<.6)r.soft=mix(r.soft,r.paper,.88);
  for(const k of ['primary','emphasis']){let t=0;const original=r[k];while(Math.min(contrast(r[k],r.paper),contrast(r[k],r.soft))<4.5&&t<1){t=Math.min(1,t+.04);r[k]=mix(original,'#16151b',t)}}
  return {roles:r,adjusted:roleKeys.some(k=>r[k]!==p.roles[k])};
 }
 function fromWebsite(t,p){const [a,b,c,d]=p.colors;let roles;
  if(t.id==='shen')roles={primary:a,soft:d,emphasis:b,paper:mix(c,'#ffffff',.6)};
  else if(t.id==='suye')roles={primary:a,soft:c,emphasis:b,paper:d};
  else if(t.id==='zhou')roles={primary:c,soft:a,emphasis:c,paper:d};
  else roles={primary:a,soft:c,emphasis:b,paper:d};
  return {name:p.name,colors:p.colors,roles,source:{tool:'website',templateId:t.id,paletteId:p.id,label:t.name+' · '+p.name}};
 }
 function element(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
 function mount(host,options){host.classList.add('saved-palettes');host.replaceChildren();
  const title=element('h2',null,'我的配色'),hint=element('p','sp-hint','收藏喜欢的配色，公众号排版时一键使用'),scope=element('p','sp-scope','仅当前账户可见，保存在当前浏览器；不跨设备同步');
  const label=element('label','sp-name','配色名称'),input=element('input');input.type='text';input.maxLength=40;input.autocomplete='off';input.value=options.current().name;label.append(input);
  const saveBtn=element('button','sp-save','保存到我的配色');saveBtn.type='button';const status=element('p','sp-status');status.setAttribute('role','status');const items=element('div','sp-items');items.setAttribute('aria-label','已保存的配色');
  host.append(title,hint,label,saveBtn,status,items,scope);
  function message(text){status.textContent=text;options.notify?.(text)}
  function refresh(){items.replaceChildren();try{const all=list();if(!all.length){items.append(element('p','sp-empty','还没有收藏，选好颜色后保存即可'));return}
    for(const p of all){const row=element('div','sp-item'),swatches=element('span','sp-swatches');swatches.setAttribute('aria-hidden','true');p.colors.forEach(c=>{const s=element('i');s.style.backgroundColor=c;swatches.append(s)});
     const name=element('b',null,p.name),meta=element('small',null,p.source.tool==='website'?'来自网站 · '+p.source.label:'来自公众号');const main=element('div','sp-info');main.append(swatches,name,meta);row.append(main);
     const actions=element('div','sp-actions');if(options.apply){const use=element('button','sp-use','使用');use.type='button';use.setAttribute('aria-label','使用配色 '+p.name);use.onclick=()=>{try{options.apply(p);input.value=p.name;items.querySelectorAll('.sp-item').forEach(x=>x.removeAttribute('data-active'));row.dataset.active='true';}catch(e){message(e.message)}};actions.append(use)}else{const link=element('a','sp-use','用于公众号');link.href='wechat-template-editor.html?template=warm-beige-lifestyle&savedPalette='+encodeURIComponent(p.id);actions.append(link)}
     const del=element('button','sp-delete','移除');del.type='button';del.setAttribute('aria-label','移除配色 '+p.name);del.onclick=async()=>{if(!confirm('从我的配色移除“'+p.name+'”？不会改变已经使用它的作品'))return;try{await remove(p.id);message('已移除收藏，已应用的作品不受影响')}catch(e){message(e.message)}};actions.append(del);row.append(actions);items.append(row);
    }
   }catch(e){items.append(element('p','sp-error',e.message))}}
  async function saveCurrent(){try{const result=await save({...options.current(),name:input.value});message(result.duplicate?'这套配色已收藏，名称已更新':'已保存到我的配色，可在公众号中使用');return result}catch(e){message(e.message);return null}}
  saveBtn.onclick=saveCurrent;const changed=()=>refresh();window.addEventListener('saved-palettes-change',changed);window.addEventListener('storage',e=>{if(e.key?.startsWith('mengyu-shared-palettes:v2:')||e.key===null)refresh()});refresh();
  return {saveCurrent,refresh,setName:name=>input.value=name,message};
 }
 window.SavedPalettes={key:KEY,list,save,remove,reading,fromWebsite,mount,contrast};
})();
