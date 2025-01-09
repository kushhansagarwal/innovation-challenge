<script lang="ts">
	import { onMount } from 'svelte';
	import type { SheetInfo } from '$lib/types';
	import SheetRow from '../Sheet/SheetRow.svelte';
	import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
	import Sheet from '../Sheet/Sheet.svelte';

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
                    matches: SheetInfo[]
                } = await response.json();
				matches = data.matches;
			} else {
				console.error('Failed to fetch matches');
			}
		} catch (error) {
			console.error('Error fetching matches:', error);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		console.log('Matches mounted');
		await fetchMatches();
	});
</script>

<div class="flex h-full w-full flex-col items-start rounded-2xl bg-base-200 md:rounded-r-none p-8">
	{#if loading}
		<p>Loading matches...</p>
	{:else}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3 overflow-y-auto">
			{#each matches as row, index}
				<div class="card rounded-lg bg-base-100 p-4 shadow-md">
					<SheetRow {row} {index} />
				</div>
			{/each}
		</div>
	{/if}
</div>
