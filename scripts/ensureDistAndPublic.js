const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');

async function exists(p) {
  try { await fs.promises.access(p); return true; } catch { return false; }
}

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(srcPath, destPath);
    else await fs.promises.copyFile(srcPath, destPath);
  }
}

async function main() {
  const hasPublic = await exists(publicDir);
  const hasDist = await exists(distDir);

  if (!hasDist && hasPublic) {
    // Rename public -> dist (preserve contents)
    await fs.promises.rename(publicDir, distDir);
    // Recreate public as a copy so Next.js can continue to serve files
    await copyDir(distDir, publicDir);
    console.log('Renamed `public` to `dist` and recreated `public` from `dist`.');
    return;
  }

  if (!hasPublic && hasDist) {
    // Ensure public exists for Next
    await copyDir(distDir, publicDir);
    console.log('Copied `dist` to recreated `public`.');
    return;
  }

  if (!hasPublic && !hasDist) {
    await fs.promises.mkdir(distDir, { recursive: true });
    await fs.promises.mkdir(publicDir, { recursive: true });
    console.log('Created empty `dist` and `public` directories.');
    return;
  }

  console.log('`dist` and `public` already present; no changes made.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
