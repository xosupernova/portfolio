/**
 *  © 2025 Nova Bowley. All rights reserved.
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

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
