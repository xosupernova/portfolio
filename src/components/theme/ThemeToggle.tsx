/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { Icon } from '@iconify/react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
	/** Force display even on mobile (used in storybook / tests) */
	forceDesktop?: boolean;
	/** If true, renders only the trigger button (no dropdown items) */
	triggerOnly?: boolean;
}

/**
 * ThemeToggle renders the circular icon button + dropdown for selecting a theme.
 * The button shows both sun & moon icons with a cross-fade.
 */
export function ThemeToggle({ forceDesktop, triggerOnly }: ThemeToggleProps) {
	const { mounted, isDark, setTheme } = useTheme();

	const TriggerButton = (
		<DropdownMenuTrigger
			data-testid="theme-trigger"
			aria-label="Theme toggle"
			className={cn(
				forceDesktop ? 'inline-flex' : 'hidden lg:inline-flex',
				'h-9 w-9 items-center justify-center rounded-full border bg-white/60 dark:bg-black/40 backdrop-blur hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
			)}
		>
			{!mounted ? (
				<Icon icon="line-md:loading-twotone-loop" className="size-5" />
			) : (
				<span className="relative block size-5" aria-hidden="true">
					<Icon
						icon="line-md:sun-rising-filled-loop"
						className={cn(
							'absolute inset-0 size-5 transition-opacity duration-300 text-yellow-500',
							isDark && 'opacity-0',
						)}
					/>
					<Icon
						icon="line-md:moon"
						className={cn(
							'absolute inset-0 size-5 transition-opacity duration-300',
							!isDark && 'opacity-0',
						)}
					/>
				</span>
			)}
		</DropdownMenuTrigger>
	);

	if (triggerOnly) {
		return TriggerButton;
	}

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger asChild>{TriggerButton}</TooltipTrigger>
				<TooltipContent>Theme</TooltipContent>
			</Tooltip>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onSelect={() => setTheme('light')}>
					<Icon
						icon="line-md:sun-rising-filled-loop"
						className="mr-2 size-4 text-yellow-500"
					/>
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
	);
}

/**
 * MobileThemeButton – simplified full-width toggle used inside mobile dialog.
 */
export function MobileThemeButton() {
	const { isDark, toggle } = useTheme();
	return (
		<button
			className={cn(
				'h-9 flex-1 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70',
				isDark
					? 'bg-white text-gray-900 hover:bg-white/90 shadow-sm'
					: 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm',
			)}
			onClick={toggle}
			type="button"
		>
			<span className="relative block size-5" aria-hidden="true">
				<Icon
					icon="line-md:sun-rising-filled-loop"
					className={cn(
						'absolute inset-0 size-5 transition-opacity duration-300 text-yellow-500',
						isDark && 'opacity-0',
					)}
				/>
				<Icon
					icon="line-md:moon"
					className={cn(
						'absolute inset-0 size-5 transition-opacity duration-300',
						!isDark && 'opacity-0',
					)}
				/>
			</span>
			{isDark ? 'Dark' : 'Light'} Mode
		</button>
	);
}

export default ThemeToggle;
