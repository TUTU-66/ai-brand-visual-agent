/* Ten canonical templates, one editing UI. Per-template palettes and local drafts. */
(async function(){
'use strict';
const $=s=>document.querySelector(s),params=new URLSearchParams(location.search),ID=params.get('template')||'warm-beige-lifestyle';
const entry=window.WechatTemplateRegistry[ID];
if(!entry){location.replace('wechat-templates.html');return;}
const templateRevision=await fetch('assets/wechat-templates/revisions.json',{cache:'no-store'}).then(r=>r.json()).then(x=>x[ID]);
const session=await PlatformWorkspace.start('wechat',ID,templateRevision);if(!session)return;
const KEY='mengyu-wechat-template:'+ID+':v3',direct=params.get('download')==='1';
const root='assets/wechat-templates/'+ID+'/',form=$('#settingsForm'),frame=$('#articleFrame');
let R;try{R=entry.engine==='beige'?window.BeigeRenderer:window.TemplateRenderer.create(await PortablePackage.fetchText(root+'template-data.json?v=color-roles-2').then(JSON.parse));}catch(e){$('#saveState').textContent='模板加载失败，请刷新';console.error(e);return;}
const palettes=entry.palettes,colorKeys=['primary','soft','emphasis','paper'];
if(ID==='mengyu-purple-editorial'){const sw=form.elements.namedItem('subtitle');sw.disabled=true;sw.closest('label').querySelector('span').textContent='本模板无独立副标题';}
document.title=entry.name+' · 微调｜梦玉的能力网站';$('.page-name b').textContent=entry.name;frame.title=entry.name+'完整文章';
if(entry.engine!=='beige'){
 for(const [key,values]of [['titleSize',[R.defaults.titleSize-2,R.defaults.titleSize,R.defaults.titleSize+2]],['headingSize',[R.defaults.headingSize-2,R.defaults.headingSize,R.defaults.headingSize+2]],['titleWeight',[...new Set([400,600,R.defaults.titleWeight])].sort()]]){
  const group=form.querySelector('[data-setting="'+key+'"]');group.innerHTML=values.map(v=>'<button type="button" data-value="'+v+'">'+(key==='titleWeight'?({400:'常规',500:'中等',600:'稍重',700:'粗体',800:'厚重'}[v]):v)+(v===R.defaults[key]?'<small>原样</small>':'')+'</button>').join('');
 }
}
$('.palette-presets').innerHTML=Object.entries(palettes).map(([id,p])=>'<button type="button" data-palette="'+id+'" aria-pressed="false"><i aria-hidden="true">'+p.colors.map(c=>'<span style="background:'+c+'"></span>').join('')+'</i><span>'+p.name+'</span></button>').join('');
let settings={...R.defaults},fixture,baseCSS,height=6500,revision=0,timer;
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
function syncColorRoles(){
 const c=WechatColorSystem.resolve(ID,settings),keys=['primary','soft','emphasis','paper'];
 keys.forEach((key,i)=>{const input=form.elements.namedItem(key);input.parentElement.firstChild.textContent=c.labels[i];input.setAttribute('aria-label',c.labels[i]);});
 let box=$('#colorRoles');if(!box){box=document.createElement('section');box.id='colorRoles';box.className='color-roles';$('.color-grid').after(box);}
 box.innerHTML='<b>实际应用色阶</b><p>'+c.description+'</p><div class="role-swatches">'+c.swatches.map(v=>'<div><i style="background:'+v.color+'" title="'+v.color+'"></i><span>'+v.label+'</span></div>').join('')+'</div>'+(c.heroGradient?'<div class="role-gradient" style="background:'+c.heroGradient+'" aria-label="'+(ID==='pastel-art-editorial'?'圆形装饰渐变':'首屏渐变')+'"></div><small>'+(ID==='pastel-art-editorial'?'圆形装饰渐变':'首屏渐变')+' · 随套色保留层次</small>':'');
}
function syncForm(){syncColorRoles();for(const [k,v]of Object.entries(settings)){const f=form.elements.namedItem(k);if(!f)continue;if(f.type==='checkbox')f.checked=v;else f.value=v;}
 form.querySelectorAll('[data-setting]').forEach(group=>{
  const key=group.dataset.setting;
  // Preserve any earlier in-range size instead of silently rounding saved work.
  if(['titleSize','headingSize'].includes(key)&&!Array.from(group.querySelectorAll('button')).some(b=>b.dataset.value===String(settings[key]))){
   const b=document.createElement('button');b.type='button';b.dataset.value=String(settings[key]);b.innerHTML=String(settings[key])+'<small>已保存</small>';group.appendChild(b);
  }
  group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===String(settings[key]))));
 });
 document.querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(colorKeys.every((k,i)=>settings[k]===palettes[b.dataset.palette].colors[i]))));
 $('#qrStatus').textContent=settings.qr?'已使用你的二维码':'当前为占位块';
 $('#removeQrBtn').disabled=!settings.qr;
}
function sizePreview(){
 const available=$('#previewScroll').clientWidth-24,scale=Math.min(1,Math.max(.3,available/343));
 $('#previewSizer').style.width=(343*scale)+'px';$('#previewSizer').style.height=(height*scale)+'px';$('#previewSizer').style.minHeight='0';
 frame.style.height=height+'px';frame.style.transform='scale('+scale+')';
}
function openGroup(key){for(const d of form.querySelectorAll('details'))d.open=d.dataset.group===key;
 if(matchMedia('(max-width:760px)').matches){document.body.classList.add('settings-open');$('#settingsToggle').setAttribute('aria-expanded','true');$('#settingsToggle').textContent='收起设置';}
 const d=form.querySelector('[data-group="'+key+'"]');d.scrollIntoView({block:'nearest'});
}
async function renderPreview(){
 const current=++revision;frame.dataset.ready='false';
 const result=R.render(fixture,settings,baseCSS,{calibration:true});
 frame.onload=async()=>{if(current!==revision)return;const doc=frame.contentDocument;await doc.fonts.ready;
  await Promise.all(Array.from(doc.images).map(im=>im.complete?null:new Promise(r=>{im.onload=im.onerror=r;})));
  if(current!==revision)return;height=Math.ceil(doc.querySelector('#article').getBoundingClientRect().height);sizePreview();frame.dataset.ready='true';
  doc.addEventListener('click',event=>{const el=event.target;if(el.closest('a'))event.preventDefault();
   const key=el.closest('.ending')?'ending':el.closest('.media-placeholder,.media-caption,.media,.placeholder,.media-note,[data-role=caption]')?'media':el.closest('.hero,.section-head,.chapter-head,.chapter-title,.article-hero,.poster-hero,h1,h2')?'headings':'body';openGroup(key);
  });
 };
 frame.srcdoc=result.html;
}
function changed(){settings=R.normalize(settings);$('#saveState').textContent='未保存';syncForm();clearTimeout(timer);timer=setTimeout(()=>renderPreview(),100);}
window.styleProfile=()=>R.profile(settings);
window.buildWechatPackage=async()=>{throw Error('完整交付仅由会员下载接口提供')};
async function download(){return PlatformWorkspace.download('wechat',{templateId:ID,settings},$('#downloadBtn'),toast);}
try{
 [fixture,baseCSS]=await Promise.all([PortablePackage.fetchText(root+'calibration.json?v=color-roles-2').then(JSON.parse),PortablePackage.fetchText(root+'base.css?v=color-roles-2')]);
 if(!direct){try{const saved=session.entry?.data;if(saved){const p=saved;if(p.templateId!==ID)throw Error('模板不匹配');settings=R.normalize(p.settings);$('#saveState').textContent='已恢复我的项目';
  for(const [id,oldAccent]of (entry.engine==='beige'?[['purple','#95704f'],['olive','#8a703d']]:[])){
   const colors=palettes[id].colors;
   if(settings.primary===colors[0]&&settings.soft===colors[1]&&settings.paper===colors[3]&&settings.emphasis===oldAccent){
    settings.emphasis=colors[2];$('#saveState').textContent='套色已校准 · 未保存';toast('已校准旧套色重点色，其他微调保留；保存后写入本机');
   }
  }
 }}catch(e){toast('未读取旧保存，暂用原模板；旧记录未覆盖');}}
 syncForm();await renderPreview();$('#downloadBtn').disabled=false;document.body.dataset.ready='true';
 form.addEventListener('submit',e=>e.preventDefault());
 form.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)form.querySelectorAll('details').forEach(other=>{if(other!==detail)other.open=false;});}));
 form.addEventListener('input',e=>{const el=e.target,k=el.name;if(!Object.hasOwn(settings,k))return;
  settings[k]=el.type==='checkbox'?el.checked:['range','number'].includes(el.type)||k==='titleWeight'?Number(el.value):el.value;changed();
 });
 form.addEventListener('click',e=>{
  const choice=e.target.closest('[data-setting] button[data-value]');
  if(choice){const key=choice.closest('[data-setting]').dataset.setting;settings[key]=['titleSize','headingSize','titleWeight'].includes(key)?Number(choice.dataset.value):choice.dataset.value;changed();return;}
  const palette=e.target.closest('[data-palette]');
  if(palette){colorKeys.forEach((k,i)=>settings[k]=palettes[palette.dataset.palette].colors[i]);changed();}
 });
 $('#saveBtn').onclick=async()=>{try{await PlatformWorkspace.save(R.profile(settings),entry.name+' · 公众号');$('#saveState').textContent=session.isGuest?'已保存为本机试用草稿':'已保存到我的资产';toast(session.isGuest?'试用草稿已保存在当前浏览器':'项目已保存在当前账户的浏览器');}catch(e){toast(e.message||'未保存，原记录已保留');}};
 $('#resetBtn').onclick=()=>{settings={...R.defaults};changed();toast('已恢复原样；保存后才更新我的项目');};
 $('#downloadBtn').onclick=()=>download().catch(()=>{});
 $('#toEndBtn').onclick=()=>{$('#previewScroll').scrollTop=$('#previewScroll').scrollHeight;};
 $('#settingsToggle').onclick=()=>{const yes=document.body.classList.toggle('settings-open');$('#settingsToggle').setAttribute('aria-expanded',String(yes));$('#settingsToggle').textContent=yes?'收起设置':'调整样式';};
 $('#helpBtn').onclick=()=>$('#helpDialog').showModal();$('#closeHelp').onclick=()=>$('#helpDialog').close();
 $('#qrFile').onchange=async event=>{const file=event.target.files[0];if(!file)return;
  try{if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>2*1024*1024)throw Error('请选择2MB以内的PNG、JPEG或WebP');
   const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
   const img=new Image();img.src=data;await img.decode();if(img.width<32||img.height<32)throw Error('图片太小，请提供清晰二维码');
   settings.qr=data;changed();
  }catch(e){toast('未替换二维码：'+e.message);}event.target.value='';
 };
 $('#removeQrBtn').onclick=()=>{settings.qr='';changed();};
 new ResizeObserver(sizePreview).observe($('#previewScroll'));
 if(direct)await download();
}catch(e){console.error(e);toast('模板加载未完成，请刷新：'+e.message);}
})();
