/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
'use client';

import { Icon } from '@iconify/react';
import * as Nav from '@radix-ui/react-navigation-menu';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Prefer long-form names when available; fall back to short primitives.
// biome-ignore lint/suspicious/noExplicitAny: dynamic module shape
const mod = Nav as any;
const Root = mod.NavigationMenu ?? mod.Root;
const List = mod.NavigationMenuList ?? mod.List;
const Item = mod.NavigationMenuItem ?? mod.Item;
const TriggerEl = mod.NavigationMenuTrigger ?? mod.Trigger;
const ContentEl = mod.NavigationMenuContent ?? mod.Content;
const LinkEl = mod.NavigationMenuLink ?? mod.Link;
const IndicatorEl = mod.NavigationMenuIndicator ?? mod.Indicator;
const ViewportEl = mod.NavigationMenuViewport ?? mod.Viewport;

export const NavigationMenu = React.forwardRef<
	HTMLElement,
	React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
	<Root
		ref={ref}
		data-slot="navigation-menu"
		className={cn(
			'relative z-20 flex max-w-max flex-1 items-center justify-center',
			className,
		)}
		{...props}
	/>
));
NavigationMenu.displayName = 'NavigationMenu';

export const NavigationMenuList = React.forwardRef<
	HTMLUListElement,
	React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
	<List
		ref={ref}
		data-slot="navigation-menu-list"
		className={cn(
			'group flex flex-1 list-none items-center justify-center space-x-1',
			className,
		)}
		{...props}
	/>
));
NavigationMenuList.displayName = 'NavigationMenuList';

// Item wrapper with proper prop/children typing
type NavigationMenuItemElement = React.ElementRef<typeof Item>;
type NavigationMenuItemProps = React.ComponentPropsWithoutRef<typeof Item>;
export const NavigationMenuItem = React.forwardRef<
	NavigationMenuItemElement,
	NavigationMenuItemProps
>((props, ref) => <Item ref={ref} {...props} />);
NavigationMenuItem.displayName = 'NavigationMenuItem';

interface TriggerExtraProps {
	hideChevron?: boolean;
}
export const NavigationMenuTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & TriggerExtraProps
>(({ className, children, hideChevron, ...props }, ref) => (
	<TriggerEl
		ref={ref}
		data-slot="navigation-menu-trigger"
		className={cn(
			'group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
		{...props}
	>
		{children}
		{!hideChevron && (
			<Icon
				icon="line-md:chevron-down"
				className="ml-1 size-4 transition-transform group-data-[state=open]:rotate-180"
			/>
		)}
	</TriggerEl>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<ContentEl
		ref={ref}
		data-slot="navigation-menu-content"
		className={cn(
			'data-[motion=from-start]:animate-in data-[motion=from-end]:animate-in data-[motion=to-start]:animate-out data-[motion=to-end]:animate-out data-[motion=from-start]:slide-in-from-left-4 data-[motion=from-end]:slide-in-from-right-4 data-[motion=to-start]:slide-out-to-left-4 data-[motion=to-end]:slide-out-to-right-4 left-0 top-0 w-full md:absolute md:w-auto',
			className,
		)}
		{...props}
	/>
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

// Link wrapper with proper prop/children typing (supports asChild)
type NavigationMenuLinkElement = React.ElementRef<typeof LinkEl>;
type NavigationMenuLinkProps = React.ComponentPropsWithoutRef<typeof LinkEl>;
export const NavigationMenuLink = React.forwardRef<
	NavigationMenuLinkElement,
	NavigationMenuLinkProps
>((props, ref) => <LinkEl ref={ref} {...props} />);
NavigationMenuLink.displayName = 'NavigationMenuLink';

export const NavigationMenuIndicator = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<IndicatorEl
		ref={ref}
		data-slot="navigation-menu-indicator"
		className={cn(
			'top-full z-[1] flex h-2 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0',
			className,
		)}
		{...props}
	>
		<div className="bg-white dark:bg-neutral-800 relative top-[60%] size-2 rotate-45 rounded-tl-sm border border-neutral-200 dark:border-neutral-700" />
	</IndicatorEl>
));
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

export const NavigationMenuViewport = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div className="absolute left-0 top-full flex justify-center">
		<ViewportEl
			ref={ref}
			data-slot="navigation-menu-viewport"
			className={cn(
				'bg-popover text-popover-foreground relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[var(--radix-navigation-menu-viewport-left)_top] overflow-hidden rounded-md border shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
				className,
			)}
			{...props}
		/>
	</div>
));
NavigationMenuViewport.displayName = 'NavigationMenuViewport';
