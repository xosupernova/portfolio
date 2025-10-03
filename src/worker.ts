/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
/**
 * Cloudflare Worker entry for Workers Git deploy
 * - Serves static SPA assets from Assets binding
 * - Implements /api/contact (POST, with optional Turnstile + KV rate limiting)
 * - Implements /api/lastfm (GET, server-side proxy to hide API key)
 */

// Minimal ambient types to avoid adding workers-types
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface KVNamespace {
	get(key: string): Promise<string | null>;
	put(
		key: string,
		value: string,
		opts?: { expirationTtl?: number },
	): Promise<void>;
}

type Env = {
	ASSETS: { fetch(req: Request): Promise<Response> };
	RATE_LIMIT_KV?: KVNamespace;
	// Secrets
	DISCORD_WEBHOOK?: string;
	TURNSTILE_SECRET?: string;
	LASTFM_API_KEY?: string;
	VITE_LASTFM_API_KEY?: string;
	LASTFM_USER?: string;
	VITE_LASTFM_USER?: string;
	// Git commit exposed via env (set in CI or CF vars)
	COMMIT_SHA?: string;
	VITE_COMMIT_SHA?: string;
};

const MEMORY_WINDOW_MS = 60_000;
const memoryStore: Map<string, number> = new Map();

function getIp(req: Request): string {
	const h = req.headers;
	return (
		h.get('cf-connecting-ip') ||
		h.get('x-forwarded-for')?.split(',')[0].trim() ||
		'' ||
		h.get('x-real-ip') ||
		'unknown'
	);
}

async function checkRateLimit(
	ip: string,
	env: Env,
): Promise<{ allowed: boolean; retryAfter?: number }> {
	const kv = env.RATE_LIMIT_KV;
	const key = `rl:${ip}`;
	const now = Date.now();
	if (kv) {
		const lastStr = await kv.get(key);
		if (lastStr) {
			const last = Number(lastStr);
			const diff = now - last;
			if (diff < MEMORY_WINDOW_MS) {
				return {
					allowed: false,
					retryAfter: Math.ceil((MEMORY_WINDOW_MS - diff) / 1000),
				};
			}
		}
		await kv.put(key, String(now), { expirationTtl: 60 });
		return { allowed: true };
	}
	const last = memoryStore.get(ip) || 0;
	const diff = now - last;
	if (diff < MEMORY_WINDOW_MS) {
		return {
			allowed: false,
			retryAfter: Math.ceil((MEMORY_WINDOW_MS - diff) / 1000),
		};
	}
	memoryStore.set(ip, now);
	return { allowed: true };
}

function json(
	status: number,
	data: unknown,
	extraHeaders?: HeadersInit,
): Response {
	const headers = new Headers({ 'Content-Type': 'application/json' });
	if (extraHeaders)
		new Headers(extraHeaders).forEach((v, k) => headers.set(k, v));
	return new Response(JSON.stringify(data), { status, headers });
}

async function handleContact(request: Request, env: Env): Promise<Response> {
	const ip = getIp(request);

	let body: Record<string, unknown> | undefined;
	try {
		body = await request.json();
	} catch {
		return json(400, { error: 'Invalid JSON' });
	}
	const {
		name = '',
		email = '',
		subject = '',
		message = '',
		turnstileToken = '',
	} = (body || {}) as Record<string, string>;

	if (env.TURNSTILE_SECRET) {
		if (!turnstileToken) return json(400, { error: 'Turnstile token missing' });
		try {
			const verifyRes = await fetch(
				'https://challenges.cloudflare.com/turnstile/v0/siteverify',
				{
					method: 'POST',
					body: new URLSearchParams({
						secret: env.TURNSTILE_SECRET,
						response: turnstileToken,
						remoteip: ip,
					}),
				},
			);
			const verifyData = (await verifyRes.json().catch(() => null)) as {
				success?: boolean;
				[k: string]: unknown;
			} | null;
			if (!verifyData?.success)
				return json(400, {
					error: 'Turnstile validation failed',
					codes: verifyData?.['error-codes'],
				});
		} catch {
			return json(400, { error: 'Turnstile validation error' });
		}
	}

	const errors: string[] = [];
	const validate = (
		name: string,
		v: unknown,
		o: { min?: number; max?: number; required?: boolean },
	) => {
		if (typeof v !== 'string') return `${name} invalid`;
		const s = v.trim();
		if (o.required && !s) return `${name} required`;
		if (o.min && s.length < o.min) return `${name} too short`;
		if (o.max && s.length > o.max) return `${name} too long`;
		return null;
	};
	for (const err of [
		validate('Name', name, { required: true, min: 1, max: 120 }),
		validate('Email', email, { required: true, min: 3, max: 200 }),
		validate('Subject', subject, { required: true, min: 1, max: 200 }),
		validate('Message', message, { required: true, min: 10, max: 4000 }),
	]) {
		if (err) errors.push(err);
	}
	if (errors.length)
		return json(400, { error: 'Validation failed', details: errors });
	if (!/[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(email)))
		return json(400, {
			error: 'Validation failed',
			details: ['Email invalid'],
		});

	const { allowed, retryAfter } = await checkRateLimit(ip, env);
	if (!allowed) return json(429, { error: 'Rate limited', retryAfter });

	const webhook = env.DISCORD_WEBHOOK;
	if (!webhook) return json(500, { error: 'Server not configured' });

	const trim = (str: string, max: number) =>
		str.length > max ? `${str.slice(0, max - 3)}...` : str;
	const safe = (str: string) => String(str).replace(/```/g, '\u200b```');
	const nowIso = new Date().toISOString();
	const messagePreview = trim(String(message), 1900);
	const embed = {
		title: 'New Contact Message',
		description: trim(safe(subject || 'No subject'), 200),
		color: 0x6366f1,
		fields: [
			{ name: 'Name', value: trim(safe(name) || '—', 256), inline: true },
			{ name: 'Email', value: trim(safe(email) || '—', 256), inline: true },
			{ name: 'IP', value: ip, inline: true },
			{ name: '\u200b', value: '\u200b', inline: true },
			{
				name: 'Message',
				value: messagePreview.length ? safe(messagePreview) : '—',
			},
		],
		footer: { text: 'Portfolio Contact Form' },
		timestamp: nowIso,
	};

	try {
		const res = await fetch(webhook, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				content: '',
				embeds: [embed],
				allowed_mentions: { parse: [] },
			}),
		});
		if (!res.ok)
			return json(502, { error: 'Webhook failure', status: res.status });
	} catch {
		return json(502, { error: 'Webhook error' });
	}

	return json(200, { ok: true });
}

