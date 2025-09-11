/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
export async function fetchNowPlaying() {
	try {
		const res = await fetch('/api/lastfm');
		if (!res.ok) return null;
		const payload = await res.json();
		return payload.track ?? null;
	} catch {
		return null;
	}
}
