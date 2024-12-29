<script lang="ts">
	import type { Message } from '$lib/types.d.ts';

	export let message: Message;
</script>

<div class="ml-auto max-w-[50rem] rounded-3xl bg-base-300 relative">
    <div
        class="border-3 border-n-2 dark:bg-n-5/50 space-y-6 rounded-[1.25rem] px-6 pb-16 pt-6 md:p-5 md:pb-8 dark:border-transparent"
    >
        <div class="">{message.content}</div>
    </div>
    <div class="absolute -bottom-6 right-6 flex items-end">
        <div
            class="relative h-12 w-12 overflow-hidden rounded-full shadow-[0_0_0_0.25rem_#FEFEFE] dark:shadow-[0_0_0_0.25rem_#232627]"
        >
            <img src="https://lh3.googleusercontent.com/a/ACg8ocLtgaYL59QxSrGNC5Lm5drjVLXXuwlvKpcz2bzf5nTt6tdtaxGq" alt="Human Avatar" class="h-full w-full object-cover" />
        </div>
    </div>
</div>