/**
 *  © 2025 Nova Bowley. Licensed under the MIT License. See LICENSE.
 */

export async function fetchGithubReadme(
	owner: string,
	repo: string,
	branchHint?: string,
): Promise<{ markdown: string; url: string } | null> {
	const branches = branchHint
		? [branchHint, 'main', 'master']
		: ['main', 'master'];
	const filenames = ['README.md', 'Readme.md', 'readme.md'];

	for (const branch of branches) {
		for (const name of filenames) {
			const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`;
			try {
				const res = await fetch(url, { headers: { Accept: 'text/plain' } });
				if (res.ok) {
					const markdown = await res.text();
					if (markdown && markdown.trim().length > 0) return { markdown, url };
				}
			} catch {
				// ignore and continue
			}
		}
	}

	return null;
}
