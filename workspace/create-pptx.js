const pptxgen = require('pptxgenjs');
const html2pptx = require('/Users/codeliu/.claude/skills/pptx/scripts/html2pptx');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SLIDES_DIR = path.join(__dirname, 'slides');
const OUTPUT = path.join(__dirname, '..', 'AI与未来工作.pptx');

// Color palette (no # for PptxGenJS)
const C = {
  purple: '7C3AED',
  deepPurple: '5B21B6',
  emerald: '10B981',
  darkEmerald: '059669',
  dark: '0B1120',
  darker: '060918',
  white: 'FFFFFF',
  lightGray: 'D1D5DB',
  midGray: '9CA3AF',
  amber: 'F59E0B',
  rose: 'F43F5E',
};

async function rasterizeGradient(filename, color1, color2, angle = 135) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="810">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#${color1}"/>
        <stop offset="100%" style="stop-color:#${color2}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(filename);
  return filename;
}

// --- Create HTML slides ---

// Slide 1: Cover
fs.writeFileSync(path.join(SLIDES_DIR, 's1.html'), `<!DOCTYPE html>
<html><head><style>
html { background: #${C.dark}; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background-image: url('bg-grad.png'); background-size: cover;
  font-family: Arial, sans-serif; display: flex;
}
.left-bar {
  position: absolute; left: 0; top: 0; bottom: 0; width: 8pt;
  background: #${C.emerald};
}
.main { margin: 60pt 80pt; display: flex; flex-direction: column; justify-content: center; }
.tag { margin: 0 0 12pt 0; }
.tag p { color: #${C.emerald}; font-size: 13pt; font-weight: bold; letter-spacing: 3pt; margin: 0; }
h1 { color: #${C.white}; font-size: 42pt; margin: 0 0 16pt 0; line-height: 1.2; }
.subtitle { margin: 0 0 32pt 0; }
.subtitle p { color: #${C.lightGray}; font-size: 16pt; margin: 0; }
.accent-line {
  width: 60pt; height: 4pt; background: #${C.purple}; margin-bottom: 32pt;
}
.footer-info { margin: 0; }
.footer-info p { color: #${C.midGray}; font-size: 10pt; margin: 0; }
</style></head>
<body>
<div class="left-bar"></div>
<div class="main">
  <div class="tag"><p>AI &amp; FUTURE</p></div>
  <h1>人工智能<br>与未来工作</h1>
  <div class="accent-line"></div>
  <div class="subtitle"><p>技术变革如何重塑我们的职业生涯</p></div>
  <div class="footer-info"><p>2026年5月 · 技术趋势报告</p></div>
</div>
</body></html>`);

// Slide 2: AI Technology Evolution (with line chart)
fs.writeFileSync(path.join(SLIDES_DIR, 's2.html'), `<!DOCTYPE html>
<html><head><style>
html { background: #${C.dark}; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #${C.dark}; font-family: Arial, sans-serif; display: flex;
}
.header {
  position: absolute; top: 0; left: 0; right: 0;
  background: #${C.darker};
  padding: 18pt 50pt; border-bottom: 2pt solid #${C.purple};
}
.header h2 { color: #${C.white}; font-size: 22pt; margin: 0; }
.header h2 span { color: #${C.emerald}; }
.content { margin: 75pt 50pt 30pt 50pt; display: flex; gap: 30pt; }
.left { width: 280pt; }
.left h3 { color: #${C.white}; font-size: 16pt; margin: 0 0 10pt 0; }
.left p { color: #${C.lightGray}; font-size: 11pt; line-height: 1.6; margin: 0 0 10pt 0; }
.stats { display: flex; gap: 16pt; margin-top: 14pt; }
.stat-box { background: #${C.darker}; padding: 12pt; border-left: 3pt solid #${C.emerald}; flex: 1; }
.stat-box p { margin: 0; }
.num { font-size: 20pt; font-weight: bold; color: #${C.white}; }
.label { font-size: 9pt; color: #${C.midGray}; }
.right { flex: 1; }
.chart-area {
  width: 330pt; height: 240pt; background: #${C.darker};
  border-radius: 4pt; border: 1pt solid #333;
}
</style></head>
<body>
<div class="header"><h2><span>01</span> &nbsp;AI 技术演进</h2></div>
<div class="content">
  <div class="left">
    <h3>模型能力指数级增长</h3>
    <p>从2018年的GPT-1到2026年的前沿模型，AI在推理、编程和多模态理解方面取得了跨越式进步。</p>
    <div class="stats">
      <div class="stat-box"><p class="num">500x</p><p class="label">计算规模增长</p></div>
      <div class="stat-box"><p class="num">85%</p><p class="label">编码任务通过率</p></div>
      <div class="stat-box"><p class="num">40+</p><p class="label">主流模型发布</p></div>
    </div>
  </div>
  <div class="right">
    <div id="chart" class="placeholder chart-area"></div>
  </div>
</div>
</body></html>`);

