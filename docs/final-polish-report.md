# Acabamento final — Odonto Wiener

Rodada concluída em 03/11/2026, no checkout existente. O complemento do usuário autorizou também o redesign e os recortes do carrossel. Nenhum commit, push ou deploy foi realizado.

## Alterações

- Textos do hero e da História restaurados diretamente dos frames Figma V7 desktop `138:2` e mobile `138:138`.
- Endereço e dados profissionais confirmados incorporados; removidas somente as pendências que foram resolvidas.
- Google Maps oficial, interativo, com marcador no endereço correto, zoom, movimentação, título acessível, lazy loading e link externo de fallback.
- Quatro retratos com enquadramentos individuais, mantendo fotos e proporções originais dos cards.
- Carrossel redesenhado como painel retrato 9:16, sem faixas laterais, nomes, legendas, setas, indicadores ou botões decorados. Cinco trechos de 3,5–4,5 segundos selecionados pelo agente com FFmpeg.
- README atualizado, testes atuais separados dos testes históricos e distribuição estática regenerada e testada com raiz exclusiva em `dist/`.

Hero: somente a chamada e o título foram alterados. Imagem, estrutura e CSS original permanecem intactos, verificados automaticamente. As três imagens originais dos tratamentos, as quatro fotografias da equipe e todos os vídeos originais foram preservados byte a byte contra o baseline recebido nesta rodada.

## Textos recuperados do Figma

Consulta via Figma MCP com `get_design_context` e screenshots dos dois frames. Os textos abaixo coincidem nas versões desktop e mobile.

| Seção | Texto V7 | Resultado |
| --- | --- | --- |
| Hero — chamada | 15 ANOS DE HISTÓRIA EM PELOTAS | Restaurado; informação confirmada pelo cliente |
| Hero — título | Há 15 anos cuidando do seu sorriso. | Restaurado, com “15 anos” no azul do Figma |
| Hero — descrição | Uma clínica familiar em Pelotas. Conheça nossa história, nossa equipe e os cuidados que oferecemos. | Conferido e preservado |
| Hero — CTAs | Agendar consulta · Conheça os tratamentos ↓ | Conferidos e preservados |
| Tratamentos — título | Conheça nossos tratamentos | Conferido e preservado |
| Tratamentos — descrição | Implantes, próteses e ortodontia. Converse com a equipe para entender as opções de cuidado. | Conferida e preservada |
| Implantes | Conheça as opções de implantes dentários e converse com a equipe sobre a avaliação. | Conferido e preservado |
| Próteses | Conheça as opções de próteses dentárias e converse com a equipe sobre a avaliação. | Conferido e preservado |
| Ortodontia | Conheça as opções de cuidados ortodônticos e converse com a equipe sobre a avaliação. | Conferido e preservado |
| Tratamentos — CTA | Conversar sobre o tratamento ↗ | Conferido nos três cards |
| História — título | 15 anos de história. / Uma clínica familiar. | Restaurado |
| História — descrição | Conheça a Odonto Wiener, uma clínica familiar em Pelotas, e as pessoas que fazem parte da nossa história. | Conferida e preservada |
| Equipe — título | Equipe por trás / do cuidado. | Conferido e preservado |
| Equipe — descrição | Conheça quem faz parte da história da Odonto Wiener. | Conferida e preservada |
| Contato — título | Vamos conversar? | Conferido e preservado |
| Contato — descrição | Fale com a equipe para tirar dúvidas e consultar os horários de atendimento. | Conferida e preservada |
| Contato — endereço | Rua Quinze de Novembro, 707, Pelotas, Rio Grande do Sul | Restaurada a redação completa, endereço confirmado |
| Contato — CTA | Agendar consulta | Conferido e preservado |
| Rodapé — descrição | Odontologia em Pelotas • Tratamentos, clínica e contato. | Conferida e preservada |

