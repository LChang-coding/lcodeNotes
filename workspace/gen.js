const pptxgen = require('/Users/codeliu/远程仓库笔记/workspace/node_modules/pptxgenjs');
const html2pptx = require('/Users/codeliu/.cc-switch/skills/pptx/scripts/html2pptx');
const sharp = require('/Users/codeliu/远程仓库笔记/workspace/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const OUT = '/Users/codeliu/远程仓库笔记/workspace';
const PPTX_OUT = '/Users/codeliu/远程仓库笔记/AI智能体脚手架系统架构.pptx';

// ── Generate gradients ──
const gradients = [
  ['bg-cover.png', `0B1120`, `131B3A`, `1A1040`, 1440, 810],
  ['bg-section.png', `0B1120`, `131B3A`, `0B1120`, 1440, 810],
];

async function genGradients() {
  for (const [name, c1, c2, c3, w, h] of gradients) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#${c1}"/><stop offset="50%" style="stop-color:#${c2}"/><stop offset="100%" style="stop-color:#${c3}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, name));
  }
  console.log('Gradients generated');
}

// ── HTML slides ──
const darkCSS = `html{background:#0B1120}body{width:720pt;height:405pt;margin:0;padding:0;display:flex;font-family:Arial,sans-serif;color:#F1F5F9}`;

function writeSlide(filename, bodyHTML) {
  const html = `<!DOCTYPE html><html><head><style>${darkCSS}${bodyHTML[0]}</style></head><body>${bodyHTML[1]}</body></html>`;
  fs.writeFileSync(path.join(OUT, filename), html);
}

const [s,bgC,bgS] = ['<img class="bg" src="bg-cover.png" style="position:absolute;top:0;left:0;width:720pt;height:405pt">','<img class="bg" src="bg-section.png" style="position:absolute;top:0;left:0;width:720pt;height:405pt">'];

// S1: Cover
writeSlide('s1.html', [`${s}{position:absolute;top:0;left:0;width:720pt;height:405pt}.content{position:relative;z-index:1;margin:80pt 60pt 0 60pt}.tag{display:inline-block;background:#06B6D4;padding:4pt 16pt;border-radius:4pt;margin-bottom:24pt}.tag p{color:#0B1120;font-size:11pt;font-weight:bold;margin:0}h1{font-size:42pt;line-height:1.2;margin:0 0 12pt 0;color:#FFFFFF}.sub{font-size:15pt;color:#94A3B8;margin:0 0 36pt 0}.line{width:80pt;height:4pt;background:#06B6D4;border-radius:2pt;margin-bottom:28pt}.info p{font-size:11pt;color:#64748B;margin:0}.bottom-right{position:absolute;right:50pt;bottom:40pt}.bottom-right p{font-size:10pt;color:#475569;margin:0;text-align:right}`,
  `<img class="bg" src="bg-cover.png"><div class="content"><div class="tag"><p>AI FRAMEWORK</p></div><h1>AI Agent 智能体<br>脚手架系统架构</h1><p class="sub">基于 Google ADK × Spring AI 的企业级智能体开发框架</p><div class="line"></div><div class="info"><p>技术架构深度解析  |  2026</p></div></div><div class="bottom-right"><p>CONFIDENTIAL</p><p>v2.1.0</p></div>`]);

