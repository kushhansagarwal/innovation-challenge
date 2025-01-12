

<script lang="ts">
	import type { Message } from '$lib/types.d.ts';
	import { messages, sessionId } from '$lib/stores';
	import { onMount } from 'svelte';
	import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
    import { sendButtonDisabled } from '$lib/stores';
	import { selectedNavigationOption } from '$lib/stores';
	import { NavigationOption } from '$lib/stores';

	export let message: Message;
	export let token: string;
	let displayedContent = '';
	let index = 0;
	let words = message.options;
	let buttonsDisabled = false;

	// Function to handle button click
	async function handleWordClick(word: string) {
		
		buttonsDisabled = true;
		messages.update((currentMessages: Message[]) => [
			...currentMessages,
			{ role: 'human', content: word, timestamp: Date.now() }
		]);

		const responsePromise = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/continue`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				user_input: word,
				session_id: $sessionId
			})
		});

		const responseData = (await responsePromise.json()).response;

        if (!responseData.options) sendButtonDisabled.set(false);

		messages.update((currentMessages: Message[]) => [
			...currentMessages,
			{ role: 'ai', content: responseData.message, timestamp: Date.now(), options: responseData.options }
		]);

		if (responseData.profile) {
			setTimeout(() => {
				selectedNavigationOption.set(NavigationOption.Matches);
			}, 2000);
		}
	}

	onMount(() => {
		const totalDuration = 1000; // 1 second in milliseconds
		const intervalDuration = totalDuration / message.content.length;

		const interval = setInterval(() => {
			if (index < message.content.length) {
				displayedContent += message.content[index];
				index++;
			} else {
				clearInterval(interval);
			}
		}, intervalDuration);
	});
</script>

<div class="relative message mr-auto max-w-[50rem] rounded-2xl bg-base-300 text-primary-content">
	<div
		class="px-6 pb-8 pt-6 text-sm"
	>
		<div class="">{message.content}</div>
		{#if words}
			<!-- Display each word as a clickable button -->
			<div class="flex flex-wrap mt-3">
				{#each words as word}
					<button 
						class="btn btn-outline btn-sm m-1" 
						on:click={() => handleWordClick(word)}
						disabled={buttonsDisabled}
					>
						{word}
					</button>
				{/each}
			</div>
		{:else}
			<!-- Display the message content if no words are available -->
		{/if}
	</div>
	<div class="absolute -bottom-6 left-6 flex items-end">
		<div
			class="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary"
		>
			<img src="/GIRAF.png" alt="GIRAF" />
		</div>
	</div>
</div>
