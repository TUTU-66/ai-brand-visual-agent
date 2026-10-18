(()=>{'use strict';
 const R=window.WechatTemplateRegistry,ids=R.visibleIds||[];
 const desc={'mengyu-purple-editorial':'紫调摄影导语、正文配图与编辑节奏','pastel-art-editorial':'周末灵感导语、粉彩留白与轻盈记录','monochrome-order':'秩序笔记导语、黑白细线与信息层级','warm-orange-journal':'慢行手账导语、浅暖纸张与旅行叙事','warm-beige-lifestyle':'日常器物导语、暖米叠层与生活节奏',green:'自然观察导语、橄榄标签与舒展编注'};
const templates=ids.map(id=>({id,name:R[id].name,desc:desc[id],image:'assets/showcase/wechat-template-'+id+'-full.png?v=color-restore-050'}));
 const $=s=>document.querySelector(s),gallery=$('#templateGallery'),dialog=$('#fullPreviewDialog'),previewImage=$('#fullPreviewImage'),previewTitle=$('#fullPreviewTitle'),dialogEdit=$('#dialogEditLink'),dialogDownload=$('#dialogDownload'),toast=$('#templateToast');let active=templates[0];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 gallery.innerHTML=templates.map(t=>`<article class="template-card" data-template-id="${t.id}"><button class="template-visual" type="button" data-preview="${t.id}" aria-label="预览${esc(t.name)}完整长图"><img src="${t.image}" alt="${esc(t.name)}R2公众号模板长图预览" loading="eager" decoding="async"><span>查看完整长图</span></button><div class="template-meta"><h2>${esc(t.name)}</h2><p>${esc(t.desc)}</p></div><div class="template-actions"><button type="button" data-preview="${t.id}">预览全图</button><a href="wechat-template-editor.html?template=${t.id}&new=1">编辑</a><button type="button" data-download="${t.id}">下载原版</button></div></article>`).join('');
 const find=id=>templates.find(x=>x.id===id)||templates[0];
 function note(s){toast.textContent=s;toast.classList.add('show');clearTimeout(note.t);note.t=setTimeout(()=>toast.classList.remove('show'),2600)}
 function open(id){active=find(id);previewTitle.textContent=active.name;previewImage.src=active.image;previewImage.alt=active.name+'完整公众号长图';dialogEdit.href='wechat-template-editor.html?template='+active.id+'&new=1';dialogDownload.dataset.download=active.id;dialog.showModal();dialog.querySelector('.dialog-scroll').scrollTop=0}
 async function download(id,b){const t=find(id);return PlatformWorkspace.download('wechat',{templateId:t.id,project:{schema:'mengyu-wechat-editor-project/v4',templateId:t.id}},b,note)}
 document.addEventListener('click',e=>{const p=e.target.closest('[data-preview]');if(p){open(p.dataset.preview);return}const d=e.target.closest('[data-download]');if(d)void download(d.dataset.download,d)});
 document.querySelector('[data-close-full]')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});addEventListener('pageshow',()=>{if(dialog?.open)dialog.close()});
})();
