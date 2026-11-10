const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const base = new URL('http://127.0.0.1/');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function checkDistribution() {
  assert.ok(fs.lstatSync(dist).isDirectory(), 'Gere dist/ com node tools/prepare-demo.cjs.');
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(dist, 'style.css'), 'utf8');
  const expected = new Set(['index.html', 'assets/icons/favicon-16.png', 'assets/icons/favicon-48.png', 'assets/icons/favicon-512.png']);
  const references = [
    ...Array.from(html.matchAll(/\b(?:src|href)="([^"]+)"/g), match => match[1]),
    ...Array.from(css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g), match => match[2])
  ];
  for (const reference of references) {
    if (reference.startsWith('#') || /^(https?:|tel:|mailto:|data:)/i.test(reference)) continue;
    assert.ok(!/^[\/\\]|\\/.test(reference), `Caminho local deve ser relativo: ${reference}`);
    const relative = decodeURIComponent(new URL(reference, base).pathname.slice(1));
    expected.add(relative);
  }

  const actual = [];
  let bytes = 0;
  for (const entry of fs.readdirSync(dist, { recursive: true, withFileTypes: true })) {
    if (entry.isDirectory()) continue;
    assert.ok(entry.isFile(), `Entrada não regular em dist/: ${entry.name}`);
    const file = path.join(entry.parentPath, entry.name);
    const relative = path.relative(dist, file).split(path.sep).join('/');
    actual.push(relative);
    const contents = fs.readFileSync(file);
    assert.ok(contents.length && contents.equals(fs.readFileSync(path.join(root, relative))), `Arquivo divergente: ${relative}`);
    bytes += contents.length;
  }
  assert.deepEqual(actual.sort(), [...expected].sort(), 'O inventário de dist/ deve conter apenas os arquivos públicos.');
  console.log(`PASS dist/ (${actual.length} arquivos, ${bytes} bytes)`);
}

async function runBrowserTests() {
  const { chromium } = require(process.env.ODONTO_PLAYWRIGHT_MODULE || 'playwright');
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, base).pathname);
      const file = path.resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
      const type = mime[path.extname(file)];
      if (!file.startsWith(dist + path.sep) || !type) return response.writeHead(404).end();
      const contents = await fs.promises.readFile(file);
      response.writeHead(200, { 'Content-Type': type }).end(contents);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  let browser;
  try {
    const baseURL = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ executablePath: process.env.ODONTO_BROWSER_EXECUTABLE });
    const page = await browser.newPage();
    const shots = path.join(root, 'artifacts', 'release');
    for (const file of ['check-release.js', 'check-content.js']) {
      const test = vm.runInThisContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), { filename: file });
      const result = await test(page, { baseURL, shots });
      assert.equal(result.status, 'PASS', file);
      console.log(file, JSON.stringify(result));
    }
  } finally {
    try {
      if (browser) await browser.close();
    } finally {
      server.close();
    }
  }
}

async function main() {
  checkDistribution();
  if (!process.argv.includes('--static-only')) await runBrowserTests();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
