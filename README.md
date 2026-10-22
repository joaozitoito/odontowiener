# Odonto Wiener

Landing page estática em HTML5, CSS e JavaScript puro, sem dependências de execução ou build. Abra `index.html` no navegador. A fonte Inter é carregada do Google Fonts; sem internet, há fallback para Arial.

## Implementado

Header e menu mobile, hero, três tratamentos com mensagens específicas para WhatsApp, história com carrossel de quatro fotografias reais no lugar da imagem estática, equipe com quatro pessoas e contato/rodapé. O carrossel tem setas, indicadores, teclado (←, →, Home, End) e gesto horizontal de mouse/toque. Sem JavaScript, a primeira fotografia e a navegação continuam disponíveis. O site apenas abre o WhatsApp; o visitante confirma o envio.

Referência: [Figma V7](https://www.figma.com/design/wq469SScZfAepySnQRDQUo/Odonto-Wiener-%E2%80%94-Conceito-de-Nova-Landing-Page), desktop `138:2` e mobile `138:138`, inspecionados via Figma. Cores, espaçamentos e hierarquia foram traduzidos para CSS responsivo. Fotos reais substituem reservas do protótipo; carrossel é o adicional contratado. As imagens dos tratamentos ainda não foram exportadas: os cards mantêm placeholders na proporção 400 × 248 do protótipo. Não houve substituição por imagens externas ou geradas.

## Antes de publicar

- Validar telefone, WhatsApp e endereço. Dados centralizados no objeto `clinic` em `script.js`; o HTML contém fallback sem JavaScript e deve acompanhar alterações desses dados. O aviso de pendência é explícito nesta primeira versão.
- Confirmar os 15 anos de história antes de reinserir essa afirmação no hero e na história.
- Confirmar especialidade de Paula, registros profissionais e responsável técnico. Não foi criado quinto integrante.
- Confirmar uso das fotos, enquadramentos e textos institucionais. Todas as quatro fotos do carrossel e quatro retratos já estão presentes. Faltam as três imagens de tratamentos, listadas abaixo.
- Comparar o resultado renderizado com a V7 nos tamanhos 390, 768 e 1440 px, em especial cortes das fotos, logo e quebras dos títulos. A retirada da afirmação dos 15 anos altera as quebras do hero.

## Verificação e continuidade

O ambiente desta entrega não disponibiliza Git nem um repositório `.git` nesta pasta. O remoto informado pelo usuário é `https://github.com/joaozitoito/odontowiener.git`. Não há branch ou commit local para informar; commit/push continuam pendentes até disponibilizar Git e o checkout correto. Nenhuma hospedagem foi configurada.

Os arquivos importantes ficam nesta pasta. Imagens originais foram preservadas em `assets/fotos` e logos em `assets`. Imagens do Figma são armazenadas em `assets/images` e ícones em `assets/icons`, sem URLs temporárias no site.

## Imagens disponíveis e exportações pendentes

Arquivos locais existentes, preservados:
- Logos: `assets/logo1.png` (utilizado) e `assets/logoodomto1.png`.
- Equipe: `assets/fotos/equipe/marcelo_wiener.jpg`, `nicia_wiener.jpg`, `luciara.jpg`, `paula.jpg`.
- Ambientes, em `assets/fotos/local/`: `fachada.jpeg`, `recepção (entrada).jpeg` (hero), `recepção2.jpeg`, `recepção2 quadros.jpeg`, `corredor_entre_recepcao.jpeg`, `consultorionicia.jpeg`, `consultorionicia (2).jpeg`.
- Referências locais: `assets/referencia/desktop.png` e `assets/referencia/mobile.png`.

Exportar manualmente do Figma V7, preservando o enquadramento e confirmando a licença/autorização de uso das fotografias do protótipo:

| Elemento desktop | Node | Colocar em | Proporção |
| --- | --- | --- | --- |
| Foto — Implantes | `138:39` | `assets/images/implantes.png` | 400 × 248 |
| Foto — Próteses | `138:48` | `assets/images/proteses.png` | 400 × 248 |
| Foto — Ortodontia | `138:57` | `assets/images/ortodontia.png` | 400 × 248 |

Pode exportar a 2× (800 × 496). Ao colocar os arquivos nesses caminhos e recarregar, o JavaScript exibe as imagens carregadas com sucesso. Arquivos ausentes ou inválidos mantêm o placeholder sem alterar a composição. Sem JavaScript, os placeholders permanecem. A seta dos CTAs usa o caractere acessível decorativo ↗; não depende do SVG indisponível. Não são necessárias outras exportações para este ajuste.

## Carrossel da História — requisitos atualizados

Está dentro de `#clinica .history`, no lugar da foto estática, sem seção extra. Mantém a coluna e a altura original de 440 px no desktop e 280 px no mobile. Fotos: fachada, recepção com quadros, corredor e consultório de Nícia. As imagens usam `object-fit: cover`; conferir os recortes visualmente.

Avanço automático a cada 5 segundos, transição de opacidade de 500 ms, setas, indicadores, teclado e swipe. Botão para pausar/retomar. Mouse sobre a área, foco dentro dela, gesto em andamento, aba oculta ou carrossel fora do viewport interrompem o temporizador. Ao liberar uma pausa temporária ou interagir manualmente, inicia-se um novo período inteiro de 5 segundos; não há avanço acumulado. A pausa explícita persiste até o usuário retomar. O botão retomar não anula a pausa enquanto ainda houver foco/mouse sobre a área.

Com `prefers-reduced-motion: reduce`, autoplay e transição ficam desativados; navegação manual continua. Alterações dessa preferência em tempo de execução também são respeitadas. Sem IntersectionObserver, mantém apenas a reprodução manual. Avanços automáticos não são anunciados repetidamente ao leitor de tela.

Verificação desta revisão: conferência estática da localização do carrossel, quatro slides/indicadores, referências locais, arquivos existentes e regras de temporização/pausa. Não houve teste funcional executado em navegador: Chrome headless falhou na inicialização do processo gráfico. Permanecem pendentes testes reais de autoplay/pausas, swipe, teclado, leitor de tela, carregamento dos exports e comparação visual em 390, 768 e 1440 px. Não há alegação de aprovação desses testes.