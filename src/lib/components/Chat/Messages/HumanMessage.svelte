<script lang="ts">
	import type { Message, UserType } from '$lib/types.d.ts';
	import { messages } from '$lib/stores';

	export let message: Message;
	export let data: { userData: UserType };

	// Split the message content into an array of words
	let words = message.options

	// Function to handle button click
	function handleWordClick(word: string) {
		console.log(`Word clicked: ${word}`);
		messages.update((currentMessages: Message[]) => [
			...currentMessages,
			{ role: 'human', content: `Sample message for word: ${word}`, timestamp: Date.now() }
		]);
	}
</script>

<div class="relative ml-auto max-w-[50rem] rounded-3xl bg-secondary text-secondary-content">
	<div
		class="border-3 border-n-2 dark:bg-n-5/50 space-y-6 rounded-[1.25rem] px-6 pb-16 pt-6 md:p-5 md:pb-8 dark:border-transparent"
	>
		{#if words}
			<!-- Display each word as a clickable button -->
			{#each words as word}
				<button class="btn btn-outline m-1" on:click={() => handleWordClick(word)}>
					{word}
				</button>
			{/each}
		{:else}
			<!-- Display the message content if no words are available -->
			<div>{message.content}</div>
		{/if}
	</div>
	<div class="absolute -bottom-6 right-6 flex items-end">
		<div
			class="relative h-12 w-12 overflow-hidden rounded-full shadow-[0_0_0_0.25rem_#FEFEFE] dark:shadow-[0_0_0_0.25rem_#232627]"
		>
			<img src={data.userData.picture} alt="Human Avatar" class="h-full w-full object-cover" />
		</div>
	</div>
</div>
