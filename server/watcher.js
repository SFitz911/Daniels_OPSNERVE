const chokidar = require('chokidar');
const simpleGit = require('simple-git');
const path = require('path');

const git = simpleGit({ baseDir: path.resolve(__dirname, '..') });

const watchPaths = [path.join(__dirname, '..', 'client'), path.join(__dirname, '..', 'server')];
const ignored = ['**/node_modules/**', '**/server/data/**', '**/.git/**'];

let changeBuffer = new Set();
let timer = null;

const flush = async () => {
  if (changeBuffer.size === 0) return;
  const files = Array.from(changeBuffer).map((f) => path.relative(path.resolve(__dirname, '..'), f));
  changeBuffer.clear();
  try {
    await git.add(files);
    const message = `chore(auto): update ${files.join(', ')}`;
    await git.commit(message).catch(() => {});
    await git.push('origin', 'main').catch(() => {});
    console.log(`[watcher] committed & pushed: ${message}`);
  } catch (err) {
    console.error('[watcher] error committing changes', err.message || err);
  }
};

const schedule = (file) => {
  changeBuffer.add(file);
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 3000);
};

const watcher = chokidar.watch(watchPaths, { ignored, persistent: true, ignoreInitial: true });

watcher.on('all', (event, file) => {
  console.log(`[watcher] ${event}: ${file}`);
  schedule(file);
});

watcher.on('error', (err) => console.error('[watcher] error', err));

console.log('[watcher] watching for file changes...');
const path = require('path');
const chokidar = require('chokidar');
const simpleGit = require('simple-git');

const repoRoot = path.resolve(__dirname, '..');
const git = simpleGit(repoRoot);

let timer = null;
const DEBOUNCE_MS = 2000;

const commitAndPush = async (files) => {
  try {
    await git.add('./*');
    const msg = `chore: auto-sync changes ${new Date().toISOString()}`;
    const status = await git.status();
    if (status.staged.length === 0 && status.modified.length === 0 && status.not_added.length === 0) {
      return;
    }
    await git.commit(msg);
    await git.push('origin', 'main');
    console.log('[watcher] committed and pushed:', msg);
  } catch (err) {
    console.error('[watcher] git push failed:', err.message);
  }
};

const onChange = (filePath) => {
  console.log('[watcher] change detected:', filePath);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => commitAndPush([filePath]), DEBOUNCE_MS);
};

console.log('[watcher] starting — watching client/ and server/ for changes');

const watcher = chokidar.watch([
  path.join(repoRoot, 'client'),
  path.join(repoRoot, 'server')
], {
  ignored: /(^|[\\/\\\\])\.git|node_modules|server\/node_modules/,
  persistent: true,
  ignoreInitial: true,
});

watcher.on('add', onChange).on('change', onChange).on('unlink', onChange);

process.on('SIGINT', () => {
  console.log('[watcher] stopping');
  watcher.close();
  process.exit(0);
});
