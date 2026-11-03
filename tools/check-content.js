// Verificação rápida do pacote final, por Playwright MCP (servidor dist na porta 4174).
async (page) => {
  const browser = await page.context().browser().browserType().launch({ executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe', headless: true });
  const results = [];
  const check = (ok, name) => { if (!ok) throw Error(name); results.push(name); };
  try {
    for (const width of [390,1440]) {
      const p = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      p.on('pageerror', e => errors.push(e.message));
      p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      p.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
      await p.goto('http://127.0.0.1:4174');
      const body = await p.locator('body').innerText();
      check(!/a confirmar|pendentes?|em breve|placeholder|\bTODO\b|a inserir|integração futura|provisório/i.test(body), width + ': sem avisos provisórios');
      check(await p.locator('a').evaluateAll(es => es.every(a => {
        const href = a.getAttribute('href');
        return href && (href.startsWith('#') ? !!document.getElementById(href.slice(1)) : /^(https:|tel:)/.test(href));
      })), width + ': links principais com destinos reais');
      for (const id of ['#tratamentos','#equipe','.footer','#clinica']) await p.locator(id).scrollIntoViewIfNeeded();
      await p.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
      await p.locator('.carousel').hover();
      await p.waitForFunction(() => document.querySelector('.is-active video').currentTime > .1);
      check(true, width + ': imagens e vídeo carregados');
      await p.locator('.map-embed').scrollIntoViewIfNeeded();
      await p.frameLocator('.map-embed iframe').getByRole('region', { name: 'Mapa', exact: true }).first().waitFor({ timeout: 20000 });
      check(await p.evaluate(() => document.documentElement.scrollWidth === innerWidth), width + ': layout sem overflow e mapa carregado');
      check(await p.locator('[data-whatsapp]').evaluateAll(es => es.length === 7 && es.every(a => a.href.startsWith('https://wa.me/5553981298471?text='))), width + ': sete links de WhatsApp preservados');
      check(errors.length === 0, width + ': sem erros de console, JS ou HTTP');
      await p.close();
    }
    return { status: 'PASS', browser: 'Brave ' + browser.version(), results };
  } finally { await browser.close(); }
}
