/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
/* eslint-disable */
// @ts-nocheck

// Manually assembled route tree for SPA builds to avoid plugin stubs.
import { Route as rootRouteImport } from './routes/__root';
import { Route as AboutRouteImport } from './routes/about';
import { Route as ContactRouteImport } from './routes/contact';
import { Route as IndexRouteImport } from './routes/index';
import { Route as ProjectsRouteImport } from './routes/projects';
import { Route as ProjectsSlugRouteImport } from './routes/projects.$slug';

const ProjectsRoute = ProjectsRouteImport.update({
	id: '/projects',
	path: '/projects',
	getParentRoute: () => rootRouteImport,
} as unknown as typeof ProjectsRouteImport);
const ContactRoute = ContactRouteImport.update({
	id: '/contact',
	path: '/contact',
	getParentRoute: () => rootRouteImport,
} as unknown as typeof ContactRouteImport);
const AboutRoute = AboutRouteImport.update({
	id: '/about',
	path: '/about',
	getParentRoute: () => rootRouteImport,
} as unknown as typeof AboutRouteImport);
const IndexRoute = IndexRouteImport.update({
	id: '/',
	path: '/',
	getParentRoute: () => rootRouteImport,
} as unknown as typeof IndexRouteImport);
const ProjectsSlugRoute = ProjectsSlugRouteImport.update({
	id: '/projects/$slug',
	path: '/projects/$slug',
	getParentRoute: () => rootRouteImport,
} as unknown as typeof ProjectsSlugRouteImport);

const rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	ContactRoute,
	ProjectsRoute,
	ProjectsSlugRoute,
};

export const routeTree = (rootRouteImport as unknown as typeof rootRouteImport)
	._addFileChildren(rootRouteChildren)
	._addFileTypes<unknown>();
