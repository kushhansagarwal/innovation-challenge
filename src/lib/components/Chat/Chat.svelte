<script lang="ts">
	import HumanMessage from './Messages/HumanMessage.svelte';
	import AIMessage from './Messages/AIMessage.svelte';
	import type { Message } from '$lib/types.d.ts';
	import { writable } from 'svelte/store';

	const messages = writable<Message[]>([
		{
			role: 'human',
			content: 'Hello, how are you?'
		},
		{
			role: 'ai',
			content: 'I am fine, thank you for asking.'
		}
	]);

	let newMessage = '';
	let isSending = false;

	function sendMessage() {
		if (newMessage.trim() === '') return;

		isSending = true;
		messages.update((currentMessages) => [
			...currentMessages,
			{ role: 'ai', content: newMessage }
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
	<div class="w-full w-min flex-shrink-0 p-8">
		<h2 class="text-2xl font-bold">Chat</h2>
	</div>
	<div class="divider w-full flex-shrink-0"></div>
	<div class="message-container flex h-full w-full flex-grow flex-col gap-4 p-8">
		{#each $messages as message (message.content)}
			{#if message.role === 'human'}
				<HumanMessage {message} />
			{:else}
				<AIMessage {message} />
			{/if}
		{/each}
	</div>
	<div class="query-container w-full flex-shrink-0 p-8">
		<div class="join-item flex items-center gap-2">
			<input
				type="text"
				bind:value={newMessage}
				class="input h-16 w-full rounded-2xl"
				placeholder="Type your message here..."
				on:keypress={handleKeyPress}
			/>
			<button class="btn btn-success h-16 rounded-2xl" on:click={sendMessage} disabled={isSending}
				>Send Message</button
			>
		</div>
	</div>
</div>
