// Smoke test da rodada de release. Executar pelo Playwright MCP ou com uma página Playwright.
async (page, { baseURL = 'http://127.0.0.1:4173', shots = 'artifacts/release' } = {}) => {
  const browser = page.context().browser();
  const checks = [];
  const check = (ok, name) => { if (!ok) throw Error(name); checks.push(name); };
  const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  try {
    await p.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    check((await p.locator('h1').innerText()).includes('Há 15 anos'), 'Hero dos 15 anos preservado');
    const team = await p.locator('.team article').evaluateAll(cards => cards.map(card => [
      card.querySelector('h3').textContent,
      card.querySelector('p').firstChild.textContent,
      card.querySelector('.professional-registration')?.textContent ?? '',
      card.querySelector('img').getAttribute('src').split('/').pop()
    ]));
    check(JSON.stringify(team) === JSON.stringify([
      ['Dr. Marcelo Wiener', 'Ortodontia • Invisalign Doctor', 'CRO/RS 12980', 'marcelo_wiener.jpg'],
      ['Nícia Wiener', 'Psicologia', 'CRP/RS 07/41467', 'nicia_wiener.jpg'],
      ['Luciara', 'Recepcionista', '', 'luciara.jpg'],
      ['Dra. Paula Menezes', 'Endodontia e Harmonização Facial', 'CRO/RS 26040', 'paula.jpg'],
      ['Dr. Igor Guimarães', 'Cirurgia Bucomaxilofacial e Implantodontia', 'CRO/RS 25036', 'igor-web.jpg']
    ]), 'Ordem, nomes, fotos, especialidades e registros da equipe');

    const carousel = p.locator('.history > .carousel');
    const active = carousel.locator('.slide.is-active');
    const current = async () => active.getAttribute('aria-label');
    const orderedPhotos = [
      '1-fachada.jpeg', '2-recepção (entrada).jpeg', '3-consultorionicia (2).jpeg',
      '4-consultorionicia.jpeg', '5-recepção2 quadros.jpeg', '6-recepção2.jpeg'
    ];
    check(await p.locator('.history').evaluate(e => getComputedStyle(e).columnGap === '120px'), 'Espaçamento desktop da História');
    check(await carousel.locator('button, [role="button"], .dots, figcaption, video').count() === 0, 'Carrossel sem controles e legendas');
    const filenames = await carousel.locator('img').evaluateAll(images => images.map(img => decodeURIComponent(img.src.split('/').pop())));
    check(JSON.stringify(filenames) === JSON.stringify(orderedPhotos), 'Seis fotos na ordem numerada');
    check(await current() === '1 de 6', 'Primeira foto inicial');
    check(await active.evaluate(e => parseFloat(getComputedStyle(e).transitionDuration) > 0), 'Transição entre as fotos');
    await carousel.evaluate(element => {
      window.carouselChanges = [];
      let previous = element.querySelector('.is-active');
      new MutationObserver(() => {
        const current = element.querySelector('.is-active');
        if (current === previous) return;
        window.carouselChanges.push(current.getAttribute('aria-label'));
        previous = current;
      }).observe(element, { subtree: true, attributes: true, attributeFilter: ['class'] });
    });
    await carousel.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const initialSize = await carousel.boundingBox();
    await p.mouse.move(initialSize.x + initialSize.width / 2, initialSize.y + initialSize.height / 2);
    check(await carousel.evaluate(element => element.matches(':hover')), 'Mouse sobre a foto durante o autoplay');
    for (const [index, position] of [2, 3, 4, 5, 6, 1].entries()) {
      const label = position + ' de 6';
      await p.waitForFunction(({ index, label }) => window.carouselChanges[index] === label, { index, label }, { timeout: 9000 });
      check(true, 'Avanço automático para a foto ' + position);
      const size = await carousel.boundingBox();
      check(size.width === initialSize.width && size.height === initialSize.height, 'Tamanho estável na foto ' + position);
    }
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await carousel.press('Home');
    await p.waitForTimeout(4400);
    check(await current() === '1 de 6' && await active.evaluate(e => getComputedStyle(e).transitionDuration === '0s'), 'Movimento reduzido desativa autoplay e transições');
    await carousel.focus();
    for (const [key, label] of [['ArrowLeft', '6 de 6'], ['Home', '1 de 6'], ['ArrowRight', '2 de 6'], ['End', '6 de 6']]) {
      await p.keyboard.press(key);
      check(await current() === label, 'Navegação por ' + key);
    }
    check((await carousel.locator('[data-slide-status]').textContent()).includes('6 de 6')
      && await carousel.locator('.slide[aria-hidden="true"]').count() === 5, 'Anúncio acessível e ocultação dos slides inativos');

    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    try {
      touch.on('pageerror', e => errors.push(e.message));
      await touch.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const photos = touch.locator('.slides');
      await photos.scrollIntoViewIfNeeded();
      const box = await photos.boundingBox();
      const center = { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) };
      const cdp = await touch.context().newCDPSession(touch);
      const send = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints });
      await send('touchStart', [{ x: center.x + 65, y: center.y }]);
      for (let shift = 45; shift >= -65; shift -= 22) await send('touchMove', [{ x: center.x + shift, y: center.y }]);
      await send('touchEnd', []);
      check(await touch.locator('.slide.is-active').getAttribute('aria-label') === '2 de 6', 'Deslize em tela de toque');
      await send('touchStart', [{ x: center.x - 65, y: center.y }]);
      for (let shift = -45; shift <= 65; shift += 22) await send('touchMove', [{ x: center.x + shift, y: center.y }]);
      await send('touchEnd', []);
      check(await touch.locator('.slide.is-active').getAttribute('aria-label') === '1 de 6', 'Deslize de volta em tela de toque');
    } finally { await touch.close(); }

    const map = p.locator('.map-embed iframe');
    await map.scrollIntoViewIfNeeded();
    await p.frameLocator('.map-embed iframe').getByRole('region', { name: 'Mapa', exact: true }).first().waitFor({ timeout: 20000 });
    check((await map.getAttribute('src')).includes('707'), 'Mapa interativo no endereço preservado');
    check(await p.locator('[data-whatsapp]').evaluateAll(es => es.every(e => new URL(e.href).pathname === '/5553981298471' && new URL(e.href).searchParams.get('text'))), 'Links e mensagens de WhatsApp');
    await p.locator('img[loading="lazy"]').evaluateAll(images => images.forEach(img => { img.loading = 'eager'; }));
    await p.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
    for (const [width, expectedRows] of [[1440, [5]], [1024, [3, 2]], [768, [3, 2]], [430, [1, 1, 1, 1, 1]], [390, [1, 1, 1, 1, 1]], [375, [1, 1, 1, 1, 1]], [320, [1, 1, 1, 1, 1]]]) {
      await p.setViewportSize({ width, height: 1000 });
      const rows = await p.locator('.team article').evaluateAll(cards => {
        const byTop = Map.groupBy(cards, card => card.offsetTop);
        return [...byTop.values()].map(row => row.length);
      });
      check(JSON.stringify(rows) === JSON.stringify(expectedRows), width + ': distribuição da equipe ' + expectedRows.join(' + '));
      check(await p.evaluate(() => document.documentElement.scrollWidth === innerWidth), width + ': sem overflow horizontal');
      check(await p.locator('.treatments article').evaluateAll(cards => cards.every(card => card.scrollWidth <= card.clientWidth)), width + ': tratamentos sem overflow');
      if (width === 1440 || width === 1024) {
        check(await p.locator('.treatments article > p').evaluateAll(paragraphs => paragraphs.every(p => p.offsetTop === paragraphs[0].offsetTop)), width + ': descrições dos tratamentos alinhadas');
      }
      if (width <= 430) {
        check(await p.locator('.team img').evaluateAll(images => images.every(img => img.clientHeight <= 260)), width + ': retratos com altura limitada');
      }
      if (width === 390) {
        const menu = p.getByRole('button', { name: 'Menu' });
        await menu.click();
        check(await p.locator('#navegacao').isVisible() && await menu.getAttribute('aria-expanded') === 'true', 'Menu mobile abre');
        await p.keyboard.press('Escape');
        check(!await p.locator('#navegacao').isVisible() && await menu.evaluate(el => el === document.activeElement), 'Menu mobile fecha e devolve o foco');
      }
      if ([1440, 390, 320].includes(width)) {
        check(await p.locator('.treatment-photo, .slide img').evaluateAll(images => images.every(img => {
          const box = img.getBoundingClientRect();
          const parent = img.parentElement.getBoundingClientRect();
          return getComputedStyle(img).objectFit === 'cover' && box.width === parent.width && box.height === parent.height;
        })), width + ': fotos preenchem a área sem distorção');
        await carousel.press('Home');
        await p.evaluate(() => document.activeElement.blur());
        await map.scrollIntoViewIfNeeded();
        await p.screenshot({ path: shots + '/page-' + width + '.png', fullPage: true });
      }
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
    const ico = await (await p.request.get(new URL('/assets/icons/favicon.ico', baseURL).href)).body();
    check(ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) === 3, 'ICO contém três dimensões');
    await p.locator('#favicon-preview').screenshot({ path: shots + '/favicon-preview.png' });
    check(errors.length === 0, 'Sem erros de console ou JavaScript: ' + errors.join(' | '));
    return { status: 'PASS', browser: browser.version(), checks };
  } finally { await p.close(); }
}
