/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { createFileRoute } from '@tanstack/react-router';

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
		return {
			title: '$ ./nova.sh --{Projects}',
			meta: [
				{ name: 'description', content: 'Nova Bowley portfolio projects page' },
				{ name: 'author', content: 'Nova Bowley' },
				{ property: 'og:title', content: '$ ./nova.sh --{Projects}' },
				{
					property: 'og:description',
					content: 'Nova Bowley portfolio projects page',
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
