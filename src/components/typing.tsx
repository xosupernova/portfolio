/**
 *  © 2025 Nova Bowley. All rights reserved.
 */
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { env } from '../env';

// ...removed old Typing function...
export function Typing() {
	const el = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!el.current) return;
		const typed = new Typed(el.current, {
			strings: [
				`${env.VITE_APP_AUTHOR_SHORT ?? env.VITE_APP_AUTHOR}'s Portfolio`,
				`${env.VITE_APP_AUTHOR_SHORT ?? env.VITE_APP_AUTHOR}'s Work`,
			],
			typeSpeed: 100,
			backSpeed: 50,
			backDelay: 1000,
			startDelay: 500,
			showCursor: true,
			cursorChar: '|',
			loop: true,
		});
		return () => {
			typed.destroy();
		};
	}, []);

	return <span ref={el} className="text-gray-900 dark:text-white" />;
}
