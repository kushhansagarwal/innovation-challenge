<script lang="ts">
	import { onMount } from 'svelte';
	import type { SheetInfo, SheetResponse } from '$lib/types';
	import SheetRow from '../Sheet/SheetRow.svelte';
	import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
	import Sheet from '../Sheet/Sheet.svelte';
	import { NavigationOption, selectedNavigationOption } from '$lib/stores';
	import ErrorBubble from '../common/Error.svelte';

	export let token: string;
	let matches: SheetInfo[] = [];
	let loading = true;

	async function fetchMatches() {
		const response = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/matches`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			return response.json();
		} else {
			const error = await response.json();
			console.error(error);
			throw new Error(error.error);
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
	class="relative flex h-full w-full flex-col items-start rounded-2xl bg-base-200 p-4 md:rounded-r-none md:p-8"
>
	{#await fetchMatches()}
		<div class="animate-pulse">Loading matches...</div>
	{:then value}
		<div>
			<div>
				<h2>Your Matches</h2>
			</div>
		</div>
		<div class="my-2 grid grid-cols-1 gap-8 overflow-y-auto xl:grid-cols-2">
			{#each value.matches as row, index}
				<div class="card rounded-lg bg-base-100 p-4">
					<SheetRow {row} {index} />
				</div>
			{/each}
		</div>
		<div class="text-xs">To reset your matches, please go back to the chat and start over</div>
	{:catch error}
		<ErrorBubble error={error} />
	{/await}
</div>
