#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const base=path.resolve(__dirname,'..'),R=require(path.join(base,'renderer/shared-renderer.js'));
function arg(name,fallback){const i=process.argv.indexOf(name);if(i<0)return fallback;if(!process.argv[i+1]||process.argv[i+1].startsWith('--'))throw Error(name+' 缺少参数');return path.resolve(process.argv[i+1]);}
try{
 const input=arg('--input',path.join(base,'input/article.json')),output=arg('--output',path.join(base,'output/article.html'));
 const profilePath=arg('--profile',path.join(base,'config/style-profile.json'));
 const article=JSON.parse(fs.readFileSync(input,'utf8').replace(/^\uFEFF/,'')),profile=JSON.parse(fs.readFileSync(profilePath,'utf8').replace(/^\uFEFF/,''));
 if(profile.templateId!==R.ID||profile.schema!=='mengyu-wechat-template-style/v3')throw Error('不是本试点的风格包配置');
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
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,result.html);
 console.log('已生成 '+output+'\n'+(process.argv.includes('--calibration')?'校准模式：包含示意灰块，不用于发布。':'正式内容模式：无图省略，无二维码省略扫码引导。'));
}catch(e){console.error('生成失败：'+e.message);process.exitCode=1;}

