import type { Config } from 'tailwindcss';

// Tailwind v4 config (explicit to enable class-based dark mode and content scanning)
const config: Config = {
	darkMode: 'class',
	content: [
		'./index.html',
		'./src/**/*.{js,jsx,ts,tsx}',
		'./app/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'light-app': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
				'dark-app': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [],
};

export default config;
