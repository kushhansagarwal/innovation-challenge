<script lang="ts">
	import type { SheetInfo } from '$lib/types';
	export let row: SheetInfo;
	export let index: number;
</script>

<div class="card bg-base-100 p-4">
	<div class="flex items-center gap-3">
		<div class="avatar">
			<div class="mask mask-squircle mr-4 h-24 w-24">
				<img
					src={row.picture?.replace('s96-c', 's500-c') ?? `https://ui-avatars.com/api/?name=${row.name?.replace(' ', '+')}`}
					referrerpolicy="no-referrer"
					alt="Avatar Tailwind CSS Component"
				/>
			</div>
		</div>
		<div>
			<div class="font-bold">{row.name}</div>
			{#if row.school || row.grad_year}
				<div class="text-sm opacity-50">
					{row.school}
					{#if row.school && row.grad_year}
						|
					{/if}
					{#if row.grad_year}{row.grad_year}{/if}
				</div>
			{/if}
			<div class="mt-1 flex gap-1">
				{#if row.email}
					<a
						class="button-chip rounded-md"
						href={`mailto:${row.email}`}
						target="_blank"
					>
						Email
					</a>
				{/if}
				{#if row.linkedin}
					<a
						class="button-chip"
						href={row.linkedin ?? ''}
						target="_blank"
					>
						LinkedIn
					</a>
				{/if}
				{#if row.github}
					<a
						class="button-chip"
						href={row.github ?? ''}
						target="_blank"
					>
						Github
					</a>
				{/if}
			</div>
		</div>
	</div>
	<div class="mt-5 flex flex-wrap gap-2">
		<div class="text-sm">
			{#if row.program}
			<p><strong>Program:</strong> {row.program}</p>
			{/if}
			{#if row.industry}
			<p><strong>Industry:</strong> {row.industry}</p>
			{/if}
			{#if row.track}
			<p><strong>Track:</strong> {row.track}</p>
			{/if}
			{#if row.role_interest}
			<p><strong>Role Interest:</strong> {row.role_interest}</p>
			{/if}
			{#if row.competition}
			<p><strong>Competition:</strong> {row.competition}</p>
			{/if}
		</div>
	</div>
	<div class="divider my-2"></div>
	{#if row.bio}
		<div class="">
			<p class="text-sm">{row.bio}</p>
		</div>
	{/if}
</div>
