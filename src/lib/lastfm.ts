/**
*  © 2025 Nova Bowley. All rights reserved.
*/
const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const USER = import.meta.env.VITE_LASTFM_USER;

export async function fetchNowPlaying() {
	if (!API_KEY || !USER) return null;
	const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USER}&api_key=${API_KEY}&format=json&limit=1`;
	const res = await fetch(url);
	if (!res.ok) return null;
	const data = await res.json();
	const track = data.recenttracks?.track?.[0];
	if (!track) return null;
	return {
		artist: track.artist['#text'],
		name: track.name,
		album: track.album['#text'],
		image: track.image?.[2]?.['#text'] || '',
		url: track.url,
		nowPlaying: track['@attr']?.nowplaying === 'true',
	};
}
