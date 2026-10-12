(async()=>{'use strict';const T=WebsiteTemplates,$=s=>document.querySelector(s),id=new URLSearchParams(location.search).get('template'),t=T.get(id);
 const toast=s=>{const el=$('#websiteToast');el.textContent=s;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3500)};
 if(!t){$('#editorMessage').textContent='没有找到这套模板，请返回模板库重新选择';document.querySelectorAll('.top-actions button').forEach(b=>b.disabled=true);return}
 const revision=await fetch(t.manifest,{cache:'no-store'}).then(r=>r.text()).then(async text=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(x=>x.toString(16).padStart(2,'0')).join(''));
 const session=await PlatformWorkspace.start('website',t.id,revision);if(!session)return;
 const key=`website-template-draft:${t.id}:${t.version}`;let selected='original',page='index.html',mode=innerWidth<760?'mobile':'desktop',seq=0,saved=false,adjustments={};
 const selection=()=>({paletteId:selected,overrides:adjustments[selected]||{}});
 const current=()=>T.palette(t,selection());
 try{const old=session.entry?.data;if(old&&old.templateId===t.id&&old.version===t.version){selected=T.palette(t,old.paletteId).id;for(const p of [...t.palettes,...t.legacyPalettes,...t.archivedPalettes]){const clean=T.cleanOverrides(t,p.id,old.colorOverrides?.[p.id]);if(Object.keys(clean).length)adjustments[p.id]=clean}saved=true}}catch{}
 $('#templateName').textContent=t.name+' · 配色微调';document.title=t.name+'配色微调｜梦玉的能力网站';$('#backCatalog').href='website-templates.html#template-'+t.id;
 $('#editorPage').innerHTML=t.pages.map(([f,label])=>`<option value="${f}">${label}</option>`).join('');
 const card=(p,note=p.note)=>`<button class="color-choice" data-palette="${p.id}" aria-pressed="false"><span class="palette-strip">${p.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span><b>${p.name}</b><small>${note}</small></button>`;
 $('#originalOptions').innerHTML=card(T.palette(t,'original'),'模板原配色 · 与模板库样张一致');
 $('#colorOptions').innerHTML=t.palettes.map(p=>card(p)).join('');
 const frame=$('#editorFrame'),host=$('#editorViewport');
 function renderControls(){const f=T.colorFields(t,selected),o=adjustments[selected]||{};const row=x=>`<div class="single-color" data-color-field="${x.key}"><label for="color-${x.key}">${x.label}</label><div><input type="color" id="color-${x.key}" data-color-key="${x.key}" value="${o[x.key]||x.value}" aria-label="${x.label}"><input type="text" data-hex-key="${x.key}" value="${o[x.key]||x.value}" aria-label="${x.label} HEX" maxlength="7" spellcheck="false"><button data-reset-color="${x.key}" type="button" aria-label="恢复${x.label}" title="恢复${x.label}" ${o[x.key]?'':'disabled'}>↶</button></div></div>`;
  $('#singleColorFields').innerHTML=f.slice(0,6).map(row).join('');$('#extraColorFields').innerHTML=f.slice(6).map(row).join('');$('.more-color-fields').hidden=f.length<=6;syncControlState();
 }
 function syncControlState(){const o=adjustments[selected]||{},active=Object.keys(o).length>0;$('#resetTweaks').disabled=!active;const warnings=active?T.colorWarnings(t,selected,o):[];$('#colorWarning').hidden=!warnings.length;$('#colorWarning').textContent=warnings.length?'对比偏低：'+warnings.join('、')+'，建议拉开深浅':'';$('#currentPalette').textContent=current().name;}
 function applyTweaks(){const style=frame.contentDocument?.getElementById('website-template-palette');if(style)style.textContent=T.themeCss(t,selection());syncControlState();save();window.dispatchEvent(new Event('website-colors-change'));}
 function editColor(key,value){if(!/^#[\da-f]{6}$/i.test(value))return;const o=T.cleanOverrides(t,selected,{...(adjustments[selected]||{}),[key]:value});if(Object.keys(o).length)adjustments[selected]=o;else delete adjustments[selected];const field=document.querySelector(`[data-color-field="${key}"]`),actual=o[key]||T.colorFields(t,selected).find(f=>f.key===key).value;field.querySelector('[data-color-key]').value=actual;field.querySelector('[data-hex-key]').value=actual;field.querySelector('[data-hex-key]').removeAttribute('aria-invalid');field.querySelector('[data-reset-color]').disabled=!o[key];applyTweaks();}
 $('.single-colors').addEventListener('input',e=>{const key=e.target.dataset.colorKey||e.target.dataset.hexKey;if(key)editColor(key,e.target.value)});
 $('.single-colors').addEventListener('change',e=>{if(e.target.dataset.hexKey&&!/^#[\da-f]{6}$/i.test(e.target.value)){e.target.setAttribute('aria-invalid','true');toast('请输入完整色号，例如 #d6e4e8；当前颜色未改变')}});
 $('.single-colors').addEventListener('click',e=>{const b=e.target.closest('[data-reset-color]');if(!b)return;editColor(b.dataset.resetColor,T.colorFields(t,selected).find(f=>f.key===b.dataset.resetColor).value)});
 $('#resetTweaks').onclick=()=>{delete adjustments[selected];renderControls();applyTweaks();toast('已恢复本套配色，其他套色的微调保留')};
 window.WebsiteEditorPalette={current,selection:()=>JSON.parse(JSON.stringify(selection()))};
 function resize(){T.sizeFrame(frame,host,mode)}new ResizeObserver(resize).observe(host);
 function showPalette(){
  const retained=selected!=='original'&&!t.palettes.some(p=>p.id===selected),box=$('#retainedPalette');
  box.hidden=!retained;box.innerHTML=retained?'<h2 class="palette-section-title">上次保存的配色</h2>'+card(T.palette(t,selected),'保留已有选择 · 切换前不会自动替换'):'';
  document.querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.palette===selected)));
  $('#currentPalette').textContent=current().name;
  renderControls();
 }
 async function save(){try{await PlatformWorkspace.save({templateId:t.id,version:t.version,paletteId:selected,colorOverrides:adjustments},t.name+' · 网站');$('#saveState').textContent=session.isGuest?'已保存为本机试用草稿':'已保存到我的资产 · 当前浏览器';return true}catch(e){$('#saveState').textContent=e.message||'保存失败，原记录已保留';return false}}
 window.saveWebsiteProject=save;
  async function navigate(filename,hash=''){const ticket=++seq;page=filename;$('#editorPage').value=page;$('#editorMessage').textContent='正在打开页面…';try{const html=await T.preview(t,selection(),page);if(ticket!==seq)return;frame.dataset.hash=hash;frame.srcdoc=html}catch{$('#editorMessage').textContent='页面加载失败，请切换页面重试'}}
 T.mount(frame,t,()=>selected,navigate,doc=>{const style=doc.getElementById('website-template-palette');if(style)style.textContent=T.themeCss(t,selection());$('#editorMessage').textContent='';if(frame.dataset.hash){try{doc.querySelector(frame.dataset.hash)?.scrollIntoView()}catch{}}resize()});
 function choose(pid){selected=T.palette(t,pid).id;showPalette();const style=frame.contentDocument?.getElementById('website-template-palette');if(style)style.textContent=T.themeCss(t,selection());else navigate(page);save()}
 function closePanel(){document.body.classList.remove('colors-open');$('#colorBackdrop').hidden=true;$('#openColors').setAttribute('aria-expanded','false')}
 $('#colorPanel').addEventListener('click',e=>{const b=e.target.closest('[data-palette]');if(b)choose(b.dataset.palette)});
 $('#resetColors').onclick=()=>{delete adjustments.original;choose('original');toast('已恢复这套模板的原配色')};$('#saveColors').onclick=async()=>toast(await save()?(session.isGuest?'试用草稿已保存在当前浏览器':'项目已保存到我的资产'):'保存失败，原记录已保留');$('#downloadSite').onclick=e=>T.download(t,selection(),e.currentTarget,toast);
 $('#editorPage').onchange=e=>navigate(e.target.value);document.querySelectorAll('[data-mode]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.mode===mode));b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));resize()}});
 $('#openColors').onclick=()=>{document.body.classList.add('colors-open');$('#colorBackdrop').hidden=false;$('#openColors').setAttribute('aria-expanded','true');$('#colorPanel').scrollTop=0;$('#closeColors').focus({preventScroll:true})};$('#closeColors').onclick=closePanel;$('#colorBackdrop').onclick=closePanel;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('colors-open')){closePanel();$('#openColors').focus()}});
 if(saved)$('#saveState').textContent='已载入本机上次选择 · '+current().name;showPalette();navigate('index.html');window.dispatchEvent(new Event('website-editor-ready'));
})();
