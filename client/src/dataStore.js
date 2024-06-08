import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let dataStore = (set) => ({
  currentAccount: null,
  setCurrentAccount: (currentAccount) => set({ currentAccount }),
  feedData: [],
  responseData: null,
  setFeedData: (data) => set({ feedData: data }),
  setResponseData: (data) => set({ responseData: data }),
  userData: [],
  setUserData: (data) => set({ userData: data }),
  userPosts: [],
  setUserPosts: (data) => set({ userPosts: data }),
});

// Apply both devtools and persist middleware
dataStore = devtools(
  persist(dataStore, {
    name: 'dataStore', // unique name for the storage
    Storage: () => localStorage, // (optional) by default it uses localStorage
  })
);

export const useStore = create(dataStore);
