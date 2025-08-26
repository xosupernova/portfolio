/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
'use client';

import { Icon } from '@iconify/react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

export const ToastProvider = ToastPrimitives.Provider;
export const ToastViewport = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Viewport>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			'fixed bottom-4 left-1/2 z-[60] flex max-h-screen w-full -translate-x-1/2 flex-col gap-2 p-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 sm:w-96',
			className,
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-md border p-4 pr-10 text-sm shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/75 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full',
	{
		variants: {
			variant: {
				default: 'bg-background/95 border-border before:hidden',
				success:
					'bg-emerald-600/15 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 border-emerald-500/40 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-emerald-500',
				error:
					'bg-rose-600/15 dark:bg-rose-500/10 text-rose-900 dark:text-rose-100 border-rose-500/40 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-rose-500',
				info: 'bg-sky-600/15 dark:bg-sky-500/10 text-sky-900 dark:text-sky-100 border-sky-500/40 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-sky-500',
			},
		},
		defaultVariants: { variant: 'default' },
	},
);

export interface ToastProps
	extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
		VariantProps<typeof toastVariants> {}

const ToastRoot = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	ToastProps
>(({ className, variant, ...props }, ref) => (
	<ToastPrimitives.Root
		ref={ref}
		className={cn(toastVariants({ variant }), className)}
		{...props}
	/>
));
ToastRoot.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn('text-sm font-semibold', className)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn('text-xs opacity-80', className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

const ToastClose = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Close>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			'absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-md text-foreground/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
			className,
		)}
		aria-label="Close"
		{...props}
	>
		<Icon icon="line-md:close" className="size-5" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

export { ToastRoot as Toast, ToastTitle, ToastDescription, ToastClose };
