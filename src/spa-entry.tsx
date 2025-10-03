/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
// SPA entrypoint for static Cloudflare deployment.
// Mounts the TanStack Router app client-side (no SSR shell HTML wrapping).
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
// Use SPA-specific router that imports only the manual route tree
import { createRouter } from './router.spa';
// Ensure base styles (normally injected via head on SSR) are loaded.
import './styles/app.css';

const router = createRouter();

// Sentry removed

function AppRoot() {
	return <RouterProvider router={router} />;
}

function mount() {
	const root = document.getElementById('root');
	if (!root) {
		console.error('Failed to find #root element to mount app');
		return;
	}
	const disableStrict =
		(import.meta.env.VITE_DISABLE_STRICT_MODE || 'false') === 'true';
	const tree = disableStrict ? (
		<AppRoot />
	) : (
		<React.StrictMode>
			<AppRoot />
		</React.StrictMode>
	);
	ReactDOM.createRoot(root).render(tree);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mount);
} else {
	mount();
}
