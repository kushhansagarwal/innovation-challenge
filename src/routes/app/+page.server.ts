import type { Cookies } from "@sveltejs/kit";

export function load({ cookies }: { cookies: Cookies }) {
	const token = cookies.get('kinde_access_token');

	return {
		token
	};
}
