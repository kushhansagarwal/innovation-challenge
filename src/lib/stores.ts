import type { Message } from '$lib/types.d.ts';
import { writable } from 'svelte/store';

export const messages = writable<Message[]>([]);

export const sessionId = writable<string>('');

export const sendButtonDisabled = writable<boolean>(false);

export enum NavigationOption {
    Chat = 'chat',
    Matches = 'matches',
    GoogleSheet = 'google_sheet'
}

export const selectedNavigationOption = writable<NavigationOption>(NavigationOption.Matches);
