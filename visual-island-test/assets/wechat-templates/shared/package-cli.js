#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),compile=require('./fragment-compiler.cjs');
const base=path.resolve(__dirname,'..'),R=require(path.join(base,'renderer/shared-renderer.js'));
function arg(name,fallback){const i=process.argv.indexOf(name);if(i<0)return fallback;if(!process.argv[i+1]||process.argv[i+1].startsWith('--'))throw Error(name+' 缺少参数');return path.resolve(process.argv[i+1]);}
try{
 const input=arg('--input',path.join(base,'input/article.json')),output=arg('--output',path.join(base,'output/article-preview.html'));
 if(['article-fragment.html','render-report.json'].includes(path.basename(output)))throw Error('--output 是预览路径，不能覆盖正文片段或报告');
 const profilePath=arg('--profile',path.join(base,'config/style-profile.json'));
 const article=JSON.parse(fs.readFileSync(input,'utf8').replace(/^\uFEFF/,'')),profile=JSON.parse(fs.readFileSync(profilePath,'utf8').replace(/^\uFEFF/,''));
 if(profile.templateId!==R.ID||profile.schema!=='mengyu-wechat-template-style/v3')throw Error('风格包配置与渲染模板不匹配');
 const inputRoot=path.dirname(input);
 function embed(im){if(!im?.src||R.raster(im.src))return;
  if(/^(?:https?:|file:|data:)/i.test(im.src))throw Error('请先将图片保存在input目录内；不读取远程地址');
  const file=path.resolve(inputRoot,im.src),relative=path.relative(inputRoot,file);
  if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('图片必须位于文章JSON所在目录内');
  const real=fs.realpathSync(file),realRoot=fs.realpathSync(inputRoot),r=path.relative(realRoot,real);
  if(r.startsWith('..')||path.isAbsolute(r))throw Error('图片链接不能跳到输入目录外');
  const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}[path.extname(file).toLowerCase()];
  if(!mime)throw Error('仅支持PNG、JPEG、WebP');const bytes=fs.readFileSync(real);if(bytes.length>3*1024*1024)throw Error('单张图片请压缩至3MB以内');
  im.src='data:'+mime+';base64,'+bytes.toString('base64');
 }
 embed(article.heroImage);
 for(const sec of article.sections||[])for(const block of sec.blocks||[])if(block.type==='image')embed(block);else if(block.type==='images')for(const im of block.items||[])embed(im);
 const result=R.render(article,profile.settings,fs.readFileSync(path.join(base,'renderer/base.css'),'utf8'),{calibration:process.argv.includes('--calibration')});
 const resolved=R.normalize(profile.settings),compiled=compile(result.html),outDir=path.dirname(output),cal=process.argv.includes('--calibration');
 const fragment=compiled.fragment;
 if(/<!doctype|<\/?(?:html|head|body|script|style|nav|iframe)\b/i.test(fragment))throw Error('正文身份检查失败');
 const preview=result.html.replace(/<style>[\s\S]*?<\/style>/,'<style>html,body{margin:0;padding:0;background:#eee}#article{margin:0 auto!important}</style>').replace(result.article,fragment);
 const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
 const report={schema:'mengyu-wechat-render-report/v1',templateId:R.ID,configHash:hash(fs.readFileSync(profilePath)),configHashMethod:'SHA-256 of profile file bytes',settingsHash:hash(JSON.stringify(resolved)),resolvedSettings:resolved,colorRoles:R.profile(resolved).colorRoles,
  usedComponents:compiled.components,rendered:{width:compiled.width,titleSize:compiled.titleSize,titleWeight:compiled.titleWeight,chapters:compiled.chapterSignatures,endingPresent:compiled.endingPresent,qrCount:compiled.qrCount},
  outputs:{fragment:{path:'article-fragment.html',identity:cal?'calibration-only':'wechat-article-body-fragment',sha256:hash(fragment)},preview:{path:path.basename(output),identity:'browser-review-only',sha256:hash(preview)},report:{path:'render-report.json',identity:'validation-metadata'}},
  compiler:{method:'computed-inline-and-materialized-pseudo-elements',browser:compiled.browser,pseudoElements:compiled.pseudoElements},
  warnings:['真实微信编辑器兼容 not-verified：flex/grid/定位/渐变可能被过滤。','图片为本地内嵌栅格；微信素材转换需由用户自己的连接器处理。','跨系统字体回退可能改变折行；预览不等于发布验收。',...(cal?['校准占位不是正式正文，不得推送。']:[])],wechatCompatibility:'not-verified',pushAuthorized:false};
 fs.mkdirSync(outDir,{recursive:true});fs.writeFileSync(path.join(outDir,'article-fragment.html'),fragment);fs.writeFileSync(output,preview);fs.writeFileSync(path.join(outDir,'render-report.json'),JSON.stringify(report,null,2));
 console.log('已生成正文片段、浏览器预览及检查报告：'+outDir+'\n真实微信兼容 not-verified；推草稿必须另行明确授权。');
}catch(e){console.error('生成失败：'+e.message);process.exitCode=1;}
