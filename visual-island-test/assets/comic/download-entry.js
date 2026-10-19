/* Catalog entry delegates to the unchanged account export controller. */
(() => {
  const params=new URLSearchParams(location.search);
  document.querySelector('#comicAccountGuard a[href^="login.html"]')?.setAttribute('href','login.html?returnTo='+encodeURIComponent(location.pathname+location.search));
  if(params.get('download')!=='1')return;
  const note=document.createElement('p');note.className='comic-export-note';note.setAttribute('role','status');note.hidden=true;
  document.querySelector('.comic-toolbar').after(note);
  let started=false;
  const attempt=async()=>{
    if(started||document.querySelector('.workspace').inert)return;
    started=true;observer.disconnect();note.hidden=false;note.textContent='正在确认下载权限…';
    const result=await window.ComicModule.dispatchExport('package',document.querySelector('#exportProfile'));
    note.textContent=result?.ok?'风格包已下载。解压后从 README.md 开始；不含模型，未生成你的漫画。':'未完成下载，请按账户提示操作后点击“下载风格包”重试。';
  };
  const observer=new MutationObserver(attempt);
  observer.observe(document.querySelector('.workspace'),{attributes:true,attributeFilter:['inert']});
  attempt();
})();
