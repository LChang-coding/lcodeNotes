const pptxgen = require('pptxgenjs');
const html2pptx = require('/Users/codeliu/.claude/skills/pptx/scripts/html2pptx');

async function build() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Claude Code';
  pptx.title = 'PPTX Skill 验证演示';

  await html2pptx('/Users/codeliu/远程仓库笔记/workspace/slides/slide1.html', pptx);
  await html2pptx('/Users/codeliu/远程仓库笔记/workspace/slides/slide2.html', pptx);
  await html2pptx('/Users/codeliu/远程仓库笔记/workspace/slides/slide3.html', pptx);

  await pptx.writeFile({ fileName: '/Users/codeliu/远程仓库笔记/test-demo.pptx' });
  console.log('Done: test-demo.pptx');
}

build().catch(e => { console.error(e); process.exit(1); });
