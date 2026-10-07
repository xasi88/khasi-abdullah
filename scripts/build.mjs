import { writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { outputPath, projectRoot, renderPage } from './render.mjs';

await writeFile(outputPath, await renderPage(), 'utf8');
console.log(`Built ${relative(projectRoot, outputPath)}: fragments, styles and scripts in one file.`);
