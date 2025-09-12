/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useRouterState,
} from '@tanstack/react-router';

// Allow Vite define replacement for SPA build guard
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __SPA_BUILD__: boolean | undefined;

import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect, useState } from 'react';
import {
	Footer,
	Header,
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	TooltipProvider,
} from '@/components';
import { env } from '@/env';
import appCss from '../styles/app.css?url';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		],
		links: [{ rel: 'stylesheet', href: appCss }],
	}),
	shellComponent: RootDocument,
	// biome-ignore lint/suspicious/noExplicitAny: dynamic error prop per router api
	notFoundComponent: (props: any) => {
		const status = props?.error?.status || 404;
		const statusText = props?.error?.statusText || 'Not Found';

		interface MemePost {
			id: string;
			title: string;
			url: string;
			permalink: string;
		}

		interface RedditChildData {
			id: string;
			title: string;
			url?: string;
			permalink: string;
			over_18: boolean;
			preview?: {
				images: Array<{
					source: { url: string };
				}>;
			};
			post_hint?: string;
		}

		interface RedditListing {
			data?: {
				children?: Array<{ data?: RedditChildData }>;
			};
		}

		const [meme, setMeme] = useState<MemePost | null>(null);
		const [loading, setLoading] = useState(true);
		const [error, setError] = useState<string | null>(null);

		useEffect(() => {
			let aborted = false;
			(async () => {
				try {
					setLoading(true);
					setError(null);
					// Fetch a batch of hot posts then pick a random SFW image
					const res = await fetch(
						'https://www.reddit.com/r/GreatBritishMemes/hot.json?limit=50',
						{ headers: { Accept: 'application/json' } },
					);
					if (!res.ok) throw new Error(`HTTP ${res.status}`);
					const json: RedditListing = await res.json();
					const rawChildren = json?.data?.children ?? [];
					const candidates: MemePost[] = rawChildren
						.map((c) => c.data)
						.filter((d): d is RedditChildData => !!d && !d.over_18)
						.filter(
							(d) =>
								/\.(png|jpe?g|gif|webp)$/i.test(d.url || '') ||
								(d.post_hint === 'image' && !!d.preview?.images?.length),
						)
						.map((d) => {
							let imageUrl: string | undefined = d.url;
							if (!imageUrl || !/\.(png|jpe?g|gif|webp)$/i.test(imageUrl)) {
								const first = d.preview?.images?.[0]?.source?.url;
								if (first) imageUrl = first.replace(/&amp;/g, '&');
							}
							return {
								id: d.id,
								title: d.title,
								url: imageUrl || '',
								permalink: `https://reddit.com${d.permalink}`,
							};
						});
					if (candidates.length) {
						const pick =
							candidates[Math.floor(Math.random() * candidates.length)];
						if (!aborted) setMeme(pick);
					} else if (!aborted) {
						setError('No meme images found.');
					}
				} catch (e: unknown) {
					if (!aborted)
						setError(
							typeof e === 'object' && e && 'message' in e
								? String((e as { message?: string }).message)
								: 'Failed to load meme',
						);
				} finally {
					if (!aborted) setLoading(false);
				}
			})();
			return () => {
				aborted = true;
			};
		}, []);

		const fallbackDog = `https://http.dog/${status}.jpg`;

		return (
			<div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
				<h1 className="text-4xl font-bold mb-4">
					{status} - {statusText}
				</h1>
				<p className="mb-4 max-w-prose">
					Uh oh! You hit a page that doesn't exist or something went wrong.
					Here's a random British meme instead.
				</p>
				<div className="mb-6 w-full max-w-md flex flex-col items-center">
					{loading && (
						<div className="animate-pulse h-64 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
					)}
					{!loading && meme && !error && (
						<a
							href={meme.permalink}
							target="_blank"
							rel="noopener noreferrer"
							className="group"
						>
							<img
								src={meme.url}
								alt={meme.title}
								className="rounded shadow mb-3 max-h-96 w-auto mx-auto group-hover:scale-[1.02] transition-transform"
								loading="lazy"
							/>
							<p className="text-xs text-neutral-600 dark:text-neutral-400 truncate max-w-md px-2">
								{meme.title}
							</p>
						</a>
					)}
					{!loading && (error || (!meme && !error)) && (
						<img
							src={fallbackDog}
							alt={`HTTP ${status} Dog`}
							className="rounded shadow mb-3 max-h-80 w-auto mx-auto"
						/>
					)}
					{error && <p className="text-xs text-red-500 mb-2">{error}</p>}
				</div>
				<p className="mb-8 text-lg font-mono">
					{meme
						? 'At least the meme made it here.'
						: 'Even the dog cannot find this page.'}
				</p>
				<a href="/" className="text-blue-500 underline">
					Go Home
				</a>
			</div>
		);
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	function EdgeHeadCleanup() {
		const pathname = useRouterState({ select: (s) => s.location.pathname });
		useEffect(() => {
			// touch dependency so linter understands intent to re-run on pathname changes
			void pathname;
			// Immediately remove server-injected non-title tags to avoid duplicates
			const nonTitleNodes = document.head.querySelectorAll(
				'[data-edge="1"]:not(title)',
			);
			nonTitleNodes.forEach((n) => n.parentElement?.removeChild(n));
			// Always keep the current title element; just strip the data-edge marker if present
			const edgeTitles = document.head.querySelectorAll('title[data-edge="1"]');
			edgeTitles.forEach((t) => t.removeAttribute('data-edge'));
		}, [pathname]);
		// Also run once on mount for the initial load in SPA shell
		useEffect(() => {
			const nonTitleNodes = document.head.querySelectorAll(
				'[data-edge="1"]:not(title)',
			);
			nonTitleNodes.forEach((n) => n.parentElement?.removeChild(n));
			const edgeTitles = document.head.querySelectorAll('title[data-edge="1"]');
			edgeTitles.forEach((t) => t.removeAttribute('data-edge'));
		}, []);
		return null;
	}
	// RootDocument now relies on HeadContent to render titles provided by route head() functions.
	// Toast state for contact success
	const [open, setOpen] = useState(false);
	const [contactName, setContactName] = useState<string | null>(null);
	useEffect(() => {
		function onSuccess(e: Event) {
			const detail = (e as CustomEvent).detail as { name?: string } | undefined;
			setContactName(detail?.name || null);
			setOpen(true);
		}
		window.addEventListener('contact:success', onSuccess as EventListener);
		return () =>
			window.removeEventListener('contact:success', onSuccess as EventListener);
	}, []);

	// Optional diagnostic flag (not in strict schema yet)
	// Diagnostic minimal flag removed (always render full shell in production SPA)
	const minimal = false;
	// In pure SPA build we already have an <html> shell from index.html; avoid nesting in hydration.
	if (typeof __SPA_BUILD__ !== 'undefined') {
		return (
			<div className="min-h-screen flex flex-col text-black dark:text-white bg-gradient-to-br from-gray-50 via-white to-gray-200 dark:bg-gradient-to-br dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
				{/* Head manager (injects per-route meta) */}
				<HeadContent />
				<EdgeHeadCleanup />
				{
					<TooltipProvider delayDuration={200}>
						<ToastProvider swipeDirection="right">
							<Header />
							<main className="flex-1 w-full pb-40">{children}</main>
							<Footer />
							{env.VITE_ENABLE_DEVTOOLS === 'true' && (
								<TanStackRouterDevtools />
							)}
							<Toast
								variant="success"
								open={open}
								onOpenChange={setOpen}
								duration={4500}
							>
								<ToastTitle className="flex items-center font-semibold">
									<span className="inline-flex items-center justify-center mr-2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 size-6">
										<svg
											viewBox="0 0 24 24"
											className="size-4"
											aria-hidden="true"
										>
											<path
												fill="currentColor"
												d="M9.55 17.6 4.3 12.35l1.4-1.4 3.85 3.85 8.75-8.75 1.4 1.4Z"
											/>
										</svg>
									</span>
									Message Sent
								</ToastTitle>
								<ToastDescription className="text-emerald-700 dark:text-emerald-200">
									Thanks{contactName ? `, ${contactName}` : ''}! I'll reply
									soon.
								</ToastDescription>
								<ToastClose />
							</Toast>
							<ToastViewport />
						</ToastProvider>
					</TooltipProvider>
				}
			</div>
		);
	}

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: cleanup script
					dangerouslySetInnerHTML={{
						__html: `(() => { try { 
						// Remove non-title server-injected tags synchronously
						var nonTitles = document.head.querySelectorAll('[data-edge="1"]:not(title)');
						nonTitles.forEach(function(n){ n.parentElement && n.parentElement.removeChild(n); });
						// Title strategy:
						// If a client title exists, remove the server one; otherwise keep it by stripping data-edge.
						var edgeTitle = document.head.querySelector('title[data-edge="1"]');
						var clientTitle = document.head.querySelector('title:not([data-edge="1"])');
						if (edgeTitle && clientTitle) {
							edgeTitle.parentElement && edgeTitle.parentElement.removeChild(edgeTitle);
						} else if (edgeTitle && !clientTitle) {
							edgeTitle.removeAttribute('data-edge');
						}
					} catch(_) {} })();`,
					}}
				/>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: needed for early theme set
					dangerouslySetInnerHTML={{
						__html: `(() => {try {const m=document.cookie.match(/(?:^|; )theme=([^;]+)/);const raw=m?decodeURIComponent(m[1]):null;const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;let wantDark=prefersDark;if(raw==='light') wantDark=false; else if(raw==='dark') wantDark=true; document.documentElement.classList.toggle('dark',wantDark);}catch(e){}})();`,
					}}
				/>
			</head>
			<body className="min-h-screen flex flex-col text-black dark:text-white bg-gradient-to-br from-gray-50 via-white to-gray-200 dark:bg-gradient-to-br dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
				{minimal ? (
					<main className="flex-1 w-full p-4">
						<p className="text-sm opacity-70">
							Diagnostic minimal shell active.
						</p>
						{children}
					</main>
				) : (
					<TooltipProvider delayDuration={200}>
						<ToastProvider swipeDirection="right">
							<Header />
							<main className="flex-1 w-full pb-40">{children}</main>
							<Footer />
							{env.VITE_ENABLE_DEVTOOLS === 'true' && (
								<TanStackRouterDevtools />
							)}
							<Toast
								variant="success"
								open={open}
								onOpenChange={setOpen}
								duration={4500}
							>
								<ToastTitle className="flex items-center font-semibold">
									<span className="inline-flex items-center justify-center mr-2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 size-6">
										<svg
											viewBox="0 0 24 24"
											className="size-4"
											aria-hidden="true"
										>
											<path
												fill="currentColor"
												d="M9.55 17.6 4.3 12.35l1.4-1.4 3.85 3.85 8.75-8.75 1.4 1.4Z"
											/>
										</svg>
									</span>
									Message Sent
								</ToastTitle>
								<ToastDescription className="text-emerald-700 dark:text-emerald-200">
									Thanks{contactName ? `, ${contactName}` : ''}! I'll reply
									soon.
								</ToastDescription>
								<ToastClose />
							</Toast>
							<ToastViewport />
						</ToastProvider>
					</TooltipProvider>
				)}
				<Scripts />
			</body>
		</html>
	);
}
