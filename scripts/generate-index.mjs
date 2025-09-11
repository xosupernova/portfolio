#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const clientDir = resolve('.tanstack/start/build/client-dist');
const manifestPath = resolve(clientDir, '.vite/manifest.json');
if (!existsSync(manifestPath)) {
  console.error('Manifest not found at', manifestPath);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
// Prefer explicit spa entry if present
let entry = Object.entries(manifest).find(([k]) => k.endsWith('src/spa-entry.tsx'))?.[1];
if (!entry) {
  entry = Object.values(manifest).find((m) => m.isEntry);
}
if (!entry) {
  console.error('No entry chunk found in manifest (looked for spa-entry then any isEntry)');
  process.exit(1);
}
const cssAssets = (entry.assets || []).filter((a) => a.endsWith('.css'));
const cssLinks = cssAssets
  .map((href) => `<link rel="preload" href="/${href}" as="style" />\n    <link rel="stylesheet" href="/${href}" />`)
  .join('\n    ');

// Pull basic meta values from environment (fall back to defaults if missing)
const appTitle = process.env.VITE_APP_TITLE || 'Nova Bowley';
const appDescription = process.env.VITE_APP_DESCRIPTION || 'Portfolio';
const appUrl = process.env.VITE_APP_URL || 'https://example.com';
const themeColor = process.env.VITE_THEME_COLOR || '#09090b';
const ogImage = process.env.VITE_OG_IMAGE || '/icon.webp';
// Cloudflare Insights removed for stability / CSP simplicity. Reintroduce by restoring beacon snippet if desired.
const analyticsScript = '';

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${appTitle}</title>
    <meta name="description" content="${appDescription}" />
    <meta name="theme-color" content="${themeColor}" />
  <noscript><style>html.dark{background:#0a0a0b;color:#fff}</style></noscript>
  <!-- Synchronous small script to set early theme class before first paint -->
  <script src="/theme-init.js"></script>
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${appTitle}" />
    <meta property="og:description" content="${appDescription}" />
    <meta property="og:url" content="${appUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${appTitle}" />
    <meta name="twitter:description" content="${appDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
    ${cssLinks}
  </head>
  <body>
    <div id="root"></div>
  <script type="module" src="/${entry.file}"></script>
${analyticsScript}
  </body>
</html>`;

writeFileSync(resolve(clientDir, 'index.html'), html);
console.log('Generated index.html for SPA at', resolve(clientDir, 'index.html'));
