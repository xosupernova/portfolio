/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { Icon } from '@iconify/react';
import { Link } from '@tanstack/react-router';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';
import { env } from '../env';

export const NAV_ITEMS = [
	{ to: '/', icon: 'line-md:home', label: 'Home' },
	{ to: '/about', icon: 'line-md:account', label: 'About' },
	{ to: '/projects', icon: 'line-md:folder', label: 'Projects' },
	{ to: '/contact', icon: 'line-md:phone', label: 'Contact' },
];

interface HeaderProps {
	forceDesktop?: boolean;
}

export default function Header({ forceDesktop }: HeaderProps) {
	const { mounted, isDark, setTheme, toggle } = useTheme();
	return (
		<header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-black/30 bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/5">
			<div className="container mx-auto grid grid-cols-[auto_1fr_auto] items-center px-4 py-3">
				<h1 className="text-xl font-bold flex items-center space-x-2 select-none">
					<Icon
						icon="streamline-flex:music-equalizer-solid"
						className="inline-block align-middle size-9"
					/>
					<span>{env.VITE_APP_TITLE}</span>
				</h1>
				<nav
					className={
						forceDesktop
							? 'flex justify-center'
							: 'hidden lg:flex justify-center'
					}
					aria-label="Main navigation"
				>
					<NavigationMenu>
						<NavigationMenuList>
							{NAV_ITEMS.map((item) => (
								<NavigationMenuItem key={item.to}>
									<NavigationMenuLink asChild>
										<Link
											to={item.to as '/' | '/about' | '/projects' | '/contact'}
											className="inline-flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
										>
											<Icon icon={item.icon} className="size-5" />
											<span>{item.label}</span>
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</nav>
				<div className="flex items-center gap-3 justify-end">
					<DropdownMenu>
						<Tooltip>
							<TooltipTrigger asChild>
								<DropdownMenuTrigger
									data-testid="theme-trigger"
									aria-label="Theme toggle"
									className={`${forceDesktop ? 'inline-flex' : 'hidden lg:inline-flex'} h-9 w-9 items-center justify-center rounded-full border bg-white/60 dark:bg-black/40 backdrop-blur hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
								>
									{!mounted ? (
										<Icon
											icon="line-md:sun-rising-filled-loop"
											className="size-5 text-yellow-500"
										/>
									) : isDark ? (
										<Icon icon="line-md:moon-loop" className="size-5 " />
									) : (
										<Icon
											icon="line-md:sun-rising-filled-loop"
											className="size-5 text-yellow-500"
										/>
									)}
								</DropdownMenuTrigger>
							</TooltipTrigger>
							<TooltipContent>Theme</TooltipContent>
						</Tooltip>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onSelect={() => setTheme('light')}>
								<Icon
									icon="line-md:sun-rising-filled-loop"
									className="mr-2 size-4 text-yellow-500"
								/>{' '}
								Light
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setTheme('dark')}>
								<Icon icon="line-md:moon" className="mr-2 size-4" /> Dark
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem disabled className="opacity-50">
								System (soon)
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Dialog>
						<DialogTrigger
							className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
							aria-label="Open menu"
						>
							<Icon icon="line-md:menu" className="size-7" />
						</DialogTrigger>
						<DialogContent variant="right" className="px-4 py-6">
							<nav className="mb-6">
								<ul className="flex flex-col gap-1">
									{NAV_ITEMS.map((item) => (
										<li key={item.to}>
											<Link
												to={
													item.to as '/' | '/about' | '/projects' | '/contact'
												}
												className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
											>
												<Icon icon={item.icon} className="size-5" />
												<span>{item.label}</span>
											</Link>
										</li>
									))}
								</ul>
							</nav>
							<div className="flex gap-3">
								<button
									className="h-9 flex-1 rounded-md border text-sm font-medium bg-white/70 dark:bg-black/30 hover:bg-black/5 dark:hover:bg-white/10"
									onClick={toggle}
									type="button"
								>
									{isDark ? 'Dark' : 'Light'} Mode
								</button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</header>
	);
}

// Removed NavItem in favor of inline Radix NavigationMenu items
// Removed old ThemeToggle in favor of Radix dropdown implementation
