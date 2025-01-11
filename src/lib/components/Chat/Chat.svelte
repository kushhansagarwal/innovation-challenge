<script lang="ts">
	import HumanMessage from './Messages/HumanMessage.svelte';
	import AIMessage from './Messages/AIMessage.svelte';
	import type { ChatResponse, Message, UserType } from '$lib/types.d.ts';
	import { messages, sessionId } from '$lib/stores';
	import { PUBLIC_ENDPOINT, PUBLIC_ENDPOINT_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import { sendButtonDisabled } from '$lib/stores';

	messages.subscribe((messages) => {
		console.log(messages);
	});

	export let data: { userData: UserType };
	export let token: string;

	onMount(() => {
		messages.set([]);
		startSession();
	});

	let newMessage = '';
	let isSending = false;

	sendButtonDisabled.set(true);

	async function startSession() {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/start`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});

				if (response.ok) {
					sendButtonDisabled.set(false);
					const responseData = (await response.json()).response;
					sessionId.set(responseData.session_id);
					messages.update((currentMessages) => [
						...currentMessages,
						{ role: 'ai', content: responseData.message, timestamp: Date.now() }
					]);
					resolve(responseData);
				} else {
					console.error('Failed to start session');
					reject('Failed to start session');
				}
			} catch (error) {
				console.error('Error starting session:', error);
				reject(error);
			}
		});
	}

	async function sendMessage() {
		sendButtonDisabled.set(true);
		if (newMessage.trim() === '') return;

		isSending = true;
		messages.update((currentMessages) => [
			...currentMessages,
			{ role: 'human', content: newMessage, timestamp: Date.now() }
		]);

		const responsePromise = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/continue`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				user_input: newMessage.trim(),
				session_id: $sessionId
			})
		});

		const responseData: ChatResponse = (await responsePromise.json()).response;

		let optionMessage: Message | null = null;

		const profile = responseData.profile;
		console.log(profile);
		if (profile) {

			try {
				const profileResponse = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({...profile, name: data.userData.given_name + ' ' + data.userData.family_name})
				});

				if (profileResponse.ok) {
					const profileData = await profileResponse.json();
					console.log('Profile data fetched successfully:', profileData);
				} else {
					console.error('Failed to fetch profile data');
				}
			} catch (error) {
				console.error('Error fetching profile data:', error);
			}
		}

		if (responseData.options) {
			optionMessage = {
				role: 'ai',
				content: 'Options:',
				options: responseData.options,
				timestamp: Date.now() - 1
			};
		} else {
			sendButtonDisabled.set(false);
		}

		messages.update((currentMessages) => [
			...currentMessages,
			{
				role: 'ai',
				content: responseData.message,
				timestamp: Date.now(),
				options: responseData.options
			}
		]);

		newMessage = '';
		isSending = false;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			sendMessage();
		}
	}
</script>

<div class="flex h-full w-full flex-col items-start rounded-2xl bg-base-200 md:rounded-r-none">
	<div class="message-container flex h-full w-full flex-grow flex-col gap-4 overflow-y-auto p-8">
		{#each $messages as message (message.timestamp)}
			{#if message.role === 'human'}
				<HumanMessage {message} {data} />
			{:else}
				<AIMessage {message} {token} />
			{/if}
		{/each}
	</div>
	<div class="query-container w-full flex-shrink-0 p-8 text-sm">
		<div class="join-item flex items-center gap-2">
			<input
				type="text"
				disabled={$sendButtonDisabled}
				bind:value={newMessage}
				class="input h-14 w-full rounded-2xl input-sm"
				placeholder="Type your message here..."
				on:keypress={handleKeyPress}
			/>
			<button
				class="btn h-14 rounded-2xl btn-sm"
				on:click={sendMessage}
				disabled={isSending || $sendButtonDisabled}>Send Message</button
			>
		</div>
	</div>
</div>
