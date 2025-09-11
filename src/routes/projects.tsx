/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { createFileRoute } from '@tanstack/react-router';
import { makeHead, resolveAbsUrl } from '@/lib/head';

function RouteComponent() {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center gap-12">
			<h1 className="text-5xl font-extrabold text-center mx-auto text-black dark:text-white">
				Projects Coming Soon™
			</h1>
		</div>
	);
}

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
	head: () => {
		const url = resolveAbsUrl('/projects');
		const img = resolveAbsUrl('/meta/projects.png');
		return makeHead({
			title: '$ ./nova.sh --{Projects}',
			description: 'Nova Bowley portfolio projects page',
			ogTitle: '$ ./nova.sh --{Projects}',
			ogDescription: 'Nova Bowley portfolio projects page',
			ogUrl: url,
			ogImage: img,
			twitterCard: 'summary_large_image',
			twitterTitle: '$ ./nova.sh --{Projects}',
			twitterDescription: 'Nova Bowley portfolio projects page',
			twitterImage: img,
		});
	},
});
