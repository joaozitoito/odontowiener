# Odonto Wiener

Landing page estática da clínica Odonto Wiener, em Pelotas. Apresenta os tratamentos, a história da clínica, a equipe e os canais de contato. A [Vercel](https://odontowiener.vercel.app/) hospeda a demonstração temporária. O provedor definitivo ainda será definido pelo responsável pela hospedagem.

O site usa HTML5, CSS e JavaScript puro. É um conjunto de arquivos estáticos, sem framework, backend, banco de dados ou dependências de execução. No fluxo de publicação, Node.js só é usado para gerar a distribuição. O servidor de produção serve os arquivos por HTTP(S) e dispensa um processo Node.js.

## Conteúdo atual

- Os seis cards aparecem na ordem **Aparelhos e Alinhadores Ortodônticos**, **Clareamento Dental**, **Facetas em Resina ou Porcelana**, **Implantes Dentários**, **Próteses Removíveis** e **Tratamento de Canal**. No desktop, a navegação mostra três cards por vez; no celular, todos aparecem em coluna.
- A equipe tem cinco integrantes. Dr. Marcelo Wiener, Nícia Wiener, Luciara, Dra. Paula Menezes e Dr. Igor Guimarães.
- A seção História exibe dez fotografias, da fachada à sala de esterilização, na ordem numerada de `assets/fotos/local/`. O carrossel avança a cada quatro segundos quando visível, com fade e zoom Ken Burns de 100% a 105%. Aceita gesto de deslizar e teclado, pausa enquanto contém o foco. O autoplay e o movimento visual são desativados quando o visitante prefere movimento reduzido.

## Estrutura

| Caminho | Função |
| --- | --- |
| `index.html`, `style.css`, `script.js` | Conteúdo, apresentação e interações |
| `assets/fotos/equipe/` | Retratos originais e versões `*-web.jpg` publicadas |
| `assets/fotos/local/`, `assets/images/` | Fotografias da clínica e dos tratamentos |
| `assets/logo1.png`, `assets/icons/` | Logo da página e favicon azul |
| `tools/` | Geração da distribuição e verificações |
| `docs/` | Histórico técnico. O [relatório de acabamento](docs/final-polish-report.md) descreve uma versão anterior |
| `dist/` | Saída gerada e ignorada pelo Git |
| `vercel.json` | Configuração da demonstração na Vercel |

## Executar localmente

Da raiz do repositório, sirva os arquivos-fonte com Python 3 e abra [a página local](http://127.0.0.1:4173/).

~~~sh
python -m http.server 4173 --bind 127.0.0.1
~~~

Para gerar e testar o pacote que será publicado, use Node.js 22 ou posterior no ambiente de preparação. O build usa somente módulos nativos e não requer instalação de pacotes.

~~~sh
node tools/prepare-demo.cjs
python -m http.server 4174 --bind 127.0.0.1 --directory dist
~~~

Abra [a distribuição isolada](http://127.0.0.1:4174/). Cada build substitui o `dist/` anterior com os arquivos públicos da lista em `tools/prepare-demo.cjs`. A distribuição contém as versões web dos retratos e tratamentos, as fotos da clínica, a logo e os ícones.

## Hospedar a distribuição

Envie **o conteúdo** de `dist/` à raiz pública do domínio ou subdomínio, de modo que `index.html` responda em `/`. Preserve a estrutura de `assets/`, os nomes dos arquivos e suas maiúsculas e minúsculas. Um servidor HTTP(S) estático compatível deve servir `index.html` como página inicial e os tipos MIME de HTML, CSS, JavaScript, JPEG, PNG e ICO. HTTPS é recomendado para produção.

Em hospedagem tradicional, abra o gerenciador de arquivos do painel ou conecte-se por SFTP, preferencialmente, ou pelo FTP oferecido pelo provedor. Identifique a raiz pública do domínio, por exemplo `public_html/` quando aplicável, faça backup da versão anterior e envie `index.html`, `style.css`, `script.js` e `assets/` diretamente para essa pasta. Confira a URL pública após o upload. O responsável pela hospedagem define o provedor, domínio e DNS.

| Provedor | Configuração com Git | Documentação |
| --- | --- | --- |
| Vercel | Projeto sem framework, build `node tools/prepare-demo.cjs`, saída `dist`. O `vercel.json` já descreve essa configuração. | [Deploys](https://vercel.com/docs/deployments) |
| Netlify | Raiz do repositório, build `node tools/prepare-demo.cjs`, diretório de publicação `dist`. Para deploy manual, gere o pacote e envie a pasta `dist` no painel. | [Configuração de build](https://docs.netlify.com/build/configure-builds/overview/) · [Deploy manual](https://docs.netlify.com/deploy/create-deploys/) |
| Cloudflare Pages | Projeto estático, build `node tools/prepare-demo.cjs`, diretório de saída `dist`. Em um projeto de Direct Upload, envie a pasta gerada ou seu ZIP. | [HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) · [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) |

Use um navegador moderno com JavaScript habilitado para o menu móvel, o carrossel e as mensagens predefinidas do WhatsApp. Os links diretos do WhatsApp também funcionam sem JavaScript. Google Fonts e o mapa incorporado precisam de internet. A página usa uma fonte de sistema como fallback e oferece um link externo para o mapa. O envio de mensagens ocorre no WhatsApp, por iniciativa do visitante.

## Atualizar o conteúdo

- **Textos e equipe** ficam em `index.html`. Ao trocar um retrato, mantenha o original em `assets/fotos/equipe/` e gere um JPEG web com cerca de 800 px de largura, preservando a proporção e o enquadramento. Atualize a referência e o texto alternativo quando necessário. Os recortes de exibição ficam em `style.css`.
- **Tratamentos e clínica** usam as fotografias em `assets/images/` e `assets/fotos/local/`. Mantenha a ordem dos cards e do carrossel no HTML. Se mudar um nome ou adicionar um arquivo público, atualize também a lista de distribuição em `tools/prepare-demo.cjs`.
- **Contato e WhatsApp** usam os dados de `clinic` e `treatmentMessages` em `script.js`. Ao trocar o endereço, sincronize também o texto de fallback e o iframe do mapa em `index.html`. Atualize os valores esperados nas verificações quando houver alteração aprovada de conteúdo.
- **Favicon** pode ser regenerado no Windows com `powershell -File tools/prepare-favicon.ps1`. Depois de substituir os ícones, atualize o parâmetro de versão nas referências de `index.html`.
- Regenere e valide `dist/` antes de enviar uma atualização ao provedor.

## Verificações

Execute os comandos a partir da raiz do repositório.

~~~sh
node --check script.js
node --check tools/prepare-demo.cjs
node --check tools/check-content.js
node --check tools/check-release.js
node --check tools/check-site.cjs
git fsck --full
git diff --check
node tools/prepare-demo.cjs
node tools/check-site.cjs --static-only
~~~

A verificação estática compara o inventário de `dist/` com as referências locais e os ícones complementares. Para executar `check-release.js` e `check-content.js` em um navegador, disponibilize Playwright no ambiente de testes e rode `node tools/check-site.cjs`. O executor abre Chromium e serve apenas `dist/` em uma porta local. As capturas ficam em `artifacts/release/`, fora do pacote publicado.

Para preparar um ambiente de teste sem adicionar um manifesto ao projeto, use `npm install --no-save --package-lock=false playwright` e `npx playwright install chromium`. Se já tiver uma instalação de Playwright, `ODONTO_PLAYWRIGHT_MODULE` pode apontar para o módulo. Use `ODONTO_BROWSER_EXECUTABLE` para indicar um Chrome ou Chromium instalado. Playwright é opcional e serve apenas à verificação local.

As seis imagens de tratamentos publicadas usam WebP com 1200 px de largura, mantendo as proporções e os enquadramentos. O conjunto passou de 13.496.265 para 818.604 bytes (93,9% menor). Os JPEG originais ficam no repositório e são excluídos da distribuição. As imagens dos tratamentos são ilustrativas e não identificam casos clínicos da Odonto Wiener.