// S2: Agenda
writeSlide('s2.html', [`.bg{position:absolute;top:0;left:0;width:720pt;height:405pt}.content{position:relative;z-index:1;margin:45pt 50pt 0 50pt}h2{font-size:30pt;color:#FFF;margin:0 0 4pt 0}.accent-line{width:60pt;height:3pt;background:#06B6D4;border-radius:2pt;margin-bottom:28pt}.grid{display:flex;flex-wrap:wrap;gap:18pt}.card{width:195pt;background:#1E293B;border-radius:10pt;padding:20pt 18pt;box-sizing:border-box;border-left:4pt solid #06B6D4}.card h3{font-size:28pt;color:#06B6D4;margin:0 0 6pt 0}.card h4{font-size:13pt;color:#F1F5F9;margin:0 0 4pt 0}.card p{font-size:9pt;color:#94A3B8;margin:0;line-height:1.4}`,
  `<img class="bg" src="bg-section.png"><div class="content"><h2>目录</h2><div class="accent-line"></div><div class="grid"><div class="card"><h3>01</h3><h4>需求背景与技术选型</h4><p>行业痛点、竞品分析、框架选型</p></div><div class="card"><h3>02</h3><h4>系统架构总览</h4><p>分层架构设计、核心模块与执行流程</p></div><div class="card"><h3>03</h3><h4>YML 配置驱动</h4><p>声明式配置、智能体装配与自动加载</p></div><div class="card"><h3>04</h3><h4>规则树责任链模式</h4><p>Handler/Mapper 接口与路由引擎</p></div><div class="card"><h3>05</h3><h4>Agent 工作流编排</h4><p>Sequential / Parallel / Loop 组合</p></div><div class="card"><h3>06</h3><h4>对外接口与对话服务</h4><p>会话/消息/流式传输/触发器</p></div></div></div>`]);

// S3: Background
writeSlide('s3.html', [`.bg{position:absolute;top:0;left:0;width:720pt;height:405pt}.content{position:relative;z-index:1;margin:42pt 50pt 0 50pt}h2{font-size:30pt;color:#FFF;margin:0 0 4pt 0}.al{width:60pt;height:3pt;background:#06B6D4;border-radius:2pt;margin-bottom:20pt}.cols{display:flex;gap:28pt}.col{flex:1}.ct{display:inline-block;padding:3pt 12pt;border-radius:3pt;margin-bottom:12pt}.cr{background:#EF4444}.cg{background:#10B981}.ct p{font-size:10pt;font-weight:bold;margin:0;color:#FFF}.bn{font-size:48pt;font-weight:bold;color:#EF4444;margin:0;line-height:1}.bng{color:#10B981}.sl{font-size:10pt;color:#94A3B8;margin:0 0 16pt 0}.it{margin-bottom:12pt}.it h4{font-size:13pt;color:#F1F5F9;margin:0 0 3pt 0}.it p{font-size:9.5pt;color:#94A3B8;margin:0;line-height:1.5}`,
  `<img class="bg" src="bg-section.png"><div class="content"><h2>需求背景与技术选型</h2><div class="al"></div><div class="cols"><div class="col"><div class="ct cr"><p>行业痛点</p></div><p class="bn">3</p><p class="sl">核心挑战</p><div class="it"><h4>接口碎片化</h4><p>大模型应用通过 HTTP 对接，MCP 服务标准不统一</p></div><div class="it"><h4>重复造轮子</h4><p>每个 AI 项目从零搭建 Agent，缺乏统一脚手架</p></div><div class="it"><h4>竞品加速</h4><p>企业大量转型 AI，市场需要快速交付能力</p></div></div><div class="col"><div class="ct cg"><p>解决方案</p></div><p class="bn bng">3</p><p class="sl">核心技术栈</p><div class="it"><h4>Google ADK</h4><p>智能体编排 — 多 Agent 协同、Runner 执行、Hook 插件</p></div><div class="it"><h4>Spring AI</h4><p>AI 接入层 — 统一 API / Model / Prompt / RAG / Tool</p></div><div class="it"><h4>YML 声明式配置</h4><p>零代码搭建 — 启动自动装配、注册 Spring 容器、即刻服务</p></div></div></div></div>`]);

