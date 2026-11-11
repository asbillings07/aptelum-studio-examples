// Build only the reviewed public inventory. Never publish repository tooling.
import { lstat, readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const prefix = '/aptelum-studio-examples/';
const oldOrigin = 'https://asbillings07.github.io';

async function build() {
  // A source-level stop, not a substitute for project access/release approval.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'preview') {
    throw new Error('Only Preview builds are enabled. Production needs a reviewed launch change.');
  }
  if (process.env.VERCEL && process.env.VERCEL_ENV !== 'preview') {
    throw new Error('Vercel must explicitly identify this build as Preview.');
  }
  const hostname = process.env.VERCEL_URL || 'preview.invalid';
  if (!/^[a-z0-9-]+\.vercel\.app$/.test(hostname) && hostname !== 'preview.invalid') {
    throw new Error('Expected a generated Vercel preview hostname.');
  }
  const paths = JSON.parse(await readFile(join(root, 'site-files.json'), 'utf8'));
  if (!Array.isArray(paths) || !paths.length || new Set(paths).size !== paths.length) {
    throw new Error('Invalid or duplicate public-file inventory.');
  }
  const prepared = [];
  for (const path of paths) {
    if (typeof path !== 'string' || !/^[a-z0-9][a-z0-9/_.-]*\.(html|css|js|svg|png|jpg|webp|txt|xml)$/.test(path)
        || path.split('/').some(part => part.startsWith('.'))
        || /^(scripts|tests|docs|dist)\//.test(path)) {
      throw new Error(`Not a public asset path: ${path}`);
    }
    let current = root;
    for (const part of path.split('/')) {
      current = join(current, part);
      if ((await lstat(current)).isSymbolicLink()) throw new Error(`Symlink rejected: ${path}`);
    }
    if (!(await lstat(current)).isFile()) throw new Error(`Not a file: ${path}`);
    let bytes = await readFile(current);
    if (/\.(html|xml)$/.test(path)) {
      let text = bytes.toString('utf8');
      text = text.replaceAll(oldOrigin + prefix, path.endsWith('.xml') ? `https://${hostname}/` : '/');
      text = text.replaceAll(prefix, '/');
      if (path.includes('privacy')) {
        text = text.replace(/<p>[\s\S]*?<\/p>/g, paragraph => paragraph.includes('GitHub Pages')
          ? '<p>Vercel hosts this preview and processes hosting requests under its own privacy practices. Hosting can generate security and operational logs even though these pages have no website analytics. See the <a href="https://vercel.com/legal/privacy-policy" rel="noreferrer noopener" referrerpolicy="no-referrer">Vercel Privacy Policy</a>.</p>'
          : paragraph);
      }
      if (text.includes(prefix) || text.includes('GitHub Pages') || text.includes(oldOrigin)) {
        throw new Error(`Unconverted hosting reference: ${path}`);
      }
      bytes = Buffer.from(text);
    }
    prepared.push([path, bytes]);
  }
  const outputStat = await lstat(output).catch(error => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (outputStat?.isSymbolicLink()) throw new Error('Output must not be a symlink.');
  await rm(output, { recursive: true, force: true });
  for (const [path, bytes] of prepared) {
    const destination = join(output, path);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, bytes);
  }
  console.log(`Built ${prepared.length} public files for Preview; no production release is enabled.`);
}

build().catch(error => {
  console.error(`Preview build stopped: ${error.message}`);
  process.exitCode = 1;
});
