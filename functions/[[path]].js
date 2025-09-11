export async function onRequest(context) {
  const res = await context.next();
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return res;

  const url = new URL(context.request.url);
  const origin = url.origin;
  const hostname = url.hostname;

  // Derive a slug from the first path segment; root -> index
  const segments = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const slug = (segments[0] || 'index').toLowerCase();
  const routePath = segments.length ? `/${slug}` : '/';

  // Basic per-route title/description mapping; extend as needed
  const metaMap = {
    '/': { title: '$ ./nova.sh --{Home}', description: 'Nova Bowley portfolio homepage' },
    '/about': { title: '$ ./nova.sh --{About}', description: 'Nova Bowley portfolio about page' },
    '/projects': { title: '$ ./nova.sh --{Projects}', description: 'Nova Bowley portfolio projects page' },
    '/contact': { title: '$ ./nova.sh --{Contact}', description: 'Nova Bowley portfolio contact page' },
  };
  const meta = metaMap[routePath] || { title: 'Nova Bowley', description: 'Portfolio' };

  const img = `${origin}/meta/${slug}.png`;
  const pageUrl = `${origin}${url.pathname}`;

  const html = await res.text();

  // Remove conflicting default OG/Twitter tags that could confuse validators
  const patterns = [
    /<meta[^>]+property=["']og:(?:title|description|image|image:secure_url|type|url)["'][^>]*>\s*/gi,
    /<meta[^>]+name=["']twitter:(?:card|title|description|image|image:src|url)["'][^>]*>\s*/gi,
    /<meta[^>]+property=["']twitter:domain["'][^>]*>\s*/gi,
    /<link[^>]+rel=["']image_src["'][^>]*>\s*/gi,
  ];
  const cleaned = patterns.reduce((acc, re) => acc.replace(re, ''), html);

  const headOpen = cleaned.match(/<head[^>]*>/i);
  if (!headOpen) {
    return new Response(cleaned, { status: res.status, headers: res.headers });
  }

  const inject = [
    `<!-- og-meta injected slug=${slug} img=${img} -->`,
    `<title data-edge="1">${meta.title}</title>`,
    `<meta data-edge="1" name="description" content="${meta.description}">`,
    `<meta data-edge="1" property="og:title" content="${meta.title}">`,
    `<meta data-edge="1" property="og:description" content="${meta.description}">`,
    `<meta data-edge="1" property="og:url" content="${pageUrl}">`,
    `<meta data-edge="1" property=\"og:type\" content=\"website\">`,
    `<meta data-edge="1" property="og:image" content="${img}">`,
    `<meta data-edge="1" property="og:image:secure_url" content="${img}">`,
    `<meta data-edge="1" property="og:image:type" content="image/png">`,
    `<meta data-edge="1" name="twitter:card" content="summary_large_image">`,
    `<meta data-edge="1" name="twitter:title" content="${meta.title}">`,
    `<meta data-edge="1" name="twitter:description" content="${meta.description}">`,
    `<meta data-edge="1" name="twitter:url" content="${pageUrl}">`,
    `<meta data-edge="1" name="twitter:image" content="${img}">`,
    `<meta data-edge="1" name="twitter:image:src" content="${img}">`,
    `<meta data-edge="1" name="twitter:domain" content="${hostname}">`,
    `<link data-edge="1" rel="image_src" href="${img}">`,
  ].join('\n');

  const newHtml = cleaned.replace(headOpen[0], `${headOpen[0]}\n${inject}\n`);
  const headers = new Headers(res.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  return new Response(newHtml, { status: res.status, headers });
}
