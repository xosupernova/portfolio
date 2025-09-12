/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { Icon } from '@iconify/react';
import { createFileRoute } from '@tanstack/react-router';
import { ContactForm } from '@/components';
import { env } from '@/env';
import { makeHead, resolveAbsUrl } from '@/lib/head';

function RouteComponent() {
	const turnstileSiteKey = env.VITE_TURNSTILE_SITE_KEY;
	const turnstileBypass = env.VITE_TURNSTILE_BYPASS === '1';
	const socials = [
		{
			label: 'GitHub',
			icon: 'line-md:github',
			href: `${env.VITE_SOCIALS_GITHUB}`,
			accent: 'from-zinc-500/40 to-zinc-900/40',
		},
		{
			label: 'Discord',
			icon: 'line-md:discord',
			href: `${env.VITE_SOCIALS_DISCORD}`,
			accent: 'from-indigo-500/30 to-indigo-900/40',
		},
		{
			label: 'Email',
			icon: 'line-md:email',
			href: `${env.VITE_SOCIALS_EMAIL}`,
			accent: 'from-rose-500/30 to-rose-900/40',
		},
		{
			label: 'LinkedIn',
			icon: 'line-md:linkedin',
			href: `${env.VITE_SOCIALS_LINKEDIN}`,
			accent: 'from-sky-500/30 to-sky-900/40',
		},
		{
			label: 'X',
			icon: 'line-md:twitter-x',
			href: `${env.VITE_SOCIALS_X}`,
			accent: 'from-blue-500/30 to-blue-900/40',
		},
		{
			label: 'Instagram',
			icon: 'line-md:instagram',
			href: `${env.VITE_SOCIALS_INSTAGRAM}`,
			accent: 'from-pink-500/30 to-pink-900/40',
		},
		{
			label: 'Facebook',
			icon: 'line-md:facebook',
			href: `${env.VITE_SOCIALS_FACEBOOK}`,
			accent: 'from-blue-500/30 to-blue-900/40',
		},
	];

	return (
		<div className="relative min-h-[60vh] w-full max-w-7xl mx-auto px-6 py-20">
			<div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
			<h1 className="text-4xl md:text-5xl font-extrabold text-center mb-14 tracking-tight">
				Get in{' '}
				<span className="text-indigo-500 dark:text-indigo-400">Touch</span>
			</h1>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
				{/* Socials */}
				<aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-28 self-start">
					<div className="rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-900/60 backdrop-blur p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
							<Icon icon="line-md:link" className="text-indigo-500" /> Socials
						</h2>
						<p className="text-sm opacity-80 leading-relaxed">
							Reach out on any platform or drop a message via the form.
						</p>
						<ul className="mt-6 flex flex-col gap-3">
							{socials.map((s) => (
								<li key={s.label}>
									<a
										href={s.href}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative flex items-center gap-4 rounded-xl border border-black/5 dark:border-white/10 bg-gradient-to-br from-neutral-200/40 via-neutral-300/10 to-neutral-50/50 dark:from-neutral-800/40 dark:via-neutral-800/20 dark:to-neutral-900/40 px-4 py-3 overflow-hidden transition-colors hover:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
									>
										<span
											className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${s.accent} transition-opacity`}
										/>
										<Icon icon={s.icon} className="text-2xl drop-shadow-sm" />
										<span className="font-medium tracking-wide">{s.label}</span>
										<Icon
											icon="line-md:arrows-diagonal"
											className="ml-auto opacity-0 group-hover:opacity-80 transition"
										/>
									</a>
								</li>
							))}
						</ul>
					</div>
				</aside>

				{/* Contact Form (skippable) */}
				<section className="lg:col-span-2 space-y-8">
					<div className="relative rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 bg-neutral-50/80 dark:bg-neutral-900/70 backdrop-blur-xl p-8 md:p-10 shadow-sm">
						<div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_60%)]" />
						<ContactForm
							turnstileSiteKey={turnstileSiteKey}
							turnstileBypass={turnstileBypass}
						/>
					</div>
				</section>
			</div>
		</div>
	);
}

export const Route = createFileRoute('/contact')({
	component: RouteComponent,
	head: () => {
		const url = resolveAbsUrl('/contact');
		const img = resolveAbsUrl('/img/meta/contact.png');
		return makeHead({
			title: '$ ./nova.sh --{Contact}',
			description: 'Nova Bowley portfolio contact page',
			ogTitle: '$ ./nova.sh --{Contact}',
			ogDescription: 'Nova Bowley portfolio contact page',
			ogUrl: url,
			ogImage: img,
			twitterCard: 'summary_large_image',
			twitterTitle: '$ ./nova.sh --{Contact}',
			twitterDescription: 'Nova Bowley portfolio contact page',
			twitterImage: img,
		});
	},
});
