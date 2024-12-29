<script>
	import Chat from '$lib/components/Chat/Chat.svelte';
	import ChatNav from '$lib/components/Chat/ChatNav.svelte';
</script>

<section class="flex h-screen space-x-4 p-4 md:p-10 md:px-0 gap-8">
	<div class="flex w-1/4 flex-col h-full">
		<ChatNav />
	</div>
	<div class="flex w-3/4 flex-col h-full">
		<Chat />
	</div>
</section>
