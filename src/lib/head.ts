/**
*  © 2025 Nova Bowley. All rights reserved.
*/
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
			ogImage ? { property: 'og:image', content: ogImage } : undefined,
			{ property: 'og:type', content: 'website' },
			{ name: 'viewport', content: viewport },
			{ name: 'theme-color', content: themeColor },
			twitterCard ? { name: 'twitter:card', content: twitterCard } : undefined,
			twitterTitle
				? { name: 'twitter:title', content: twitterTitle }
				: undefined,
			twitterDescription
				? { name: 'twitter:description', content: twitterDescription }
				: undefined,
			twitterImage
				? { name: 'twitter:image', content: twitterImage }
				: undefined,
			twitterSite ? { name: 'twitter:site', content: twitterSite } : undefined,
		].filter(Boolean),
		links: [
			{ rel: 'icon', href: '/favicon.ico' },
			{ rel: 'manifest', href: '/manifest.json' },
		],
	};
}
