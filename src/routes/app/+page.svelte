<script lang="ts">
	import Chat from '$lib/components/Chat/Chat.svelte';
	import Sheet from '$lib/components/Sheet/Sheet.svelte';
	import ChatNav from '$lib/components/Chat/ChatNav.svelte';
    import type { UserType } from '$lib/types';
	import { selectedNavigationOption } from '$lib/stores';
	import { NavigationOption, isNavOpen } from '$lib/stores';
	import Matches from '$lib/components/Matches/Matches.svelte';
    export let data: { userData: UserType, token: string };

	let currentNavigationOption = NavigationOption.GoogleSheet;
	let touchStart = 0;
	let touchEnd = 0;

	selectedNavigationOption.subscribe((option) => {
		currentNavigationOption = option;
	});

	function toggleNav() {
		isNavOpen.set(!$isNavOpen);
		
	}

	function handleTouchStart(e: TouchEvent) {
		touchStart = e.touches[0].clientX;
	}

	function handleTouchMove(e: TouchEvent) {
		touchEnd = e.touches[0].clientX;
	}

	function handleTouchEnd() {
		const swipeDistance = touchStart - touchEnd;
		if (swipeDistance > 50 && $isNavOpen) { // Swipe left
			isNavOpen.set(false);
		}
	}
</script>

<section class="flex h-screen md:p-10 md:px-0 relative">
	<!-- Hamburger menu button - only visible on md and below -->
	<button 
		class="md:hidden mb-20 fixed top-4 left-4 z-50 p-2 rounded-lg"
		on:click={toggleNav}
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>

	<!-- Sliding navigation -->
	<div 
		class="fixed md:relative w-full md:w-96 h-full transition-transform duration-300 z-40 {$isNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
		on:touchstart={handleTouchStart}
		on:touchmove={handleTouchMove}
		on:touchend={handleTouchEnd}
	>
		<ChatNav {data} />
	</div>

	<!-- Main content -->
	<div class="flex-1 ml-0 md:ml-8 mt-20 md:mt-0">
		{#if currentNavigationOption === NavigationOption.Chat}
			<Chat {data} token={data.token} />
		{:else if currentNavigationOption === NavigationOption.Matches}
			<Matches token={data.token} />
		{:else if currentNavigationOption === NavigationOption.GoogleSheet}
			<Sheet token={data.token} />
		{/if}
	</div>

	<!-- Overlay for mobile -->
	{#if $isNavOpen}
		<div 
			class="fixed inset-0 bg-black bg-opacity-50 z-60 md:hidden"
			on:click={toggleNav}
		></div>
	{/if}
</section>
