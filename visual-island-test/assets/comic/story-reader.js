(()=>{
 'use strict';
 const all=window.ComicStories?.stories||[],$=id=>document.getElementById(id);
 if(!all.length){$('storyError').hidden=false;$('storyError').textContent='故事资源暂时未载入，请刷新重试。';$('storyLayout').hidden=true;return;}
 const img=$('storyImage');
 img.addEventListener('error',()=>{$('storyError').hidden=false;$('storyError').textContent='图片未能加载，请刷新或展开下方故事文字版。';});
 function render(id){
  const selected=all.find(s=>s.id===id),s=selected||all[0];
  $('storyError').hidden=!!selected;
  if(!selected)$('storyError').textContent='没有找到这个画风，先为你展示第一个故事。';
  document.title=s.title+' · '+s.styleName+'｜故事条漫';
  $('storyStyleName').textContent=s.styleName;$('storyDetailedName').textContent=s.detailedName;
  $('storyMeta').textContent=s.kind+' · '+s.panels.length+'个画面 · 完整长漫';
  img.width=s.width;img.height=s.height;img.alt=s.title+'——'+s.subtitle+'，完整内容可在图下展开文字版';img.src=s.image;
  $('storyEdit').href='comic.html?style='+s.id;$('storyDownload').href='comic.html?style='+s.id+'&download=1';
  $('storyOriginal').href=s.master;$('storyTitleText').textContent=s.title;
  $('storyTranscript').replaceChildren(...s.panels.map(p=>{const li=document.createElement('li');li.textContent=p.text;return li;}));
  document.querySelector('.story-transcript').open=false;
  $('storyStyleLinks').querySelectorAll('a').forEach(a=>{if(a.dataset.style===s.id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 }
 for(const s of all){
  const a=document.createElement('a');a.href='comic-story.html?style='+s.id;a.dataset.style=s.id;a.textContent=s.styleName;
  a.addEventListener('click',e=>{
   if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   e.preventDefault();if(new URLSearchParams(location.search).get('style')!==s.id)history.pushState({},'',a.href);
   render(s.id);window.scrollTo({top:0,behavior:'instant'});
  });$('storyStyleLinks').append(a);
 }
 window.addEventListener('popstate',()=>{render(new URLSearchParams(location.search).get('style')||'p01');window.scrollTo(0,0);});
 render(new URLSearchParams(location.search).get('style')||'p01');
 const active=document.querySelector('#siteNav a[href="comic-story.html"]');if(active){active.classList.add('active');active.setAttribute('aria-current','page');}
})();
