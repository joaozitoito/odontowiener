// Monta dist/ para qualquer hospedagem estática. Nunca publica.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const files = ['index.html', 'style.css', 'script.js', 'assets/logo1.png',
  'assets/images/implantes-cirurgias-web.jpg', 'assets/images/proteses-ortodontia-web.jpg',
  'assets/images/tratamento-canal-web.jpg'];
for (const folder of ['assets/fotos/local', 'assets/fotos/equipe', 'assets/icons']) {
  for (const name of fs.readdirSync(path.join(root, folder))) {
    const source = path.join(folder, name);
    if (fs.statSync(path.join(root, source)).isFile()) files.push(source);
  }
}
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}
console.log(`Demo estática preparada em dist/: ${files.length} arquivos, sem originais pesados, ferramentas ou dependências. Nada publicado.`);
