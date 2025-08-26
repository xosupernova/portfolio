/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { Icon } from '@iconify/react';
import { useMemo } from 'react';

const currentYear = new Date().getFullYear();
const siteVersion = import.meta.env.VITE_SITE_VERSION || '1.0.0';

type PhrasePart = string | { icon: string; className?: string };
interface PowerPhrase {
	parts: PhrasePart[];
}

const POWER_PHRASES: PowerPhrase[] = [
	{
		parts: [
			{ icon: 'simple-icons:tesco' },
			' meal deals',
		],
	},
	{
		parts: [
			'huffing ',
			{ icon: 'arcticons:greggs', className: 'scale-110' },
			' steakbakes like they are glue',
		],
	},
	{
		parts: [
			{ icon: 'tabler:brand-grindr' },
			' hookups',
		],
	},
	{
		parts: [
			'infinite ',
			{ icon: 'simple-icons:redbull' },
			' cans',
		],
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
	return (
		<footer className="w-full fixed left-0 bottom-0 z-50 bg-[#232a32]/95 backdrop-blur text-white py-6 text-center text-sm select-none">
			<div className="mb-2">
				&copy; 2024 - {currentYear} Nova Bowley. All rights reserved - Version{' '}
				{siteVersion}
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
								className={
									['h-6 w-6 inline-block align-middle', part.className]
										.filter(Boolean)
										.join(' ')
								}
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
