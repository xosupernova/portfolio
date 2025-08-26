/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import * as Sentry from '@sentry/tanstackstart-react';
import {
	createMiddleware,
	registerGlobalMiddleware,
} from '@tanstack/react-start';

registerGlobalMiddleware({
	middleware: [
		createMiddleware({ type: 'function' }).server(
			Sentry.sentryGlobalServerMiddlewareHandler(),
		),
	],
});
