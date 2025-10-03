/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
