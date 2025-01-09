<script lang="ts">
	import type { Message } from '$lib/types.d.ts';
	import { messages, sessionId } from '$lib/stores';
	import { onMount } from 'svelte';
	import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
    import { sendButtonDisabled } from '$lib/stores';

	export let message: Message;
	export let token: string;
	let displayedContent = '';
	let index = 0;
	let words = message.options;

	// Function to handle button click
	async function handleWordClick(word: string) {
		console.log(`Word clicked: ${word}`);
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
	}

	onMount(() => {
		const interval = setInterval(() => {
			if (index < message.content.length) {
				displayedContent += message.content[index];
				index++;
			} else {
				clearInterval(interval);
			}
		}, 10); // Adjust the speed of the typewriter effect here
	});
</script>

<div class="relative mr-auto max-w-[50rem] rounded-3xl bg-primary text-primary-content">
	<div
		class="border-3 border-n-2 dark:bg-n-5/50 rounded-[1.25rem] px-6 pb-16 pt-6 md:p-5 md:pb-8 dark:border-transparent"
	>
		<div class="">{displayedContent}</div>
		{#if words}
			<!-- Display each word as a clickable button -->
			<div class="flex mt-3">
				{#each words as word}
					<button class="btn btn-outline m-1" on:click={() => handleWordClick(word)}>
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
			class="relative h-12 w-12 overflow-hidden rounded-full shadow-[0_0_0_0.25rem_#FEFEFE] dark:shadow-[0_0_0_0.25rem_#232627]"
		>
			<img src="/GIRAF.png" alt="GIRAF" />
		</div>
	</div>
</div>
