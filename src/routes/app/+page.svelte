<script lang="ts">
	import Chat from '$lib/components/Chat/Chat.svelte';
	import Sheet from '$lib/components/Sheet/Sheet.svelte';
	import ChatNav from '$lib/components/Chat/ChatNav.svelte';
    import type { UserType } from '$lib/types';
	import { selectedNavigationOption } from '$lib/stores';
	import { NavigationOption } from '$lib/stores';
	import Matches from '$lib/components/Matches/Matches.svelte';
    export let data: { userData: UserType, token: string };

	let currentNavigationOption = NavigationOption.GoogleSheet;
	console.log(currentNavigationOption);

	selectedNavigationOption.subscribe((option) => {
		currentNavigationOption = option;
	});
	
	
</script>

<section class="flex h-screen space-x-4 p-4 md:p-10 md:px-0 gap-8">
	<div class="flex w-1/4 flex-col h-full">
		<ChatNav {data} />
	</div>
	<div class="flex w-3/4 flex-col h-full">
		{#if currentNavigationOption === NavigationOption.Chat}
			<Chat {data} token={data.token} />
		{:else if currentNavigationOption === NavigationOption.Matches}
			<Matches token={data.token} />
		{:else if currentNavigationOption === NavigationOption.GoogleSheet}
			<Sheet token={data.token} />
		{/if}
	</div>
</section>
