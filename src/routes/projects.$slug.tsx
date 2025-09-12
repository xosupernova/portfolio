// @ts-nocheck
/**
 *  © 2025 Nova Bowley. All rights reserved.
 */

// biome-ignore assist/source/organizeImports: false positive
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { makeHead, resolveAbsUrl } from '@/lib/head';
import { fetchGithubReadme } from '@/lib/github';
import { findProject, type ProjectDef } from '@/lib/projects';

type LoaderData = {
	proj: ProjectDef | null;
	md: { markdown: string; url: string } | null;
};

function RouteComponent() {
	// Use this route's id so it works with both generated (nested) and manual trees
	const data = useLoaderData({ from: Route.id }) as LoaderData | undefined;
	const proj = data?.proj ?? null;
	const md = data?.md ?? null;
	const baseDir = md?.url ? new URL('.', md.url).toString() : undefined;

	if (!proj) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
				<p className="opacity-80">Project not found.</p>
				<Link to="/projects" className="underline">
					Back to Projects
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto px-6 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">{proj.title}</h1>
				<div className="flex gap-2 text-sm">
					<a
						href={`https://github.com/${proj.owner}/${proj.repo}`}
						target="_blank"
						rel="noreferrer"
						className="underline"
					>
						View on GitHub
					</a>
					{proj.homepage && (
						<a
							href={proj.homepage}
							target="_blank"
							rel="noreferrer"
							className="underline"
						>
							Website
						</a>
					)}
				</div>
			</div>
			{proj.description && (
				<p className="opacity-80 mb-8">{proj.description}</p>
			)}
			{proj.tags && proj.tags.length > 0 && (
				<div className="mb-6 flex flex-wrap gap-2">
					{proj.tags.map((t: string) => (
						<span
							key={t}
							className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs"
						>
							{t}
						</span>
					))}
				</div>
			)}
			<div className="markdown max-w-none text-base leading-relaxed space-y-4 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_code]:bg-black/5 dark:[&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_table]:w-full [&_th]:text-left [&_td]:align-top">
				{md?.markdown ? (
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							a: ({ href, children, ...props }) => {
								const rawHref = href || '';
								const isHttp = /^https?:\/\//i.test(rawHref);
								const resolved =
									!isHttp && baseDir
										? new URL(rawHref, baseDir).toString()
										: rawHref;
								return (
									<a
										{...props}
										href={resolved}
										target={isHttp ? '_blank' : undefined}
										rel={isHttp ? 'noopener noreferrer' : undefined}
										className="underline"
									>
										{children}
									</a>
								);
							},
							img: ({ src, alt, ...props }) => {
								let resolved = src || '';
								if (resolved && !/^https?:\/\//i.test(resolved) && baseDir) {
									resolved = new URL(resolved, baseDir).toString();
								}
								return (
									<img
										{...props}
										src={resolved}
										alt={alt || ''}
										loading="lazy"
									/>
								);
							},
						}}
					>
						{md.markdown}
					</ReactMarkdown>
				) : (
					<p className="opacity-70">README not found.</p>
				)}
			</div>
		</div>
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