// Slide 3: Industry Impact (with bar chart)
fs.writeFileSync(path.join(SLIDES_DIR, 's3.html'), `<!DOCTYPE html>
<html><head><style>
html { background: #${C.dark}; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #${C.dark}; font-family: Arial, sans-serif; display: flex;
}
.header {
  position: absolute; top: 0; left: 0; right: 0;
  background: #${C.darker};
  padding: 18pt 50pt; border-bottom: 2pt solid #${C.emerald};
}
.header h2 { color: #${C.white}; font-size: 22pt; margin: 0; }
.header h2 span { color: #${C.purple}; }
.content { margin: 75pt 50pt 30pt 50pt; display: flex; gap: 30pt; }
.left { flex: 1; }
.left h3 { color: #${C.white}; font-size: 16pt; margin: 0 0 10pt 0; }
.left p { color: #${C.lightGray}; font-size: 11pt; line-height: 1.6; margin: 0 0 14pt 0; }
.insight { background: #${C.darker}; padding: 10pt 14pt; border-radius: 4pt; border-left: 3pt solid #${C.amber}; margin-bottom: 8pt; }
.insight p { margin: 0; color: #${C.white}; font-size: 10pt; }
.insight p b { color: #${C.amber}; }
.right { width: 320pt; }
.chart-area {
  width: 320pt; height: 240pt; background: #${C.darker};
  border-radius: 4pt; border: 1pt solid #333;
}
</style></head>
<body>
<div class="header"><h2><span>02</span> &nbsp;行业影响分布</h2></div>
<div class="content">
  <div class="left">
    <h3>AI 正在重塑每个行业</h3>
    <p>不同行业对AI的采纳速度和应用深度各有不同，技术、金融和医疗领跑本轮变革。</p>
    <div class="insight"><p><b>技术行业</b> — 代码生成与自动化测试已成为标配，开发效率提升40%以上</p></div>
    <div class="insight"><p><b>金融服务</b> — 智能风控与量化交易系统全面升级，人工审核量下降60%</p></div>
    <div class="insight"><p><b>医疗健康</b> — AI辅助诊断准确率达95%，药物研发周期缩短30%-50%</p></div>
  </div>
  <div class="right">
    <div id="chart" class="placeholder chart-area"></div>
  </div>
</div>
</body></html>`);

