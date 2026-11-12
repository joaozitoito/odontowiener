// Monta dist/ para qualquer hospedagem estática. Nunca publica.
const fs = require('node:fs');
const path = require('node:path');
const root = fs.realpathSync(path.resolve(__dirname, '..'));
const output = path.join(root, 'dist');
const files = [
  'index.html', 'style.css', 'script.js', 'assets/logo1.png',
  'assets/icons/favicon.ico', 'assets/icons/favicon-16.png', 'assets/icons/favicon-32.png',
  'assets/icons/favicon-48.png', 'assets/icons/favicon-512.png',
  'assets/images/aparelhos-e-alinhadores-ortodonticos.jpg',
  'assets/images/clareamento-dental.jpg',
  'assets/images/facetas-em-resina-ou-porcelana.jpg',
  'assets/images/implantes-dentarios.jpg',
  'assets/images/proteses-removiveis.jpg',
  'assets/images/tratamento-canal-web.jpg',
  'assets/fotos/equipe/marcelo_wiener-web.jpg', 'assets/fotos/equipe/nicia_wiener-web.jpg',
  'assets/fotos/equipe/luciara-web.jpg', 'assets/fotos/equipe/paula-web.jpg', 'assets/fotos/equipe/igor-web.jpg',
  'assets/fotos/local/1-fachada.jpeg', 'assets/fotos/local/2-recepção (entrada).jpeg',
  'assets/fotos/local/3-consultorionicia (2).jpeg', 'assets/fotos/local/4-consultorionicia.jpeg',
  'assets/fotos/local/5-recepção2 quadros.jpeg', 'assets/fotos/local/6-recepção2.jpeg',
  'assets/fotos/local/7-sala-cirurgia.jpeg', 'assets/fotos/local/8-sala-raio-x.jpeg',
  'assets/fotos/local/9-sala-cirurgia-2.jpeg', 'assets/fotos/local/10-esterilização.jpeg'
];

const workspace = fs.mkdtempSync(path.join(root, '.dist-'));
const staging = path.join(workspace, 'site');
const previous = path.join(workspace, 'previous');
let keepBackup = false;

try {
  for (const file of files) {
    const destination = path.join(staging, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, file), destination);
  }

  const existing = fs.lstatSync(output, { throwIfNoEntry: false });
  if (existing && !existing.isDirectory()) throw new Error('dist/ deve ser um diretório comum.');
  if (existing) fs.renameSync(output, previous);
  try {
    fs.renameSync(staging, output);
  } catch (error) {
    if (existing) {
      keepBackup = true;
      fs.renameSync(previous, output);
      keepBackup = false;
    }
    throw error;
  }
} finally {
  if (!keepBackup) fs.rmSync(workspace, { recursive: true, force: true });
  else console.error(`A distribuição anterior foi preservada em ${previous}.`);
}
console.log(`Distribuição estática gerada em dist/ com ${files.length} arquivos.`);
