import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';

async function main() {
  await mkdir('docs', { recursive: true });

  const indexHtml = await readFile('index.html', 'utf8');
  const docsIndexHtml = indexHtml.replace('src="docs/app.js"', 'src="app.js"');
  await writeFile('docs/index.html', docsIndexHtml, 'utf8');

  await copyFile('main.css', 'docs/main.css');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
