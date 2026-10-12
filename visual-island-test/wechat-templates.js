(()=>{
  const templates=[
    {id:'mengyu-purple-editorial',name:'紫调摄影编辑',desc:'白底紫色、摄影编辑与节奏强调',image:'assets/showcase/wechat-template-mengyu-purple-editorial-full.png?v=color-roles-1'},
    {id:'pastel-art-editorial',name:'粉彩艺术编辑',desc:'粉彩圆形、三点过渡与编辑留白',image:'assets/showcase/wechat-template-pastel-art-editorial-full.png?v=color-roles-1'},
    {id:'monochrome-order',name:'黑白留白秩序',desc:'黑白细线、方块秩序与高留白',image:'assets/showcase/wechat-template-monochrome-order-full.png?v=color-roles-1'},
    {id:'warm-orange-journal',name:'暖橙旅行手账',desc:'暖橙编号、手账节奏与阶段叙事',image:'assets/showcase/wechat-template-warm-orange-journal-full.png?v=color-roles-1'},
    {id:'warm-beige-lifestyle',name:'暖米生活美学',desc:'暖米留白、菱形过渡与生活节奏',image:'assets/showcase/wechat-template-warm-beige-lifestyle-full.png?v=color-roles-1'},
    {id:'green',name:'橄榄舒展编注',desc:'舒展留白、PART 章节与克制套色',image:'assets/showcase/wechat-template-green-full.png?v=color-roles-1'},
    {id:'paper',name:'暖纸人文注释',desc:'暖纸、细线与浅色标记',image:'assets/showcase/wechat-template-paper-full.png?v=color-roles-1'},
    {id:'index',name:'墨绿信息索引',desc:'编号、严格对齐与信息秩序',image:'assets/showcase/wechat-template-index-full.png?v=color-roles-1'},
    {id:'bold',name:'黑红强势编辑',desc:'大字、反白与强弱节奏',image:'assets/showcase/wechat-template-bold-full.png?v=color-roles-1'},
    {id:'soft',name:'柔紫轻盈叙事',desc:'低对比、圆角与柔和块面',image:'assets/showcase/wechat-template-soft-full.png?v=color-roles-1'}
  ];
  const gallery=document.querySelector('#templateGallery');
  const dialog=document.querySelector('#fullPreviewDialog');
  const previewImage=document.querySelector('#fullPreviewImage');
  const previewTitle=document.querySelector('#fullPreviewTitle');
  const dialogEdit=document.querySelector('#dialogEditLink');
  const dialogDownload=document.querySelector('#dialogDownload');
  const toast=document.querySelector('#templateToast');
  let activeTemplate=templates[0];
  const escapeHtml=value=>String(value).replace(/[&<>'\"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[char]));
  gallery.innerHTML=templates.map(template=>`
    <article class="template-card" data-template-id="${template.id}">
      <button class="template-visual" type="button" data-preview="${template.id}" aria-label="预览${escapeHtml(template.name)}完整长图">
        <img src="${template.image}" alt="${escapeHtml(template.name)}公众号模板长图预览" loading="eager" decoding="async">
        <span>查看完整长图</span>
      </button>
      <div class="template-meta"><h2>${escapeHtml(template.name)}</h2><p>${escapeHtml(template.desc)}</p></div>
      <div class="template-actions" aria-label="${escapeHtml(template.name)}操作">
        <button type="button" data-preview="${template.id}">预览全图</button><a href="wechat-template-editor.html?template=${template.id}">编辑</a><button type="button" data-download="${template.id}">下载原版</button>
      </div>
    </article>`).join('');
  const findTemplate=id=>templates.find(item=>item.id===id)||templates[0];
  function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2600)}
  function openPreview(id){activeTemplate=findTemplate(id);previewTitle.textContent=activeTemplate.name;previewImage.src=activeTemplate.image;previewImage.alt=`${activeTemplate.name}完整公众号长图`;dialogEdit.href=`wechat-template-editor.html?template=${activeTemplate.id}`;dialogDownload.dataset.download=activeTemplate.id;dialog.showModal();dialog.querySelector('.dialog-scroll').scrollTop=0}
  async function directDownload(id,button){const template=findTemplate(id);return PlatformWorkspace.download('wechat',{templateId:template.id},button,showToast)}
  document.addEventListener('click',event=>{const preview=event.target.closest('[data-preview]');if(preview){openPreview(preview.dataset.preview);return}const download=event.target.closest('[data-download]');if(download)directDownload(download.dataset.download,download)});
  document.querySelector('[data-close-full]')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog?.open)dialog.close()});
  addEventListener('pageshow',()=>{if(dialog?.open)dialog.close();document.body.style.overflow='';});
})();
