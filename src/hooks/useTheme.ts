/**
 *  © 2025 Nova Bowley. All rights reserved.
 */

import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
	const [mounted, setMounted] = useState(false);
	const [theme, setTheme] = useState<Theme>('light');

	// read initial theme once
	useEffect(() => {
		try {
			const m =
				typeof document !== 'undefined'
					? document.cookie.match(/(?:^|; )theme=([^;]+)/)
					: null;
			const prefersDark =
				typeof window !== 'undefined' && typeof window.matchMedia === 'function'
					? window.matchMedia('(prefers-color-scheme: dark)').matches
					: false;
			const initial = m
				? (decodeURIComponent(m[1]) as Theme)
				: prefersDark
					? 'dark'
					: 'light';
			setTheme(initial);
			if (typeof document !== 'undefined') {
				document.documentElement.classList.toggle('dark', initial === 'dark');
			}
			Cookies.set('theme', initial, { expires: 365, path: '/' });
		} catch {
			// swallow any SSR/test errors
		} finally {
			setMounted(true);
		}
	}, []);

	// apply theme changes
	useEffect(() => {
		if (!mounted) return;
		document.documentElement.classList.toggle('dark', theme === 'dark');
		Cookies.set('theme', theme, { expires: 365, path: '/' });
	}, [theme, mounted]);

	const toggle = useCallback(
		() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
		[],
	);

	return { mounted, theme, isDark: theme === 'dark', setTheme, toggle };
}
