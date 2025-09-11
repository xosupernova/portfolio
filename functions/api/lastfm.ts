// Cloudflare Pages Function: Last.fm now playing proxy
// Hides API key from the client by performing the request server-side.

/**
 * Cloudflare automatically injects context (env, request, etc.).
 * Using untyped param to avoid dependency on PagesFunction type here.
 */
export const onRequestGet = async (context: any) => {
  const API_KEY = (context.env as any).VITE_LASTFM_API_KEY || (context.env as any).LASTFM_API_KEY;
  const USER = (context.env as any).VITE_LASTFM_USER || (context.env as any).LASTFM_USER;
  if (!API_KEY || !USER) {
    return new Response(JSON.stringify({ error: 'Not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(USER)}&api_key=${encodeURIComponent(API_KEY)}&format=json&limit=1`;
  try {
    const upstream = await fetch(url, { headers: { 'User-Agent': 'portfolio-site' } });
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: 'Upstream error' }), { status: upstream.status, headers: { 'Content-Type': 'application/json' } });
    }
    const data = await upstream.json();
    const track = data.recenttracks?.track?.[0];
    if (!track) return new Response(JSON.stringify({ track: null }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30' } });
    const payload = {
      artist: track.artist['#text'],
      name: track.name,
      album: track.album['#text'],
      image: track.image?.[2]?.['#text'] || '',
      url: track.url,
      nowPlaying: track['@attr']?.nowplaying === 'true'
    };
    return new Response(JSON.stringify({ track: payload }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=15' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
