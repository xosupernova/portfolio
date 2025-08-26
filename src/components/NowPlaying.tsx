/**
*  © 2025 Nova Bowley. All rights reserved.
*/
import * as React from 'react';
import { fetchNowPlaying } from '../lib/lastfm';

export type Track = {
	artist: string;
	name: string;
	album: string;
	image: string;
	url: string;
	nowPlaying: boolean;
};

// Last.fm generic placeholder hash fragment (transparent square)
const LASTFM_PLACEHOLDER_HASH = '2a96cbd8b46e442fc41c2b86b821562f';

function isValidImage(url: string | undefined) {
	if (!url) return false;
	if (url.length < 9) return false;
	if (url.includes('noimage')) return false;
	if (url.endsWith('/')) return false;
	if (url.includes(LASTFM_PLACEHOLDER_HASH)) return false;
	return true;
}

// Simple in-memory cache to avoid repeated iTunes lookups within a session
const artCache = new Map<string, string>();

async function lookupItunesArt(artist: string, name: string, album?: string) {
	const key = `${artist}::${name}::${album || ''}`.toLowerCase();
	if (artCache.has(key)) return artCache.get(key) || null;
	const songQ = encodeURIComponent(`${artist} ${name}`);
	const tryFetch = async (q: string, entity: 'song' | 'album') => {
		try {
			const res = await fetch(
				`https://itunes.apple.com/search?term=${q}&entity=${entity}&limit=1`,
			);
			if (!res.ok) return null;
			const json = await res.json();
			const raw = json.results?.[0]?.artworkUrl100 as string | undefined;
			if (!raw) return null;
			// Upgrade size 100 -> 300 -> 512 if possible
			return raw.replace('100x100bb', '512x512bb');
		} catch {
			return null;
		}
	};
	let art = await tryFetch(songQ, 'song');
	if (!art) {
		const albumQ = encodeURIComponent(`${artist} ${album || name}`);
		art = await tryFetch(albumQ, 'album');
	}
	if (art) artCache.set(key, art);
	return art;
}

export function NowPlaying() {
	// Start with empty state so SSR & first client render produce identical HTML.
	// We'll hydrate from localStorage & network after mount to avoid hydration mismatch.
	const [hydrated, setHydrated] = React.useState(false);
	const [track, setTrack] = React.useState<Track | null>(null);
	const [albumArt, setAlbumArt] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [imageError, setImageError] = React.useState(false);

	React.useEffect(() => {
		let isMounted = true;
		setHydrated(true);

		// First, attempt to hydrate from localStorage (client only)
		try {
			const raw = localStorage.getItem('nowPlaying:lastTrack');
			if (raw) {
				const parsed = JSON.parse(raw);
				if (
					parsed &&
					typeof parsed === 'object' &&
					'artist' in parsed &&
					'name' in parsed
				) {
					setTrack(parsed as Track);
					setLoading(false);
				}
			}
			const art = localStorage.getItem('nowPlaying:lastAlbumArt');
			if (art) setAlbumArt(art);
		} catch {}

		const fetchAndSet = async () => {
			const data = await fetchNowPlaying();
			if (!isMounted) return;
			setTrack(data);
			let foundArt: string | null = null;
			if (data && !isValidImage(data.image)) {
				foundArt = await lookupItunesArt(data.artist, data.name, data.album);
				if (isMounted) setAlbumArt(foundArt);
			}
			setLoading(false);
			try {
				localStorage.setItem('nowPlaying:lastTrack', JSON.stringify(data));
				if (foundArt) localStorage.setItem('nowPlaying:lastAlbumArt', foundArt);
			} catch {}
		};

		fetchAndSet();
		const interval = setInterval(fetchAndSet, 10000);
		return () => {
			isMounted = false;
			clearInterval(interval);
		};
	}, []);

	// Render a stable placeholder during SSR & first client render to avoid hydration mismatch.
	if (!hydrated) {
		return <div style={{ minHeight: 80 }} />;
	}

	if (loading) return <div>Loading now playing…</div>;
	if (!track) return <div>Not playing anything right now.</div>;

	const imageSrc =
		!imageError && isValidImage(track.image) ? track.image : albumArt;

	return (
		<a
			href={track.url}
			target="_blank"
			rel="noopener noreferrer"
			className="now-playing bg-gray-800 flex items-center gap-4 p-6 rounded-xl shadow-2xl transition-colors hover:bg-gray-700"
			title={track.album ? `Album: ${track.album}` : undefined}
		>
			{imageSrc ? (
				<img
					src={imageSrc}
					alt={track.album || 'Album Art'}
					className="w-16 h-16 object-cover rounded shadow"
					onError={async () => {
						if (!albumArt) {
							const art = await lookupItunesArt(
								track.artist,
								track.name,
								track.album,
							);
							if (art) {
								setAlbumArt(art);
								return;
							}
						}
						setImageError(true);
					}}
				/>
			) : (
				<div className="w-40 h-40 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded shadow text-2xl">
					<span role="img" aria-label="music">
						🎵
					</span>
				</div>
			)}
			<div className="flex flex-col">
				<span className="font-semibold">
					{track.name}
					{track.nowPlaying && (
						<span className="ml-2 text-xs text-green-600">(Now Playing)</span>
					)}
				</span>
				<span className="text-sm text-gray-300 dark:text-gray-300">
					{track.artist}
				</span>
			</div>
		</a>
	);
}

export default NowPlaying;
