/* Small adapters; leave both tools' renderers, drafts and export contracts intact. */
(()=>{'use strict';const S=window.SavedPalettes,host=document.querySelector('[data-saved-palettes]');if(!host||!S)return;
 function notify(text){const el=document.querySelector('#websiteToast,#toast');if(!el)return;el.textContent=text;el.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.classList.remove('show'),4000)}
 function initWebsite(){if(!window.WebsiteEditorPalette||!PlatformWorkspace.owner())return;
 if(host.dataset.savedPalettes==='website'){
  const t=WebsiteTemplates.get(new URLSearchParams(location.search).get('template'));if(!t)return;
  const current=()=>{const p=window.WebsiteEditorPalette?.current()||WebsiteTemplates.palette(t,document.querySelector('#colorPanel [data-palette][aria-pressed=true]')?.dataset.palette),saved=S.fromWebsite(t,p);if(p.readingRoles)saved.roles={...p.readingRoles};return saved};
  let ui;ui=S.mount(host,{current,notify,apply:p=>{const {roles,adjusted}=S.reading(p);WebsiteEditorPalette.applyRoles(roles);ui.message('已应用“'+p.name+'”'+(adjusted?'，已适配页面底色和文字对比':'')+'；模板结构与内容不变')}});window.addEventListener('website-colors-change',()=>ui.setName(current().name));
  document.querySelector('#colorPanel').addEventListener('click',e=>{if(e.target.closest('[data-palette]'))ui.setName(current().name)});document.querySelector('#resetColors').addEventListener('click',()=>ui.setName(current().name));
 }}
 if(host.dataset.savedPalettes==='website'){if(window.WebsiteEditorPalette)initWebsite();else addEventListener('website-editor-ready',initWebsite,{once:true});}else{
  function init(){if(document.body.dataset.ready!=='true'||!window.styleProfile)return false;
   const current=()=>{const p=styleProfile(),r=p.settings;return {name:document.querySelector('.page-name b').textContent+'配色',colors:[r.primary,r.soft,r.emphasis,r.paper],roles:{primary:r.primary,soft:r.soft,emphasis:r.emphasis,paper:r.paper},source:{tool:'wechat',templateId:p.templateId,label:document.querySelector('.page-name b').textContent}}};
   let ui;ui=S.mount(host,{current,notify,apply:p=>{const {roles,adjusted}=S.reading(p);for(const [k,v]of Object.entries(roles)){const el=document.querySelector('#settingsForm').elements.namedItem(k);el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))}ui.message('已应用“'+p.name+'”'+(adjusted?'，已适配浅底和文字对比':'')+'；其他设置不变，点击顶部保存可记住本次微调')}});
   const id=new URLSearchParams(location.search).get('savedPalette');if(id){try{const found=S.list().find(p=>p.id===id);if(found)ui.message('已找到“'+found.name+'”，点击下方「使用」预览，不会自动覆盖当前微调')}catch{}}
   document.querySelector('.palette-presets').addEventListener('click',e=>{const b=e.target.closest('[data-palette]');if(b)ui.setName(b.textContent.trim())});return true;
  }
  if(!init()){const observer=new MutationObserver(()=>{if(init())observer.disconnect()});observer.observe(document.body,{attributes:true,attributeFilter:['data-ready']})}
 }
})();
