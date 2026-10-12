---
name: monochrome-order-layout
description: 按用户在网站确认的黑白留白秩序风格排版新文章；不重设计，不生图，不连接微信。
---

# 黑白留白秩序 · 个人公众号风格
本包将网站微调后的规则和同一份渲染器带走。运行要求 Node.js 18+ 与本机 Chrome/Edge/Chromium，零 npm 依赖，无网络调用。

## 先读再执行
1. 读取 config/style-profile.json、input/article.json 和 reference/calibration.json。
2. 保存用户原文与段落含义；仅识别真实标题、导语、章节、引用、列表和已有重点。没有的内容不要添加。没有英文标签时省略，不复制样稿英文。
3. 将用户文章整理成 input/article.json 的字段结构。小标题可留空；纯文字也放入 sections 的 blocks。每个 paragraph 对应原文一段，quote/statement/list 仅在确有语义时使用。最多每章一处独立强调；不要凭空提炼引语。
4. 用户图片按上下文对应位置放进 image 或 images。两张相关图才并列；多图按双图、单图顺序展开。无图不建占位，不生成图片，不下载外链。图片放在文章 JSON 所在目录或子目录中。PNG/JPEG/WebP，单张≤3MB。
5. 按 README 运行 scripts/render-article.cjs。不要手写第二份CSS、替换字体系统、擅改标题字重或重排已确认的模板。
6. 浏览器打开 output/article-preview.html。核对标题、段落、图文对应、无空槽及无横向溢出；有失败先修数据，不擅自换模板。
7. 将HTML和输入稿交用户。微信后台连接、转换和发布由用户独立选择的工具处理，不在本包职责内。

## 文本规则
字符串中的换行表示明确换行，**词句** 表示用户已有重点。其他HTML按纯文字处理，不执行。title必填；sections数组必填。每章 blocks 支持 paragraph / quote / statement / list / image / images，参照两个样例。结尾由用户配置，不编造个人资料。

## 不能把校准图当文章
reference/current-style-sample.html 仅作外观校准。--calibration 只用于与样张回归，会显示图片和二维码占位，不用于真实交付。正常运行无图自动删除图槽；缺少真实二维码时去掉扫码组，保留自然结尾与自定义签名。

## 工作流与失败路径
~~~mermaid
flowchart LR
 A["用户原文与自有图片"] --> B["读取固定风格配置"]
 B --> C["AI整理语义JSON 不重写原文"]
 C --> D["Node同源渲染"]
 D --> E{"原文完整与视觉检查"}
 E -->|内容或格式错误| C
 E -->|配置错误| B
 E -->|通过| F["交付HTML与数据 不连接后台"]
~~~

视觉校准：reference/current-style-sample.html。本包不保证任意第三方AI自由生成达到固定百分比；稳定来自按既定JSON和共享渲染器执行。微信后台样式转换未在本包内验收。


## v3 正式交付合同
读取 SKILL.md、config/style-profile.json 和输入示例，调用包内原渲染器；禁止把v3重解释成旧版colors/semanticSlots或手写另一套CSS。
完整保留 templateId、settings.primary/soft/emphasis/paper、titleSize/titleWeight、headingSize/numbers、正文343px及endingTitle/endingNote/signature/qr。请核对 render-report.json 和实际渲染；不能只检查退出码。
正文是 output/article-fragment.html；output/article-preview.html 只供浏览器看图；output/render-report.json 是身份/哈希/诊断，不能当正文。无图不造图槽，无二维码不造联系方式。
wechatpublish导入v3后必须使用随Skill携带的同源模板渲染器。不转换为经典模板；未知schema或模板应停止。纯文本/Markdown先整理为语义JSON，原文不改写。
真实微信后台兼容 not-verified；不得把浏览器预览当发布验证。推草稿必须另行明确授权，本交付不授权推送。