Não houve falha de extração de copy. Reservas do Figma não foram reintroduzidas: “Foto a inserir”, os profissionais sem identificação e o mapa estático foram substituídos pelas mídias e informações reais autorizadas. Os dados profissionais fornecidos nesta rodada prevalecem sobre os rótulos genéricos do protótipo. O rodapé agora mantém apenas “Responsável técnico a confirmar com a clínica.”, pois os registros informados foram confirmados. As mensagens de WhatsApp existentes, gerais e específicas por tratamento, foram preservadas.

## Retratos e dados profissionais

Cada original foi aberto e inspecionado antes do ajuste. Sem edição de rostos, geração de imagens ou substituição de arquivos. `object-fit: cover` e proporção 294/288 preservados.

| Integrante | object-position | Ajuste visual | Dados exibidos |
| --- | --- | --- | --- |
| Dr. Marcelo Wiener | 50% 34% | Menor espaço acima da cabeça, rosto inteiro e ombros preservados | Ortodontista e Clínico Geral · CRO/RS 12980 |
| Nícia Wiener | 50% 64% | Maior deslocamento vertical para retirar o excesso de parede acima da cabeça | Psicologia · CRP/RS 07/41467 |
| Luciara | 50% 44% | Rosto mais alto no card, com testa/queixo preservados | Recepcionista, como já constava |
| Dra. Paula Menezes | 50% 38% | Menos teto e alinhamento visual com os outros rostos | Endodontista · CRO/RS 26040 |

Mantidos exclusivamente os quatro integrantes existentes. Igor não foi incluído e nenhum responsável técnico foi atribuído.

## Google Maps

