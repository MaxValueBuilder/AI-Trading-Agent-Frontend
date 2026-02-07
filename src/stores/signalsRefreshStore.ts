import { create } from 'zustand';

interface SignalsRefreshState {
  lastUpdatedAt: number;
  bump: () => void;
}

export const useSignalsRefreshStore = create<SignalsRefreshState>((set) => ({
  lastUpdatedAt: 0,
  bump: () => {
    const newTime = Date.now();
    console.log("🔄 SignalsRefreshStore: bump called, new time:", newTime);
    set({ lastUpdatedAt: newTime });
  },
})); 