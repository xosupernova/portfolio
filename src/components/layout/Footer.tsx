/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import { env } from '@/env';

const currentYear = new Date().getFullYear();

type PhrasePart = string | { icon: string; className?: string };
interface PowerPhrase {
	parts: PhrasePart[];
}

const POWER_PHRASES: PowerPhrase[] = [
	{
		parts: [{ icon: 'simple-icons:tesco' }, ' meal deals'],
	},
	{
		parts: [
			'huffing ',
			{ icon: 'arcticons:greggs', className: 'scale-110' },
			' steakbakes like they are glue',
		],
	},
	{
		parts: [{ icon: 'tabler:brand-grindr' }, ' hookups'],
	},
	{
		parts: ['infinite ', { icon: 'simple-icons:redbull' }, ' cans'],
	},
	{
		parts: [
			'waiting for ',
			{ icon: 'simple-icons:nationalrail' },
			' to update the PIS',
		],
	},
];

export function Footer() {
	// Random selection on each page load/refresh.
	const phrase = useMemo(
		() => POWER_PHRASES[Math.floor(Math.random() * POWER_PHRASES.length)],
		[],
	);
	const [placement, setPlacement] = useState<string>('dev');
	const [commit, setCommit] = useState<string | null>(null);
	useEffect(() => {
		let aborted = false;
		(async () => {
			try {
				const res = await fetch('/api/placement', { headers: { Accept: 'application/json' } });
				if (!res.ok) throw new Error(String(res.status));
				const json = (await res.json()) as { placement?: string; commit?: string };
				if (!aborted) {
					setPlacement(json?.placement || 'dev');
					setCommit(json?.commit || null);
				}
			} catch {
				if (!aborted) setPlacement('dev');
			}
		})();
		return () => {
			aborted = true;
		};
	}, []);
	return (
		<footer className="w-full fixed left-0 bottom-0 z-50 bg-[#232a32]/95 backdrop-blur text-white py-6 text-center text-sm select-none">
			{/* Edge placement and commit in the footer corner */}
			<div className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 text-xs opacity-60 hover:opacity-100 transition-opacity">
				<span className="font-mono">Edge: {placement}</span>
				{commit && (
					env.VITE_REPO_URL ? (
						<a
							className="font-mono ml-2 underline decoration-dotted decoration-1"
							href={`${env.VITE_REPO_URL.replace(/\/$/, '')}/commit/${commit}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Commit: {commit}
						</a>
					) : (
						<span className="font-mono ml-2">Commit: {commit}</span>
					)
				)}
			</div>
			<div className="mb-2">
				&copy; 2024 - {currentYear} Nova Bowley. All rights reserved
			</div>
			<div className="mb-2 flex justify-center items-center gap-2">
				<span>Powered by</span>
				<span className="flex items-center gap-2 italic">
					{phrase.parts.map((part) => {
						if (typeof part === 'string') {
							return <span key={`text-${part}`}>{part}</span>;
						}
						return (
							<Icon
								key={`icon-${part.icon}-${part.className ?? 'na'}`}
								icon={part.icon}
								className={['h-6 w-6 inline-block align-middle', part.className]
									.filter(Boolean)
									.join(' ')}
							/>
						);
					})}
				</span>
			</div>
			<nav className="flex justify-center gap-6 mt-2">
				<a href="/" className="flex items-center gap-1 hover:underline">
					<Icon icon="line-md:home" className="h-6 w-6" />
					Home
				</a>
				<a href="/about" className="flex items-center gap-1 hover:underline">
					<Icon icon="line-md:account" className="h-6 w-6" />
					About
				</a>
				<a href="/contact" className="flex items-center gap-1 hover:underline">
					<Icon icon="line-md:phone" className="h-6 w-6" />
					Contact
				</a>
			</nav>
		</footer>
	);
}
