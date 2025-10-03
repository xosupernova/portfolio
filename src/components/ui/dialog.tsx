/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
'use client';

import { Icon } from '@iconify/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out',
			className,
		)}
		{...props}
	/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
	extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
	variant?: 'center' | 'right';
}

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DialogContentProps
>(({ className, children, variant = 'center', ...props }, ref) => {
	const base =
		variant === 'right'
			? 'fixed inset-y-0 right-0 z-50 w-80 max-w-xs border-l bg-background p-6 shadow-lg focus-visible:outline-none data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right'
			: 'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg focus-visible:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out';
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content
				ref={ref}
				className={cn(base, className)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close
					className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md bg-transparent text-foreground/60 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
					aria-label="Close"
				>
					<Icon icon="line-md:close" className="size-5" />
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col space-y-1.5 text-center sm:text-left',
			className,
		)}
		{...props}
	/>
);
const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
			className,
		)}
		{...props}
	/>
);

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn(
			'text-lg font-semibold leading-none tracking-tight',
			className,
		)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn('text-sm text-muted-foreground', className)}
		{...props}
	/>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogTrigger,
	DialogPortal,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogClose,
	DialogOverlay,
};
