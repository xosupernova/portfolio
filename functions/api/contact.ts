/**
*  © 2025 Nova Bowley. All rights reserved.
*/
// Cloudflare Pages Function: /api/contact (POST)
// Handles contact form submissions server-side, hides Discord webhook,
// extracts client IP, and rate limits (1 request per IP per 60s).

// If you bind a KV namespace named RATE_LIMIT_KV in your Cloudflare project,
// it will be used for distributed rate limiting. Otherwise falls back to an
// in-memory Map (best-effort, not durable across isolates).

// Minimal ambient types if Cloudflare types aren't installed.
// Remove if you add @cloudflare/workers-types dev dependency.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface KVNamespace { get(key: string): Promise<string | null>; put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>; }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PagesFunctionContext { request: Request; env: Record<string, any>; }
type PagesFunction = (context: PagesFunctionContext) => Promise<Response> | Response;

const MEMORY_WINDOW_MS = 60_000;
const memoryStore: Map<string, number> = new Map();

function getIp(req: Request): string {
  const headers = req.headers;
  return (
    headers.get('cf-connecting-ip') ||
    (headers.get('x-forwarded-for')?.split(',')[0].trim() || '') ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

async function checkRateLimit(ip: string, env: any): Promise<{ allowed: boolean; retryAfter?: number }> {
  // KV path
  const kv = (env as any).RATE_LIMIT_KV as KVNamespace | undefined;
  const key = `rl:${ip}`;
  const now = Date.now();
  if (kv) {
    const lastStr = await kv.get(key);
    if (lastStr) {
      const last = Number(lastStr);
      const diff = now - last;
      if (diff < MEMORY_WINDOW_MS) {
        return { allowed: false, retryAfter: Math.ceil((MEMORY_WINDOW_MS - diff) / 1000) };
      }
    }
    await kv.put(key, String(now), { expirationTtl: 60 });
    return { allowed: true };
  }
  // Memory fallback
  const last = memoryStore.get(ip) || 0;
  const diff = now - last;
  if (diff < MEMORY_WINDOW_MS) {
    return { allowed: false, retryAfter: Math.ceil((MEMORY_WINDOW_MS - diff) / 1000) };
  }
  memoryStore.set(ip, now);
  return { allowed: true };
}

function validateField(name: string, value: unknown, opts: { min?: number; max?: number; required?: boolean }): string | null {
  if (typeof value !== 'string') return `${name} invalid`;
  const v = value.trim();
  if (opts.required && !v) return `${name} required`;
  if (opts.min && v.length < opts.min) return `${name} too short`;
  if (opts.max && v.length > opts.max) return `${name} too long`;
  return null;
}

function json(status: number, data: any): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction = async (ctx) => {
  const { request, env } = ctx;
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });
  const ip = getIp(request);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const { name = '', email = '', subject = '', message = '', turnstileToken = '' } = body || {};
  // Verify Turnstile if configured
  if ((env as any).TURNSTILE_SECRET) {
    if (!turnstileToken) return json(400, { error: 'Turnstile token missing' });
    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: new URLSearchParams({ secret: (env as any).TURNSTILE_SECRET, response: turnstileToken, remoteip: ip }),
      });
      const verifyData: any = await verifyRes.json().catch(() => null);
      if (!verifyData?.success) {
        return json(400, { error: 'Turnstile validation failed', codes: verifyData?.['error-codes'] });
      }
    } catch {
      return json(400, { error: 'Turnstile validation error' });
    }
  }

  const errors: string[] = [];
  for (const err of [
    validateField('Name', name, { required: true, min: 1, max: 120 }),
    validateField('Email', email, { required: true, min: 3, max: 200 }),
    validateField('Subject', subject, { required: true, min: 1, max: 200 }),
    validateField('Message', message, { required: true, min: 10, max: 4000 }),
  ]) {
    if (err) errors.push(err);
  }
  if (errors.length) return json(400, { error: 'Validation failed', details: errors });

  // Basic email regex
  if (!/[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(email))) {
    return json(400, { error: 'Validation failed', details: ['Email invalid'] });
  }

  const { allowed, retryAfter } = await checkRateLimit(ip, env);
  if (!allowed) return json(429, { error: 'Rate limited', retryAfter });

  const webhook = (env as any).DISCORD_WEBHOOK as string | undefined;
  if (!webhook) return json(500, { error: 'Server not configured' });

  const trim = (str: string, max: number) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
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
      { name: 'Message', value: messagePreview.length ? safe(messagePreview) : '—' },
    ],
    footer: { text: 'Portfolio Contact Form' },
    timestamp: nowIso,
  };

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '', embeds: [embed], allowed_mentions: { parse: [] } }),
    });
    if (!res.ok) {
      return json(502, { error: 'Webhook failure', status: res.status });
    }
  } catch (e) {
    return json(502, { error: 'Webhook error' });
  }

  return json(200, { ok: true });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response('', { status: 204, headers: { 'Allow': 'POST, OPTIONS' } });
};
