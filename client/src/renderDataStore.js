import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

let renderDataStore = (set) => ({
  profilePageRender: false,
  setProfilePageRender: (profilePageRender) => set({ profilePageRender }),
});

renderDataStore = devtools(renderDataStore, 'renderData');

export const useRender = create(renderDataStore);
