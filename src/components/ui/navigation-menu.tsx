/**
*  © 2025 Nova Bowley. All rights reserved.
*/
'use client';

import { Icon } from '@iconify/react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import * as React from 'react';
import { cn } from '@/lib/utils';

const NavigationMenu = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.NavigationMenu>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.NavigationMenu>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.NavigationMenu
		ref={ref}
		data-slot="navigation-menu"
		className={cn(
			'relative z-20 flex max-w-max flex-1 items-center justify-center',
			className,
		)}
		{...props}
	/>
));
NavigationMenu.displayName = NavigationMenuPrimitive.NavigationMenu.displayName;

const NavigationMenuList = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		data-slot="navigation-menu-list"
		className={cn(
			'group flex flex-1 list-none items-center justify-center space-x-1',
			className,
		)}
		{...props}
	/>
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const NavigationMenuTrigger = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Trigger
		ref={ref}
		data-slot="navigation-menu-trigger"
		className={cn(
			'group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
		{...props}
	>
		{children}
		<Icon
			icon="line-md:chevron-down"
			className="ml-1 size-4 transition-transform group-data-[state=open]:rotate-180"
		/>
	</NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Content
		ref={ref}
		data-slot="navigation-menu-content"
		className={cn(
			'data-[motion=from-start]:animate-in data-[motion=from-end]:animate-in data-[motion=to-start]:animate-out data-[motion=to-end]:animate-out data-[motion=from-start]:slide-in-from-left-4 data-[motion=from-end]:slide-in-from-right-4 data-[motion=to-start]:slide-out-to-left-4 data-[motion=to-end]:slide-out-to-right-4 left-0 top-0 w-full md:absolute md:w-auto',
			className,
		)}
		{...props}
	/>
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuIndicator = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Indicator
		ref={ref}
		data-slot="navigation-menu-indicator"
		className={cn(
			'top-full z-[1] flex h-2 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0',
			className,
		)}
		{...props}
	>
		<div className="bg-white dark:bg-neutral-800 relative top-[60%] size-2 rotate-45 rounded-tl-sm border border-neutral-200 dark:border-neutral-700" />
	</NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

const NavigationMenuViewport = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
	<div className="absolute left-0 top-full flex justify-center">
		<NavigationMenuPrimitive.Viewport
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
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

export {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuIndicator,
	NavigationMenuViewport,
};