// Slide 4: Skill Transformation (with pie chart)
fs.writeFileSync(path.join(SLIDES_DIR, 's4.html'), `<!DOCTYPE html>
<html><head><style>
html { background: #${C.dark}; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #${C.dark}; font-family: Arial, sans-serif; display: flex;
}
.header {
  position: absolute; top: 0; left: 0; right: 0;
  background: #${C.darker};
  padding: 18pt 50pt; border-bottom: 2pt solid #${C.purple};
}
.header h2 { color: #${C.white}; font-size: 22pt; margin: 0; }
.header h2 span { color: #${C.emerald}; }
.content { margin: 75pt 50pt 30pt 50pt; display: flex; gap: 30pt; }
.left { flex: 1; }
.left h3 { color: #${C.white}; font-size: 16pt; margin: 0 0 10pt 0; }
.left p { color: #${C.lightGray}; font-size: 11pt; line-height: 1.6; margin: 0 0 14pt 0; }
.skill-list { margin: 0; }
.skill-list ul { list-style: none; padding: 0; margin: 0; }
.skill-list li { color: #${C.lightGray}; font-size: 11pt; margin-bottom: 6pt; padding-left: 14pt; }
.right { width: 300pt; }
.chart-area {
  width: 300pt; height: 240pt; background: #${C.darker};
  border-radius: 4pt; border: 1pt solid #333;
}
</style></head>
<body>
<div class="header"><h2><span>03</span> &nbsp;技能转型趋势</h2></div>
<div class="content">
  <div class="left">
    <h3>未来最受欢迎的五大能力</h3>
    <p>到2030年，全球将有超过10亿个工作岗位因AI而发生根本性变化。复合型人才将成为最稀缺的资源。</p>
    <div class="skill-list"><ul>
      <li>AI 系统思维与提示工程</li>
      <li>跨领域问题解决能力</li>
      <li>数据素养与分析思维</li>
      <li>创造力与战略思维</li>
      <li>人机协作与伦理判断</li>
    </ul></div>
  </div>
  <div class="right">
    <div id="chart" class="placeholder chart-area"></div>
  </div>
</div>
</body></html>`);

// Slide 5: Future Outlook (closing)
fs.writeFileSync(path.join(SLIDES_DIR, 's5.html'), `<!DOCTYPE html>
<html><head><style>
html { background: #${C.dark}; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background-image: url('bg-grad.png'); background-size: cover;
  font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center;
}
.left-bar {
  position: absolute; left: 0; top: 0; bottom: 0; width: 8pt;
  background: #${C.purple};
}
.main { text-align: center; margin: 40pt 100pt; }
.tag { margin: 0 0 16pt 0; }
.tag p { color: #${C.emerald}; font-size: 13pt; font-weight: bold; letter-spacing: 3pt; margin: 0; }
h1 { color: #${C.white}; font-size: 36pt; margin: 0 0 20pt 0; }
.divider { width: 80pt; height: 4pt; background: #${C.emerald}; margin: 0 auto 24pt auto; }
.big-p { color: #${C.lightGray}; font-size: 14pt; line-height: 1.7; margin: 0 0 28pt 0; }
.grid { display: flex; gap: 20pt; justify-content: center; }
.card { width: 160pt; background: rgba(255,255,255,0.05); padding: 20pt 16pt; border-radius: 4pt; text-align: center; }
.card h3 { color: #${C.white}; font-size: 13pt; margin: 0 0 8pt 0; }
.card p { color: #${C.midGray}; font-size: 10pt; line-height: 1.5; margin: 0; }
</style></head>
<body>
<div class="left-bar"></div>
<div class="main">
  <div class="tag"><p>LOOKING AHEAD</p></div>
  <h1>拥抱智能时代</h1>
  <div class="divider"></div>
  <div class="big-p"><p>AI 不是替代人类，而是放大每个人的潜能。<br>适应变化、持续学习、保持好奇心——是面向未来最好的策略。</p></div>
  <div class="grid">
    <div class="card">
      <h3>学习</h3>
      <p>拥抱终身学习，建立 AI 时代的知识体系</p>
    </div>
    <div class="card">
      <h3>适应</h3>
      <p>灵活调整职业路径，利用 AI 工具提升效率</p>
    </div>
    <div class="card">
      <h3>创造</h3>
      <p>专注于人类独有的创造力、判断力与共情能力</p>
    </div>
  </div>
</div>
</body></html>`);

console.log('HTML slides created.');

