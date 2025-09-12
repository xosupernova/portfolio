/**
 *  © 2025 Nova Bowley. All rights reserved.
 */

export type ProjectDef = {
	slug: string;
	owner: string;
	repo: string;
	title: string;
	description?: string;
	tags?: string[];
	branch?: string; // optional default branch hint (falls back to main/master)
	homepage?: string;
	// Optional thumbnail image to show on the projects list card.
	// If not provided, the UI may fall back to a GitHub OpenGraph image for the repo.
	image?: string;
	imageAlt?: string;
};

// TODO: curate this list to your actual projects
export const PROJECTS: ProjectDef[] = [
	{
		slug: 'portfolio-tan',
		owner: 'xosupernova',
		repo: 'portfolio-tan',
		title: 'Portfolio (This Site)',
		description:
			'Source code for this portfolio built with TanStack Start + Vite',
		tags: ['react', 'tanstack', 'vite', 'cloudflare'],
		homepage: 'https://xosupernova.xyz',
		image: '/img/projects/portfolio.png',
		imageAlt: 'Portfolio screenshot',
	},
	{
		slug: 'boilerplates',
		owner: 'xosupernova',
		repo: 'boilerplates',
		title: 'Boilerplates',
		description: 'A collection of boilerplate projects',
		tags: ['react', 'tanstack', 'vite', 'cloudflare'],
	},
	// Add more:
	// {
	//   slug: 'my-library',
	//   owner: 'xosupernova',
	//   repo: 'my-library',
	//   title: 'My Library',
	//   description: 'A small library that does X',
	//   tags: ['ts', 'lib'],
	// },
];

export function findProject(slug: string): ProjectDef | undefined {
	const s = slug.trim().toLowerCase();
	return PROJECTS.find((p) => p.slug.toLowerCase() === s);
}
