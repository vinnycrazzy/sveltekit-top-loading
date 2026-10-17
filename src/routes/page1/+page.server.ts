import { error } from '@sveltejs/kit';

export async function load({ url }: import('./$types.js').PageServerLoadEvent) {
	// A deliberate delay in the demo so the navigation indicator is visible.
	await new Promise((resolve) => setTimeout(resolve, 800));
	if (url.searchParams.has('error')) error(500, 'Demo loading error');
	return {};
}
