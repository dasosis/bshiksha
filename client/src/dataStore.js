import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

let dataStore = (set) => ({
  currentAccount: null,
  setCurrentAccount: (currentAccount) => set({ currentAccount }),
});

dataStore = devtools(dataStore, 'dataStore');

export const useStore = create(dataStore);
