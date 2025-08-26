/**
*  © 2025 Nova Bowley. All rights reserved.
*/
import { Icon } from '@iconify/react';
import { Link } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import * as React from 'react';
import { env } from '../env';

export default function Header() {
	const [open, setOpen] = React.useState(false);

	// Close menu on route change (basic listener using hashchange/popstate as fallback)
	React.useEffect(() => {
		const close = () => setOpen(false);
		window.addEventListener('popstate', close);
		return () => window.removeEventListener('popstate', close);
	}, []);

	// Close on Escape
	React.useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open]);

	return (
		<header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-black/30 bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/5">
			<div className="container mx-auto grid grid-cols-[auto_1fr_auto] items-center px-4 py-3">
				{/* Left: Logo */}
				<h1 className="text-xl font-bold flex items-center space-x-2 select-none">
					<Icon
						icon="streamline-flex:music-equalizer-solid"
						className="inline-block align-middle size-9"
					/>
					<span>{env.VITE_APP_TITLE}</span>
				</h1>
				{/* Center: Nav (desktop) */}
				<nav
					className="hidden lg:flex justify-center"
					aria-label="Main navigation"
				>
					<ul className="flex space-x-3">
						<NavItem to="/" icon="line-md:home" label="Home" />
						<NavItem to="/about" icon="line-md:account" label="About" />
						<NavItem to="/projects" icon="line-md:folder" label="Projects" />
						<NavItem to="/contact" icon="line-md:phone" label="Contact" />
					</ul>
				</nav>
				{/* Right: Theme toggle (desktop) + Burger (mobile) */}
				<div className="flex items-center gap-3 justify-end">
					<div className="hidden lg:block shadow-xl rounded-full">
						<ThemeToggle />
					</div>
					<div className="flex items-center lg:hidden">
						<button
							type="button"
							aria-label={open ? 'Close menu' : 'Open menu'}
							aria-expanded={open}
							aria-controls="mobile-menu"
							onClick={() => setOpen((o) => !o)}
							className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
						>
							{open ? (
								<Icon
									icon="line-md:menu-to-close-alt-transition"
									className="size-7"
								/>
							) : (
								<Icon icon="line-md:menu" className="size-7" />
							)}
						</button>
					</div>
				</div>
			</div>
			{/* Mobile menu overlay (absolute, doesn't push content) */}
			<div
				className={`lg:hidden absolute top-full right-0 left-auto ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
			>
				{/* Backdrop */}
				<div
					aria-hidden="true"
					tabIndex={-1}
					onClick={() => setOpen(false)}
					onKeyDown={(e) => {
						if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')
							setOpen(false);
					}}
					className={`fixed inset-0 z-[-1] transition ${open ? 'opacity-100' : 'opacity-0'} bg-black/30 backdrop-blur-sm`}
				/>
				<div
					id="mobile-menu"
					className={`mt-2 mr-4 ml-auto w-40 rounded-2xl shadow-xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur p-4 space-y-4 transform transition-all duration-200 origin-top-right ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
				>
					<ul
						className="flex flex-col gap-1 items-start text-left"
						onClick={() => setOpen(false)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								setOpen(false);
							}
						}}
					>
						<NavItem to="/" icon="line-md:home" label="Home" mobile />
						<NavItem to="/about" icon="line-md:account" label="About" mobile />
						<NavItem
							to="/projects"
							icon="line-md:folder"
							label="Projects"
							mobile
						/>
						<NavItem
							to="/contact"
							icon="line-md:phone"
							label="Contact"
							mobile
						/>
					</ul>
					<div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-end">
						<div className="shadow-xl rounded-full">
							<ThemeToggle />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

function NavItem({
	to,
	icon,
	label,
	mobile,
}: {
	to: string;
	icon: string;
	label: string;
	mobile?: boolean;
}) {
	return (
		<li>
			<Link
				to={to as '/' | '/about' | '/projects' | '/contact'}
				className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${mobile ? 'active:scale-[.98]' : ''}`}
			>
				<Icon icon={icon} className="size-5" />
				<span>{label}</span>
			</Link>
		</li>
	);
}

// Helper to set cookie
function setCookie(name: string, value: string, days: number) {
	Cookies.set(name, value, { expires: days, path: '/' });
}

// Theme toggle with cookie persistence
function ThemeToggle() {
	const [mounted, setMounted] = React.useState(false);
	const [isDark, setIsDark] = React.useState(false);

	// On mount decide theme from cookie/system
	React.useEffect(() => {
		const m = document.cookie.match(/(?:^|; )theme=([^;]+)/);
		const initial = m
			? decodeURIComponent(m[1]) === 'dark'
			: window.matchMedia('(prefers-color-scheme: dark)').matches;
		setIsDark(initial);
		document.documentElement.classList.toggle('dark', initial);
		setMounted(true);
		setCookie('theme', initial ? 'dark' : 'light', 365);
	}, []);

	// Persist subsequent changes
	React.useEffect(() => {
		if (!mounted) return;
		document.documentElement.classList.toggle('dark', isDark);
		setCookie('theme', isDark ? 'dark' : 'light', 365);
	}, [isDark, mounted]);

	const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

	return (
		<button
			aria-label={label}
			className="h-8 w-8 flex items-center justify-center rounded-full border bg-white/60 dark:bg-black/40 backdrop-blur hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
			onClick={() => mounted && setIsDark((d) => !d)}
			type="button"
			suppressHydrationWarning
		>
			{!mounted ? (
				<Icon
					icon="line-md:moon-loop"
					className="h-6 w-6 text-gray-700 dark:text-gray-200"
				/>
			) : isDark ? (
				<Icon
					icon="line-md:sun-rising-filled-loop"
					className="h-6 w-6 text-yellow-500"
				/>
			) : (
				<Icon
					icon="line-md:moon-loop"
					className="h-6 w-6 text-gray-700 dark:text-gray-200"
				/>
			)}
		</button>
	);
}