// --- Generate PPTX ---
async function main() {
  // 1. Rasterize gradient background
  const bgPath = path.join(SLIDES_DIR, 'bg-grad.png');
  await rasterizeGradient(bgPath, C.dark, '1E1145');

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'AI Research';
  pptx.title = 'AI与未来工作';

  // Slide 1: Cover
  await html2pptx(path.join(SLIDES_DIR, 's1.html'), pptx);

  // Slide 2: Line Chart — AI capability growth
  const { slide: s2, placeholders: p2 } = await html2pptx(path.join(SLIDES_DIR, 's2.html'), pptx);
  s2.addChart(pptx.charts.LINE, [{
    name: '推理能力 (MMLU)',
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    values: [35, 42, 55, 62, 70, 78, 85, 89, 93]
  }, {
    name: '编码能力 (HumanEval)',
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    values: [12, 18, 28, 40, 52, 65, 75, 82, 88]
  }], {
    ...p2[0],
    showTitle: false,
    showLegend: true,
    legendPos: 'b',
    lineSize: 3,
    lineSmooth: true,
    showCatAxisTitle: true,
    catAxisTitle: '年份',
    showValAxisTitle: true,
    valAxisTitle: '得分 (%)',
    valAxisMinVal: 0,
    valAxisMaxVal: 100,
    valAxisMajorUnit: 20,
    chartColors: [C.emerald, C.purple],
    catAxisLabelColor: C.lightGray,
    valAxisLabelColor: C.lightGray,
    catAxisTitleColor: C.lightGray,
    valAxisTitleColor: C.lightGray,
    legendColor: C.lightGray,
    plotArea: { fill: { color: C.darker } },
  });

  // Slide 3: Bar Chart — Industry AI adoption
  const { slide: s3, placeholders: p3 } = await html2pptx(path.join(SLIDES_DIR, 's3.html'), pptx);
  s3.addChart(pptx.charts.BAR, [{
    name: 'AI采纳率 (%)',
    labels: ['技术', '金融', '医疗', '制造', '零售', '教育', '农业', '能源'],
    values: [78, 65, 58, 45, 40, 32, 22, 18]
  }], {
    ...p3[0],
    barDir: 'bar',
    showTitle: false,
    showLegend: false,
    showCatAxisTitle: true,
    catAxisTitle: '行业',
    showValAxisTitle: true,
    valAxisTitle: 'AI 采纳率 (%)',
    valAxisMinVal: 0,
    valAxisMaxVal: 90,
    valAxisMajorUnit: 20,
    chartColors: [C.emerald],
    catAxisLabelColor: C.lightGray,
    valAxisLabelColor: C.lightGray,
    catAxisTitleColor: C.lightGray,
    valAxisTitleColor: C.lightGray,
    plotArea: { fill: { color: C.darker } },
    dataLabelPosition: 'outEnd',
    dataLabelColor: C.lightGray,
    dataLabelFontSize: 9,
  });

  // Slide 4: Pie Chart — Skill demand distribution
  const { slide: s4, placeholders: p4 } = await html2pptx(path.join(SLIDES_DIR, 's4.html'), pptx);
  s4.addChart(pptx.charts.PIE, [{
    name: '技能需求分布',
    labels: ['AI/ML 工程', '数据科学', '产品管理', '创意设计', '人机交互'],
    values: [32, 25, 18, 15, 10]
  }], {
    ...p4[0],
    showPercent: true,
    showLegend: true,
    legendPos: 'b',
    chartColors: [C.purple, C.emerald, C.amber, C.rose, C.midGray],
    legendColor: C.lightGray,
    plotArea: { fill: { color: C.darker } },
  });

  // Slide 5: Closing
  await html2pptx(path.join(SLIDES_DIR, 's5.html'), pptx);

  await pptx.writeFile({ fileName: OUTPUT });
  console.log('Done:', OUTPUT);
}

main().catch(e => { console.error(e); process.exit(1); });
