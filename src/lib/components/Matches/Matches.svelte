<script lang="ts">
	import { onMount } from 'svelte';
	import type { SheetInfo } from '$lib/types';
	import SheetRow from '../Sheet/SheetRow.svelte';
	import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
	import Sheet from '../Sheet/Sheet.svelte';
	import { NavigationOption, selectedNavigationOption } from '$lib/stores';

	export let token: string;
	let matches: SheetInfo[] = [];
	let loading = true;

	async function fetchMatches() {
		try {
			const response = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/matches`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			if (response.ok) {
				const data: {
					matches: SheetInfo[];
				} = await response.json();
				matches = data.matches;
			} else {
			}
		} catch (error) {
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await fetchMatches();
	});

	function goToChat() {
		selectedNavigationOption.set(NavigationOption.Chat);
	}
</script>

<div
	class="relative flex h-full w-full flex-col items-start rounded-2xl bg-base-200 p-8 md:rounded-r-none"
>
	{#if loading}
		<div class="animate-pulse">Loading matches...</div>
	{:else}
		<div class="grid grid-cols-1 gap-8 overflow-y-auto xl:grid-cols-2">
			<div>
				<div>
					<h2>Your Matches</h2>
					<p class="mb-5 text-base-content">
						Here are your potential matches based on your preferences. Click "Reset Matches" to
						start over and find new matches.
					</p>
				</div>
				<button class="btn btn-error" on:click={goToChat}> Reset Matches </button>
			</div>
			{#each matches as row, index}
				<div class="card rounded-lg bg-base-100 p-4">
					<SheetRow {row} {index} />
				</div>
			{/each}
		</div>
	{/if}
</div>