// S4: Architecture
writeSlide('s4.html', [`.bg{position:absolute;top:0;left:0;width:720pt;height:405pt}.content{position:relative;z-index:1;margin:38pt 50pt 0 50pt}h2{font-size:30pt;color:#FFF;margin:0 0 4pt 0}.al{width:60pt;height:3pt;background:#06B6D4;border-radius:2pt;margin-bottom:12pt}.arch{display:flex;flex-direction:column;gap:4pt;width:410pt}.layer{display:flex;align-items:center;gap:10pt}.ln{width:26pt;height:26pt;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}.ln p{color:#FFF;font-size:10pt;font-weight:bold;margin:0}.l1{background:#6366F1}.l2{background:#06B6D4}.l3{background:#10B981}.l4{background:#F59E0B}.l5{background:#EF4444}.li{flex:1;background:#1E293B;border-radius:7pt;padding:8pt 14pt;border-left:3pt solid #06B6D4}.li h4{font-size:11pt;color:#F1F5F9;margin:0 0 2pt 0}.li p{font-size:8.5pt;color:#94A3B8;margin:0}.arrow{text-align:center}.arrow p{font-size:14pt;color:#475569;margin:0}.fb{position:absolute;right:46pt;top:100pt;width:190pt;background:#1E293B;border-radius:8pt;padding:14pt;border:1pt solid #334155}.fb h4{font-size:11pt;color:#06B6D4;margin:0 0 8pt 0}.step{display:flex;align-items:center;gap:6pt;margin-bottom:3pt}.sd{width:6pt;height:6pt;border-radius:50%;background:#10B981}.step p{font-size:9pt;color:#94A3B8;margin:0}`,
  `<img class="bg" src="bg-section.png"><div class="content"><h2>系统架构总览</h2><div class="al"></div><div class="arch"><div class="layer"><div class="ln l1"><p>1</p></div><div class="li"><h4>接入层 — AI API Node</h4><p>对接 OpenAI 兼容 API，配置 base-url / api-key</p></div></div><div class="arrow"><p>↓</p></div><div class="layer"><div class="ln l2"><p>2</p></div><div class="li"><h4>模型层 — ChatModel Node</h4><p>封装 model + MCP Tool (百度搜索/地图等)</p></div></div><div class="arrow"><p>↓</p></div><div class="layer"><div class="ln l3"><p>3</p></div><div class="li"><h4>智能体层 — Agent Node</h4><p>LLMAgent + instruction + output-key</p></div></div><div class="arrow"><p>↓</p></div><div class="layer"><div class="ln l4"><p>4</p></div><div class="li"><h4>编排层 — AgentWorkflow Node</h4><p>Sequential / Parallel / Loop 三种模式</p></div></div><div class="arrow"><p>↓</p></div><div class="layer"><div class="ln l5"><p>5</p></div><div class="li"><h4>运行层 — Runner Node</h4><p>InMemoryRunner + Session + Event 流式输出</p></div></div></div><div class="fb"><h4>执行流程</h4><div class="step"><div class="sd"></div><p>YML 配置加载</p></div><div class="step"><div class="sd"></div><p>AutoConfig 装配</p></div><div class="step"><div class="sd"></div><p>责任链节点执行</p></div><div class="step"><div class="sd"></div><p>注册 Spring 容器</p></div><div class="step"><div class="sd"></div><p>对外暴露 API 服务</p></div></div></div>`]);

