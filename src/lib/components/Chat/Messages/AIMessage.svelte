<script lang="ts">
	import type { Message } from '$lib/types.d.ts';
	import { onMount } from 'svelte';

	export let message: Message;
	let displayedContent = '';
	let index = 0;

	onMount(() => {
		const interval = setInterval(() => {
			if (index < message.content.length) {
				displayedContent += message.content[index];
				index++;
			} else {
				clearInterval(interval);
			}
		}, 10); // Adjust the speed of the typewriter effect here
	});
</script>

<div class="relative mr-auto max-w-[50rem] rounded-3xl bg-base-100">
	<div
		class="border-3 border-n-2 dark:bg-n-5/50 space-y-6 rounded-[1.25rem] px-6 pb-16 pt-6 md:p-5 md:pb-8 dark:border-transparent"
	>
		<div class="">{displayedContent}</div>
	</div>
	<div class="absolute -bottom-6 left-6 flex items-end">
		<div
			class="relative h-12 w-12 overflow-hidden rounded-full shadow-[0_0_0_0.25rem_#FEFEFE] dark:shadow-[0_0_0_0.25rem_#232627]"
		>
			<img src="/GIRAF.png" />
		</div>
	</div>
</div>
