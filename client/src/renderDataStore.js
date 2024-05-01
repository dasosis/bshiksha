import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

let renderDataStore = (set) => ({
  pageRender: 0,
  setPageRender: (pageRender) => set({ pageRender }),
});

renderDataStore = devtools(renderDataStore, 'renderData');

export const useRender = create(renderDataStore);
