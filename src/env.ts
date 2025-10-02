/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		SERVER_URL: z.string().url().optional(),
		DISCORD_WEBHOOK: z.string().url().optional(),
		TURNSTILE_SECRET: z.string().min(1).optional(),
		LASTFM_API_KEY: z.string().min(1).optional(),
		LASTFM_USER: z.string().min(1).optional(),
	},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: 'VITE_',

	client: {
		VITE_APP_TITLE: z.string().min(1).default('Nova Bowley'),
		VITE_APP_DESCRIPTION: z
			.string()
			.min(1)
			.default('Personal portfolio for Nova Bowley'),
		VITE_APP_AUTHOR: z.string().min(1).default('Nova Bowley'),
		VITE_APP_AUTHOR_SHORT: z.string().min(1).default('Nova'),
		// Optional site URL used to construct absolute URLs for meta tags in SPA
		VITE_SITE_URL: z.string().url().optional(),
		// Optional default OG image used by head helper when a route doesn't specify one
		VITE_OG_IMAGE: z.string().optional(),
		VITE_DISABLE_STRICT_MODE: z.string().optional(),
		VITE_ENABLE_DEVTOOLS: z.string().optional(),

		// Discord
		VITE_DISCORD_WEBHOOK: z.string().url().optional(),

		// Turnstile
		VITE_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
		VITE_TURNSTILE_BYPASS: z.string().optional(),

		// Social media links
		VITE_SOCIALS_GITHUB: z.string().url().optional(),
		VITE_SOCIALS_DISCORD: z.string().url().optional(),
		VITE_SOCIALS_EMAIL: z.string().url().optional(),
		VITE_SOCIALS_LINKEDIN: z.string().url().optional(),
		VITE_SOCIALS_X: z.string().url().optional(),
		VITE_SOCIALS_INSTAGRAM: z.string().url().optional(),
		VITE_SOCIALS_FACEBOOK: z.string().url().optional(),
	},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	runtimeEnv: import.meta.env,

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});
