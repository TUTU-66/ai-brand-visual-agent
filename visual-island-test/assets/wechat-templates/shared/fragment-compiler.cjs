/* Offline computed-style compiler. No npm packages; requires an installed Chromium browser. */
'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),cp=require('child_process'),{pathToFileURL}=require('url');
function browserPath(){
 if(process.env.WECHAT_BROWSER&&!fs.existsSync(process.env.WECHAT_BROWSER))throw Error('WECHAT_BROWSER 指定文件不存在；停止，不回退。');
 const candidates=[process.env.WECHAT_BROWSER,process.env.CHROME_PATH,
  ...['PROGRAMFILES','PROGRAMFILES(X86)','LOCALAPPDATA'].flatMap(k=>process.env[k]?[path.join(process.env[k],'Microsoft/Edge/Application/msedge.exe'),path.join(process.env[k],'Google/Chrome/Application/chrome.exe')]:[]),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge','/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'];
 const found=candidates.find(p=>p&&fs.existsSync(p));if(!found)throw Error('需要本机 Chrome/Edge/Chromium；可用 WECHAT_BROWSER 指定。未生成正式正文。');return found;
}
function compileDOM(){
 const document=window.frames[0].document;
 const getComputedStyle=document.defaultView.getComputedStyle.bind(document.defaultView);
 try{
 const root=document.querySelector('#article');if(!root)throw Error('missing article');
 const source=[root,...root.querySelectorAll('*')],clone=root.cloneNode(true),targets=[clone,...clone.querySelectorAll('*')];
 const props=/^(background|border|box-|color$|display$|position$|top$|right$|bottom$|left$|float$|clear$|width$|height$|min-|max-|margin|padding|font|line-height$|letter-spacing$|word-|text-|white-space$|vertical-align$|opacity$|overflow|object-|flex|grid|gap$|row-gap$|column-gap$|align-|justify-|order$|transform|z-index$|clip-path$|list-|writing-mode$|-webkit-text)/;
 function style(s){return Array.from(s).filter(k=>props.test(k)).map(k=>k+':'+s.getPropertyValue(k)+';').join('');}
 let pseudo=0;
 source.forEach((el,i)=>{
  const target=targets[i];target.setAttribute('style',style(getComputedStyle(el)));
  // Keep intrinsic sizing. Freezing used height changes margin collapse and image flow.
  for(const key of ['width','height'])if(el.computedStyleMap?.().get(key)?.toString()==='auto')target.style.setProperty(key,'auto');
  for(const at of Array.from(target.attributes))if(/^on/i.test(at.name))target.removeAttribute(at.name);
  for(const side of ['before','after']){
   const st=getComputedStyle(el,'::'+side),content=st.content;
   if(st.display==='none'||content==='none'||content==='normal')continue;
   const n=document.createElement('span');n.setAttribute('data-materialized-pseudo',side);n.setAttribute('aria-hidden','true');n.setAttribute('style',style(st));
   if(content!=='""'&&content!=="''") {try{n.textContent=JSON.parse(content);}catch{n.textContent=content.replace(/^["']|["']$/g,'');}}
   if(side==='before')target.prepend(n);else target.append(n);pseudo++;
  }
 });
 clone.querySelectorAll('script,link,style,meta,iframe,form,button,input,nav').forEach(n=>n.remove());
 const info={fragment:clone.outerHTML,pseudoElements: pseudo,width:root.getBoundingClientRect().width,titleSize:getComputedStyle(root.querySelector('h1')).fontSize,titleWeight:getComputedStyle(root.querySelector('h1')).fontWeight,
  chapterSignatures:Array.from(root.querySelectorAll('h2')).map(n=>({className:n.className,parentClass:n.parentElement.className,fontSize:getComputedStyle(n).fontSize})),
  components:Array.from(new Set([...Array.from(root.querySelectorAll('[data-role]')).map(n=>n.dataset.role),...Object.entries({title:'h1',chapter:'h2',paragraph:'p',quote:'blockquote,.quote',list:'ul,ol,.list,.step-list',image:'img:not(.personal-qr):not(.qr-real)',ending:'.ending'}).filter(([,sel])=>root.querySelector(sel)).map(([name])=>name)])),endingPresent:!!root.querySelector('.ending'),qrCount:root.querySelectorAll('.personal-qr,.qr-real').length};
 const out=document.createElement('pre');out.id='wechat-compiled';out.textContent=btoa(unescape(encodeURIComponent(JSON.stringify(info))));window.document.body.replaceChildren(out);
 }catch(e){window.document.body.textContent='COMPILE_ERROR:'+e.message;}
}
module.exports=function compile(html){
 if(/<(?:script|iframe|link)\b|(?:src|href)=["']https?:/i.test(html))throw Error('离线编译拒绝活动内容或外部依赖');
 const browser=browserPath(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'wechat-fragment-'));
 try{
  const file=path.join(temp,'compile.html');fs.writeFileSync(file,'<!doctype html><html><body><iframe style="width:343px;height:900px;border:0"></iframe><script>const f=document.querySelector("iframe");f.onload=async()=>{await f.contentDocument.fonts.ready;f.style.height=(f.contentDocument.documentElement.scrollHeight+100)+"px";('+compileDOM.toString()+')();};f.srcdoc='+JSON.stringify(html).replace(/</g,'\\u003c')+';</script></body></html>');
  const r=cp.spawnSync(browser,['--headless','--disable-gpu','--no-first-run','--disable-extensions','--disable-background-networking','--disable-component-update','--disable-sync','--no-default-browser-check','--user-data-dir='+path.join(temp,'profile'),'--virtual-time-budget=3000','--window-size=677,900','--dump-dom',pathToFileURL(file).href],{encoding:'utf8',timeout:45000,maxBuffer:32*1024*1024,windowsHide:true});
  const match=(r.stdout||'').match(/<pre id="wechat-compiled">([A-Za-z0-9+/=]+)<\/pre>/);
  if(r.error||r.status!==0||!match)throw Error('正文样式编译失败：'+(r.error?.message||'exit='+r.status+' dom='+(r.stdout||'').slice(-600)+' '+(r.stderr||'').slice(-100)));
  return {...JSON.parse(Buffer.from(match[1],'base64').toString('utf8')),browser:path.basename(browser)};
 }finally{try{fs.rmSync(temp,{recursive:true,force:true,maxRetries:5,retryDelay:200});}catch{/* browser cleanup may lag; only disposable OS temp remains */}}
};
