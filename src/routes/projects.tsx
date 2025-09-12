/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import {
	createFileRoute,
	Link,
	Outlet,
	useMatchRoute,
} from '@tanstack/react-router';
import { makeHead, resolveAbsUrl } from '@/lib/head';
import { PROJECTS } from '@/lib/projects';

function RouteComponent() {
	const matchRoute = useMatchRoute();
	// When a child slug route is active, render only the child via Outlet
	const isDetail = !!matchRoute({ to: '/projects/$slug', fuzzy: true });

	if (isDetail) {
		return (
			<div className="max-w-5xl mx-auto px-6 py-12">
				<Outlet />
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto px-6 py-12">
			<h1 className="text-4xl font-extrabold mb-6">Projects</h1>
			<p className="opacity-80 mb-8">A curated selection of my public work.</p>
			<ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{PROJECTS.map((p) => (
					<li
						key={p.slug}
						className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur overflow-hidden"
					>
						<div className="w-full aspect-[16/9] bg-black/5 dark:bg-white/5">
							{p.image ? (
								<img
									src={p.image}
									alt={p.imageAlt || `${p.title} preview`}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
							) : (
								<img
									src={`https://opengraph.githubassets.com/1/${p.owner}/${p.repo}`}
									alt={`${p.title} preview`}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
							)}
						</div>
						<div className="p-5">
							<h2 className="text-xl font-semibold mb-1">{p.title}</h2>
							{p.description && (
								<p className="text-sm opacity-80 mb-3">{p.description}</p>
							)}
							{p.tags && p.tags.length > 0 && (
								<div className="mb-3 flex flex-wrap gap-2">
									{p.tags.map((t) => (
										<span
											key={t}
											className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs"
										>
											{t}
										</span>
									))}
								</div>
							)}
							<div className="flex gap-3 text-sm">
								<Link
									to="/projects/$slug"
									params={{ slug: p.slug }}
									className="underline"
								>
									Readme
								</Link>
								<a
									href={`https://github.com/${p.owner}/${p.repo}`}
									target="_blank"
									rel="noreferrer"
									className="underline"
								>
									GitHub
								</a>
								{p.homepage && (
									<a
										href={p.homepage}
										target="_blank"
										rel="noreferrer"
										className="underline"
									>
										Website
									</a>
								)}
							</div>
						</div>
					</li>
				))}
			</ul>
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