O iframe foi copiado do recurso oficial Compartilhar → Incorporar um mapa, conforme o [fluxo documentado pelo Google](https://support.google.com/maps/answer/7101463?hl=en). Não foi usada a API paga nem uma chave própria.

O painel do Google Maps identifica **R. Quinze de Novembro, 707 - Centro, Pelotas - RS, 96015-000**, com **Odonto Wiener** em “Neste lugar”. O embed mantém o identificador `0x9511b59803cfffff:0xc23460b776b1abc1` e as coordenadas **-31.7659118, -52.3404258**. O marcador vermelho e o card do número 707 foram conferidos no mapa renderizado.

Zoom e movimentação foram executados de fato no iframe: o zoom solicitou outro nível de tiles e as setas do teclado deslocaram o mapa. O card continua responsivo, com área de mapa de 440 px desktop / 300 px mobile, bordas arredondadas, `loading="lazy"` e título acessível. O link externo e a orientação de fallback ficam disponíveis mesmo se a incorporação for bloqueada. Não se confunde o evento `load` de um iframe externo com garantia de sucesso do serviço.

## Carrossel e edição dos vídeos

Foi atendido o complemento do usuário: a versão redesenhada ainda não existia, por isso foi implementada nesta rodada. Os originais foram analisados em contact sheets de um quadro por segundo, disponíveis em `artifacts/final-polish/video-analysis/`.

| Ordem | Arquivo | Trecho selecionado do original | Duração | Bytes finais | Critério |
| --- | --- | --- | --- | --- | --- |
| 1 | `1_recepcao.mp4` | 0,8–4,3 s | 3,5 s | 315.069 | Entrada e assentos da recepção |
| 2 | `2_sala_nicia.mp4` | 3,1–7,6 s | 4,5 s | 390.275 | Sala já aberta, poltronas, luminária e prateleiras; retirado o início dominado pela porta |
| 3 | `3_segunda_recepcao.mp4` | 3,8–8,3 s | 4,5 s | 362.492 | Interior da recepção e área de espera; retirado o anúncio que domina o início |
| 4 | `4_sala_operacao_marcelo.mp4` | 0,3–4,2 s | 3,9 s | 301.180 | Cadeira e equipamentos, evitando pontas da gravação |
| 5 | `5_sala_operacao_secundaria.mp4` | 0,2–3,7 s | 3,5 s | 399.768 | Equipamentos, cadeira e janela antes do giro final para a parede |

As cópias usam H.264, 540 × 960, 30 fps, yuv420p, sem áudio e faststart. Total **1.768.784 bytes**, redução de **99,2%** sobre os 223.184.166 bytes originais. Os originais continuam em `assets/videos/local/`; só os derivados de `web/` e `posters/` entram no pacote público. Posters vêm do segundo 1 de cada trecho.

O painel segue a proporção original 9:16, com 340 px de largura máxima no desktop e 300 px em tablet/mobile. Isso elimina as faixas sem cortar espacialmente os ambientes para preencher um retângulo horizontal. A seção mantém o texto ao lado no desktop e acima no mobile. Os recortes são temporais; não há zoom ou deformação das imagens.

Autoplay silencioso, `playsinline`, um vídeo por vez, antecipação do próximo e avanço pelo evento real `ended`. Loop na ordem original. Crossfade conservou opacidade visual acumulada mínima de 0,9999995 no ciclo amostrado a cada 25 ms, sem reprodução simultânea. É evidência no Brave testado, não garantia de comportamento idêntico em toda rede/dispositivo.

Sem controles aparentes na interface normal: a própria mídia é um botão transparente com nome acessível e contorno ao receber foco de teclado. Toque/clique ou Espaço/Enter pausa e retoma; setas, Home/End e swipe mudam o ambiente. Movimento reduzido mantém posters estáticos e navegação manual, sem baixar vídeos inicialmente. Falhas mantêm o poster e permitem continuar. Bloqueio de autoplay pode ser recuperado por interação direta no painel.

## Testes executados e resultados

Playwright MCP lançou explicitamente **Brave 156.0.8078.80**, headless. Todos os testes ativos abaixo passaram. Os testes históricos da interface anterior foram preservados em `tools/archive/`.

| Script/check | Evidência executada | Resultado |
| --- | --- | --- |
| `check-final-contract.js` | Faltas de copy/mapa/registros/carrossel detectadas antes da implementação; mesmas verificações depois | FAIL esperado antes → PASS depois |
| `check-final-layout.js` | 390/768/1440 px, textos V7, quatro integrantes/registros, enquadramentos, três tratamentos, menu, sete URLs WhatsApp, tiles reais do Maps, console e HTTP | PASS |
| `check-final-media.js` | Ciclo natural 1 → 2 → 3 → 4 → 5 → 1; durações 3,5/4,5/4,5/3,9/3,5 s; exclusividade e crossfade | PASS |
| Mesmo script | Pausa persistente, retomada, foco, teclado, toque, swipe e preferência de movimento reduzido | PASS |
| Regressão swipe → teclado | Reproduzido um caso que consumia o primeiro Espaço após swipe; clique de ponteiro passou a ser distinguido do teclado | FAIL reproduzido → corrigido → PASS |
| `check-final-maps.js` | Endereço/ID, incorporação sem chave própria, zoom real, movimentação por teclado e fallback com rede bloqueada | PASS |
| `check-final-resilience.js` | Falha de vídeo, recuperação, NotAllowedError, saída do viewport, visibilidade simulada e navegação sem JS | PASS |
| `capture-final-clips.js` | Reprodução e captura dos cinco ambientes em desktop e mobile | PASS |
| `check-dist.js` | Servidor separado com raiz exclusiva dist; todos os assets locais HTTP 200; vídeo reproduz; CTA abre nova aba interceptada; sem erros e sem overflow | PASS |
| Integridade | Hero com somente textos alterados; imagem/CSS original preservados; hashes das fotos e vídeos originais | PASS |
| Sintaxe/whitespace | `node --check script.js`, `git diff --check` | PASS |
| Revisão independente de código | Estado assíncrono, toque/teclado, falhas, movimento reduzido, mapa e preparação estática | Sem achados críticos/importantes |

As falhas de rede, o bloqueio de autoplay e `visibilitychange` foram injetados deliberadamente nos testes de recuperação. A validação normal em 390/768/1440 não apresentou erros de console, JavaScript ou respostas HTTP ≥400. A tentativa de leitura de README no servidor exclusivo de dist retornou 404 intencionalmente, comprovando o isolamento da raiz; isso não é um asset ausente da página.

Não houve teste físico em Safari/iPhone nem auditoria com leitor de tela. A revisão independente de código não repetiu o navegador porque o MCP estava em uso pelos testes principais; não se atribui a ela uma aprovação independente de browser.

## Capturas atuais

| Largura | Página completa | Hero | Equipe | Nossa História | Contato com Maps |
| --- | --- | --- | --- | --- | --- |
| 1440 | [Desktop](../artifacts/final-polish/screenshots/page-1440.png) | [Hero](../artifacts/final-polish/screenshots/hero-1440.png) | [Equipe](../artifacts/final-polish/screenshots/team-1440.png) | [História](../artifacts/final-polish/screenshots/history-1440.png) | [Contato](../artifacts/final-polish/screenshots/contact-1440.png) |
| 768 | [Tablet](../artifacts/final-polish/screenshots/page-768.png) | [Hero](../artifacts/final-polish/screenshots/hero-768.png) | [Equipe](../artifacts/final-polish/screenshots/team-768.png) | [História](../artifacts/final-polish/screenshots/history-768.png) | [Contato](../artifacts/final-polish/screenshots/contact-768.png) |
| 390 | [Mobile](../artifacts/final-polish/screenshots/page-390.png) | [Hero](../artifacts/final-polish/screenshots/hero-390.png) | [Equipe](../artifacts/final-polish/screenshots/team-390.png) | [História](../artifacts/final-polish/screenshots/history-390.png) | [Contato](../artifacts/final-polish/screenshots/contact-390.png) |

Os cinco enquadramentos possuem capturas separadas `clip-1-1440.png` até `clip-5-1440.png`, e `clip-1-390.png` até `clip-5-390.png`, no mesmo diretório. Foram produzidas após reprodução real de cada trecho, e não com fotografias antigas.

## Pendências reais

- Aprovação final do cliente para copy, retratos e recortes apresentados.
- Confirmar telefones/WhatsApp; os números do Figma foram preservados e o aviso visível se refere somente a eles.
- Confirmar quem é o responsável técnico. Nenhum integrante recebeu essa atribuição.
- Teste físico em iPhone/Safari e com leitor de tela permanece recomendado, não executado.
- Os retratos originais somam aproximadamente 14 MB; a otimização dos arquivos de foto é uma melhoria futura separada. Nenhuma foto foi alterada nesta rodada.

Não permanecem como pendência os 15 anos, o endereço ou as especialidades e registros fornecidos pelo cliente nesta rodada.

## Git e distribuição

Branch atual: `main`, sem novo commit. Alterados `README.md`, `index.html`, `script.js`, `style.css` e ferramentas/documentação/derivados desta entrega ainda não rastreados. As seis exclusões locais de fotos antigas já existiam e foram preservadas. Não houve reset, commit, push ou deploy.

`node tools/prepare-demo.cjs` produziu **22 arquivos, 16.810.686 bytes**, em `dist/`. O pacote não contém vídeos originais pesados, originais JPEG dos tratamentos, documentação, ferramentas, testes ou node_modules. Os caminhos são relativos e o pacote funcionou em servidor com raiz exclusiva nessa pasta, na porta 4174, sem acesso aos arquivos da pasta de desenvolvimento.

**dist/ está tecnicamente pronto para publicação estática após aprovação.** Antes de autorizar commit, revisar também quais exclusões e originais devem entrar no histórico. Publicar somente o conteúdo de dist. Nenhuma ação de publicação foi executada.