// S5: YML Config
writeSlide('s5.html', [`.bg{position:absolute;top:0;left:0;width:720pt;height:405pt}.content{position:relative;z-index:1;margin:38pt 50pt 0 50pt}h2{font-size:30pt;color:#FFF;margin:0 0 4pt 0}.al{width:60pt;height:3pt;background:#06B6D4;border-radius:2pt;margin-bottom:14pt}.cols{display:flex;gap:20pt}.left{width:340pt}.right{flex:1}.cb{background:#0F172A;border-radius:7pt;padding:12pt 14pt;border:1pt solid #334155;margin-bottom:8pt}.cb h4{font-size:10pt;color:#06B6D4;margin:0 0 7pt 0}.cl{display:flex;margin-bottom:1pt}.cl p{font-size:8pt;margin:0;font-family:Courier New,monospace;color:#E2E8F0;line-height:1.5}.i1{margin-left:12pt}.i2{margin-left:24pt}.key{color:#C084FC}.val{color:#34D399}.feat{margin-bottom:12pt}.feat h4{font-size:12pt;color:#F1F5F9;margin:0 0 3pt 0}.feat p{font-size:9pt;color:#94A3B8;margin:0;line-height:1.5}.bdr{display:flex;gap:5pt;flex-wrap:wrap}.bd{background:#1E293B;border-radius:4pt;padding:3pt 8pt;border:1pt solid #334155}.bd p{font-size:8pt;color:#06B6D4;margin:0}`,
  `<img class="bg" src="bg-section.png"><div class="content"><h2>YML 声明式配置</h2><div class="al"></div><div class="cols"><div class="left"><div class="cb"><h4>agent-config.yml</h4><div class="cl"><p class="key">ai.agent.config.tables.testAgent:</p></div><div class="cl"><p class="i1"><span class="key">app-name:</span> <span class="val">testAgent</span></p></div><div class="cl"><p class="i1"><span class="key">agent-id:</span> <span class="val">100001</span></p></div><div class="cl"><p class="i1"><span class="key">module:</span></p></div><div class="cl"><p class="i2"><span class="key">ai-api.base-url:</span> <span class="val">https://apis...</span></p></div><div class="cl"><p class="i2"><span class="key">chat-model.model:</span> <span class="val">gpt-4.1</span></p></div><div class="cl"><p class="i2"><span class="key">tool-mcp-list:</span></p></div><div class="cl"><p class="i2"><span class="key">- name:</span> <span class="val">baidu-search</span></p></div><div class="cl"><p class="i2"><span class="key">agents:</span></p></div><div class="cl"><p class="i2"><span class="key">- name:</span> <span class="val">CodeWriterAgent</span></p></div><div class="cl"><p class="i2"><span class="key">- name:</span> <span class="val">CodeReviewerAgent</span></p></div><div class="cl"><p class="i2"><span class="key">agent-workflows:</span></p></div><div class="cl"><p class="i2"><span class="key">- type:</span> <span class="val">sequential</span></p></div><div class="cl"><p class="i2"><span class="key">sub-agents:</span> <span class="val">[Writer,Reviewer,Refactorer]</span></p></div></div></div><div class="right"><div class="feat"><h4>三层配置结构</h4><p>应用层 → 智能体描述 → 智能体模块，层层嵌套组织</p></div><div class="feat"><h4>模块化组装</h4><p>ai-api 对接大模型 / chat-model 模型+工具 / agents 子智能体 / agent-workflows 编排</p></div><div class="feat"><h4>自动装配机制</h4><p>@EnableConfigurationProperties → ApplicationReadyEvent 钩子 → 责任链装配 → IOC 单例注册</p></div><div class="bdr"><div class="bd"><p>MCP SSE</p></div><div class="bd"><p>Google ADK</p></div><div class="bd"><p>Spring Boot</p></div><div class="bd"><p>RxJava3</p></div><div class="bd"><p>InMemoryRunner</p></div></div></div></div></div>`]);

