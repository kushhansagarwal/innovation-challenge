<script lang="ts">
	import type { SheetInfo } from '$lib/types';
	export let row: SheetInfo;
	export let index: number;
</script>

<div class="card bg-base-100  p-4 rounded-lg">
	<div class="flex items-center gap-3">
		<div class="avatar">
			<div class="mask mask-squircle h-24 w-24 mr-4">
				<img
					src={`https://ui-avatars.com/api/?name=${row.name?.replace(' ', '+')}`}
					alt="Avatar Tailwind CSS Component"
				/>
			</div>
		</div>
		<div>
			<div class="font-bold">{row.name}</div>
			<div class="text-sm opacity-50">{row.school} | {row.grad_year}</div>
			<div class="mt-1 flex gap-1">
				<button
					class="email-button p-1 hover:bg-base-300"
					on:click={() => window.open(`mailto:${row.email}`, '_blank')}
				>
					<img src="/icons/email.svg" alt="Email" class="h-6 w-6" />
				</button>
				{#if row.linkedin}
					<button
						class="linkedin-button p-1 hover:bg-base-300"
						on:click={() => window.open(row.linkedin ?? '', '_blank')}
					>
						<img src="/icons/linkedin.svg" alt="LinkedIn" class="h-6 w-6" />
					</button>
				{/if}
				{#if row.github}
					<button
						class="github-button p-1 hover:bg-base-300"
						on:click={() => window.open(row.github ?? '', '_blank')}
					>
						<img src="/icons/github.svg" alt="Github" class="h-6 w-6" />
					</button>
				{/if}
			</div>
		</div>
	</div>
    <div class="divider py-5"></div>
	<div class="mt-2 flex flex-wrap gap-2">
		<div class="chip chip-program text-white">{row.program}</div>
		{#each row.industry?.split(',') ?? [] as industry}
			<div class="chip chip-industry text-white">{industry.trim()}</div>
		{/each}
		{#each row.track?.split(',') ?? [] as track}
			<div class="chip chip-track text-white">{track.trim()}</div>
		{/each}
		{#each row.role_interest?.split(',') ?? [] as role_interest}
			{#if role_interest.trim()}
				<div class="chip chip-role-interest text-white">{role_interest.trim()}</div>
			{/if}
		{/each}
		{#each row.competition?.split(',') ?? [] as competition}
			{#if competition.trim()}
				<div class="chip chip-competition text-white">{competition.trim()}</div>
			{/if}
		{/each}
	</div>
	{#if row.bio}
		<div class="mt-4">
			<p class="text-sm">{row.bio}</p>
		</div>
	{/if}
</div>
