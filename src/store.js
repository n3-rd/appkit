import { sdk } from './appwrite';
import { writable } from 'svelte/store';
const createState = () => {
    const { subscribe, set, update } = writable({
        account: null,
        alert: null
    });

    return {
        subscribe,
        signup: async (email, password, name) => {
            return await sdk.account.create('unique()', email, password, name);
        },
        user: async () => {
            return await sdk.account.get();
        },
        login: async (email, password) => {
            await sdk.account.createEmailSession(email, password);
            const user = await sdk.account.get();
            state.init(user);
        },
        logout: async () => {
            await sdk.account.deleteSession('current');
        },
        alert: async (alert) =>
            update((n) => {
                n.alert = alert;
                return n;
            }),
        init: async (account = null) => {
            return set({ account, alert: null });
        },
        checkSession: async () => {
            const user = await sdk.account.get();
            state.init(user);
        }
    };
};
export const state = createState();