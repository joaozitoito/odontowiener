# Odonto Wiener

Landing page estática em HTML5, CSS e JavaScript puro. Sem framework, build ou dependências de execução. Referência: [Figma V7](https://www.figma.com/design/wq469SScZfAepySnQRDQUo/Odonto-Wiener-%E2%80%94-Conceito-de-Nova-Landing-Page), desktop `138:2` e mobile `138:138`.

## Executar

Abra `index.html`, ou use HTTP para testar nas condições de hospedagem:

~~~sh
python -m http.server 4173 --bind 127.0.0.1
~~~

Acesse [a página local](http://127.0.0.1:4173). A fonte Inter usa Google Fonts com fallback Arial e `font-display: swap`. Os links de WhatsApp abrem a conversa; o visitante confirma qualquer envio.

## Acabamento final

Textos recuperados diretamente do Figma MCP: “15 ANOS DE HISTÓRIA EM PELOTAS”, “Há 15 anos cuidando do seu sorriso.” e “15 anos de história. Uma clínica familiar.”. Os demais títulos, descrições e CTAs foram conferidos. A informação dos 15 anos está confirmada pelo cliente. Estrutura, imagem e CSS original do hero foram preservados.

A equipe permanece com quatro integrantes, sem inclusão de Igor:

| Integrante | Informação confirmada |
| --- | --- |
| Dr. Marcelo Wiener | Ortodontista e Clínico Geral · CRO/RS 12980 |
| Nícia Wiener | Psicologia · CRP/RS 07/41467 |
| Luciara | Recepcionista, preservada como já estava |
| Dra. Paula Menezes | Endodontista · CRO/RS 26040 |

As fotografias originais não foram modificadas. Os enquadramentos usam regras individuais de `object-position`: Marcelo 50% 34%; Nícia 50% 64%; Luciara 50% 44%; Paula 50% 38%. Os cards mantêm a proporção 294/288.

## Imagens de tratamentos

Exports originais do Figma MCP preservados em 400 × 248, com fontes JPEG em `assets/images/originals/`. Não há placeholders ou URLs temporárias no runtime.

| Tratamento | Nó | Arquivo usado |
| --- | --- | --- |
| Implantes | `138:39` | `assets/images/implantes.png` |
| Próteses | `138:48` | `assets/images/proteses.png` |
| Ortodontia | `138:57` | `assets/images/ortodontia.png` |

## Google Maps

Endereço confirmado: Rua Quinze de Novembro, 707 — Pelotas/RS. O site exibe a redação do Figma: Rua Quinze de Novembro, 707, Pelotas, Rio Grande do Sul.

O iframe veio do menu Compartilhar → Incorporar um mapa do próprio Google Maps. O painel oficial identifica o número 707 e lista Odonto Wiener em “Neste lugar”. O marcador usa as coordenadas -31.7659118, -52.3404258 e o identificador oficial do endereço, sem chave de API própria ou serviço pago.

Mapa com `loading="lazy"`, título acessível, zoom, movimentação e bordas do card preservadas. A área mede 440 px de altura no desktop e 300 px no mobile. Um link externo e uma orientação permanecem disponíveis se a incorporação for bloqueada. Por ser conteúdo de outro domínio, não se tenta inferir o sucesso do mapa apenas pelo evento `load`.

## Carrossel final da História

Somente em `#clinica .history > .carousel`. A versão anterior foi substituída nesta rodada por autorização expressa do usuário. Sem nomes, legendas, setas, indicadores ou botões decorados. Painel vertical 9:16, com 340 px de largura máxima no desktop e 300 px até 800 px de viewport, mantendo o enquadramento completo e eliminando faixas laterais.

Os cinco vídeos originais 2160 × 3840 permanecem intactos em `assets/videos/local/`. Foram inspecionados com contact sheets de FFmpeg e selecionados os seguintes trechos:

| Ordem | Arquivo | Trecho original | Duração final | Bytes web |
| --- | --- | --- | --- | --- |
| 1 | `1_recepcao.mp4` | 0,8–4,3 s | 3,5 s | 315.069 |
| 2 | `2_sala_nicia.mp4` | 3,0–10,0 s | 7,0 s | 588.550 |
| 3 | `3_segunda_recepcao.mp4` | 3,8–8,3 s | 4,5 s | 362.492 |
| 4 | `4_sala_operacao_marcelo.mp4` | 0,3–4,2 s | 3,9 s | 301.180 |
| 5 | `5_sala_operacao_secundaria.mp4` | 0,2–3,7 s | 3,5 s | 399.768 |

Cópias em `assets/videos/web/`: H.264 540 × 960, 30 fps, yuv420p, sem áudio, faststart; total 1.967.059 bytes contra 223.184.166 bytes dos originais (redução de 99,1%). Posters em `assets/videos/posters/` vêm do segundo 1 de cada trecho. Não foram geradas imagens nem alterados rostos.

Apenas o vídeo ativo reproduz, sem som e com `playsinline`. Somente ativo/próximo são antecipados no início, quando a História entra na tela. Avanço por `ended`, ciclo 1 → 2 → 3 → 4 → 5 → 1 e crossfade de opacidade. Vídeo indisponível mantém poster e avança ao próximo após quatro segundos, se a reprodução automática estiver permitida.

A própria área do vídeo é um botão transparente acessível: toque/clique ou Espaço/Enter pausa e retoma. Há nome acessível, instruções para leitor de tela e foco visível. Setas, Home/End e swipe mudam o ambiente. Foco, gesto, saída do viewport e aba oculta interrompem a reprodução; hover não pausa nem reinicia vídeos; uma retomada explícita permite continuar com o controle focado. A pausa explícita persiste na navegação manual.

Movimento reduzido desativa autoplay e download inicial dos vídeos, mostrando posters; tocar/ativar o painel muda o ambiente manualmente. Sem JavaScript, o primeiro poster e a navegação da página continuam disponíveis.

## Distribuição estática

~~~sh
node tools/prepare-demo.cjs
python -m http.server 4174 --bind 127.0.0.1 --directory dist
~~~

O conteúdo de `dist/` é a distribuição pública: 27 arquivos, sem vídeos originais, fontes JPEG dos tratamentos, ferramentas, testes, documentação ou node_modules. O pacote foi testado com servidor cuja raiz é somente `dist/`. Não precisa de Node.js no servidor. Use hospedagem estática que sirva HTML/CSS/JS/MP4; HTTP Range é recomendado. Google Fonts e o mapa precisam de internet, com fallbacks próprios.

Não houve publicação, configuração de domínio ou contratação de serviço. Upload/deploy só após autorização.

Para recriar os vídeos/posters, `tools/prepare-videos.cjs` usa FFmpeg e os trechos aprovados acima. Defina `ODONTO_FFMPEG` com o executável instalado, ou instale a ferramenta local opcional `ffmpeg-static@5.3.0` com `npm install --no-save --package-lock=false ffmpeg-static@5.3.0`. Nada disso é carregado pelo site.

## Testes desta rodada — 03/11/2026

Playwright MCP lançou explicitamente Brave 156.0.8078.80. Scripts ativos (`browser_run_code_unsafe`, argumento `filename` com caminho absoluto):

- `tools/check-final-contract.js`: requisitos principais; falhou antes da implementação e passou depois.
- `tools/check-final-layout.js`: 390/768/1440 px, textos, equipe, mídia, WhatsApp, menu, mapa, console/rede e screenshots.
- `tools/check-final-media.js`: ciclo natural completo, duração/ordem, pausa, teclado, toque, swipe e movimento reduzido.
- `tools/check-final-maps.js`: incorporação, endereço, zoom, movimentação e fallback.
- `tools/check-final-resilience.js`: falha de mídia, bloqueio de autoplay, viewport, aba oculta simulada e ausência de JavaScript.
- `tools/check-dist.js`: distribuição em servidor isolado, todos os assets, reprodução e CTA com nova aba interceptada.
- `tools/capture-final-clips.js`: cinco enquadramentos desktop/mobile com reprodução real antes de capturar.

Verificações locais: `python tools/check-integrity.py`, `node --check script.js`, `git diff --check`. O baseline desta rodada está em `artifacts/final-polish/baseline.json` e verifica originais byte a byte. Os testes da UI anterior ficam preservados em `tools/archive/`; suas expectativas de setas/legendas e vídeos de 10 s são históricas e não integram a suíte atual.

Caminhos do Brave, screenshots e porta 4173 estão explícitos nos testes; adapte em outra máquina. Capturas atuais: `artifacts/final-polish/screenshots/`. [Relatório atual](docs/final-polish-report.md). O relatório `docs/delivery-report.md` registra a etapa anterior.

## Pendências reais

- Confirmar telefone e WhatsApp. Foram preservados os números do Figma; o aviso se refere agora somente aos telefones.
- Confirmar o responsável técnico antes de atribuir essa função a alguém.
- Aprovação final de textos, imagens e recortes pelo cliente.
- Teste físico em iPhone/Safari e com leitor de tela não foi realizado. A aba oculta foi simulada no headless.
- Retratos originais da equipe somam aproximadamente 14 MB; otimização de arquivos permanece uma melhoria separada. Os originais e seus rostos foram preservados.

As antigas pendências de endereço, 15 anos e registros/especialidades informados foram resolvidas pelo briefing confirmado desta rodada.

## Git

Remoto: `https://github.com/joaozitoito/odontowiener.git`. Alterações anteriores e seis exclusões locais de fotos antigas foram preservadas. Nenhum commit, push ou deploy foi feito. Antes de um commit futuro, revisar quais exclusões e originais pesados devem entrar no histórico; publicar somente o conteúdo de `dist/`.

## Ajustes para release — 03/11/2026

- Hover removido da lógica do carrossel. O ciclo completo foi testado com o cursor sobre a mídia.
- Espaçamento horizontal da História: 120 px acima de 1100 px; 64 px em tablet horizontal; 32 px no layout de uma coluna. Proporção e largura do vídeo preservadas.
- Nícia: trecho atualizado para 3,0–10,0 s, incluindo a logo. Somente esse vídeo web e seu poster foram regenerados.
- Favicon: dente branco isolado por componente alfa da logo original `assets/logoodomto1.png`, sem texto ou recriação. PNGs transparentes 16/32/48/512 e ICO 16/32/48 em `assets/icons/`. Recriar no Windows com `powershell -File tools/prepare-favicon.ps1`. A distribuição inclui os ícones.
- Smoke test local: `tools/check-release.js`, executado por Playwright MCP com Brave. Verifica ciclo em hover, trecho de sete segundos, 390/1440, mapa, WhatsApp e ícones. Capturas permanecem somente em artifacts, ignorado pelo Git.
- Para a Vercel, use `node tools/prepare-demo.cjs` como preparação e `dist` como diretório de saída, sem framework. Não houve deploy.

O relatório `docs/final-polish-report.md` descreve a etapa anterior; os ajustes de hover, favicon, espaçamento e trecho da Nícia desta seção o atualizam. Permanecem a confirmação de telefones/WhatsApp, responsável técnico e aprovação final do cliente.
