<script lang="ts">
	import type { Message, UserType } from '$lib/types.d.ts';
	import { messages } from '$lib/stores';

	export let message: Message;
	export let data: { userData: UserType };

	// Split the message content into an array of words
	let words = message.options;

	// Regex to check if a string is a URL
	const urlRegex = /https?:\/\/[^\s]+/;

	// Function to handle button click
	function handleWordClick(word: string) {
		messages.update((currentMessages: Message[]) => [
			...currentMessages,
			{ role: 'human', content: `Sample message for word: ${word}`, timestamp: Date.now() }
		]);
	}
</script>

<div class="relative message ml-auto max-w-full rounded-3xl bg-base-100 text-primary-content">
	<div class="text-sm">
		{#if words}
			<!-- Display each word as a clickable button -->
			{#each words as word}
				<button class="btn btn-outline p-6" on:click={() => handleWordClick(word)}>
					{word}
				</button>
			{/each}
		{:else if urlRegex.test(message.content)}
			<!-- Display the message content as a button if it is a link -->
			<a href={message.content} target="_blank" class="btn btn-outline m-6 mb-8 bg-blue-500 text-white hover:bg-blue-700 hover:text-white">
				Open Link
			</a>
		{:else}
			<!-- Display the message content if no words are available and it's not a link -->
			<div class="whitespace-pre-wrap break-words overflow-hidden text-ellipsis max-w-full p-6">{message.content}</div>
		{/if}
	</div>
	<div class="absolute -bottom-6 right-6 flex items-end">
		<div class="relative h-12 w-12 overflow-hidden rounded-full border-2 border-secondary">
			<img src={`https://ui-avatars.com/api/?name=${data.userData.given_name}+${data.userData.family_name}`} alt="Human Avatar" class="h-full w-full object-cover" />
		</div>
	</div>
</div>
