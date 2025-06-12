const { JSDOM } = require('jsdom');
const fs = require('fs');

async function loadDom() {
  const html = fs.readFileSync('multiploku_June12B.html', 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  // wait for DOMContentLoaded handlers
  await new Promise(resolve => {
    if (dom.window.document.readyState === 'complete') {
      resolve();
    } else {
      dom.window.addEventListener('load', () => resolve());
    }
  });
  return dom;
}

test('generateGrid beginner creates 16 cells with correct products', async () => {
  const dom = await loadDom();
  dom.window.generateGrid('beginner');
  const grid = dom.window.document.getElementById('game-grid');
  expect(grid.children.length).toBe(16);
  const cells = Array.from(dom.window.cellElements);

  const topFactors = [cells[1].value, cells[2].value, cells[3].value].map(Number);
  const leftFactors = [cells[4].value, cells[8].value, cells[12].value].map(Number);

  for (let r = 1; r <= 3; r++) {
    for (let c = 1; c <= 3; c++) {
      const idx = r * 4 + c;
      const value = Number(cells[idx].value);
      expect(value).toBe(topFactors[c - 1] * leftFactors[r - 1]);
    }
  }
});
