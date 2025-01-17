<script lang="ts">
	import HumanMessage from './Messages/HumanMessage.svelte';
	import AIMessage from './Messages/AIMessage.svelte';
	import type { ChatResponse, Message, UserType } from '$lib/types.d.ts';
	import { messages, NavigationOption, selectedNavigationOption, sessionId } from '$lib/stores';
	import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
	import { onMount, afterUpdate } from 'svelte';
	import { sendButtonDisabled, currentRegex } from '$lib/stores';

	messages.subscribe((messages) => {
		
	});

	export let data: { userData: UserType };
	export let token: string;

	onMount(() => {
		messages.set([]);
		startSession();
	});

	let newMessage = '';
	let errorMessage = '';
	let isSending = false;
	let startedSession = false;
	let skippable = false;
	let placeHolderMessage = 'Type your message here...';

	sendButtonDisabled.set(true);

	let messageContainer: HTMLDivElement;

	// Log messages to ensure they are updating
	messages.subscribe((messages) => {
		
	});

	afterUpdate(() => {
		if (messageContainer) {
			
			messageContainer.scrollTo({
				top: messageContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	});

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
					startedSession = true;
					sendButtonDisabled.set(false);
					const responseData = (await response.json()).response;
					sessionId.set(responseData.session_id);
					currentRegex.set(responseData.regex || '.*');
					skippable = responseData.skippable || false;
					messages.update((currentMessages) => [
						...currentMessages,
						{ role: 'ai', content: responseData.message, timestamp: Date.now() }
					]);
					resolve(responseData);
				} else {
					
					reject('Failed to start session');
				}
			} catch (error) {
				
				reject(error);
			}
		});
	}

	async function sendMessage() {
		if (!startedSession) {
			await startSession();
		}
		sendButtonDisabled.set(true);
		if (newMessage.trim() === '') return;

		if ($currentRegex && newMessage.trim() !== 'skip') {
			try {
				const regex = new RegExp($currentRegex);
				
				if (!regex.test(newMessage)) {
					errorMessage = `Incorrectly formatted message. Please enter the requested information.`;
					sendButtonDisabled.set(false);
					return;
				}
			} catch (error) {
				
				errorMessage = 'Invalid regex pattern';
			}
		}

		if (!skippable && newMessage.trim().toLowerCase() === 'skip') {
			errorMessage = `The message "skip" is not allowed at this step. Please enter the requested information.`;
			sendButtonDisabled.set(false);
			return;
		}

		errorMessage = '';

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
				user_input: skippable ? '' : newMessage.trim(),
				session_id: $sessionId
			})
		});

		const responseData: ChatResponse = (await responsePromise.json()).response;

		let optionMessage: Message | null = null;

		const profile = responseData.profile;

		currentRegex.set(responseData.regex || '.*');
		skippable = responseData.skippable || false;
		
		if (profile) {
			try {
				const profileResponse = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						...profile,
						name: data.userData.given_name + ' ' + data.userData.family_name
					})
				});

				if (profileResponse.ok) {
					const profileData = await profileResponse.json();
					setTimeout(() => {
						selectedNavigationOption.set(NavigationOption.Matches);
					}, 3000);
					
				} else {
					
				}
			} catch (error) {
				
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

	async function handleInput(event: InputEvent) {
		const target = event.target as HTMLInputElement;
		const inputValue = target.value;
		currentRegex.set(inputValue);
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			sendMessage();
		}
	}

	function autoResizeTextarea(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		target.style.height = 'auto';
		target.style.height = `${Math.min(target.scrollHeight, 70)}px`;
	}
</script>

<div class="flex h-full w-full flex-col items-start rounded-2xl bg-base-200 md:rounded-r-none">
	<div
		bind:this={messageContainer}
		class="message-container flex h-full w-full flex-grow flex-col gap-8 overflow-y-auto p-4 md:p-8"
	>
		{#if !startedSession}
			<div class="animate-pulse">Please wait while we start the session...</div>
		{/if}
		{#each $messages as message (message.timestamp)}
				{#if message.role === 'human'}
					<HumanMessage {message} {data} />
				{:else}
					<AIMessage {message} {token} />
				{/if}
		{/each}
	</div>
	<div class="query-container w-full flex-shrink-0 p-4 md:p-8 text-sm">
		<p class="text-error mb-2">{errorMessage}</p>
		<div class="join-item flex flex-col xl:flex-row items-center gap-2">
			<textarea
				disabled={$sendButtonDisabled}
				bind:value={newMessage}
				class="textarea leading-5 textarea-sm h-14 w-full rounded-2xl p-4 resize-y"
				placeholder={skippable ? 'Type your message or type "skip"...' : 'Type your message here...'}
				on:keypress={handleKeyPress}
				on:input={autoResizeTextarea}
			></textarea>
			<button
				class="btn btn-sm h-14 w-full xl:w-auto rounded-2xl"
				on:click={sendMessage}
				disabled={isSending || $sendButtonDisabled}>Send Message</button
			>
		</div>
	</div>
</div>
