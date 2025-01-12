<script lang="ts">
	import type { Message, UserType } from '$lib/types.d.ts';
	import { messages } from '$lib/stores';

	export let message: Message;
	export let data: { userData: UserType };

	// Split the message content into an array of words
	let words = message.options

	// Function to handle button click
	function handleWordClick(word: string) {
		
		messages.update((currentMessages: Message[]) => [
			...currentMessages,
			{ role: 'human', content: `Sample message for word: ${word}`, timestamp: Date.now() }
		]);
	}
</script>

<div class="relative message ml-auto max-w-[50rem] rounded-3xl bg-base-100 text-primary-content">
	<div
	class="px-6 pb-8 pt-6 text-sm"

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
			<div class="whitespace-pre-wrap break-words max-w-full overflow-hidden text-ellipsis">{message.content}</div>
		{/if}
	</div>
	<div class="absolute -bottom-6 right-6 flex items-end">
		<div
			class="relative h-12 w-12 overflow-hidden rounded-full border-2 border-secondary"
		>
			<img src={`https://ui-avatars.com/api/?name=${data.userData.given_name}+${data.userData.family_name}`} alt="Human Avatar" class="h-full w-full object-cover" />
		</div>
	</div>
</div>
