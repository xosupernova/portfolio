/**
*  © 2025 Nova Bowley. All rights reserved.
*/
import { Icon } from '@iconify/react';

const currentYear = new Date().getFullYear();
const siteVersion = import.meta.env.VITE_SITE_VERSION || '1.0.0';

export function Footer() {
	return (
		<footer className="w-full fixed left-0 bottom-0 z-50 bg-[#232a32]/95 backdrop-blur text-white py-6 text-center text-sm select-none">
			<div className="mb-2">
				&copy; 2024 - {currentYear} Nova Bowley. All rights reserved - Version{' '}
				{siteVersion}
			</div>
			<div className="mb-2 flex justify-center items-center gap-2">
				<span>Powered by</span>
				<Icon icon="simple-icons:tesco" className="h-6 w-6" />
				<span>meal deals</span>
			</div>
			<nav className="flex justify-center gap-6 mt-2">
				<a href="/" className="flex items-center gap-1 hover:underline">
					<Icon icon="line-md:home" className="h-6 w-6" />
					Home
				</a>
				<a href="/about" className="flex items-center gap-1 hover:underline">
					<Icon icon="line-md:account" className="h-6 w-6" />
					About
				</a>
				<a href="/contact" className="flex items-center gap-1 hover:underline">
					<Icon icon="line-md:phone" className="h-6 w-6" />
					Contact
				</a>
			</nav>
		</footer>
	);
}
