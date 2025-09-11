#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import https from 'node:https';

const cssEndpoint = 'https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;700&display=swap';

const outDir = resolve('public/fonts');
mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolvePromise, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('Failed to download ' + url + ' status ' + res.statusCode));
        return;
      }
      const data = [];
      res.on('data', (c) => data.push(c));
      res.on('end', () => {
        writeFileSync(dest, Buffer.concat(data));
        resolvePromise();
      });
    }).on('error', reject);
  });
}

function fetchCss(url) {
  return new Promise((resolvePromise, reject) => {
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path: reqUrl.pathname + reqUrl.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/css,*/*;q=0.1',
      },
    };
    https
      .get(options, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error('Failed to fetch CSS ' + url + ' status ' + res.statusCode));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolvePromise(Buffer.concat(chunks).toString('utf-8')));
      })
      .on('error', reject);
  });
}

(async () => {
  console.log('Fetching Google Sans Code font CSS...');
  const css = await fetchCss(cssEndpoint);
  const blocks = css.split('@font-face').slice(1);
  const byWeight = new Map();
  for (const raw of blocks) {
    const weight = /font-weight:\s*(\d+)/.exec(raw)?.[1];
    const url = /src:\s*url\((https:[^)]+\.woff2)\)/.exec(raw)?.[1];
    if (weight && url && !byWeight.has(weight)) {
      byWeight.set(weight, url);
    }
  }
  if (byWeight.size === 0) {
    console.warn('No woff2 URLs located; CSS:\n', css.slice(0, 500));
    return;
  }
  for (const [weight, fontUrl] of byWeight.entries()) {
    const file = resolve(outDir, `google-sans-code-${weight}.woff2`);
    if (process.env.CI) {
      console.log(`Ensuring font weight ${weight}`);
    }
    console.log('Downloading', fontUrl, '->', file);
    await download(fontUrl, file);
  }
  console.log('Downloaded weights:', [...byWeight.keys()].sort().join(', '));
})();
