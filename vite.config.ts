import { fileURLToPath, URL } from 'node:url';
import { wrapVinxiConfigWithSentry } from '@sentry/tanstackstart-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
	plugins: [
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ['./tsconfig.json'],
		}),
		tailwindcss(),
		tanstackStart({
			customViteReactPlugin: true,
		}),
		viteReact(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 3000,
		// Allow accessing the dev server via these hostnames/IPs (e.g. local network / tailscale / custom DNS)
		allowedHosts: ['illum', '100.84.34.69'],
	},
});

// Dev plugin to emulate Cloudflare Pages Function for /api/contact
const contactApiDevPlugin: Plugin = {
	name: 'dev-contact-function-shim',
	configureServer(server) {
		server.middlewares.use(async (req, res, next) => {
			if (req.url?.startsWith('/api/contact') && req.method === 'POST') {
				try {
					const chunks: Buffer[] = [];
					req.on('data', (c: Buffer) => chunks.push(c));
					await new Promise<void>((resolve) => req.on('end', () => resolve()));
					const bodyStr = Buffer.concat(chunks).toString('utf8') || '{}';
					const headerEntries: [string, string][] = [];
					for (const [k, v] of Object.entries(req.headers)) {
						if (Array.isArray(v)) headerEntries.push([k, v.join(',')]);
						else if (typeof v === 'string') headerEntries.push([k, v]);
					}
					const cfReq = new Request(`http://localhost:3000${req.url}`, {
						method: 'POST',
						headers: new Headers(headerEntries),
						body: bodyStr,
					});
					const { onRequestPost } = await import('./functions/api/contact.ts');
					const response = await onRequestPost({
						request: cfReq,
						env: process.env,
					});
					res.statusCode = response.status;
					response.headers.forEach((value, key) => res.setHeader(key, value));
					const respBody = await response.text();
					res.end(respBody);
					return;
				} catch (e) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.end(
						JSON.stringify({
							error: 'Dev function error',
							detail: (e as Error).message,
						}),
					);
					return;
				}
			}
			next();
		});
	},
};

// Append dev contact function shim
if (!config.plugins) {
	config.plugins = [];
}
config.plugins.push(contactApiDevPlugin);

export default wrapVinxiConfigWithSentry(config, {
	org: process.env.VITE_SENTRY_ORG,
	project: process.env.VITE_SENTRY_PROJECT,
	// Use server-only secret (no VITE_ prefix) so it never reaches client bundles
	authToken: process.env.SENTRY_AUTH_TOKEN,
	// Only print logs for uploading source maps in CI
	// Set to `true` to suppress logs
	silent: !process.env.CI,
});
