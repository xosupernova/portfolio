/**
*  © 2025 Nova Bowley. All rights reserved.
*/
import { createFileRoute } from '@tanstack/react-router';
import { NowPlaying } from '../components/NowPlaying';
import { Typing } from '../components/typing';

function NowPlayingHome() {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center gap-12">
			<h1 className="text-5xl font-extrabold text-center mx-auto text-black dark:text-white">
				<Typing />
			</h1>
			<div
				className="relative flex justify-center items-center w-full mt-2 text-lg"
				style={{ minHeight: 80 }}
			>
				<NowPlaying />
			</div>
		</div>
	);
}

export const Route = createFileRoute('/')({
	component: NowPlayingHome,
	head: () => {
		return {
			title: '$ ./nova.sh --{Home}',
			meta: [
				{ name: 'description', content: 'Nova Bowley portfolio homepage' },
				{ name: 'author', content: 'Nova Bowley' },
				{ property: 'og:title', content: '$ ./nova.sh --{Home}' },
				{
					property: 'og:description',
					content: 'Nova Bowley portfolio homepage',
				},
				{ property: 'og:type', content: 'website' },
			],
			links: [
				{ rel: 'icon', href: '/favicon.ico' },
				{ rel: 'manifest', href: '/manifest.json' },
			],
		};
	},
});

// NowPlaying component moved to ../components/NowPlaying
