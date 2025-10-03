/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
import { createRouter as createTanstackRouter } from '@tanstack/react-router';
// SSR/standard app router: always use the generated route tree.
// SPA uses router.spa.ts, which imports the manual route tree.
import { routeTree as genRouteTree } from './routeTree.gen';

// Create a new router instance
export const createRouter = () => {
	return createTanstackRouter({
		routeTree: genRouteTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
	});
};

// Exported API expected by TanStack Start's client to obtain the router
// Alias "#tanstack-router-entry" imports { getRouter } from this module.
// It can be sync or async; hydrateStart awaits the result.
export const getRouter = () => createRouter();

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
