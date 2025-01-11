<script lang="ts">
    import type { UserType } from '$lib/types';
    import { selectedNavigationOption } from '$lib/stores';
    import { NavigationOption } from '$lib/stores';

    export let data: { userData: UserType };
</script>

<div class="flex h-full max-w-md flex-col gap-4 rounded-2xl pl-8 md:rounded-l-none">
	<div class="flex-shrink-0">
		<h2 class="logo">Kuhnelo</h2>
		<p class="logo-text">Made with 💛 for UCLA</p>
	</div>
	<div class="rounded-xl bg-base-200 p-6">
		<ul class="list-inside list-disc text-sm">
			<li>Sign up or log in to your account.</li>
			<li>Navigate to the chat section.</li>
			<li>Select a contact to start chatting.</li>
			<li>Type your message and hit send.</li>
			<li>Enjoy your conversation!</li>
		</ul>
	</div>
	<div class="button-list h-full flex-grow">
		<button on:click={() => selectedNavigationOption.set(NavigationOption.Chat)}>
			<img src="/icons/chat.svg"  alt="Chat Icon" />
			<span>Chat</span>
		</button>
		<button on:click={() => selectedNavigationOption.set(NavigationOption.Matches)}>
			<img src="/icons/matches.svg" alt="Matches Icon" />
			<span>Matches</span>
		</button>
		<button on:click={() => selectedNavigationOption.set(NavigationOption.GoogleSheet)}>
			<img src="/icons/dashboard.svg" alt="Dashboard Icon" />
			<span>Google Sheet</span>
		</button>
	</div>
	<div class=" w-full flex-shrink-0 rounded-2xl bg-base-200 p-4">
		<div class="flex items-center gap-4">
			<div
				class="relative h-12 w-12  rounded-full "
			>
				<img
					src={`https://ui-avatars.com/api/?name=${data.userData.given_name}+${data.userData.family_name}`}
					alt="User Avatar"
					class="h-full w-full object-cover rounded-full"
				/>
				<div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 animate-ping"></div>
				<div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500"></div>
			</div>
			<div>
				<p class="text-base font-semibold">{data.userData.given_name} {data.userData.family_name}</p>
				<p class="text-sm text-gray-500">{data.userData.email}</p>
			</div>
		</div>
		<div class="divider my-4"></div>
		<a href="/api/auth/logout" class="btn btn-error w-full text-primary-content">
			<!-- <img src="/icons/logout.svg" class="fill-amber-50" alt="Logout Icon" /> -->
			<span>Log Out</span>
		</a>
	</div>
</div>
