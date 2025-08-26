/**
*  © 2025 Nova Bowley. All rights reserved.
*/
import { Icon } from '@iconify/react';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
	const bullets = [
		'Web Developer',
		'Bluey Connoisseur',
		'Systems Administrator',
		'Dog Lover',
		'JavaScript Enthusiast',
		'React and Astro Developer',
	];

	// User-provided marquee datasets mapped to Iconify devicon collection
	const marquees: {
		title: string;
		items: { label: string; icon: string }[];
	}[] = [
		{
			title: 'Languages Known',
			items: [
				{ label: 'NodeJS', icon: 'devicon:nodejs' },
				{ label: 'TypeScript', icon: 'devicon:typescript' },
				{ label: 'Yaml', icon: 'devicon:yaml' },
				{ label: 'JavaScript', icon: 'devicon:javascript' },
				{ label: 'HTML5', icon: 'devicon:html5' },
				{ label: 'CSS3', icon: 'devicon:css3' },
				{ label: 'Markdown', icon: 'devicon:markdown' },
				{ label: 'C#', icon: 'devicon:csharp' },
				{ label: 'Python', icon: 'devicon:python' },
				{ label: 'Java', icon: 'devicon:java' },
				{ label: 'Rust', icon: 'devicon:rust' },
				{ label: 'Go', icon: 'devicon:go' },
				{ label: 'Lua', icon: 'devicon:lua' },
				{ label: 'Bash', icon: 'devicon:bash' },
				{ label: 'PowerShell', icon: 'devicon:powershell' },
			],
		},
		{
			title: 'Frameworks Known',
			items: [
				{ label: 'React', icon: 'devicon:react' },
				{ label: 'Astro', icon: 'devicon:astro' },
				{ label: 'NextJS', icon: 'devicon:nextjs' },
				{ label: 'Discord.js', icon: 'devicon:discordjs' },
				{ label: 'TailwindCSS', icon: 'devicon:tailwindcss' },
				{ label: 'Bootstrap', icon: 'devicon:bootstrap' },
				{ label: 'Express', icon: 'devicon:express' },
				{ label: 'SvelteKit', icon: 'devicon:svelte' },
				{ label: 'Vue', icon: 'devicon:vuejs' },
				{ label: 'Angular', icon: 'devicon:angularjs' },
				{ label: 'Svelte', icon: 'devicon:svelte' },
				{ label: 'Electron', icon: 'devicon:electron' },
				{ label: 'React Native', icon: 'devicon:react' },
				{ label: 'NuxtJS', icon: 'devicon:nuxtjs' },
			],
		},
		{
			title: 'Software Known',
			items: [
				{ label: 'Apache', icon: 'devicon:apache' },
				{ label: 'Cloudflare', icon: 'devicon:cloudflare' },
				{ label: 'Cloudflare Workers', icon: 'devicon:cloudflareworkers' },
				{ label: 'Docker', icon: 'devicon:docker' },
				{ label: 'Github', icon: 'devicon:github' },
				{ label: 'Gitlab', icon: 'devicon:gitlab' },
				{ label: 'Grafana', icon: 'devicon:grafana' },
				{ label: 'MariaDB', icon: 'devicon:mariadb' },
				{ label: 'MongoDB', icon: 'devicon:mongodb' },
				{ label: 'MySQL', icon: 'devicon:mysql' },
				{ label: 'Nginx', icon: 'devicon:nginx' },
				{ label: 'Notion', icon: 'devicon:notion' },
				{ label: 'NPM', icon: 'devicon:npm' },
				{ label: 'Nuget', icon: 'devicon:nuget' },
				{ label: 'PfSense', icon: 'devicon:pfsense' },
				{ label: 'PM2.js', icon: 'devicon:pm2' },
				{ label: 'Portainer', icon: 'devicon:portainer' },
				{ label: 'Prisma', icon: 'devicon:prisma' },
				{ label: 'Redis', icon: 'devicon:redis' },
				{ label: 'Sentry', icon: 'devicon:sentry' },
				{ label: 'Slack', icon: 'devicon:slack' },
				{ label: 'Swagger', icon: 'devicon:swagger' },
				{ label: 'Trello', icon: 'devicon:trello' },
				{ label: 'Vercel', icon: 'devicon:vercel' },
				{ label: 'VSCode', icon: 'devicon:vscode' },
				{ label: 'Webpack', icon: 'devicon:webpack' },
				{ label: 'Yarn', icon: 'devicon:yarn' },
			],
		},
	];

	const Marquee = ({
		items,
		title,
		reverse,
	}: {
		items: { label: string; icon: string }[];
		title: string;
		reverse?: boolean;
	}) => (
		<div className="w-full py-6">
			<h3 className="text-center font-semibold mb-4 tracking-wide">{title}</h3>
			<div className={`marquee ${reverse ? 'marquee-reverse' : ''}`}>
				<ul className="marquee-track gap-10 pr-10" aria-label={title}>
					{items.map((i) => (
						<li
							key={`${title}-${i.label}-a`}
							className="inline-flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100 transition"
						>
							<Icon
								icon={i.icon}
								className="text-2xl shrink-0"
								aria-hidden="true"
							/>
							<span>{i.label}</span>
						</li>
					))}
				</ul>
				<ul className="marquee-track gap-10 pr-10" aria-hidden="true">
					{items.map((i) => (
						<li
							key={`${title}-${i.label}-b`}
							className="inline-flex items-center gap-2 text-sm font-medium opacity-70"
						>
							<Icon
								icon={i.icon}
								className="text-2xl shrink-0"
								aria-hidden="true"
							/>
							<span>{i.label}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);

	return (
		<div className="min-h-[60vh] max-w-5xl mx-auto px-6 py-16 flex flex-col gap-16">
			<header className="text-center space-y-4">
				<h1 className="text-4xl md:text-5xl font-extrabold">
					Nova Bowley&apos;s
				</h1>
				<h2 className="text-2xl md:text-3xl font-semibold">About Page</h2>
			</header>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
				<div className="flex justify-center md:justify-start">
					<img
						src="/me.webp"
						alt="Nova Bowley"
						className="rounded-full w-72 h-72 object-cover shadow-xl border border-black/10 dark:border-white/10"
						loading="lazy"
					/>
				</div>
				<ul className="list-disc pl-6 space-y-3 text-lg marker:text-indigo-500 dark:marker:text-indigo-400">
					{bullets.map((b) => (
						<li key={b}>{b}</li>
					))}
				</ul>
			</div>
			<div className="flex flex-col gap-4">
				{marquees.map((m, idx) => (
					<Marquee
						key={m.title}
						items={m.items}
						title={m.title}
						reverse={idx % 2 === 1}
					/>
				))}
			</div>
		</div>
	);
}

export const Route = createFileRoute('/about')({
	component: RouteComponent,
	head: () => {
		return {
			title: '$ ./nova.sh --{About}',
			meta: [
				{ name: 'description', content: 'Nova Bowley portfolio about page' },
				{ name: 'author', content: 'Nova Bowley' },
				{ property: 'og:title', content: '$ ./nova.sh --{About}' },
				{
					property: 'og:description',
					content: 'Nova Bowley portfolio about page',
				},
				{ property: 'og:type', content: 'website' },
			],
			links: [
				{ rel: 'icon', href: '/favicon.ico' },
				{ rel: 'manifest', href: '/manifest.json' },
			],
		};
	},
});
