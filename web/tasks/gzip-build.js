/**
 * Gzip .js, .css, .html in the build directory (replacement for gzipper).
 * Uses Node built-in zlib only — no extra dependencies, permissive license.
 * Uses level 6 compression and parallel work for faster builds.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const buildDir = path.join(__dirname, '..', 'build');
const ext = ['.js', '.css', '.html'];
const GZIP_LEVEL = 6; // Faster than 9, still good compression
const CONCURRENCY = Math.max(1, require('os').cpus().length - 1);

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, out);
    } else if (e.isFile() && ext.includes(path.extname(e.name))) {
      out.push(full);
    }
  }
}

function gzipFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, content) => {
      if (err) return reject(err);
      zlib.gzip(content, { level: GZIP_LEVEL }, (gzErr, compressed) => {
        if (gzErr) return reject(gzErr);
        fs.writeFile(filePath + '.gz', compressed, (writeErr) => {
          if (writeErr) return reject(writeErr);
          resolve();
        });
      });
    });
  });
}

async function runInBatches(items, batchSize, fn) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(fn));
  }
}

if (!fs.existsSync(buildDir)) {
  console.error('Build directory not found:', buildDir);
  process.exit(1);
}

const files = [];
walk(buildDir, files);

runInBatches(files, CONCURRENCY, gzipFile)
  .then(() => {
    console.log(`gzip-build: compressed ${files.length} files (.js, .css, .html)`);
  })
  .catch((err) => {
    console.error('gzip-build error:', err);
    process.exit(1);
  });
