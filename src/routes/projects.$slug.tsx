// @ts-nocheck
/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */

import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { fetchGithubReadme } from '@/lib/github';
import { makeHead, resolveAbsUrl } from '@/lib/head';
import type { ProjectDef } from '@/lib/projects';
import { findProject } from '@/lib/projects';

const ProjectsSlugView = React.lazy(() => import('./projects.$slug.view'));

type LoaderData = {
	proj: ProjectDef | null;
	md: { markdown: string; url: string } | null;
};

function RouteComponent() {
	const data = useLoaderData({ from: Route.id }) as LoaderData | undefined;
	const proj = data?.proj ?? null;
	const md = data?.md ?? null;
	return (
		<Suspense
			fallback={
				<div className="py-10 text-center opacity-70">Loading README…</div>
			}
		>
			<ProjectsSlugView proj={proj} md={md} />
		</Suspense>
	);
}

export const Route = createFileRoute('/projects/$slug')({
	loader: async ({ params }) => {
		const proj = findProject(params.slug);
		if (!proj) return { proj: null, md: null } as const;
		const mdRes = await fetchGithubReadme(proj.owner, proj.repo, proj.branch);
		return { proj, md: mdRes } as const;
	},
	head: ({ loaderData }) => {
		const ld = loaderData as LoaderData | undefined;
		const title = ld?.proj
			? `$ ./nova.sh --{${ld.proj.title}}`
			: '$ ./nova.sh --{Projects}';
		const desc = ld?.proj?.description || 'Project details';
		const url = resolveAbsUrl(`/projects/${ld?.proj?.slug ?? ''}`);
		const img = resolveAbsUrl('/img/meta/projects.png');
		return makeHead({
			title,
			description: desc,
			ogTitle: title,
			ogDescription: desc,
			ogUrl: url,
			ogImage: img,
			twitterCard: 'summary_large_image',
			twitterTitle: title,
			twitterDescription: desc,
			twitterImage: img,
		});
	},
	component: RouteComponent,
});
