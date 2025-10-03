/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { Typing } from '@/components';
import { makeHead, resolveAbsUrl } from '@/lib/head';

const NowPlaying = React.lazy(() => import('@/components/media/NowPlaying'));

function NowPlayingHome() {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center gap-12">
			{
				<h1 className="text-5xl font-extrabold text-center mx-auto text-black dark:text-white">
					<Typing />
				</h1>
			}
			<React.Suspense
				fallback={<div className="text-sm opacity-60">Loading music…</div>}
			>
				<div className="relative flex justify-center items-center w-full mt-2 text-lg min-h-20">
					<NowPlaying />
				</div>
			</React.Suspense>
		</div>
	);
}

export const Route = createFileRoute('/')({
	component: NowPlayingHome,
	head: () => {
		const url = resolveAbsUrl('/');
		const img = resolveAbsUrl('/img/meta/index.png');
		return makeHead({
			title: '$ ./nova.sh --{Home}',
			description: 'Nova Bowley portfolio homepage',
			ogTitle: '$ ./nova.sh --{Home}',
			ogDescription: 'Nova Bowley portfolio homepage',
			ogUrl: url,
			ogImage: img,
			twitterCard: 'summary_large_image',
			twitterTitle: '$ ./nova.sh --{Home}',
			twitterDescription: 'Nova Bowley portfolio homepage',
			twitterImage: img,
		});
	},
});
