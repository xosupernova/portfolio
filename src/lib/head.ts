/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { env } from '@/env';

export function resolveAbsUrl(input: string): string {
	if (!input) return '';
	if (/^https?:\/\//i.test(input)) return input;
	const origin = env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
	const path = input.startsWith('/') ? input : `/${input}`;
	return origin ? `${origin}${path}` : input;
}

export function makeHead({
	title,
	description,
  keywords = '',
  robots = 'index,follow',
  ogTitle,
  ogDescription,
  ogUrl = '',
  ogImage = '',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage = '',
  twitterSite = '',
  themeColor = '#000000',
  viewport = 'width=device-width, initial-scale=1',
}: {
	title: string;
	description: string;
	keywords?: string;
	robots?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogUrl?: string;
	ogImage?: string;
	twitterCard?: string;
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
	twitterSite?: string;
	themeColor?: string;
	viewport?: string;
}) {
		const finalOgImage = ogImage ? resolveAbsUrl(ogImage) : '';
		const finalTwitterImage = twitterImage ? resolveAbsUrl(twitterImage) : finalOgImage;

	return {
		title,
		meta: [
			{ name: 'description', content: description },
			{ name: 'author', content: 'Nova Bowley' },
			keywords ? { name: 'keywords', content: keywords } : undefined,
			robots ? { name: 'robots', content: robots } : undefined,
			ogTitle ? { property: 'og:title', content: ogTitle } : undefined,
			ogDescription
				? { property: 'og:description', content: ogDescription }
				: undefined,
			ogUrl ? { property: 'og:url', content: ogUrl } : undefined,
			finalOgImage ? { property: 'og:image', content: finalOgImage } : undefined,
			ogTitle || ogDescription || ogUrl || finalOgImage ? { property: 'og:type', content: 'website' } : undefined,
			{ name: 'viewport', content: viewport },
			{ name: 'theme-color', content: themeColor },
			twitterCard ? { name: 'twitter:card', content: twitterCard } : undefined,
			twitterTitle
				? { name: 'twitter:title', content: twitterTitle }
				: undefined,
			twitterDescription
				? { name: 'twitter:description', content: twitterDescription }
				: undefined,
				finalTwitterImage ? { name: 'twitter:image', content: finalTwitterImage } : undefined,
			twitterSite ? { name: 'twitter:site', content: twitterSite } : undefined,
		].filter(Boolean),
		links: [
			{ rel: 'icon', href: '/favicon.ico' },
			{ rel: 'manifest', href: '/manifest.json' },
		],
	};
}
