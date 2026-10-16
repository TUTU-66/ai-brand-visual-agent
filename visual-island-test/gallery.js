(()=>{
  const A='assets/showcase/';
  const data={
    website:{title:'网站',tool:'builder.html?v=light-2',toolText:'进入网站组装器',kind:'desktop',items:[['冷调艺术人像','website-art.webp'],['好奇小喵工具屋','website-cat.webp'],['生活方式叙事','website-cafe.webp'],['知识型个人品牌','website-studio.webp']]},
    wechat:{title:'公众号',tool:'wechat.html',toolText:'进入公众号排版',kind:'phone',items:[['纸感长文','wechat-paper.webp'],['轻柔层次','wechat-soft.webp'],['强对比表达','wechat-bold.webp'],['序号章节','wechat-index.webp']]},
    comic:{title:'故事条漫',kicker:'',description:'六种画风，六个完整故事。点开局部预览，看看一段内容如何成为条漫。本站暂未接入在线生图模型；可以编辑内容或下载风格包，带到自己的 AI 软件中验证。不同模型的效果会有差异。',tool:'comic.html?style=p01',toolText:'编辑内容',kind:'strip',items:[["扁平编辑插画", "assets/comic/stories-r17/p01.webp", "p01", "清爽限色黑线编辑漫画", "小兔子和月亮", 2.7412587412587412, 7.52366716492277], ["轻线条漫画", "assets/comic/stories-r15/p02.webp", "p02", "疏线留白低饱和对话漫画", "借你半把伞", 1.6864197530864198, 5.859375], ["手绘日记", "assets/comic/stories-r15/p03.webp", "p03", "轻彩铅留白生活日记", "没赶上的车", 1.9774011299435028, 8.49609375], ["黑白报刊", "assets/comic/stories-r15/p04.webp", "p04", "清爽黑白墨线报刊漫画", "先把这张凳子修好", 1.9626436781609196, 6.640625], ["孔版印刷", "assets/comic/stories-r15/p05.webp", "p05", "三专色块面孔版漫画", "街角的交换日", 1.89196675900277, 8.203125], ["剪纸拼贴", "assets/comic/stories-r15/p06.webp", "p06", "少层纸片限色剪纸漫画", "种下一个明年", 2.202279202279202, 8.304668304668304]]},
    palette:{title:'配色',kicker:'FOUR-ROLE PALETTES',description:'登录 Free 账户后，点开任意色卡即可选择、调整、预览和保存；下载应用包需要 Pro 或 Max。',tool:'palette.html',toolText:'打开配色工具',kind:'palette',items:[
      ['冷蓝山葵',['#476B7C','#D7EFFF','#E9F056','#F7F8F2'],'cool-wasabi'],
      ['柿橙深梅',['#351E28','#FFB59F','#FF5C34','#FFF4ED'],'persimmon-plum'],
      ['玉石陶土',['#72806B','#AEB8A0','#D2A96E','#F5F1E8'],'jade-clay'],
      ['沙金靛蓝',['#36415E','#E6DCC7','#B88A44','#F5EFE3'],'sand-indigo']
    ]}
  };
  const type=new URLSearchParams(location.search).get('type');
  if(type==='website'){location.replace('website-templates.html'+location.hash);return}
  if(type==='wechat'){location.replace('wechat-templates.html');return}
  const cfg=data[type]||data.website;
  const activeType=data[type]?type:'website';
  document.body.dataset.galleryType=activeType;
  const activeLink=document.querySelector(`#siteNav a[href="gallery.html?type=${activeType}"]`);
  if(activeLink){activeLink.classList.add('active');activeLink.setAttribute('aria-current','page')}
  document.title=`${cfg.title}｜梦玉的能力网站`;
  document.querySelector('#galleryTitle').textContent=cfg.title;
  document.querySelector('#galleryKicker').textContent=cfg.kicker||'';
  document.querySelector('#galleryDescription').textContent=cfg.description||'';
  const tool=document.querySelector('#toolLink');tool.href=cfg.tool;tool.textContent=cfg.toolText;
  document.querySelector('#galleryList').innerHTML=cfg.items.map((it,i)=>{
    if(cfg.kind==='strip')return `<article class="gallery-item comic-strip-card" id="case-${i+1}"><a class="device strip" href="comic-story.html?style=${it[2]}" aria-label="查看${it[0]}完整故事：${it[4]}"><div class="device-shell" style="--story-crop-ratio:${it[5]};--story-crop-y:-${it[6]}%"><img src="${it[1]}" alt="${it[4]}的局部预览" loading="lazy"></div><span class="comic-story-open">${it[4]} · 查看完整故事 →</span></a><div class="gallery-item-copy"><div><h2>${it[0]}</h2><p>${it[3]}</p></div><div class="comic-card-actions"><a href="comic.html?style=${it[2]}">编辑内容</a><a href="comic.html?style=${it[2]}&download=1">下载风格包</a></div></div></article>`;
    const media=cfg.kind==='palette'
      ?`<div class="device ${cfg.kind}"><div class="device-shell">${it[1].map(c=>`<i style="background:${c}"></i>`).join('')}</div></div>`
      :`<div class="device ${cfg.kind}"><div class="device-shell"><img src="${A+it[1]}" alt="${it[0]}"></div></div>`;
    if(cfg.kind==='palette')return `<a class="gallery-item gallery-item-link" id="case-${i+1}" href="palette.html?preset=${encodeURIComponent(it[2])}" aria-label="使用${it[0]}进入在线配色">${media}<div class="gallery-item-copy"><h2>${it[0]}</h2><span aria-hidden="true">进入配色 →</span></div></a>`;
    return `<article class="gallery-item" id="case-${i+1}">${media}<div class="gallery-item-copy"><h2>${it[0]}</h2></div></article>`
  }).join('');
})();


