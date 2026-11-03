// Smoke test da rodada de release; executar pelo Playwright MCP.
async (page) => {
  const browser = await page.context().browser().browserType().launch({ executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe', headless: true });
  const checks = [];
  const check = (ok, name) => { if (!ok) throw Error(name); checks.push(name); };
  const shots = 'C:/Users/lulu uwu/Documents/ChatGPT/odonto-wiener/artifacts/release/';
  try {
    const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await p.addInitScript(() => { window.endedFiles = []; document.addEventListener('ended', e => { if (e.target.tagName === 'VIDEO') window.endedFiles.push(e.target.getAttribute('src').split('/').pop()); }, true); });
    await p.goto('http://127.0.0.1:4173');
    check((await p.locator('h1').innerText()).includes('Há 15 anos'), 'Hero dos 15 anos preservado');
    check(await p.locator('.team article').count() === 4 && !(await p.locator('.team').innerText()).includes('Igor') && (await p.locator('.team').innerText()).includes('CRO/RS 26040'), 'Equipe e registros preservados');
    const carousel = p.locator('.history > .carousel');
    await carousel.scrollIntoViewIfNeeded();
    await carousel.hover();
    await p.waitForFunction(() => document.querySelector('.is-active video').currentTime > .1);
    check(await p.locator('.history').evaluate(e => getComputedStyle(e).columnGap === '120px'), 'Espaçamento desktop de 120 px');
    await p.waitForFunction(() => document.querySelector('.is-active video').getAttribute('data-src').includes('2_sala') && document.querySelector('.is-active video').currentTime > 6.7, null, { timeout: 20000 });
    check(await p.locator('.is-active video').evaluate(v => Math.abs(v.duration - 7) < .05 && !v.paused), 'Nícia: sete segundos, reprodução até a logo com cursor sobre o vídeo');
    await carousel.screenshot({ path: shots + 'nicia-logo.png' });
    await p.waitForFunction(() => window.endedFiles.length >= 5 && document.querySelector('.is-active').getAttribute('aria-label') === '1 de 5', null, { timeout: 20000 });
    check((await p.evaluate(() => window.endedFiles)).join('|') === '1_recepcao.mp4|2_sala_nicia.mp4|3_segunda_recepcao.mp4|4_sala_operacao_marcelo.mp4|5_sala_operacao_secundaria.mp4', 'Ciclo completo e loop com cursor mantido sobre a mídia');
    check(await carousel.locator('figcaption,.carousel-controls,.autoplay-toggle').count() === 0, 'Carrossel clean preservado');
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await p.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.paused));
    check(true, 'Movimento reduzido interrompe reprodução');
    await p.locator('.map-embed').scrollIntoViewIfNeeded();
    await p.frameLocator('.map-embed iframe').getByRole('region', { name: 'Mapa', exact: true }).first().waitFor({ timeout: 20000 });
    check((await p.locator('.map-embed iframe').getAttribute('src')).includes('707'), 'Mapa interativo no endereço confirmado');
    check(await p.locator('[data-whatsapp]').evaluateAll(es => es.every(e => new URL(e.href).pathname === '/5553981298471' && new URL(e.href).searchParams.get('text'))), 'Links e mensagens WhatsApp');
    for (const width of [1440, 390]) {
      await p.setViewportSize({ width, height: 1000 });
      for (const id of ['#tratamentos', '#equipe', '.footer']) await p.locator(id).scrollIntoViewIfNeeded();
      await p.waitForFunction(() => [...document.images].every(e => e.complete && e.naturalWidth > 0));
      check(await p.evaluate(() => document.documentElement.scrollWidth === innerWidth), width + ': sem overflow e imagens carregadas');
      await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await p.screenshot({ path: shots + 'page-' + width + '.png', fullPage: true });
    }
    const icons = await p.evaluate(async () => {
      const results = [];
      for (const size of [16, 32]) {
        const image = new Image(); image.src = 'assets/icons/favicon-' + size + '.png'; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0); const pixels = ctx.getImageData(0, 0, size, size).data;
        results.push({ size, ok: image.width === size && pixels[3] === 0 && [...pixels].some((v, i) => i % 4 === 3 && v > 128) });
      }
      const preview = document.createElement('div'); preview.id = 'favicon-preview'; preview.style.cssText = 'position:fixed;inset:0;z-index:999;background:#173652;display:flex;align-items:center;justify-content:center;gap:50px';
      preview.innerHTML = '<img src="assets/icons/favicon-16.png" width="16" height="16"><img src="assets/icons/favicon-32.png" width="32" height="32">'; document.body.append(preview);
      return results;
    });
    check(icons.every(i => i.ok), 'PNG 16/32 com transparência e símbolo presente');
    const ico = await (await p.request.get('http://127.0.0.1:4173/assets/icons/favicon.ico')).body();
    check(ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) === 3, 'ICO contém três dimensões');
    await p.locator('#favicon-preview').screenshot({ path: shots + 'favicon-preview.png' });
    check(errors.length === 0, 'Sem erros de console/JavaScript');
    return { status: 'PASS', browser: 'Brave ' + browser.version(), checks };
  } finally { await browser.close(); }
}
