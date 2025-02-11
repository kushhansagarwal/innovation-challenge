import { goto } from '$app/navigation';
import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
import {
	kindeAuthClient,
	type SessionManager,
	type UserType
} from '@kinde-oss/kinde-auth-sveltekit';
import { redirect, type RequestEvent, type Cookies } from '@sveltejs/kit';

export async function load({ request, cookies }: { request: RequestEvent; cookies: Cookies }) {
	let userData: UserType | null = null;
	const isAuthenticated = await kindeAuthClient.isAuthenticated(
		request as unknown as SessionManager
	); // Boolean: true or false

	if (isAuthenticated) {
		userData = await kindeAuthClient.getUser(request as unknown as SessionManager);

		if (userData) { // Ensure userData and email are defined
			
			const kindeToken = await kindeAuthClient.getToken(request as unknown as SessionManager);

			let status = 0;

			try {
				const response = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/user`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${kindeToken}`
					},
					body: JSON.stringify(userData)
				});

				status = response.status;

				if (response.ok) {
					const data = await response.json();
					console.log(data);
				} else {
					console.log('Error fetching user data');
				}
			} catch (error) {
				
			}
			return {
				userData: userData,
				status: status
			};
		} else {
			
			throw redirect(302, '/api/auth/register?post_login_redirect_url=/app');
		}
	} else {
		
		throw redirect(302, '/api/auth/register?post_login_redirect_url=/app');
	}

	return {};
}
