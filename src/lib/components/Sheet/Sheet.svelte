<script lang="ts">
	export let token: string;
	import { PUBLIC_ENDPOINT_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { SheetResponse } from '$lib/types';
	import SheetRow from './SheetRow.svelte';
	import { writable, derived, type Writable } from 'svelte/store';

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
				return data;
			} else {
				
			}
		} catch (error) {
			
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

			const programs = new Set<string>();
			const competitions = new Set<string>();
			const industries = new Set<string>();
			const tracks = new Set<string>();
			const roleInterests = new Set<string>();

			data.sheetInfo.forEach((row) => {
				row.program?.split(',').forEach((program: string) => programs.add(program.trim()));
				row.competition
					?.split(',')
					.forEach((competition: string) => competitions.add(competition.trim()));
				row.industry?.split(',').forEach((industry: string) => industries.add(industry.trim()));
				row.track?.split(',').forEach((track: string) => tracks.add(track.trim()));
				row.role_interest
					?.split(',')
					.forEach((roleInterest: string) => roleInterests.add(roleInterest.trim()));
			});

			masterPrograms.set(programs);
			masterCompetitions.set(competitions);
			masterIndustries.set(industries);
			masterTracks.set(tracks);
			masterRoleInterests.set(roleInterests);
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
</script>

<div class="flex h-full w-full flex-col items-start rounded-2xl bg-base-200 md:rounded-r-none">
	<div class="grid h-full grid-cols-1 md:grid-cols-3 overflow-y-auto">
		<div class="overflow-y-auto md:col-span-2">
			<div class="flex h-full w-full flex-grow flex-col gap-4 overflow-y-auto p-8">
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 overflow-y-auto">
					{#each $filteredData as row, index}
						<div class="card rounded-lg bg-base-100 p-4 shadow-md">
							<SheetRow {row} {index} />
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="h-full border-l border-base-300 ">
			<div class="order-1 flex flex-wrap gap-2 p-8 md:order-2">
				<h3 class="chip-header">Programs</h3>
				<div class="flex flex-wrap gap-2">
					{#each Array.from($masterPrograms) as program}
						<div
							class="chip chip-program cursor-pointer text-white"
							class:active={$selectedPrograms.has(program)}
							on:click={() => toggleSelection(selectedPrograms, program)}
						>
							{program}
						</div>
					{/each}
				</div>

				<h3 class="chip-header">Competitions</h3>
				<div class="flex flex-wrap gap-2">
					{#each Array.from($masterCompetitions) as competition}
						<div
							class="chip chip-competition cursor-pointer text-white"
							class:active={$selectedCompetitions.has(competition)}
							on:click={() => toggleSelection(selectedCompetitions, competition)}
						>
							{competition}
						</div>
					{/each}
				</div>

				<h3 class="chip-header">Industries</h3>
				<div class="flex flex-wrap gap-2">
					{#each Array.from($masterIndustries) as industry}
						<div
							class="chip chip-industry cursor-pointer text-white"
							class:active={$selectedIndustries.has(industry)}
							on:click={() => toggleSelection(selectedIndustries, industry)}
						>
							{industry}
						</div>
					{/each}
				</div>

				<h3 class="chip-header">Tracks</h3>
				<div class="flex flex-wrap gap-2">
					{#each Array.from($masterTracks) as track}
						<div
							class="chip chip-track cursor-pointer text-white"
							class:active={$selectedTracks.has(track)}
							on:click={() => toggleSelection(selectedTracks, track)}
						>
							{track}
						</div>
					{/each}
				</div>

				<h3 class="chip-header">Role Interests</h3>
				<div class="flex flex-wrap gap-2">
					{#each Array.from($masterRoleInterests) as roleInterest}
						<div
							class="chip chip-role-interest cursor-pointer text-white"
							class:active={$selectedRoleInterests.has(roleInterest)}
							on:click={() => toggleSelection(selectedRoleInterests, roleInterest)}
						>
							{roleInterest}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
