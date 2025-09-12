/**
 *  © 2025 Nova Bowley. All rights reserved.
 *  SPA-specific router: imports only the manual route tree to avoid
 *  bundling generated stubs in the static SPA build.
 */
import { createRouter as createTanstackRouter } from '@tanstack/react-router';
import { routeTree as manualRouteTree } from './routeTree.manual';

export const createRouter = () => {
	return createTanstackRouter({
		routeTree: manualRouteTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
	});
};
