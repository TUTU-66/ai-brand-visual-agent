(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.WechatProjectAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

const IDS=['mengyu-purple-editorial','pastel-art-editorial','monochrome-order','warm-orange-journal','warm-beige-lifestyle','green'];
const COPY={
  'mengyu-purple-editorial':{text:'AI并没有让创作变得更轻松，它只是把“做出来”这件事提前了。接下来真正困难的，是知道什么值得被做、为什么这样表达。',highlight:'当生成变得容易，审美不再是最后的修饰，而是最早发生的选择。',columnName:'视野实验室',eyebrow:'AI × CREATIVE OBSERVATION'},
  'pastel-art-editorial':{text:'暂时离开结果，重新感受材料和直觉。',highlight:'灵感不是突然出现的答案，而是你重新注意到什么。',columnName:'周末画室 · 今日灵感',keywords:['10月14日','星期六']},
  'monochrome-order':{text:'面对一堆散乱的信息，最先要做的不是分类，而是判断它们之间到底是什么关系：先后、并列、因果，还是同一问题的不同层面。',highlight:'结构不是把内容装进框里，而是让读者看见信息之间的关系。',columnName:'秩序笔记'},
  'warm-orange-journal':{text:'这次没有列满行程。每天只选一个方向出发，走累了就停下来。城市开始从地标变成气味、光线和街角的人声。',highlight:'慢一点不是浪费时间，而是让一段路真正发生。',columnName:'慢行手账',keywords:['旅途记录','DAY 01']},
  'warm-beige-lifestyle':{text:'整理不只是把东西藏起来。我们需要重新判断：什么仍在使用，什么只是因为舍不得而被留下，什么应该回到真正方便的位置。',highlight:'空间变得轻一点，生活里的选择也会跟着清楚一点。',columnName:'日常器物'},
  green:{text:'自然观察不需要去很远的地方。选一条每天都会经过的路，固定一个位置，花十分钟看光线、植物和天气发生了什么变化。',highlight:'长期主义不是一直向前，而是愿意反复回到同一个地方。',columnName:'一周自然观察',eyebrow:'城市自然观察'}
};
const HEAD_COPY={
  'mengyu-purple-editorial':{title:'AI进入创作之后，\n审美为什么更重要？',subtitle:'一篇关于选择、边界与复查的文章'},
  'pastel-art-editorial':{title:'给创作者的一次\n周末灵感练习',subtitle:'不用完成作品，先重新看见手边的材料'},
  'monochrome-order':{title:'如何把混乱的信息\n整理成清晰系统',subtitle:'从材料堆到可复查结构的四步方法'},
  'warm-orange-journal':{title:'一次三天慢行，\n重新看见一座城',subtitle:'不赶景点的慢行手记'},
  'warm-beige-lifestyle':{title:'整理房间，\n也是在整理生活',subtitle:'从一张桌面开始的安静练习'},
  green:{title:'在城市里建立\n一周自然观察',subtitle:'每天十分钟的观察计划'}
};
const clean=v=>String(v==null?'':v).replace(/[<>]/g,'').trim();
const esc=s=>String(s||'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

function defaults(id,settings){
  const c=COPY[id]||COPY.green;
  return {schema:'mengyu-wechat-editor-project/v4',templateId:id,settings:{...(settings||{})},lead:{enabled:true,mode:'text',signature:c.columnName||'',text:c.text,highlight:c.highlight,image:`assets/wechat-templates/${id}/lead-default.jpg`,imageAlt:'导语配图',imageFocus:'center'},bodyImageCount:2,identity:{brandName:'',displayName:'',slogan:'',columnName:c.columnName,eyebrow:c.eyebrow||'',keywords:c.keywords||[],authorName:'',sourceName:''}};
}

function normalize(raw,id,settings){
  const d=defaults(id,settings),p=raw&&raw.schema==='mengyu-wechat-editor-project/v4'?raw:(raw&&raw.settings?{settings:raw.settings}:{});
  const lead={...d.lead,...(p.lead||{})},identity={...d.identity,...(p.identity||{})};
  lead.signature=clean(Object.hasOwn(p.lead||{},'signature')?p.lead.signature:(p.identity?.brandName||p.identity?.slogan||d.lead.signature)).slice(0,120);
  lead.enabled=lead.enabled!==false;lead.mode=lead.mode==='image'?'image':'text';lead.text=clean(lead.text).slice(0,600);lead.highlight=clean(lead.highlight).slice(0,240);lead.image=String(lead.image||'');lead.imageAlt=clean(lead.imageAlt).slice(0,120);lead.imageFocus=['top','center','bottom'].includes(lead.imageFocus)?lead.imageFocus:'center';
  for(const k of ['brandName','displayName','slogan','columnName','eyebrow','authorName','sourceName'])identity[k]=clean(identity[k]).slice(0,k==='slogan'?120:80);
  identity.keywords=(Array.isArray(identity.keywords)?identity.keywords:String(identity.keywords||'').split(/[，,]/)).map(clean).filter(Boolean).slice(0,4);
  if(p.experience==='style-selection/v1'){lead.enabled=true;identity.columnName='';identity.displayName='';identity.authorName='';identity.sourceName='';}
  p.decoration={visible:p.decoration?.visible!==false,mode:['original','keyword','custom'].includes(p.decoration?.mode)?p.decoration.mode:'original',text:clean(p.decoration?.text).slice(0,120),slots:Object.fromEntries(Object.entries(p.decoration?.slots||{}).filter(([k])=>/^(ending-copy|ending-mark|ending-en|chapter-[0-9]{1,2})$/.test(k)).slice(0,16).map(([k,v])=>[k,{visible:v?.visible!==false,mode:['original','keyword','custom'].includes(v?.mode)?v.mode:'original',text:clean(v?.text).slice(0,120),...(typeof v?.secondaryText==='string'?{secondaryText:clean(v.secondaryText).slice(0,60)}:{})}]))};
  p.captionOptions={visible:p.captionOptions?.visible!==false,number:p.captionOptions?.number!==false,mode:['description','keywords','none'].includes(p.captionOptions?.mode)?p.captionOptions.mode:'description'};
  return {...d,...p,schema:d.schema,templateId:id,settings:{...d.settings,...(p.settings||{})},lead,identity,bodyImageCount:[0,1,2].includes(Number(p.bodyImageCount))?Number(p.bodyImageCount):d.bodyImageCount};
}

/* Exact R2 lead baseline. Do not reinterpret as one generic card.
   Source: evidence/wechat-content-015/module-stage1-lead-samples/lead-samples.html
   Approval: 确认记录_公众号导语静态样张_R2.md */
function css(id,p){
  const c=p.settings||{},primary=c.primary||'#66507d',soft=c.soft||'#eee9f4',em=c.emphasis||primary;
  return `<style data-project-v4 data-r2-baseline="true">
html,body,.stage,#article,#article.article{background-color:#fff!important;background-image:none!important}
#article .wx-r2{box-sizing:border-box;width:100%;background:#fff;color:#18171a;font-family:"Microsoft YaHei","PingFang SC",sans-serif;overflow:hidden}#article .wx-r2 *{box-sizing:border-box}#article .wx-r2 .article-head{padding:34px 28px 24px}#article .wx-r2 .eyebrow{font:700 9px/1.3 Arial;letter-spacing:.18em}#article .wx-r2 .article-head h3{font-family:"Songti SC","SimSun",serif;font-size:27px;line-height:1.35;margin:11px 0 8px}#article .wx-r2 .sub{font-size:12px;color:#6d6870;line-height:1.7}#article .wx-r2 .lead{margin:0 22px 34px;padding:22px;font-size:14px;line-height:2;text-align:justify}#article .wx-r2 .lead p{margin:0 0 13px}#article .wx-r2 .lead p:last-child{margin:0}#article .wx-r2 .highlight{font-weight:700}#article .wx-r2 .identity{font-size:9px;letter-spacing:.14em}#article .wx-r2 .tag{display:inline-block;padding:5px 10px;font-size:9px;letter-spacing:.12em}#article .wx-r2 .photo{width:100%;height:210px;object-fit:cover;display:block;object-position:center ${p.lead.imageFocus}}#article .wx-r2 .footer-note{margin:22px 28px 34px;font-size:10px;line-height:1.7;color:#777}
#article .wx-r2.purple .article-head{padding:38px 26px 24px;text-align:center;background:linear-gradient(145deg,#f5f1fb 0%,#fff 58%,#eee7f9 100%)}#article .wx-r2.purple .eyebrow,#article .wx-r2.purple .sub{display:none}#article .wx-r2.purple .article-head h3{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-size:25px;line-height:1.34;font-weight:700;letter-spacing:-.035em;max-width:290px;margin:0 auto}#article .wx-r2.purple .article-head h3 span{display:block}#article .wx-r2.purple .article-head h3 span:first-child{color:#1d1b20}#article .wx-r2.purple .article-head h3 span:last-child{color:${primary}}#article .wx-r2.purple .highlight{color:${em}}#article .wx-r2.purple .lead{margin-top:22px;background:${soft};border-left:2px solid ${primary}}#article .wx-r2.purple .lead .tag{display:block;padding:0;margin:0 0 12px;font-size:12px;line-height:1.5;text-align:left;letter-spacing:.04em}#article .wx-r2.purple .r2-hero{position:relative;margin:0 22px}#article .wx-r2.purple .r2-hero .photo{height:120px;object-position:center ${p.lead.imageFocus}}#article .wx-r2.purple .r2-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,15,35,.05),rgba(39,19,68,.82))}#article .wx-r2.purple .hero-copy{position:absolute;z-index:2;left:22px;right:22px;bottom:18px;color:#fff;text-align:left}#article .wx-r2.purple .hero-copy strong{display:block;font:700 16px/1.45 "Microsoft YaHei","PingFang SC",sans-serif;margin:6px 0}#article .wx-r2.purple .hero-copy span{font-size:11px;color:#ddd2ef}#article .wx-r2.purple .footer-note,#article .wx-r2.purple .hero-copy>span:last-child{display:none}#article .wx-r2.purple.image-mode{display:flex;flex-direction:column}#article .wx-r2.purple.image-mode .article-head{order:1}#article .wx-r2.purple.image-mode .lead{order:2;margin:22px 22px 0;padding-bottom:18px}#article .wx-r2.purple.image-mode .r2-hero{order:3;margin-top:0}
#article .wx-r2.pastel .article-head{position:relative;overflow:hidden;text-align:center;padding:31px 25px 14px;min-height:190px}#article .wx-r2.pastel .article-head>*{position:relative;z-index:1}#article .wx-r2.pastel .eyebrow,#article .wx-r2.pastel .editable-badge{display:none}#article .wx-r2.pastel .article-head h3{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-weight:400;font-size:28px;line-height:1.38;letter-spacing:-.025em;margin:23px auto 12px;max-width:285px}#article .wx-r2.pastel .sub{font-size:12px;color:#555;line-height:1.7}#article .wx-r2.pastel .daily-card{margin:0 22px 34px;min-height:218px;padding:25px 25px 27px;background:${soft};display:flex;flex-direction:column;justify-content:center;text-align:center}#article .wx-r2.pastel .daily-meta,#article .wx-r2.pastel .photo-meta{display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}#article .wx-r2.pastel .daily-source,#article .wx-r2.pastel .photo-source{font-size:11px;line-height:1.4;font-weight:700;color:#31351d}#article .wx-r2.pastel .daily-date,#article .wx-r2.pastel .photo-date{font:700 9px/1.4 Arial;letter-spacing:.1em;color:#70783e}#article .wx-r2.pastel .daily-card p{font:500 20px/1.65 "Songti SC","SimSun",serif;margin:21px 0 0;color:${em}}#article .wx-r2.pastel .photo-note{margin:0 22px 34px;background:${soft}}#article .wx-r2.pastel .photo-note .photo{height:278px}#article .wx-r2.pastel .photo-caption{padding:15px 20px 21px;text-align:left}#article .wx-r2.pastel .photo-meta{justify-content:flex-start}#article .wx-r2.pastel .photo-caption strong{display:block;margin-top:9px;font-size:15px;line-height:1.7;color:${em}}
#article .wx-r2.mono .article-head{position:relative;overflow:hidden;text-align:center;padding:34px 24px 29px;border-bottom:0}#article .wx-r2.mono .article-head>*{position:relative;z-index:1}#article .wx-r2.mono .article-head h3{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-size:27px;line-height:1.28;font-weight:800;letter-spacing:-.045em;margin:0 auto 12px;max-width:285px}#article .wx-r2.mono .sub{display:inline-block;padding:7px 18px;border-top:1px solid #181818;border-bottom:1px solid #181818;color:#222}#article .wx-r2.mono .eyebrow{display:none}#article .wx-r2.mono .highlight{color:#111}#article .wx-r2.mono .lead{border:1px solid #181818;background:#fff;margin-top:0}#article .wx-r2.mono .lead .tag{background:#181818;color:#fff;margin-bottom:15px}#article .wx-r2.mono .image-block{margin:0 22px}#article .wx-r2.mono .image-block .photo{filter:grayscale(1);height:210px}#article .wx-r2.mono .mono-id{border-top:5px solid #181818;border-bottom:1px solid #181818;padding:12px 0;display:flex;justify-content:space-between;font:700 9px/1.3 Arial;letter-spacing:.12em}#article .wx-r2.mono.image-mode .lead{margin-top:0;border-width:0 0 1px;padding:18px 0 20px}
#article .wx-r2.orange .article-head{margin:0;padding:35px 28px 24px;border:0;box-shadow:none;background:transparent}#article .wx-r2.orange .article-head h3{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-weight:700;font-size:27px;line-height:1.34;letter-spacing:-.03em;margin:0 0 12px;padding-bottom:15px;border-bottom:2px solid ${primary}}#article .wx-r2.orange .article-head h3 span{display:block}#article .wx-r2.orange .eyebrow{display:none}#article .wx-r2.orange .highlight{color:${em}}#article .wx-r2.orange .lead{background:${soft};border-top:2px solid ${primary};border-bottom:1px solid ${primary}}#article .wx-r2.orange .lead .tag{display:block;padding:0;margin:0 0 12px;text-align:left;font-size:10px;font-weight:700}#article .wx-r2.orange .footer-note{display:none}#article .wx-r2.orange .travel-card{margin:0 22px;background:#fff;padding:0;border:0;border-bottom:2px solid ${primary};transform:none}#article .wx-r2.orange .travel-card .photo{height:210px}#article .wx-r2.orange .travel-cap{padding:12px 2px 10px;display:flex;justify-content:space-between;gap:8px}#article .wx-r2.orange .travel-cap strong{font-size:12px}#article .wx-r2.orange .travel-cap span{font-size:9px;color:${em}}#article .wx-r2.orange.image-mode .lead{margin-top:0;padding:18px 14px 22px;background:${soft};border-top:0}
#article .wx-r2.beige .article-head{text-align:center;padding:39px 25px 30px;background:linear-gradient(180deg,#f7efe5 0%,#fff 100%)}#article .wx-r2.beige .article-head h3{font-family:"Songti SC","SimSun",serif;font-size:26px;line-height:1.43;font-weight:400;letter-spacing:.015em;margin:0 auto 9px;max-width:275px}#article .wx-r2.beige .article-head h3:before{content:"[ ";color:${em}}#article .wx-r2.beige .article-head h3:after{content:" ]";color:${em}}#article .wx-r2.beige .eyebrow{display:none}#article .wx-r2.beige .highlight{color:${em}}#article .wx-r2.beige .lead{background:${soft};border:1px solid ${primary}33}#article .wx-r2.beige .lead .tag{display:block;padding:0;margin:0 0 12px;text-align:left;font-size:10px;font-weight:700}#article .wx-r2.beige .footer-note{display:none}#article .wx-r2.beige .life{margin:0 22px 36px;position:relative}#article .wx-r2.beige .life .photo{height:180px}#article .wx-r2.beige .life-copy{position:relative;margin:-28px 12px 0;background:#fbf5ed;padding:16px 17px;border:1px solid ${primary}33}#article .wx-r2.beige .life-copy strong{font-family:"Songti SC",serif;font-size:17px;line-height:1.45;display:block;color:#4c3b2b}#article .wx-r2.beige .life-copy em{display:block;margin-top:7px;font:400 11px/1.65 "Microsoft YaHei","PingFang SC",sans-serif;font-style:normal;color:${em}}
#article .wx-r2.green .article-head{text-align:center;padding:35px 25px 28px}#article .wx-r2.green .article-head h3{font-family:"Microsoft YaHei","PingFang SC",sans-serif;color:${primary};font-size:27px;line-height:1.34;font-weight:700;letter-spacing:-.025em;margin:13px auto 12px;max-width:275px}#article .wx-r2.green .article-head .sub{display:inline-block;padding:6px 18px;border:1px solid ${primary};border-radius:999px;background:${primary};color:#fff;line-height:1.3}#article .wx-r2.green .eyebrow,#article .wx-r2.green .highlight{color:${em}}#article .wx-r2.green .eyebrow{font-size:9px;letter-spacing:.16em}#article .wx-r2.green .lead{border:1px solid ${primary}66;background:transparent;position:relative}#article .wx-r2.green .lead-heading{display:flex;align-items:center;gap:9px;margin:0 0 13px}#article .wx-r2.green .lead-heading .tag{flex:0 0 auto;padding:3px 8px;border:1px solid ${primary};background:${primary};color:#fff;font-size:9px;letter-spacing:.12em}#article .wx-r2.green .lead-heading strong{font-size:12px;line-height:1.5;color:${primary}}#article .wx-r2.green .footer-note{display:none}#article .wx-r2.green .nature{margin:0 14px 34px;border:1px solid ${primary}66;padding:8px;background:transparent}#article .wx-r2.green .nature .photo{height:224px}#article .wx-r2.green .nature-copy{padding:12px 10px 9px;background:transparent;text-align:center}#article .wx-r2.green .nature-copy strong{font:700 14px/1.5 "Songti SC",serif;color:${primary}}#article .wx-r2.green .nature-copy span{display:block;font:400 12px/1.65 "Microsoft YaHei","PingFang SC",sans-serif;letter-spacing:.02em;color:${em};margin-top:7px}#article .wx-r2.green.image-mode .lead{display:none}
#article .wx-r2 .article-head h1{font-family:"Songti SC","SimSun",serif;font-size:27px;line-height:1.35;margin:11px 0 8px;padding:0;border:0;background:none;color:inherit;text-align:inherit;letter-spacing:normal}#article .wx-r2.purple .article-head h1{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-size:25px;line-height:1.34;font-weight:700;letter-spacing:-.035em;max-width:290px;margin:0 auto}#article .wx-r2.purple .article-head h1 span{display:block}#article .wx-r2.purple .article-head h1 span:first-child{color:#1d1b20}#article .wx-r2.purple .article-head h1 span:last-child{color:${primary}}#article .wx-r2.pastel .article-head h1{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-weight:400;font-size:28px;line-height:1.38;letter-spacing:-.025em;margin:23px auto 12px;max-width:285px}#article .wx-r2.mono .article-head h1{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-size:27px;line-height:1.28;font-weight:800;letter-spacing:-.045em;margin:0 auto 12px;max-width:285px}#article .wx-r2.orange .article-head h1{font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-weight:700;font-size:27px;line-height:1.34;letter-spacing:-.03em;margin:0 0 12px;padding-bottom:15px;border-bottom:2px solid ${primary}}#article .wx-r2.orange .article-head h1 span{display:block}#article .wx-r2.beige .article-head h1{font-family:"Songti SC","SimSun",serif;font-size:26px;line-height:1.43;font-weight:400;letter-spacing:.015em;margin:0 auto 9px;max-width:275px}#article .wx-r2.beige .article-head h1:before{content:"[ ";color:${em}}#article .wx-r2.beige .article-head h1:after{content:" ]";color:${em}}#article .wx-r2.green .article-head h1{font-family:"Microsoft YaHei","PingFang SC",sans-serif;color:${primary};font-size:27px;line-height:1.34;font-weight:700;letter-spacing:-.025em;margin:13px auto 12px;max-width:275px}.wx-lead-empty{height:120px;display:flex;align-items:center;justify-content:center;background:${soft};color:#777;font-size:12px}.wx-identity{margin:24px 22px;text-align:center;color:${primary};font-size:12px}.wx-identity b{display:block;font-size:15px}.wx-editor-focus{outline:3px solid #8067d8!important;outline-offset:3px}
/* W024: image combinations use ordinary editorial ratios instead of tall,
   offset collage fragments. Captions belong to each image, not to a group. */
#article .media-pair,#article .media-duo,#article .final-pair,#article .double,#article .stack-bottom{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;align-items:start!important}
#article .media-stack{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;align-items:start!important}
#article .media-stack>.baseline-media-item:first-child,#article .media-stack>.media-wide,#article .media-stack>.stack-bottom{grid-column:1/-1!important}
#article .stack-bottom{width:100%!important;margin:0!important}
#article .baseline-media-item{min-width:0!important;width:100%!important;height:auto!important;min-height:0!important;margin:24px 0 24px!important;padding:0!important;transform:none!important;align-self:start!important}
#article .media-pair>.baseline-media-item,#article .media-duo>.baseline-media-item,#article .final-pair>.baseline-media-item,#article .double>.baseline-media-item,#article .media-stack>.baseline-media-item,#article .stack-bottom>.baseline-media-item{margin:0!important}
#article .baseline-media-item>[data-body-image-slot]:not(figcaption){display:flex!important;width:100%!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:0!important;aspect-ratio:4/3!important;margin:0!important;transform:none!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;box-sizing:border-box!important}
#article .baseline-media-item.media-wide>[data-body-image-slot]:not(figcaption),#article .baseline-media-item.hero-media>[data-body-image-slot]:not(figcaption){aspect-ratio:16/9!important}
#article .baseline-media-item>img[data-body-image-slot]{display:block!important;object-fit:cover!important}
#article .baseline-media-item>[data-body-image-slot]:not(figcaption)>img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
#article .baseline-media-caption{display:block!important;margin:8px 0 0!important;padding:0 2px!important;color:#746f78!important;font:400 10px/1.55 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:.01em!important;text-align:left!important;text-align-last:left!important}
#article>.wx-r2+*{margin-top:0!important}
#article>.wx-r2+.chapter{padding-top:64px!important}
#article>.wx-r2+.chapter:before{top:12px!important}
#article>.wx-r2+.chapter-title{padding-top:28px!important}
#article .media-pair,#article .media-duo,#article .media-stack,#article .double{margin-top:24px!important;margin-bottom:24px!important}
#article .baseline-media-caption{height:auto!important;min-height:0!important;aspect-ratio:auto!important}
#article [data-pilot-real]:before,#article [data-pilot-real]:after{content:none!important}
#article .down{display:none!important}

#article .editorial-image-pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}#article .editorial-image-pair figure{min-width:0}
/* W028: explicit editable targets and predictable vertical rhythm. */
#article [data-chapter028]{padding-top:0!important;margin-top:0!important}#article .wx-r2+[data-chapter028]{padding-top:24px!important}#article .wx-r2.purple+[data-chapter028]{padding-top:0!important}
#article .chapter-head,#article .section-head{padding-top:26px!important;padding-bottom:20px!important;margin-top:0!important;margin-bottom:0!important}
#article .chapter-head:before,#article .section-head:before{display:none!important}
#article .chapter-title{padding-top:26px!important;padding-bottom:18px!important;margin:0!important}
#article .chapter-card{background:#fff!important;padding-top:14px!important;padding-bottom:18px!important}
#article [data-chapter028]>p{margin:0 0 22px!important;line-height:${p.settings.density==='compact'?1.8:p.settings.density==='airy'?2.1:1.95}!important}
#article .baseline-media-item{margin:24px 0!important;width:100%!important}
#article .baseline-media-item>img[data-body-image-slot]{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:300px!important;aspect-ratio:auto!important;object-fit:contain!important;background:white!important}
#article .baseline-media-caption{margin:8px 0 0!important;padding:0!important;font-size:11px!important;line-height:1.6!important}
#article .baseline-media-caption[hidden]{display:none!important}
#article .wx-r2 .lead,#article .wx-r2 .daily-card,#article .wx-r2 .photo-note,#article .wx-r2 .nature,#article .wx-r2 .life{margin-bottom:24px!important}
#article .article-head h1{font-size:${p.settings.titleSize||27}px!important;font-weight:${p.settings.titleWeight||700}!important}
#article h2{font-size:${p.settings.headingSize||22}px!important}
#article [data-article-emphasis]{background:none!important;box-shadow:none!important;text-decoration:none!important;font-weight:400!important;color:inherit!important}
#article [data-article-emphasis][data-original-emphasis=color]{color:${em}!important}
#article [data-article-emphasis][data-original-emphasis=bold]{font-weight:700!important}
#article [data-article-emphasis][data-original-emphasis=underline]{background:linear-gradient(transparent 62%,${soft} 62%)!important}
${p.settings.emphasisMode==='color'?'#article [data-article-emphasis]{color:'+em+'!important;background:none!important}':p.settings.emphasisMode==='underline'?'#article [data-article-emphasis]{color:inherit!important;background:linear-gradient(transparent 62%,'+soft+' 62%)!important}':''}
#article [data-edit-section]{scroll-margin-top:28px}
/* W029: decorative elements occupy their own line instead of absolute offsets. */
${id==='warm-orange-journal'?'#article .chapter:before,#article .ending:before{content:none!important;display:none!important}#article .wx-r2+.chapter{padding-top:0!important}#article .chapter{padding-bottom:28px!important}#article .section-head{margin-bottom:16px!important}#article .ending{padding-top:8px!important}':''}
${id==='warm-beige-lifestyle'?'#article .chapter:before{content:none!important;display:none!important}#article .wx-r2+.chapter{padding-top:0!important}#article .chapter{padding-bottom:28px!important}':''}
#article .wx-decorative-text{position:static!important;display:block;box-sizing:border-box;margin:0!important;padding:16px 8px 4px!important;text-align:center;font:700 13px/1.65 Arial,"Microsoft YaHei",sans-serif!important;letter-spacing:.1em;color:${primary}!important;opacity:.66;overflow-wrap:anywhere;white-space:normal}
#article [data-decorative-text]{overflow-wrap:anywhere;white-space:normal}#article [data-decorative-text][hidden]{display:none!important}
#article .ghost.wx-custom-mark{font-size:22px!important;line-height:1.5!important;letter-spacing:0!important;overflow-wrap:anywhere}
/* W035: visible chapter gaps 89 -> 59.333 (26px header inset retained) and ending 94.5 -> 63; first lead gap stays 28.5. */
${id==='monochrome-order'?'#article .chapter:before,#article .ending:before{content:none!important;display:none!important}#article>.chapter{margin-top:0!important;margin-bottom:0!important;padding-top:33.333333px!important;padding-bottom:0!important}#article>.wx-r2+.chapter{padding-top:28.5px!important}#article>.chapter>.section-head{margin-top:0!important}#article>.chapter>:last-child{margin-bottom:0!important}#article .ending{padding-top:63px!important;margin-top:0!important}#article .ending-copy{border-left:2px solid #111!important;border-right:2px solid #111!important;padding:0 12px!important;margin:0 0 38px!important}#article .ending .qr-panel{margin-top:0!important}':''}
${id==='pastel-art-editorial'?'#article .ending-copy{font-style:italic!important}':''}
#article .ghost-main{display:block;font:inherit;color:inherit;letter-spacing:inherit}#article .ghost>small{display:block}
#article .wx-decorative-text[hidden]{display:none!important}
#article .wx-decorative-text:not([hidden])+.section-head{padding-top:14px!important}
/* W031 lead signatures and screenshot-targeted spacing. */
#article .wx-r2.purple.image-mode .lead{margin-bottom:0!important}
#article .wx-r2.purple.image-mode .r2-hero{margin-top:0!important}
#article .wx-r2.green .lead .highlight{background:none!important;box-shadow:none!important;text-decoration:none!important;font-weight:700!important}
#article .wx-r2 [data-identity-slot=leadSignature]{overflow-wrap:anywhere;white-space:normal}
#article .wx-r2.pastel .photo-source:has([data-identity-slot]:empty),#article .wx-r2.pastel .daily-source:has([data-identity-slot]:empty){display:none}
#article .wx-r2.green .nature-copy strong{display:block}
#article .wx-r2.green .nature-copy strong [data-identity-slot]{display:inline;font:inherit;color:inherit;letter-spacing:inherit;margin:0}
</style>`;
}

const FAMILY={'mengyu-purple-editorial':'purple','pastel-art-editorial':'pastel','monochrome-order':'mono','warm-orange-journal':'orange','warm-beige-lifestyle':'beige',green:'green'};
function titleParts(title){return String(title||'').split(/\n+/).map(clean).filter(Boolean);}
function titleHTML(id,title){const parts=titleParts(title);if(id==='mengyu-purple-editorial'||id==='warm-orange-journal')return (parts.length?parts:['']).map(x=>`<span>${esc(x)}</span>`).join('');return parts.map(esc).join('<br>');}
function imageHTML(p,editor,cls='photo'){if(p.lead.image)return `<img class="${cls}" src="${esc(p.lead.image)}" alt="${esc(p.lead.imageAlt)}">`;return editor?'<div class="wx-lead-empty">请在右侧上传导语图片</div>':'';}
function headHTML(id,p,content){const approved=p.contentMode==='article'?content:(HEAD_COPY[id]||content),eyebrow=p.identity.eyebrow||content.eyebrow||'';return `<div class="article-head" data-edit-section="headings">${eyebrow?`<div class="eyebrow">${esc(eyebrow)}</div>`:''}<h1>${titleHTML(id,approved.title)}</h1>${approved.subtitle?`<div class="sub">${esc(approved.subtitle)}</div>`:''}${id==='pastel-art-editorial'&&p.experience!=='style-selection/v1'?`<div class="editable-badge">${esc(p.identity.brandName||'')}</div>`:''}</div>`;}
function exactLeadHTML(id,p,editor,content={}){
  const fam=FAMILY[id]||'green',mode=p.lead.mode==='image'?'image':'text',i=p.identity,tag=p.lead.signature||'',kw=i.keywords||[],img=imageHTML(p,editor),head=headHTML(id,p,content);
  const demo='<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)">演示内容</span>';
  if(!p.lead.enabled)return `<section class="wx-r2 ${fam}" data-r2-approved="true">${demo}${head}</section>`;
  let body='';
  if(mode==='text'){
    if(id==='pastel-art-editorial')body=`<div class="daily-card" data-edit-section="lead"><div class="daily-meta"><span class="daily-source"><span data-identity-slot="leadSignature">${esc(tag)}</span></span>${kw.length?`<span class="daily-date">${esc(kw.join(' · '))}</span>`:''}</div><p>${esc(p.lead.highlight||p.lead.text)}</p></div>`;
    else if(id==='green')body=`<div class="lead" data-edit-section="lead"><div class="lead-heading"><span class="tag">编者按</span><strong><span data-identity-slot="leadSignature">${esc(tag)}</span></strong></div>${p.lead.text?`<p>${esc(p.lead.text)}</p>`:''}${p.lead.highlight?`<p class="highlight">${esc(p.lead.highlight)}</p>`:''}</div>`;
    else body=`<div class="lead" data-edit-section="lead">${tag?`<span class="tag"><span data-identity-slot="leadSignature">${esc(tag)}</span></span>`:''}${p.lead.text?`<p>${esc(p.lead.text)}</p>`:''}${p.lead.highlight?`<p class="highlight">${esc(p.lead.highlight)}</p>`:''}</div>`;
  }else if(id==='mengyu-purple-editorial')body=`<div class="r2-hero" data-edit-section="lead">${img}<div class="hero-copy"><div class="identity">${esc(i.eyebrow||'AI与创作 · 观察')}</div><strong><span data-identity-slot="leadSignature">${esc(tag)}</span></strong>${false&&i.slogan?`<span>${esc(i.slogan)}</span>`:''}</div></div><div class="lead" data-edit-section="lead">${p.lead.text?`<p>${esc(p.lead.text)}</p>`:''}${p.lead.highlight?`<p class="highlight">${esc(p.lead.highlight)}</p>`:''}</div>`;
  else if(id==='pastel-art-editorial')body=`<div class="photo-note" data-edit-section="lead">${img}<div class="photo-caption"><div class="photo-meta"><span class="photo-source"><span data-identity-slot="leadSignature">${esc(tag)}</span></span>${kw.length?`<span class="photo-date">${esc(kw.join(' · '))}</span>`:''}</div><strong>${esc(p.lead.highlight||p.lead.text)}</strong></div></div>`;
  else if(id==='monochrome-order')body=`<div class="image-block" data-edit-section="lead">${img}<div class="mono-id"><span><span data-identity-slot="leadSignature">${esc(tag)}</span></span><span>${esc(kw.join(' / '))}</span></div></div><div class="lead" data-edit-section="lead">${p.lead.text?`<p>${esc(p.lead.text)}</p>`:''}${p.lead.highlight?`<p class="highlight">${esc(p.lead.highlight)}</p>`:''}</div>`;
  else if(id==='warm-orange-journal')body=`<div class="travel-card" data-edit-section="lead">${img}<div class="travel-cap"><strong><span data-identity-slot="leadSignature">${esc(tag)}</span></strong><span>${esc(kw.join(' · '))}</span></div></div><div class="lead" data-edit-section="lead">${p.lead.text?`<p>${esc(p.lead.text)}</p>`:''}${p.lead.highlight?`<p class="highlight">${esc(p.lead.highlight)}</p>`:''}</div>`;
  else if(id==='warm-beige-lifestyle')body=`<div class="life" data-edit-section="lead">${img}<div class="life-copy"><strong><span data-identity-slot="leadSignature">${esc(tag)}</span></strong><em>${esc(p.lead.highlight)}</em></div></div>`;
  else body=`<div class="nature" data-edit-section="lead">${img}<div class="nature-copy"><strong><span data-identity-slot="leadSignature">${esc(tag)}</span></strong><span>${esc(p.lead.highlight)}</span></div></div>`;
  return `<section class="wx-r2 ${fam}${mode==='image'?' image-mode':''}" data-r2-approved="true">${demo}${head}${body}</section>`;
}

function identityHTML(p){if(p.experience==='style-selection/v1')return '';const i=p.identity,top=[i.brandName,i.displayName].filter(Boolean).join(' · '),meta=[i.authorName&&'作者：'+i.authorName,i.sourceName&&'来源：'+i.sourceName].filter(Boolean).join('　');if(!top&&!i.slogan&&!meta)return '';return `<section class="wx-identity" data-edit-section="identity">${top?`<b>${esc(top)}</b>`:''}${i.slogan?`<span>${esc(i.slogan)}</span>`:''}${meta?`<small>${esc(meta)}</small>`:''}</section>`;}
function directOpening(article){const children=[...article.children];const title=children.find(el=>el.matches('header,.hero,.article-hero,.poster-hero,.opening'))||article.querySelector('header,.hero,.article-hero,.poster-hero,.opening');const intro=children.find(el=>el!==title&&el.matches('.intro,.opening,.live-intro'))||null;return {title,intro};}
function contentFromDOM(title){const h=title?.querySelector('h1');return {title:h?(h.innerText||h.textContent||'').trim():'',subtitle:(title?.querySelector('.subtitle,[data-role=subtitle]')?.textContent||'').trim(),eyebrow:(title?.querySelector('.eyebrow,.kicker,.article-kicker')?.textContent||'').trim()};}
function stripTags(s){return String(s||'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();}
function contentFromHTML(html){const h=(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||'',sub=(html.match(/<(?:p|div)\b[^>]*class="[^"]*subtitle[^"]*"[^>]*>([\s\S]*?)<\/(?:p|div)>/i)||[])[1]||'',eye=(html.match(/<(?:p|div|span)\b[^>]*class="[^"]*(?:eyebrow|kicker|article-kicker)[^"]*"[^>]*>([\s\S]*?)<\/(?:p|div|span)>/i)||[])[1]||'';return {title:stripTags(h),subtitle:stripTags(sub),eyebrow:stripTags(eye)};}
function replaceOpeningHTML(html,replacement){let out=html;out=out.replace(/(<article\b[^>]*>)([\s\S]*?)(<header\b[^>]*>[\s\S]*?<\/header>)/i,(m,open,before)=>open+before+replacement);out=out.replace(/(<section\b[^>]*class="[^"]*(?:intro|opening|live-intro)[^"]*"[^>]*>[\s\S]*?<\/section>)/i,'');return out;}

const PASTEL_PILOT={
  chapters:[
    {label:'NOTICE WHAT IS HERE',title:'先把完成放到一边',paragraphs:['周末的练习不从“我要做出什么”开始。先把桌面清出来，只留下今天愿意碰一碰的材料：纸、铅笔、剪刀，或者一本很久没有翻开的速写本。','不用急着把它们变成作品。先看颜色、触感和边缘，留意哪一样东西让你愿意多停留几秒。','灵感往往不是突然出现的答案，而是你重新注意到什么。']},
    {label:'COLLECT THREE COLORS',title:'从手边收集三种颜色',paragraphs:['从房间里找三种今天想靠近的颜色。它们可以来自一本书的封面、一块布、窗外的叶子，也可以只是一张被留下来的包装纸。','把颜色并排放在一起，不必解释为什么喜欢。先观察它们靠近时，是安静、明亮，还是有一点意外。','颜色不是装饰，它会先替你说出今天的情绪。']},
    {label:'MAKE WITHOUT FINISHING',title:'做一张不完整的拼贴',paragraphs:['用撕下来的纸片组成一个很小的画面。只给自己二十分钟，不找标准答案，也不要求把空白全部填满。','先放下最大的形状，确定画面的重心。','再加一块不同方向的颜色，让画面有一点转折。','最后留下一处没有解决的地方，明天再回来看看。','这张练习不需要被发表。它的作用，是让手和眼睛重新建立联系。']},
    {label:'KEEP ONE SENTENCE',title:'留下一句今天的观察',paragraphs:['结束以前，写下一句非常具体的话。不要写“今天很有灵感”，而是写你真正看见的东西：淡紫和旧纸放在一起时更安静，或者剪下来的边缘比画出来的线更自然。','这句话会成为下一次开始的位置。等你再次打开材料时，不需要重新寻找状态，只要从已经注意到的地方继续。','周末练习不是为了证明自己仍然会创作，而是给注意力留一个可以慢慢回来的入口。']}
  ],
  images:[
    {src:'assets/wechat-templates/pastel-art-editorial/images/weekend-desk-v1.png',alt:'周末桌面上的纸张、色铅笔与速写本',caption:'图 01｜把材料摊开，先从手边真实存在的颜色开始'},
    {src:'assets/wechat-templates/pastel-art-editorial/images/collage-process-v1.png',alt:'双手正在制作浅色手工拼贴',caption:'图 02｜不追求完整，先让纸张的形状和触感参与判断'},
    {src:'assets/wechat-templates/pastel-art-editorial/images/collage-finished-v1.png',alt:'完成后的浅紫与鼠尾草绿纸张拼贴',caption:'图 03｜保留一处未解决的空白，作为下一次继续的位置'}
  ]
};
function applyPastelPilot(article){
  const chapters=[...article.querySelectorAll(':scope > .chapter')];
  chapters.slice(0,4).forEach((chapter,index)=>{
    const copy=PASTEL_PILOT.chapters[index],h=chapter.querySelector('h2,h3'),ps=[...chapter.querySelectorAll('p')];
    if(h)h.textContent=copy.title;if(ps[0])ps[0].textContent=copy.label;
    copy.paragraphs.forEach((value,n)=>{if(ps[n+1])ps[n+1].textContent=value});
    ps.slice(copy.paragraphs.length+1).forEach(p=>{if(!p.closest('.ending'))p.remove()});
  });
  const listTitles=['先定重心','再加转折','留下空白'];
  [...(chapters[2]?.querySelectorAll('strong')||[])].slice(0,3).forEach((node,n)=>{node.textContent=listTitles[n]});
  const keep=[chapters[0]?.querySelector('figure.baseline-media-item'),...chapters[1]?.querySelectorAll('figure.baseline-media-item')||[]].filter(Boolean).slice(0,3);
  [...article.querySelectorAll('figure.baseline-media-item')].forEach(f=>{if(!keep.includes(f))f.remove()});
  article.querySelectorAll('.media-pair,.media-duo,.final-pair,.double,.media-stack,.stack-bottom').forEach(g=>{if(!g.querySelector('figure.baseline-media-item'))g.remove()});
  keep.forEach((figure,n)=>{const data=PASTEL_PILOT.images[n],slot=figure.querySelector('[data-body-image-slot]'),cap=figure.querySelector('figcaption');if(!slot||!data)return;slot.innerHTML=`<img src="${data.src}" alt="${data.alt}">`;slot.dataset.pilotReal='true';if(cap)cap.textContent=data.caption});
  const closing=article.querySelector(':scope > .ending p');if(closing)closing.textContent='让注意力慢慢回来，从已经看见的地方继续。';
}


const ARTICLE_028={"mengyu-purple-editorial":{"chapters":[["先说清楚，为什么做","START WITH A QUESTION","打开工具之前，先写下这次表达希望让谁看见、让谁理解。一个海报、一篇文章或一张图片，都应该有明确的对象。","[em]先确定要传达的事情，再决定怎样把它做出来。[/em]如果目的还没有说清，生成更多版本只会增加选择的负担。"],["把选择标准写下来","MAKE YOUR CRITERIA VISIBLE","画面是否清楚，信息是否有轻重，风格是否和内容一致，这些判断可以在生成之前列出来。不要只用“好看”描述期待。","拿到结果后，把它放回真实场景：手机上能否读清，标题是否抢走了全部注意力，图片有没有偏离文章。[em]标准越具体，比较才越有依据。[/em]"],["让工具执行，让人复查","KEEP THE HUMAN REVIEW","AI 可以整理材料、尝试组合，也可以把已有规则应用到新的内容里。但它不能代替你确认最终表达是否合适。","[em]把重复步骤交出去，把最后的判断留下来。[/em]对于颜色、措辞和图片选择，保留一轮完整阅读，而不是只检查局部有没有报错。"],["保留一次选择的理由","LEAVE A USEFUL RECORD","完成后，不必把所有试稿都留下。保存最终版本，并用几句话记录为什么选择它、哪些尝试没有奏效。","这些记录不是给创作增加负担，而是让下一次少走一些重复的路。[em]审美也可以通过一次次有理由的选择，慢慢变得清晰。[/em]"]],"images":[["images/editorial-028-01.jpg","屏幕前的执行工作：先确认目标，再开始操作","目标 · 执行"],["images/editorial-028-02.jpg","计算能力提供更多可能，选择标准仍由人建立","技术 · 判断"]],"ending":"让工具帮你完成，让判断保留你的方向。"},"monochrome-order":{"chapters":[["先把材料放到同一处","COLLECT BEFORE SORTING","会议纪要、便签和零散消息常常描述着同一件事，却散落在不同位置。先收集，再决定怎样归类，避免一边找资料一边仓促下结论。","[em]收集阶段只解决“有什么”，不急着回答“怎么办”。[/em]保留来源，让每条信息都能回到原来的语境。"],["找到信息之间的关系","LOOK FOR CONNECTIONS","把相近的信息并排阅读：哪些是事实，哪些是意见，哪些只是还没有得到回答的问题？同一个关键词不一定意味着同一种关系。","[em]结构不是文件夹的数量，而是内容之间的联系。[/em]可以先用先后、并列和因果三种关系整理，复杂的分类留到真正需要时再加。"],["给每一组一个清楚的名字","NAME THE GROUPS","命名不是装饰。好的名称能帮助下一位读者判断：这里有什么，什么时候应该回来查找。尽量用具体对象与动作，而不是宽泛的大词。","比如把“其他资料”改成“待核实的问题”，把“项目相关”改成“已确认的交付范围”。[em]名称越清楚，后续检索越省力。[/em]"],["留下一个可以继续的位置","MAKE THE NEXT STEP CLEAR","整理结束时，再通读一次：重复的材料有没有标记，仍有分歧的意见有没有被保留，下一步要做什么是否明确？","不必追求一次整理得永远正确。[em]一个好系统，应当允许新信息进来，也允许旧判断被修正。[/em]"]],"images":[["images/editorial-028-01.jpg","把不同来源的材料放到一起，先建立共同视野","收集 · 协作"],["images/editorial-028-02.jpg","阅读与核对，让分类建立在实际内容之上","阅读 · 核对"]],"ending":"让资料有来处，让下一步有位置。"},"warm-orange-journal":{"chapters":[["第一天，只选一个方向","DAY 01 / FIND A DIRECTION","到达之后，没有急着把地图上的标记全部走完。先沿着住处附近的街道慢慢走，看看人们在哪里停留，哪一家小店还亮着灯。","[em]少安排一个地点，就多留出一点真正看见的时间。[/em]这趟慢行的第一件事，是让脚步跟上自己的呼吸。"],["第二天，在海边等一会儿","DAY 02 / STAY A LITTLE LONGER","下午来到海边，太阳还很高。于是找一处能坐下的位置，听浪声，看水面的颜色从明亮变得柔和。","同一个地方停留久一点，细节才会慢慢出现。[em]风景不只在远处，也在一次没有被催促的等待里。[/em]"],["给偶然发生的事留位置","LEAVE SPACE FOR CHANCE","走错的小路、临时决定买的一杯饮料、路边一段短短的交谈，都不在出发前的清单里。它们却常常比打卡地点更容易留在记忆中。","[em]计划负责带你出发，不必负责解释全部经历。[/em]如果今天只发生了一件值得记住的小事，也已经足够。"],["第三天，带走自己的观察","DAY 03 / TAKE A NOTE HOME","离开前，再走一次第一天经过的路。街道没有变多少，但你已经知道哪里有阴影，什么时候能闻到面包的味道。","带走的不是一份更长的景点名单，而是一种观察的速度。[em]慢行的意义，是回到日常之后，也愿意多看一眼。[/em]"]],"images":[["images/editorial-028-01.jpg","在海岸停留，等待光线缓慢改变","海岸 · 日光"],["images/editorial-028-02.jpg","潮水边的一点细节，也值得进入旅行记录","潮汐 · 细节"]],"ending":"不赶着抵达，让一段路真正发生。"},"warm-beige-lifestyle":{"chapters":[["从今天会用的东西开始","START WITH WHAT YOU USE","整理不需要从整个房间开始。先选一个每天都会碰到的位置：床边、书桌，或者放钥匙的小托盘。把这里的东西暂时拿开，看清它们各自的用途。","[em]先照顾每天的动作，再考虑物品摆得是否漂亮。[/em]常用的东西容易拿到，生活就会少一点不必要的寻找。"],["给喜欢的物件留一点空白","LEAVE SOME BREATHING ROOM","一本正在读的书、一副眼镜、一束小花，不需要被收进完全相同的盒子。它们可以留在顺手的位置，也可以成为房间里温柔的提醒。","[em]空白不是浪费空间，而是让留下的东西更容易被看见。[/em]不用把每个平面填满，也不必把每件物品都变成展示。"],["把犹豫的东西暂时放下","MAKE ROOM FOR A DECISION","有些东西不是不需要，只是还没有想清楚。可以给它们一个临时位置，写下再次查看的时间，不必在疲惫时强迫自己立刻决定。","区别“现在不用”和“永远不要”，会让整理轻松一些。[em]真正的秩序，来自清楚的选择，而不是勉强的舍弃。[/em]"],["让恢复原位成为小动作","KEEP IT EASY TO RETURN","整理完成之后，试着过一天真实的生活。看看哪些物品又堆在了原来的地方：也许不是自己不够自律，而是它们的位置还不够方便。","把收纳方式调整到随手可以完成，胜过建立一套很难维持的标准。[em]房间是用来生活的，不是用来证明整齐的。[/em]"]],"images":[["images/editorial-028-01.jpg","书、眼镜与小花，为日常阅读留出一个安静的位置","阅读 · 留白"]],"ending":"把空间整理轻一点，让日常自在一点。"},"green":{"chapters":[["选一条每天经过的路","CHOOSE A FAMILIAR ROUTE","不必为了观察专门去远方。可以从楼下的一棵树、一段步道或公园的一小块绿地开始，选一个容易再次回来的位置。","[em]观察的起点，不是发现稀有的东西，而是愿意重复看见。[/em]给自己十分钟，先把手机放下。"],["记录今天与昨天的不同","NOTICE A SMALL CHANGE","同一片叶子，在清晨和傍晚会有不同的颜色；雨后潮湿的树皮，与晴天的触感也不一样。先描述看到的变化，不急着给它一个漂亮的解释。","[em]把“很美”换成一个具体细节。[/em]例如叶缘卷起了一点、地面多了一片落叶，或者鸟鸣比昨天更近。"],["只留下三条简单记录","KEEP THREE SMALL NOTES","每次记录不必很长。可以写下天气、一个看见的细节，以及一个还想继续观察的问题。没有照片的日子，也可以只写一句话。","[em]记录是帮助注意力停留，不是给自己增加作业。[/em]当你愿意持续回来，细小的变化才会连成一段经验。"],["一周后，再看第一次的笔记","RETURN TO YOUR FIRST NOTE","把几天的记录放到一起，会发现自己注意的东西在变化。最初只看见一棵树，后来开始分辨它周围的光、风和声音。","不必总结出宏大的结论。[em]长期主义不是一直向前，而是愿意反复回到同一个地方。[/em]熟悉的街区也能成为持续打开的自然课堂。"]],"images":[["lead-default.jpg","林间的树干与苔藓：把视线停在可以具体描述的细节上","树木 · 苔藓"]],"ending":"每天十分钟，从熟悉的地方重新看见。"}};
function inline028(text){return esc(text).replace(/\[em\]([\s\S]*?)\[\/em\]/g,'<strong data-article-emphasis="true">$1</strong>');}
function applyEditorial028(article,id,p){
 if(p.contentMode==='article')return;
 let sample=ARTICLE_028[id];
 if(id==='pastel-art-editorial')sample={chapters:PASTEL_PILOT.chapters.map(c=>[c.title,c.label,c.paragraphs[0],c.paragraphs.slice(1).join(' ')]),images:PASTEL_PILOT.images.map((i,n)=>[i.src,i.caption.replace(/^图 \d+｜/,''),['纸张 · 色彩','拼贴 · 手作','留白 · 材料'][n]]),ending:'让注意力慢慢回来，从已经看见的地方继续。'};
 if(!sample)return;
 const chapters=[...article.querySelectorAll(':scope > .chapter,:scope > .chapter-card')];
 chapters.forEach((ch,n)=>{const cp=sample.chapters[n];if(!cp)return;const heading=id==='green'?ch.previousElementSibling:ch.querySelector('header');const h=heading?.querySelector('h2,h3');if(h)h.textContent=cp[0];const label=heading?.querySelector('[data-role=partlabel],.section-head p');if(label)label.textContent=cp[1];const hint=heading?.querySelector('.hint,.chapter-head p');if(hint)hint.remove();
 const header=id==='green'?'':heading?.outerHTML||'';
 const text=cp[3].includes('[em]')?cp[3]:cp[3].replace(/([^。！？]+[。！？])$/, '[em]$1[/em]');
 const img=sample.images[n],source=img?(img[0].startsWith('assets/')?img[0]:'assets/wechat-templates/'+id+'/'+img[0]):'';
 let media=img?'<figure class="baseline-media-item" data-edit-section="media"><img data-body-image-slot="body-'+n+'" src="'+esc(p.assetMap?.[source]||source)+'" alt="'+esc(img[1])+'"><figcaption class="baseline-media-caption" data-caption-description="'+esc(img[1])+'" data-caption-keywords="'+esc(img[2])+'"></figcaption></figure>':'';
 if(id==='pastel-art-editorial'&&n===1){media='<div class="editorial-image-pair">'+sample.images.slice(1).map((im,j)=>'<figure class="baseline-media-item" data-edit-section="media"><img data-body-image-slot="pastel-pair-'+j+'" src="'+esc(p.assetMap?.[im[0]]||im[0])+'" alt="'+esc(im[1])+'"><figcaption class="baseline-media-caption" data-caption-description="'+esc(im[1])+'" data-caption-keywords="'+esc(im[2])+'"></figcaption></figure>').join('')+'</div>';}if(id==='pastel-art-editorial'&&n===2)media='';
 ch.innerHTML=header+'<p data-edit-section="body">'+inline028(cp[2])+'</p>'+media+'<p data-edit-section="body">'+inline028(text)+'</p>';ch.removeAttribute('data-edit-section');ch.dataset.chapter028='true';});
 article.querySelectorAll('.ending [data-role=image],.ending .ending-image,.footnote').forEach(el=>el.remove());const end=article.querySelector('.ending-copy');if(end)end.textContent=sample.ending;
}
function finish028(article,id,p){
 applyEditorial028(article,id,p);
 if(p.contentMode==='article')article.querySelectorAll('p strong,p b,p em,p mark').forEach(x=>x.dataset.articleEmphasis='true');
 article.querySelectorAll('[data-edit-section="headings"]').forEach(x=>x.removeAttribute('data-edit-section'));
 article.querySelectorAll('.article-head').forEach(x=>x.dataset.editSection='title');
 article.querySelectorAll('h2,h3').forEach(x=>{const target=x.closest('header,.chapter-title')||x;target.dataset.editSection='headings';});
 article.querySelectorAll('p').forEach(x=>{if(!x.closest('.wx-r2,.ending,[data-edit-section=headings]'))x.dataset.editSection='body';});
 article.querySelectorAll('[data-article-emphasis]').forEach((x,n)=>{x.dataset.editSection='emphasis';x.dataset.originalEmphasis=['color','bold','underline'][n%3];const mode=p.settings.emphasisMode&&p.settings.emphasisMode!=='original'?p.settings.emphasisMode:x.dataset.originalEmphasis;x.style.setProperty('color',mode==='color'?(p.settings.emphasis||'#66507d'):'inherit','important');x.style.setProperty('font-weight',mode==='bold'?'700':'400','important');x.style.setProperty('background',mode==='underline'?'linear-gradient(transparent 62%,'+(p.settings.soft||'#eee9f4')+' 62%)':'none','important');});
 const cap=p.captionOptions||{};article.querySelectorAll('figure.baseline-media-item').forEach((fig,n)=>{fig.dataset.editSection='media';const c=fig.querySelector('figcaption');if(!c)return;const description=c.dataset.captionDescription||c.textContent.replace(/^图\s*\d+\s*[｜|]?/,'').trim();const keywords=c.dataset.captionKeywords||description.split(/[，。：；]/)[0].slice(0,12);c.dataset.captionDescription=description;c.dataset.captionKeywords=keywords;const label=cap.mode==='keywords'?keywords:cap.mode==='none'?'':description;c.textContent=(cap.number!==false?'图 '+String(n+1).padStart(2,'0')+(label?'｜':''):'')+label;c.hidden=cap.visible===false||!c.textContent;});
 if(p.contentMode==='article')article.querySelectorAll('.wx-r2 .article-head h1').forEach(()=>{});
}

// W033: stable per-location decorations; no replacement of article body or QR copy.
function finishDecorations029(article,id,p,editor){
 const doc=article.ownerDocument,slots=p.decoration?.slots||{};
 const dictionary=[['审美','AESTHETICS'],['创作','CREATIVITY'],['灵感','INSPIRATION'],['秩序','ORDER'],['信息','INFORMATION'],['整理','SIMPLICITY'],['自然','NATURE'],['观察','OBSERVATION'],['慢行','SLOW TRAVEL'],['方向','DIRECTION'],['海边','SEASIDE'],['偶然','SERENDIPITY'],['街角','STREET CORNER'],['时间','TIME'],['步调','PACE'],['城市','CITY'],['记录','JOURNAL'],['旅途','JOURNEY'],['空间','SPACE'],['生活','LIFE'],['协作','COLLABORATION'],['材料','MATERIALS'],['色彩','COLOR'],['分享','SHARING'],['选择','CHOICE'],['工具','TOOLS']];
 function keyword(node,english){const title=(node===article?article.querySelector('h1'):node.querySelector('h2'))?.textContent||article.querySelector('h1')?.textContent||'';const match=dictionary.find(([zh])=>title.includes(zh));if(match)return match[english?1:0];if(english){const label=node.querySelector('[data-role=partlabel],.section-head p,.chapter-head small')?.textContent||'';return label.match(/[A-Za-z][A-Za-z -]{2,}/)?.[0].trim().toUpperCase()||'';}const words=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('zh',{granularity:'word'}).segment(title)].filter(x=>x.isWordLike).map(x=>x.segment):title.split(/[，。！？、\s]+/);return words.filter(x=>x.length>=2&&!['一个','我们','自己','什么','如何','之后'].includes(x)).sort((a,b)=>b.length-a.length)[0]?.slice(0,8)||'';}
 function decorate(node,key,context,english,legacy){if(!node)return;const opt=slots[key]||(legacy?p.decoration:{});node.dataset.decorationSlot=key;node.dataset.decorativeText='true';node.dataset.editSection='decoration';node.dataset.decorationLanguage=english?'en':'zh';node.dataset.decorationLabel=key==='ending-mark'?'文末大字':key==='ending-en'?'文末英文关键词':key==='ending-copy'?'文末装饰文字':'章节英文装饰';node.dataset.originalDecoration=node.textContent.trim();
 let main=node;if(key==='ending-mark'){const sub=node.querySelector('small'),originalMain=[...node.childNodes].filter(x=>x!==sub).map(x=>x.textContent).join('').trim();main=doc.createElement('span');main.className='ghost-main';main.textContent=originalMain;const small=sub||doc.createElement('small');small.textContent=opt.secondaryText?.trim()||small.textContent||'VOL.01';node.replaceChildren(main,small);}
 if(opt.mode==='custom')main.textContent=opt.text||'';else if(opt.mode==='keyword')main.textContent=keyword(context,english);node.dataset.decorationMode=opt.mode||'original';node.hidden=opt.visible===false||!main.textContent.trim();
 if(key==='ending-mark'&&opt.mode&&opt.mode!=='original'&&main.textContent.length>6)node.classList.add('wx-custom-mark');}
 if(id==='warm-orange-journal')[...article.querySelectorAll(':scope > .chapter')].forEach((node,n)=>{const word=doc.createElement('div');word.className='wx-decorative-text';word.textContent='DESIGN';node.prepend(word);decorate(word,'chapter-'+(n+1),node,true,true)});
 if(id==='monochrome-order')article.querySelectorAll(':scope > .chapter').item(article.querySelectorAll(':scope > .chapter').length-1)?.classList.add('wx-before-ending');
 const end=article.querySelector(':scope > .ending');if(end){decorate(end.querySelector('.ending-copy'),'ending-copy',article,false,false);decorate(end.querySelector('.ghost'),'ending-mark',article,false,false);decorate(end.querySelector('.ending-en'),'ending-en',article,true,false);}
}
function enhanceDocument(doc,id,raw,editor){
  const p=normalize(raw,id),article=doc.querySelector('#article')||doc.body;if(!article)return p;
  doc.head.insertAdjacentHTML('beforeend',css(id,p));
  const opening=directOpening(article),content=contentFromDOM(opening.title),holder=doc.createElement('div');holder.innerHTML=exactLeadHTML(id,p,editor,content);
  if(opening.title)opening.title.replaceWith(holder.firstElementChild);else article.prepend(holder.firstElementChild);if(opening.intro&&opening.intro.isConnected)opening.intro.remove();
  const mediaSelector='[data-role=image],.media-placeholder,.image-block,.photo-block,img';
  const media=[...article.querySelectorAll(mediaSelector)].filter(el=>!el.closest('[data-edit-section=lead],[data-edit-section=headings],.ending,.wx-identity')&&!el.querySelector(mediaSelector)).map(el=>p.contentMode==='article'&&el.tagName==='IMG'&&el.parentElement?.matches('.portable-image,.media-placeholder,.image-block,.photo-block')?el.parentElement:el);
  /* Baseline reconstruction: preserve every original media node and its parent
     layout. A two-image pair must remain two independent slots; bodyImageCount
     is intentionally not applied until content remapping is redesigned. */
  media.forEach((slot,n)=>{
    const slotId='baseline-image-'+(n+1),oldCaption=slot.nextElementSibling?.matches?.('.media-note,.media-caption,[data-role=caption],figcaption')?slot.nextElementSibling:null;
    slot.dataset.bodyImageSlot=slotId;slot.dataset.editSection='media';
    let figure=slot.closest('figure.baseline-media-item');
    if(!figure&&p.contentMode==='article'){figure=slot.closest('figure.portable-media');if(figure)figure.classList.add('baseline-media-item');}
    if(!figure){
      figure=doc.createElement('figure');figure.className='baseline-media-item';
      ['media-wide','media-small','media-tall','hero-media','portrait','offset'].forEach(k=>{if(slot.classList.contains(k))figure.classList.add(k)});
      slot.replaceWith(figure);figure.appendChild(slot);
    }
    let caption=figure.querySelector(':scope > figcaption');
    if(!caption){caption=doc.createElement('figcaption');caption.className='baseline-media-caption';caption.textContent=oldCaption?.textContent?.trim()||`图 ${String(n+1).padStart(2,'0')}｜${n===0?'主场景：呈现本节核心内容':'细节：补充人物、材料或环境信息'}`;figure.appendChild(caption)}
    if(oldCaption&&oldCaption!==caption)oldCaption.remove();
    if(p.contentMode==='article')caption.classList.add('baseline-media-caption');
    caption.dataset.bodyImageSlot=slotId+'-caption';caption.dataset.editSection='media';
  });
  // W028 applies the unified sample mapping after structural preparation.
  article.querySelectorAll('h2,h3,.section-head,.chapter-head,.chapter-title').forEach(x=>{(x.closest('section,div')||x).dataset.editSection='headings';});article.querySelectorAll('p,blockquote').forEach(x=>{if(!x.closest('[data-edit-section]'))x.dataset.editSection='body';});const ending=article.querySelector('.ending,[class*=ending],footer');if(ending)ending.dataset.editSection='ending';article.insertAdjacentHTML('beforeend',identityHTML(p));finish028(article,id,p);finishDecorations029(article,id,p,editor);return p;
}
function enhanceHTML(html,id,raw){const p=normalize(raw,id),content=contentFromHTML(html);let out=html.replace('</head>',css(id,p)+'</head>');out=replaceOpeningHTML(out,exactLeadHTML(id,p,false,content));return out.replace(/<\/article>/i,identityHTML(p)+'</article>');}
function leadHTML(id,p,editor,content){return exactLeadHTML(id,p,editor,content||{});}function eyebrowHTML(){return '';}
return {IDS,COPY,HEAD_COPY,defaults,normalize,enhanceDocument,enhanceHTML,leadHTML,identityHTML,eyebrowHTML,css};
});
