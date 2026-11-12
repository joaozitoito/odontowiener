// Verificação do conteúdo público. Executar pelo Playwright MCP ou com uma página Playwright.
async (page, { baseURL = 'http://127.0.0.1:4174' } = {}) => {
  const browser = page.context().browser();
  const results = [];
  const check = (ok, name) => { if (!ok) throw Error(name); results.push(name); };
  const treatments = [
    ['01 Aparelhos e Alinhadores Ortodônticos', 'Opções de tratamento ortodôntico com aparelhos fixos ou alinhadores, definidas após avaliação e planejamento individual.', 'aparelhos-e-alinhadores-ortodonticos', 'Olá! Gostaria de saber mais sobre aparelhos e alinhadores ortodônticos.'],
    ['02 Clareamento Dental', 'O clareamento é indicado após avaliação profissional, considerando a saúde bucal e os objetivos de cada paciente.', 'clareamento-dental', 'Olá! Gostaria de saber mais sobre clareamento dental.'],
    ['03 Facetas em Resina ou Porcelana', 'Alternativas para modificar forma e cor dos dentes, avaliadas individualmente conforme as necessidades de cada sorriso.', 'facetas-em-resina-ou-porcelana', 'Olá! Gostaria de saber mais sobre facetas em resina ou porcelana.'],
    ['04 Implantes Dentários', 'Tratamentos com implantes dentários planejados individualmente para reabilitação oral, após avaliação clínica.', 'implantes-dentarios', 'Olá! Gostaria de saber mais sobre implantes dentários.'],
    ['05 Próteses Removíveis', 'Próteses planejadas para substituir dentes ausentes e apoiar conforto e função, conforme avaliação profissional.', 'proteses-removiveis', 'Olá! Gostaria de saber mais sobre próteses removíveis.'],
    ['06 Tratamento de Canal', 'Tratamento endodôntico voltado à preservação do dente natural e ao cuidado com sua saúde.', 'tratamento-de-canal', 'Olá! Gostaria de saber mais sobre o tratamento de canal.']
  ];
  const photos = ['aparelhos-e-alinhadores-ortodonticos.jpg', 'clareamento-dental.jpg', 'facetas-em-resina-ou-porcelana.jpg', 'implantes-dentarios.jpg', 'proteses-removiveis.jpg', 'tratamento-canal-web.jpg'];
  for (const width of [320, 390, 1440]) {
    const p = await browser.newPage({ viewport: { width, height: 1000 } });
    try {
      const errors = [];
      p.on('pageerror', e => errors.push(e.message));
      p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      p.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
      await p.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const body = await p.locator('body').innerText();
      check(!/a confirmar|pendentes?|em breve|placeholder|\bTODO\b|a inserir|integração futura|provisório/i.test(body), width + ': sem avisos internos');
      check(await p.locator('a').evaluateAll(es => es.every(a => {
        const href = a.getAttribute('href');
        return href && (href.startsWith('#') ? !!document.getElementById(href.slice(1)) : /^(https:|tel:)/.test(href));
      })), width + ': links principais com destinos reais');

      const cards = p.locator('.treatments article');
      check(await cards.count() === treatments.length, width + ': seis tratamentos');
      for (const [index, [title, description, key, message]] of treatments.entries()) {
        const card = cards.nth(index);
        check(await card.locator('h3').textContent() === title && await card.locator('p').textContent() === description, width + ': ' + title);
        const photo = card.locator('img');
        check(await photo.getAttribute('src') === 'assets/images/' + photos[index] && !!await photo.getAttribute('alt'), width + ': foto real com descrição em ' + key);
        const link = card.locator('a');
        const url = new URL(await link.getAttribute('href'));
        check(await link.getAttribute('data-whatsapp') === key && url.searchParams.get('text') === message, width + ': mensagem de ' + key);
      }
      check(await p.locator('[data-whatsapp]').evaluateAll(es => es.length === 10 && es.every(a => {
        const url = new URL(a.href);
        return url.origin === 'https://wa.me' && url.pathname === '/5553981298471'
          && (a.dataset.whatsapp || url.searchParams.get('text') === 'Olá! Gostaria de conversar sobre o agendamento de uma consulta.')
          && a.target === '_blank' && a.relList.contains('noopener') && a.relList.contains('noreferrer');
      })), width + ': dez links de WhatsApp e destino preservados');
      if (width > 800) {
        const viewport = p.locator('[data-treatment-viewport]');
        const previous = p.locator('[data-treatment-prev]');
        const next = p.locator('[data-treatment-next]');
        check(await previous.isDisabled() && await next.isEnabled(), width + ': controles iniciam na primeira página');
        await next.click();
        await p.waitForFunction(() => !document.querySelector('[data-treatment-prev]').disabled
          && document.querySelector('[data-treatment-next]').disabled);
        check(await previous.isEnabled() && await next.isDisabled(), width + ': controles avançam para a segunda página');
        check(await p.locator('.treatments article').nth(3).evaluate((card, element) => {
          const viewport = element.getBoundingClientRect();
          const bounds = card.getBoundingClientRect();
          return bounds.left >= viewport.left - 1 && bounds.right <= viewport.right + 1;
        }, await viewport.elementHandle()), width + ': segundo grupo de cards visível');
        await previous.click();
        await p.waitForFunction(() => document.querySelector('[data-treatment-viewport]').scrollLeft === 0);
      } else {
        check(!await p.locator('[data-treatment-prev]').isVisible() && !await p.locator('[data-treatment-next]').isVisible(), width + ': controles horizontais ocultos no mobile');
        check(await p.locator('.treatments article').evaluateAll(cards => new Set(cards.map(card => card.offsetTop)).size === 6), width + ': seis cards em coluna no mobile');
      }
      await p.locator('img[loading="lazy"]').evaluateAll(images => images.forEach(img => { img.loading = 'eager'; }));
      await p.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
      check(await p.locator('.carousel img').count() === 10 && await p.locator('.carousel video, .carousel button, .carousel figcaption').count() === 0,
        width + ': dez fotos da clínica, sem controles ou legendas');
      await p.locator('.map-embed').scrollIntoViewIfNeeded();
      await p.frameLocator('.map-embed iframe').getByRole('region', { name: 'Mapa', exact: true }).first().waitFor({ timeout: 20000 });
      check(await p.evaluate(() => document.documentElement.scrollWidth === innerWidth), width + ': layout sem overflow e mapa carregado');
      check(errors.length === 0, width + ': sem erros de console, JS ou HTTP: ' + errors.join(' | '));
    } finally { await p.close(); }
  }
  return { status: 'PASS', browser: browser.version(), results };
}
