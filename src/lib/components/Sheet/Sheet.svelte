<script lang="ts">
	export let token: string;
	import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { SheetResponse } from '$lib/types';
	import SheetRow from './SheetRow.svelte';
	import { writable, derived, type Writable } from 'svelte/store';

	let isLoading = writable(true);

	// Function to fetch data using the token
	async function fetchData() {
		try {
			const response = await fetch(`${PUBLIC_ENDPOINT_URL}/innovation-challenge/sheet`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			if (response.ok) {
				const data: SheetResponse = await response.json();
				isLoading.set(false);
				return data;
			} else {
				isLoading.set(false);
			}
		} catch (error) {
			isLoading.set(false);
		}
	}

	let tableData = writable<any[]>([]);
	let selectedPrograms = writable<Set<string>>(new Set());
	let selectedCompetitions = writable<Set<string>>(new Set());
	let selectedIndustries = writable<Set<string>>(new Set());
	let selectedTracks = writable<Set<string>>(new Set());
	let selectedRoleInterests = writable<Set<string>>(new Set());

	let filteredData = derived(
		[
			tableData,
			selectedPrograms,
			selectedCompetitions,
			selectedIndustries,
			selectedTracks,
			selectedRoleInterests
		],
		([
			$tableData,
			$selectedPrograms,
			$selectedCompetitions,
			$selectedIndustries,
			$selectedTracks,
			$selectedRoleInterests
		]) => {
			let filtered = $tableData;
			if ($selectedPrograms.size > 0) {
				filtered =
					filtered?.filter((row) =>
						row.program
							?.split(',')
							.map((p: string) => p.trim())
							.some((p: string) => $selectedPrograms.has(p))
					) ?? [];
			}
			if ($selectedCompetitions.size > 0) {
				filtered =
					filtered?.filter((row) =>
						row.competition
							?.split(',')
							.map((c: string) => c.trim())
							.some((c: string) => $selectedCompetitions.has(c))
					) ?? [];
			}
			if ($selectedIndustries.size > 0) {
				filtered =
					filtered?.filter((row) =>
						row.industry
							?.split(',')
							.map((i: string) => i.trim())
							.some((i: string) => $selectedIndustries.has(i))
					) ?? [];
			}
			if ($selectedTracks.size > 0) {
				filtered =
					filtered?.filter((row) =>
						row.track
							?.split(',')
							.map((t: string) => t.trim())
							.some((t: string) => $selectedTracks.has(t))
					) ?? [];
			}
			if ($selectedRoleInterests.size > 0) {
				filtered =
					filtered?.filter((row) =>
						row.role_interest
							?.split(',')
							.map((r: string) => r.trim())
							.some((r: string) => $selectedRoleInterests.has(r))
					) ?? [];
			}
			return filtered;
		}
	);

	let masterPrograms = writable<Set<string>>(new Set());
	let masterCompetitions = writable<Set<string>>(new Set());
	let masterIndustries = writable<Set<string>>(new Set());
	let masterTracks = writable<Set<string>>(new Set());
	let masterRoleInterests = writable<Set<string>>(new Set());

	// Fetch data on component mount
	onMount(async () => {
		const data = await fetchData();
		if (data) {
			tableData.set(data.sheetInfo);

			const programs = new Map<string, number>();
			const competitions = new Map<string, number>();
			const industries = new Map<string, number>();
			const tracks = new Map<string, number>();
			const roleInterests = new Map<string, number>();

			data.sheetInfo.forEach((row) => {
				row.program?.split(',').forEach((program: string) => {
					program = program.trim();
					programs.set(program, (programs.get(program) || 0) + 1);
				});
				row.competition?.split(',').forEach((competition: string) => {
					competition = competition.trim();
					competitions.set(competition, (competitions.get(competition) || 0) + 1);
				});
				row.industry?.split(',').forEach((industry: string) => {
					industry = industry.trim();
					industries.set(industry, (industries.get(industry) || 0) + 1);
				});
				row.track?.split(',').forEach((track: string) => {
					track = track.trim();
					tracks.set(track, (tracks.get(track) || 0) + 1);
				});
				row.role_interest?.split(',').forEach((roleInterest: string) => {
					roleInterest = roleInterest.trim();
					roleInterests.set(roleInterest, (roleInterests.get(roleInterest) || 0) + 1);
				});
			});

			masterPrograms.set(
				new Set([...programs.entries()].sort((a, b) => b[1] - a[1]).map((entry) => entry[0]))
			);
			masterCompetitions.set(
				new Set([...competitions.entries()].sort((a, b) => b[1] - a[1]).map((entry) => entry[0]))
			);
			masterIndustries.set(
				new Set([...industries.entries()].sort((a, b) => b[1] - a[1]).map((entry) => entry[0]))
			);
			masterTracks.set(
				new Set([...tracks.entries()].sort((a, b) => b[1] - a[1]).map((entry) => entry[0]))
			);
			masterRoleInterests.set(
				new Set([...roleInterests.entries()].sort((a, b) => b[1] - a[1]).map((entry) => entry[0]))
			);
		}
	});

	function toggleSelection(store: Writable<Set<string>>, value: string) {
		store.update((currentSet) => {
			const newSet = new Set(currentSet);
			if (newSet.has(value)) {
				newSet.delete(value);
			} else {
				newSet.add(value);
			}
			return newSet;
		});
	}

	let showMorePrograms = writable(false);
	let showMoreCompetitions = writable(false);
	let showMoreIndustries = writable(false);
	let showMoreTracks = writable(false);
	let showMoreRoleInterests = writable(false);
</script>

<div class="flex h-full w-full flex-col items-start rounded-2xl bg-base-200 xl:rounded-r-none">

	<div class="grid xl:h-full grid-cols-1 overflow-y-auto xl:grid-cols-2">
		<div class="overflow-y-auto order-2 xl:order-1">
			<div class="flex h-full w-full flex-grow flex-col gap-4 overflow-y-auto p-8">
				{#if $isLoading}
				<div class="animate-pulse">Loading all the data...</div>
			{/if}
				<div class="grid grid-cols-1 gap-8 overflow-y-auto">
					{#each $filteredData as row, index}
						<div class="card rounded-lg bg-base-100 p-4">
							<SheetRow {row} {index} />
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="max-h-1/3 border-l border-base-300 xl:h-full xl:order-2 overflow-y-auto xl:overflow-visible hidden xl:block">
			<div class="flex flex-wrap gap-2 p-8">
				<h3 class="chip-header">Programs</h3>
				{#each Array.from($masterPrograms).slice(0, 5) as program}
					<div class="flex flex-wrap gap-2">
						<div
							class="chip chip-program cursor-pointer text-white"
							class:active={$selectedPrograms.has(program)}
							on:click={() => toggleSelection(selectedPrograms, program)}
						>
							{program}
						</div>
					</div>
				{/each}
				{#if $masterPrograms.size > 5}
					{#if $showMorePrograms}
						{#each Array.from($masterPrograms).slice(5) as program}
							<div
								class="chip chip-program cursor-pointer text-white"
								class:active={$selectedPrograms.has(program)}
								on:click={() => toggleSelection(selectedPrograms, program)}
							>
								{program}
							</div>
						{/each}
						<div class="flex w-full text-sm">
							<button on:click={() => showMorePrograms.set(false)}>Show Less</button>
						</div>
					{:else}
						<div class="flex w-full text-sm">
							<button on:click={() => showMorePrograms.set(true)}>Show More</button>
						</div>
					{/if}
				{/if}

				<h3 class="chip-header">Competitions</h3>
				{#each Array.from($masterCompetitions).slice(0, 5) as competition}
					<div class="flex flex-wrap gap-2">
						<div
							class="chip chip-competition cursor-pointer text-white"
							class:active={$selectedCompetitions.has(competition)}
							on:click={() => toggleSelection(selectedCompetitions, competition)}
						>
							{competition}
						</div>
					</div>
				{/each}
				{#if $masterCompetitions.size > 5}
					{#if $showMoreCompetitions}
						{#each Array.from($masterCompetitions).slice(5) as competition}
							<div
								class="chip chip-competition cursor-pointer text-white"
								class:active={$selectedCompetitions.has(competition)}
								on:click={() => toggleSelection(selectedCompetitions, competition)}
							>
								{competition}
							</div>
						{/each}
						<div class="flex w-full text-sm">
							<button on:click={() => showMoreCompetitions.set(false)}>Show Less</button>
						</div>
					{:else}
						<div class="flex w-full text-sm">
							<button on:click={() => showMoreCompetitions.set(true)}>Show More</button>
						</div>
					{/if}
				{/if}

				<h3 class="chip-header">Industries</h3>
				{#each Array.from($masterIndustries).slice(0, 5) as industry}
					<div class="flex flex-wrap gap-2">
						<div
							class="chip chip-industry cursor-pointer text-white"
							class:active={$selectedIndustries.has(industry)}
							on:click={() => toggleSelection(selectedIndustries, industry)}
						>
							{industry}
						</div>
					</div>
				{/each}
				{#if $masterIndustries.size > 5}
					{#if $showMoreIndustries}
						{#each Array.from($masterIndustries).slice(5) as industry}
							<div
								class="chip chip-industry cursor-pointer text-white"
								class:active={$selectedIndustries.has(industry)}
								on:click={() => toggleSelection(selectedIndustries, industry)}
							>
								{industry}
							</div>
						{/each}
						<div class="flex w-full text-sm">
							<button on:click={() => showMoreIndustries.set(false)}>Show Less</button>
						</div>
					{:else}
						<div class="flex w-full text-sm">
							<button on:click={() => showMoreIndustries.set(true)}>Show More</button>
						</div>
					{/if}
				{/if}

				<h3 class="chip-header">Tracks</h3>
				{#each Array.from($masterTracks).slice(0, 5) as track}
					<div class="flex flex-wrap gap-2">
						<div
							class="chip chip-track cursor-pointer text-white"
							class:active={$selectedTracks.has(track)}
							on:click={() => toggleSelection(selectedTracks, track)}
						>
							{track}
						</div>
					</div>
				{/each}
				{#if $masterTracks.size > 5}
					{#if $showMoreTracks}
						{#each Array.from($masterTracks).slice(5) as track}
							<div
								class="chip chip-track cursor-pointer text-white"
								class:active={$selectedTracks.has(track)}
								on:click={() => toggleSelection(selectedTracks, track)}
							>
								{track}
							</div>
						{/each}
						<div class="flex w-full text-sm">
							<button on:click={() => showMoreTracks.set(false)}>Show Less</button>
						</div>
					{:else}
						<div class="flex w-full text-sm">
							<button on:click={() => showMoreTracks.set(true)}>Show More</button>
						</div>
					{/if}
				{/if}

				<h3 class="chip-header">Role Interests</h3>
				{#each Array.from($masterRoleInterests).slice(0, 5) as roleInterest}
					<div class="flex flex-wrap gap-2">
						<div
							class="chip chip-role-interest cursor-pointer text-white"
							class:active={$selectedRoleInterests.has(roleInterest)}
							on:click={() => toggleSelection(selectedRoleInterests, roleInterest)}
						>
							{roleInterest}
						</div>
					</div>
				{/each}
				{#if $masterRoleInterests.size > 5}
					{#if $showMoreRoleInterests}
						{#each Array.from($masterRoleInterests).slice(5) as roleInterest}
							<div
								class="chip chip-role-interest cursor-pointer text-white"
								class:active={$selectedRoleInterests.has(roleInterest)}
								on:click={() => toggleSelection(selectedRoleInterests, roleInterest)}
							>
								{roleInterest}
							</div>
						{/each}
						<div class="flex w-full text-sm">
							<button on:click={() => showMoreRoleInterests.set(false)}>Show Less</button>
						</div>
					{:else}
						<div class="flex w-full text-sm">
							<button on:click={() => showMoreRoleInterests.set(true)}>Show More</button>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>
