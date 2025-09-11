/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { Icon } from '@iconify/react';
import { useEffect, useRef } from 'react';

export type TurnstileStatus = 'idle' | 'loading' | 'rendered' | 'error';

interface TurnstileWidgetProps {
	siteKey?: string;
	bypass?: boolean;
	status: TurnstileStatus;
	setStatus: (s: TurnstileStatus) => void;
	token: string | null;
	setToken: (t: string | null) => void;
	className?: string;
	// When true, don't load remote Turnstile script; simulate success locally.
	localFallback?: boolean;
}

/**
 * Lazy-loading Cloudflare Turnstile widget. Loads script only when in/near viewport.
 */
export function TurnstileWidget({
	siteKey,
	bypass,
	status,
	setStatus,
	token,
	setToken,
	className,
	localFallback,
}: TurnstileWidgetProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!siteKey || bypass) return;
		if (!containerRef.current) return;
		if (localFallback) {
			setStatus('rendered');
			setToken('local-dev-token');
			return;
		}

		const scriptRequested = { current: false };

		const loadTurnstile = () => {
			if (scriptRequested.current) return;
			scriptRequested.current = true;
			setStatus('loading');

			const render = () => {
				if (!containerRef.current) return;
				if (containerRef.current.firstChild) return;
				// @ts-expect-error turnstile global
				if (!window.turnstile) return;
				try {
					// @ts-expect-error turnstile global
					window.turnstile.render(containerRef.current, {
						sitekey: siteKey,
						theme: 'auto',
						callback: (tok: string) => {
							setToken(tok);
							setStatus('rendered');
						},
						'error-callback': () => {
							setToken(null);
							setStatus('error');
						},
						'expired-callback': () => {
							setToken(null);
							setStatus('idle');
						},
					});
				} catch {
					setStatus('error');
				}
			};

			const existing = document.querySelector(
				'script[data-turnstile]',
			) as HTMLScriptElement | null;
			if (existing) {
				existing.addEventListener('load', render, { once: true });
				// @ts-expect-error turnstile global
				if (window.turnstile) setTimeout(render, 0);
			} else {
				const s = document.createElement('script');
				s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
				s.async = true;
				s.defer = true;
				s.setAttribute('data-turnstile', 'true');
				s.addEventListener('load', render, { once: true });
				s.addEventListener('error', () => setStatus('error'));
				document.head.appendChild(s);
			}
		};

		const rect = containerRef.current.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) {
			loadTurnstile();
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						loadTurnstile();
						observer.disconnect();
						break;
					}
				}
			},
			{ rootMargin: '200px 0px' },
		);

		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, [siteKey, bypass, setStatus, setToken, localFallback]);

	if (!siteKey || bypass) return null;

	return (
		<div className={className}>
			<div ref={containerRef} className="mt-2" />
			{status === 'loading' && !localFallback && (
				<p className="text-xs opacity-60">Loading verification…</p>
			)}
			{status === 'error' && !localFallback && (
				<p className="text-xs text-rose-500 flex items-center gap-1">
					<Icon icon="line-md:alert-circle" /> Verification unavailable. Please
					reload.
				</p>
			)}
			{status === 'rendered' && !token && !localFallback && (
				<p className="text-xs opacity-60">
					Complete the verification to enable submission.
				</p>
			)}
			{localFallback && (
				<p className="text-xs opacity-60">Local verification bypass active.</p>
			)}
		</div>
	);
}
