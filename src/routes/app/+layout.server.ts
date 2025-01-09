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
			console.log('User is authenticated with email:', userData.email);
			const kindeToken = await kindeAuthClient.getToken(request as unknown as SessionManager);

			try {
				const response = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/user`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Origin': 'http://localhost:5173',
						'Authorization': `Bearer ${kindeToken}`
					},
					body: JSON.stringify(userData)
				});

				console.log('Response:', response);

				if (response.ok) {
					const data = await response.json();
					console.log('Data fetched successfully:', data);
				} else {
					console.error('Failed to fetch data');
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
			return {
				userData
			};
		} else {
			console.log('User data is incomplete or undefined');
			throw redirect(302, '/api/auth/register?post_login_redirect_url=/app');
		}
	} else {
		console.log('redirecting to login');
		throw redirect(302, '/api/auth/register?post_login_redirect_url=/app');
	}

	return {};
}
