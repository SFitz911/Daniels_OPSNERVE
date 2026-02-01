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