// S6: Rule Tree
writeSlide('s6.html', [`.bg{position:absolute;top:0;left:0;width:720pt;height:405pt}.content{position:relative;z-index:1;margin:38pt 50pt 0 50pt}h2{font-size:30pt;color:#FFF;margin:0 0 4pt 0}.al{width:60pt;height:3pt;background:#06B6D4;border-radius:2pt;margin-bottom:12pt}.cols{display:flex;gap:20pt}.left{width:280pt}.right{flex:1}.if{margin-bottom:10pt;background:#1E293B;border-radius:7pt;padding:10pt 14pt;border-left:3pt solid #6366F1}.if h4{font-size:11pt;color:#C084FC;margin:0 0 3pt 0}.if p{font-size:9pt;color:#94A3B8;margin:0;line-height:1.5}.cs{background:#0F172A;border-radius:5pt;padding:6pt 8pt;margin-top:5pt}.cs p{font-size:8pt;font-family:Courier New,monospace;color:#E2E8F0;margin:0;line-height:1.5}.fi{display:flex;gap:7pt;margin-bottom:6pt;align-items:flex-start}.fs{width:20pt;height:20pt;border-radius:50%;background:#10B981;display:flex;align-items:center;justify-content:center;flex-shrink:0}.fs p{color:#FFF;font-size:9pt;font-weight:bold;margin:0}.fsr{background:#F59E0B}.finfo h4{font-size:10pt;color:#F1F5F9;margin:0 0 1pt 0}.finfo p{font-size:8pt;color:#94A3B8;margin:0}.link{text-align:center;margin:1pt 0}.link p{font-size:8pt;color:#475569;margin:0}.bt{font-size:8.5pt;color:#64748B;margin:8pt 0 0 0}`,
  `<img class="bg" src="bg-section.png"><div class="content"><h2>规则树 & 责任链模式</h2><div class="al"></div><div class="cols"><div class="left"><div class="if"><h4>TreeHandler — 执行契约</h4><p>定义"做什么"：apply(request, dynamic) → R</p></div><div class="if"><h4>TreeMapper — 路由契约</h4><p>定义"下一步找谁"：get(request, dynamic) → Handler</p></div><div class="if"><h4>AbstractRouterClass — 整合引擎</h4><p>同时实现 Handler+Mapper，提供 router() 路由和 apply() 模板</p><div class="cs"><p>router() = get() 找节点 → apply() 执行 → defaultHandler 兜底</p></div></div><div class="if"><h4>TreeSupport — 便捷基类</h4><p>空实现 mulitWork() 多线程方法，业务节点按需继承</p></div></div><div class="right"><h4 style="font-size:11pt;color:#F1F5F9;margin:0 0 8pt 0">节点调用链路</h4><div class="fi"><div class="fs"><p>1</p></div><div class="finfo"><h4>TreeFactory.handler()</h4><p>注入 rootNode 作为入口</p></div></div><div class="link"><p>│  apply("订单", ctx)</p></div><div class="fi"><div class="fs fsr"><p>R</p></div><div class="finfo"><h4>rootNode.router()</h4><p>get() 动态分派 → firstNode</p></div></div><div class="link"><p>│</p></div><div class="fi"><div class="fs"><p>2</p></div><div class="finfo"><h4>firstNode.doApply() → router()</h4><p>执行业务逻辑 → get() → secondNode</p></div></div><div class="link"><p>│</p></div><div class="fi"><div class="fs"><p>3</p></div><div class="finfo"><h4>secondNode.doApply() → router()</h4><p>执行业务逻辑 → get() → thirdNode 终节点</p></div></div><div class="link"><p>│</p></div><div class="fi"><div class="fs"><p>✓</p></div><div class="finfo"><h4>thirdNode.doApply()</h4><p>返回结果，逐层回传至调用方</p></div></div><p class="bt">核心：逻辑区 (doApply) 与流转区 (get) 分离，新增节点仅需重写两个方法</p></div></div></div>`]);

