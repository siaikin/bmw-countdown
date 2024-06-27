import Fontmin from 'fontmin';
import fs from 'node:fs/promises';
import  path from 'node:path';

async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

// Then, use it with a simple async for loop
async function main() {
  const charSet = new Set();
  for await (const p of walk('./src/')) {
    if (![
      '.vue',
      '.js',
      '.cjs',
      '.mjs',
      '.jsx',
      '.ts',
      '.css',
      '.scss',
      '.less',
      '.styl',
      '.html',
      '.json',
      '.md',
    ].includes(path.extname(p))) continue;

    const content = await fs.readFile(p, 'utf-8');
    for (const char of content) {
      charSet.add(char);
    }
  }

  const fontmin = new Fontmin()
    .src('./src/assets/HYHuangKeBangShuW.ttf')
    .dest('./public')
    .use(Fontmin.glyph({
      text: Array.from(charSet).join(''),
    }))
    .use(Fontmin.ttf2woff2())

  fontmin.run(function (err, files) {
    if (err) {
      throw err;
    }
  });
}

await main()
