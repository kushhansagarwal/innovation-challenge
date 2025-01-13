<script lang="ts">
    import type { UserType } from '$lib/types';
    import { selectedNavigationOption, isNavOpen } from '$lib/stores';
    import { NavigationOption } from '$lib/stores';

    export let data: { userData: UserType };
</script>

<div class="flex h-full max-w-md flex-col gap-4 p-8 md:p-0 md:pl-8 md:rounded-l-none bg-base-100 pt-16 md:pt-0">
	<div class="flex-shrink-0 cursor-pointer hover:bg-base-200 p-4 rounded-2xl" on:click={() => selectedNavigationOption.set(NavigationOption.Chat)}>
		<h2 class="logo mb-2">Innovation Challenge Matching</h2>
		<p class="logo-text">Made by Kuhnelo for UCLA</p>
	</div>
	<div class="divider"></div>
	<div class="button-list h-full flex-grow">
		<button on:click={() => {
			selectedNavigationOption.set(NavigationOption.Chat);
			isNavOpen.set(false);
		}}>
			<img src="/icons/chat.svg"  alt="Chat Icon" />
			<span>Chat</span>
		</button>
		<button on:click={() => {
			selectedNavigationOption.set(NavigationOption.Matches);
			isNavOpen.set(false);
		}}>
			<img src="/icons/matches.svg" alt="Matches Icon" />
			<span>Matches</span>
		</button>
		<button on:click={() => {
			selectedNavigationOption.set(NavigationOption.GoogleSheet);
			isNavOpen.set(false);
		}}>
			<img src="/icons/dashboard.svg" alt="Dashboard Icon" />
			<span>All Participants</span>
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
		<a href="/api/auth/logout" class="btn btn-error w-full">
			<!-- <img src="/icons/logout.svg" class="fill-amber-50" alt="Logout Icon" /> -->
			<span>Log Out</span>
		</a>
	</div>
</div>
