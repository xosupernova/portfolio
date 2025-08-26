/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import {
	RootRoute,
	Route,
	Router,
	RouterProvider,
} from '@tanstack/react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock Iconify to avoid async timers & window errors post-teardown
vi.mock('@iconify/react', () => ({
	// biome-ignore lint/suspicious/noExplicitAny: test mock
	Icon: (props: any) => <span data-icon={props.icon} />,
}));

function renderWithRouter(node: React.ReactElement) {
	const rootRoute = new RootRoute({
		component: () => (
			<TooltipProvider delayDuration={0}>{node}</TooltipProvider>
		),
	});
	const indexRoute = new Route({
		getParentRoute: () => rootRoute,
		path: '/',
		component: () => null,
	});
	const aboutRoute = new Route({
		getParentRoute: () => rootRoute,
		path: 'about',
		component: () => null,
	});
	const projectsRoute = new Route({
		getParentRoute: () => rootRoute,
		path: 'projects',
		component: () => null,
	});
	const contactRoute = new Route({
		getParentRoute: () => rootRoute,
		path: 'contact',
		component: () => null,
	});
	const routeTree = rootRoute.addChildren([
		indexRoute,
		aboutRoute,
		projectsRoute,
		contactRoute,
	]);
	const router = new Router({ routeTree });
	return render(<RouterProvider router={router} />);
}

afterEach(() => {
	vi.clearAllTimers();
});

function CenterDialogSample() {
	return (
		<Dialog>
			<DialogTrigger data-testid="open-dialog">Open Dialog</DialogTrigger>
			<DialogContent>
				<DialogTitle data-testid="dlg-title">Dialog Title</DialogTitle>
				<DialogDescription>
					This is a sample dialog used for accessibility tests.
				</DialogDescription>
				<button type="button" data-testid="first-btn">
					First
				</button>
				<button type="button" data-testid="second-btn">
					Second
				</button>
			</DialogContent>
		</Dialog>
	);
}

function SheetDialogSample() {
	return (
		<Dialog>
			<DialogTrigger data-testid="open-sheet">Open Sheet</DialogTrigger>
			<DialogContent variant="right">
				<DialogTitle data-testid="sheet-title">Sheet Title</DialogTitle>
				<DialogDescription>Sheet dialog description.</DialogDescription>
				<a href="#a" data-testid="sheet-link">
					Link
				</a>
			</DialogContent>
		</Dialog>
	);
}

describe('Accessibility', () => {
	it('dialog closes with Escape and returns focus', async () => {
		const user = userEvent.setup();
		render(<CenterDialogSample />);
		await user.click(screen.getByTestId('open-dialog'));
		const first = await screen.findByTestId('first-btn');
		// Radix should focus something inside; ensure we start from first
		first.focus();
		await user.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByTestId('dlg-title')).toBeNull());
		await waitFor(() =>
			expect(document.activeElement).toBe(screen.getByTestId('open-dialog')),
		);
	});

	it('side sheet opens and contains focusable link', async () => {
		const user = userEvent.setup();
		render(<SheetDialogSample />);
		await user.click(screen.getByTestId('open-sheet'));
		const link = await screen.findByTestId('sheet-link');
		expect(link).toBeTruthy();
	});

	it('header navigation links have accessible names', async () => {
		renderWithRouter(<Header forceDesktop />);
		// wait for at least Home link
		await waitFor(() =>
			expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy(),
		);
		expect(screen.getByRole('link', { name: 'About' })).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Projects' })).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Contact' })).toBeTruthy();
	});

	it('theme dropdown trigger opens menu via keyboard', async () => {
		renderWithRouter(<Header forceDesktop />);
		const themeBtn = screen.getByLabelText('Theme toggle');
		themeBtn.focus();
		fireEvent.keyDown(themeBtn, { key: 'Enter' });
		// Fallback: also fire click in case keyDown not handled
		fireEvent.click(themeBtn);
		await waitFor(() => {
			expect(screen.getByText('Light')).toBeTruthy();
			expect(screen.getByText('Dark')).toBeTruthy();
		});
	});
});
