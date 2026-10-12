(()=>{
  const A='assets/showcase/';
  const data={
    website:{title:'网站',tool:'builder.html?v=light-2',toolText:'进入网站组装器',kind:'desktop',items:[['冷调艺术人像','website-art.webp'],['好奇小喵工具屋','website-cat.webp'],['生活方式叙事','website-cafe.webp'],['知识型个人品牌','website-studio.webp']]},
    wechat:{title:'公众号',tool:'wechat.html',toolText:'进入公众号排版',kind:'phone',items:[['纸感长文','wechat-paper.webp'],['轻柔层次','wechat-soft.webp'],['强对比表达','wechat-bold.webp'],['序号章节','wechat-index.webp']]},
    comic:{title:'分格漫画',kicker:'PANEL COMIC STYLES',description:'先查看已有样张，再进入工具记录制作设定。只有下载或导出风格包时需要 Pro 或 Max。',tool:'comic.html',toolText:'进入分格漫画工具',kind:'paper',items:[['日常观察','comic-p01.webp'],['步骤说明','comic-p02.webp'],['观点表达','comic-p03.webp'],['纸感故事','comic-p05.webp']]},
    palette:{title:'配色',kicker:'FIVE-COLOR PALETTES',description:'点开任意色卡即可进入五色配色工具试用。只有下载应用包时需要 Pro 或 Max。',tool:'palette.html',toolText:'进入五色配色卡',kind:'palette',items:[
      ['冷蓝山葵',['#F7F8F2','#D7EFFF','#476B7C','#E9F056','#20242A'],'cool-wasabi'],
      ['柿橙深梅',['#FFF4ED','#FFB59F','#FF5C34','#351E28','#7C5363'],'persimmon-plum'],
      ['玉石陶土',['#F5F1E8','#AEB8A0','#72806B','#351E28','#D2A96E'],'jade-clay'],
      ['沙金靛蓝',['#F5EFE3','#E6DCC7','#B88A44','#36415E','#242631'],'sand-indigo']
    ]}
  };
  const type=new URLSearchParams(location.search).get('type');
  if(type==='website'){location.replace('website-templates.html'+location.hash);return}
  if(type==='wechat'){location.replace('wechat-templates.html');return}
  const cfg=data[type]||data.website;
  const activeType=data[type]?type:'website';
  const activeLink=document.querySelector(`#siteNav a[href="gallery.html?type=${activeType}"]`);
  if(activeLink){activeLink.classList.add('active');activeLink.setAttribute('aria-current','page')}
  document.title=`${cfg.title}｜梦玉的能力网站`;
  document.querySelector('#galleryTitle').textContent=cfg.title;
  document.querySelector('#galleryKicker').textContent=cfg.kicker||'';
  document.querySelector('#galleryDescription').textContent=cfg.description||'';
  const tool=document.querySelector('#toolLink');tool.href=cfg.tool;tool.textContent=`${cfg.toolText} →`;
  document.querySelector('#galleryList').innerHTML=cfg.items.map((it,i)=>{
    const media=cfg.kind==='palette'
      ?`<div class="device ${cfg.kind}"><div class="device-shell">${it[1].map(c=>`<i style="background:${c}"></i>`).join('')}</div></div>`
      :`<div class="device ${cfg.kind}"><div class="device-shell"><img src="${A+it[1]}" alt="${it[0]}"></div></div>`;
    if(cfg.kind==='palette')return `<a class="gallery-item gallery-item-link" id="case-${i+1}" href="palette.html?preset=${encodeURIComponent(it[2])}" aria-label="使用${it[0]}进入在线配色">${media}<div class="gallery-item-copy"><h2>${it[0]}</h2><span aria-hidden="true">进入配色 →</span></div></a>`;
    return `<article class="gallery-item" id="case-${i+1}">${media}<div class="gallery-item-copy"><h2>${it[0]}</h2></div></article>`
  }).join('');
})();