// S7: Workflow (with chart placeholder)
writeSlide('s7.html', [`.bg{position:absolute;top:0;left:0;width:720pt;height:405pt}.content{position:relative;z-index:1;margin:38pt 50pt 0 50pt}h2{font-size:30pt;color:#FFF;margin:0 0 4pt 0}.al{width:60pt;height:3pt;background:#06B6D4;border-radius:2pt;margin-bottom:14pt}.tr{display:flex;gap:14pt;margin-bottom:14pt}.card{flex:1;background:#1E293B;border-radius:9pt;padding:14pt;border-top:3pt solid #06B6D4}.card.sq{border-top-color:#6366F1}.card.pr{border-top-color:#10B981}.card.lp{border-top-color:#F59E0B}.card h4{font-size:13pt;color:#F1F5F9;margin:0 0 4pt 0}.card p{font-size:8.5pt;color:#94A3B8;margin:0 0 8pt 0;line-height:1.4}.dgr{display:flex;font-family:Courier New,monospace}.dgr p{font-size:9pt;color:#E2E8F0;margin:0}.tg{display:flex;gap:4pt}.tg .t{background:#0F172A;border-radius:3pt;padding:2pt 7pt}.tg .t p{font-size:7.5pt;color:#C084FC;margin:0}.ca{display:flex;gap:14pt}.clft{width:330pt;background:#1E293B;border-radius:7pt;padding:12pt}.clft h4{font-size:11pt;color:#F1F5F9;margin:0 0 6pt 0}.clft p{font-size:8.5pt;color:#94A3B8;margin:0;line-height:1.5}`,
  `<img class="bg" src="bg-section.png"><div class="content"><h2>Agent 工作流编排</h2><div class="al"></div><div class="tr"><div class="card sq"><h4>Sequential 串行</h4><p>子 Agent 按序执行，前节点 output-key 作为后节点模板变量输入</p><div class="dgr"><p>A → B → C</p></div><div class="tg"><div class="t"><p>代码审查流水线</p></div></div></div><div class="card pr"><h4>Parallel 并行</h4><p>多条链路同时执行，独立任务并发完成后汇总结果</p><div class="dgr"><p>A ↘ / B ↗ 汇总</p></div><div class="tg"><div class="t"><p>多渠道数据采集</p></div></div></div><div class="card lp"><h4>Loop 循环</h4><p>多轮迭代：分析→执行→检测→不通过则重新分析，支持 maxIterations</p><div class="dgr"><p>A→B→检测 ↻</p></div><div class="tg"><div class="t"><p>质量保障闭环</p></div></div></div></div><div class="ca"><div class="clft"><h4>实战：CodePipeline 代码审查流水线</h4><p>CodeWriterAgent 生成代码 → 输出 generated_code。CodeReviewerAgent 审查代码，引用 {generated_code} → 输出 review_comments。CodeRefactorerAgent 根据 {review_comments} 重构 → 输出 refactored_code 最终代码</p></div><div id="chart" class="placeholder" style="width:285pt;height:165pt;background:#1E293B;border-radius:7pt"></div></div></div>`]);

