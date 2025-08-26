/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useMatches,
} from '@tanstack/react-router';
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
	// biome-ignore lint/suspicious/noExplicitAny: false positive
	notFoundComponent: (props: any) => {
		const status = props?.error?.status || 404;
		const statusText = props?.error?.statusText || 'Not Found';
		const dogImg = `https://http.dog/${status}.jpg`;
		return (
			<div className="flex flex-col items-center justify-center min-h-screen text-center">
				<h1 className="text-4xl font-bold mb-4">
					{status} - {statusText}
				</h1>
				<p className="mb-4">
					Uh oh! You hit a page that doesn't exist or something went wrong.
				</p>
				<img
					src={dogImg}
					alt={`HTTP ${status} Dog`}
					className="rounded shadow mb-6 max-w-xs mx-auto"
					style={{ maxHeight: 300 }}
				/>
				<p className="mb-8 text-lg font-mono">
					Even the dog can't find this page.
				</p>
				<a href="/" className="text-blue-500 underline">
					Go Home
				</a>
			</div>
		);
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const matches = useMatches();
	let pageTitle = 'Nova Bowley';
	for (let i = matches.length - 1; i >= 0; i--) {
		// biome-ignore lint/suspicious/noExplicitAny: dynamic route meta resolution
		const m: any = matches[i];
		// biome-ignore lint/suspicious/noExplicitAny: dynamic route meta resolution
		const r: any = m?.routeContext?.route || m?.route;
		const headFn = r?.options?.head;
		try {
			const h =
				typeof headFn === 'function'
					? headFn({ params: m.params, matches })
					: null;
			if (h?.title) {
				pageTitle = h.title;
				break;
			}
		} catch {}
	}
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

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<title>{pageTitle}</title>
				<HeadContent />
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: needed for early theme set
					dangerouslySetInnerHTML={{
						__html: `(() => {try {const m=document.cookie.match(/(?:^|; )theme=([^;]+)/);const raw=m?decodeURIComponent(m[1]):null;const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;let wantDark=prefersDark;if(raw==='light') wantDark=false; else if(raw==='dark') wantDark=true; document.documentElement.classList.toggle('dark',wantDark);}catch(e){}})();`,
					}}
				/>
			</head>
			<body className="min-h-screen flex flex-col text-black dark:text-white bg-gradient-to-br from-gray-50 via-white to-gray-200 dark:bg-gradient-to-br dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
				<TooltipProvider delayDuration={200}>
					<ToastProvider swipeDirection="right">
						<Header />
						<main className="flex-1 w-full pb-40">{children}</main>
						<Footer />
						<TanStackRouterDevtools />
						<Scripts />
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
								Thanks{contactName ? `, ${contactName}` : ''}! I'll reply soon.
							</ToastDescription>
							<ToastClose />
						</Toast>
						<ToastViewport />
					</ToastProvider>
				</TooltipProvider>
			</body>
		</html>
	);
}
