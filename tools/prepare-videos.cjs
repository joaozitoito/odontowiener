// Ferramenta opcional de preparação; não é necessária para hospedar o site.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const ffmpeg = process.env.ODONTO_FFMPEG || require('ffmpeg-static');
const root = path.resolve(__dirname, '..');
const input = path.join(root, 'assets/videos/local');
const output = path.join(root, 'assets/videos/web');
const posters = path.join(root, 'assets/videos/posters');
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(posters, { recursive: true });
const files = fs.readdirSync(input).filter(name => /^\d+[-_].*\.mp4$/i.test(name))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
// Trechos escolhidos após inspeção dos cinco originais, em segundos.
const edits = {
  '1_recepcao.mp4': { start: 0.8, duration: 3.5 },
  '2_sala_nicia.mp4': { start: 3.1, duration: 4.5 },
  '3_segunda_recepcao.mp4': { start: 3.8, duration: 4.5 },
  '4_sala_operacao_marcelo.mp4': { start: 0.3, duration: 3.9 },
  '5_sala_operacao_secundaria.mp4': { start: 0.2, duration: 3.5 }
};
for (const name of files) {
  const edit = edits[name];
  if (!edit) throw new Error(`Selecione e confira o trecho de ${name} antes de exportar.`);
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(edit.start), '-i', path.join(input, name), '-t', String(edit.duration),
    '-map', '0:v:0', '-vf', 'scale=540:-2', '-r', '30', '-c:v', 'libx264', '-preset', 'medium',
    '-crf', '25', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', path.join(output, name)], { stdio: 'inherit' });
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(output, name),
    '-ss', '1', '-frames:v', '1', '-q:v', '3', path.join(posters, name.replace(/\.mp4$/i, '.jpg'))], { stdio: 'inherit' });
  console.log(`${name}: ${edit.start}–${(edit.start + edit.duration).toFixed(1)}s, ${fs.statSync(path.join(output, name)).size} bytes`);
}