// S8: Summary
writeSlide('s8.html', [`.bg{position:absolute;top:0;left:0;width:720pt;height:405pt}.content{position:relative;z-index:1;margin:38pt 50pt 0 50pt}h2{font-size:30pt;color:#FFF;margin:0 0 4pt 0}.al{width:60pt;height:3pt;background:#06B6D4;border-radius:2pt;margin-bottom:16pt}.cols{display:flex;gap:20pt}.col{flex:1}.col h4{font-size:13pt;color:#06B6D4;margin:0 0 8pt 0}.tk{display:flex;gap:7pt;margin-bottom:8pt;align-items:flex-start}.tn{width:18pt;height:18pt;border-radius:50%;background:#6366F1;display:flex;align-items:center;justify-content:center;flex-shrink:0}.tn p{color:#FFF;font-size:8pt;font-weight:bold;margin:0}.tt p{font-size:9pt;color:#E2E8F0;margin:0;line-height:1.3}.tt .s{font-size:7.5pt;color:#94A3B8}.mb{background:#1E293B;border-radius:7pt;padding:12pt;text-align:center;margin-bottom:7pt}.mb .n{font-size:32pt;font-weight:bold;color:#10B981;margin:0;line-height:1}.mb .l{font-size:9pt;color:#94A3B8;margin:0}.nxt{margin-top:4pt}.nxt h4{font-size:11pt;color:#F59E0B;margin:0 0 5pt 0}.nxt p{font-size:8.5pt;color:#94A3B8;margin:0 0 2pt 0}.ft{position:absolute;bottom:30pt;left:50pt;right:50pt;border-top:1pt solid #334155;padding-top:9pt}.ft p{font-size:8pt;color:#475569;margin:0;text-align:center}`,
  `<img class="bg" src="bg-cover.png"><div class="content"><h2>总结与展望</h2><div class="al"></div><div class="cols"><div class="col"><h4>核心成果</h4><div class="tk"><div class="tn"><p>1</p></div><div class="tt"><p>零代码智能体搭建</p><p class="s">YML 配置 → 自动装配 → 服务，全链路自动化</p></div></div><div class="tk"><div class="tn"><p>2</p></div><div class="tt"><p>规则树引擎解耦</p><p class="s">Handler/Mapper 分离逻辑与流转，节点按需扩展</p></div></div><div class="tk"><div class="tn"><p>3</p></div><div class="tt"><p>多 Agent 灵活编排</p><p class="s">串行/并行/循环三种模式，覆盖复杂业务</p></div></div><div class="tk"><div class="tn"><p>4</p></div><div class="tt"><p>标准化对外接口</p><p class="s">会话管理/消息发送/流式传输/文件对话</p></div></div></div><div class="col"><div class="mb"><p class="n">3x</p><p class="l">开发效率提升</p></div><div class="mb"><p class="n">5</p><p class="l">核心模块解耦层级</p></div><div class="nxt"><h4>后续规划</h4><p>→ MCP 服务市场：更多预集成 Tool</p><p>→ 可视化编排：Web UI 拖拽式工作流</p><p>→ 监控面板：Token/延迟/成功率 Dashboard</p><p>→ 多模态增强：图片/音频/视频支持</p></div></div></div><div class="ft"><p>AI Agent 智能体脚手架  |  CONFIDENTIAL  |  v2.1.0</p></div></div>`]);

console.log('All slides written');

// ── Build PPTX ──
async function build() {
  await genGradients();

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'AI Agent Framework Team';
  pptx.title = 'AI Agent 智能体脚手架系统架构';

  const slideFiles = ['s1.html','s2.html','s3.html','s4.html','s5.html','s6.html','s7.html','s8.html'];

  for (let i = 0; i < slideFiles.length; i++) {
    const file = slideFiles[i];
    console.log(`Processing slide ${i+1}: ${file}`);
    const result = await html2pptx(path.join(OUT, file), pptx);

    // Slide 7: Add chart
    if (i === 6 && result.placeholders.length > 0) {
      const ph = result.placeholders[0];
      result.slide.addChart(pptx.charts.BAR, [{
        name: "处理耗时 (ms)",
        labels: ["CodeWriter", "CodeReviewer", "CodeRefactorer"],
        values: [320, 180, 250]
      }], {
        ...ph,
        barDir: 'bar',
        showTitle: true,
        title: 'Pipeline 各阶段耗时',
        titleColor: 'F1F5F9',
        showLegend: false,
        showCatAxisTitle: true,
        catAxisTitle: 'Agent 节点',
        catAxisTitleColor: '94A3B8',
        showValAxisTitle: true,
        valAxisTitle: '耗时 (ms)',
        valAxisTitleColor: '94A3B8',
        chartColors: ["6366F1", "06B6D4", "10B981"],
        catAxisLabelColor: '94A3B8',
        valAxisLabelColor: '94A3B8',
        dataLabelPosition: 'outEnd',
        dataLabelColor: 'F1F5F9',
        plotArea: { fill: { color: "1E293B" } },
        fill: { color: "1E293B" }
      });
    }
  }

  await pptx.writeFile({ fileName: PPTX_OUT });
  console.log(`PPTX saved to: ${PPTX_OUT}`);
}

build().catch(e => { console.error(e); process.exit(1); });