async function handleLastfm(_request: Request, env: Env): Promise<Response> {
	const API_KEY = env.VITE_LASTFM_API_KEY || env.LASTFM_API_KEY;
	const USER = env.VITE_LASTFM_USER || env.LASTFM_USER;
	// If not configured, return a quiet 200 with no track to avoid noisy 500s in dev
	if (!API_KEY || !USER)
		return new Response(JSON.stringify({ track: null }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store',
			},
		});
	const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(USER)}&api_key=${encodeURIComponent(API_KEY)}&format=json&limit=1`;
	try {
		const upstream = await fetch(url, {
			headers: { 'User-Agent': 'portfolio-site' },
		});
		if (!upstream.ok) return json(upstream.status, { error: 'Upstream error' });
		const data = await upstream.json();
		const track = data.recenttracks?.track?.[0];
		if (!track)
			return new Response(JSON.stringify({ track: null }), {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'public, max-age=30',
				},
			});
		const payload = {
			artist: track.artist['#text'],
			name: track.name,
			album: track.album['#text'],
			image: track.image?.[2]?.['#text'] || '',
			url: track.url,
			nowPlaying: track['@attr']?.nowplaying === 'true',
		};
		return new Response(JSON.stringify({ track: payload }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=15',
			},
		});
	} catch {
		return json(500, { error: 'Fetch failed' });
	}
}

async function handlePlacement(request: Request, env?: Env): Promise<Response> {
	// Prefer platform-provided header if available
	const hdr =
		request.headers.get('cf-placement') ||
		request.headers.get('CF-Placement') ||
		'';
	// Fallback to request.cf info in Workers, or 'dev' locally
	const cf = (request as unknown as { cf?: Record<string, unknown> }).cf || {};
	const colo = (cf as { colo?: string }).colo || null;
	const country = (cf as { country?: string }).country || null;
	const city = (cf as { city?: string }).city || null;
	const ray = request.headers.get('cf-ray') || null;
	const commit =
		((env?.VITE_COMMIT_SHA || env?.COMMIT_SHA || '') as string).slice(0, 7) ||
		null;
	return new Response(
		JSON.stringify({
			placement: hdr || colo || 'dev',
			colo,
			country,
			city,
			httpHeader: hdr || null,
			ray,
			commit,
		}),
		{
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store',
			},
		},
	);
}

function corsify(res: Response, origin?: string): Response {
	const hdrs = new Headers(res.headers);
	hdrs.set('Access-Control-Allow-Origin', origin || '*');
	hdrs.set('Vary', 'Origin');
	hdrs.set('Access-Control-Allow-Headers', 'Content-Type');
	hdrs.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	return new Response(res.body, { status: res.status, headers: hdrs });
}

async function serveAssetWithSpaFallback(
	request: Request,
	env: Env,
): Promise<Response> {
	const res = await env.ASSETS.fetch(request);
	if (res.status !== 404) return res;
	// SPA fallback to index.html
	const url = new URL(request.url);
	const indexReq = new Request(new URL('/index.html', url).toString(), request);
	return env.ASSETS.fetch(indexReq);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === '/api/contact') {
			if (request.method === 'OPTIONS')
				return corsify(new Response('', { status: 204 }));
			if (request.method !== 'POST')
				return corsify(json(405, { error: 'Method not allowed' }));
			const res = await handleContact(request, env);
			return corsify(res);
		}
		if (url.pathname === '/api/lastfm') {
			const res = await handleLastfm(request, env);
			return corsify(res);
		}
		if (url.pathname === '/api/placement') {
			if (request.method === 'OPTIONS')
				return corsify(new Response('', { status: 204 }));
			const res = await handlePlacement(request, env);
			return corsify(res);
		}
		return serveAssetWithSpaFallback(request, env);
	},
};
