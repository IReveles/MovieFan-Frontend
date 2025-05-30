import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (userData) => set({ user: userData, token: userData.token }),
      clearUser: () => set({ user: null, token: null }),
    }),
    {
      name: 'user', // This is the localStorage key
    }
  )
);

export default useUserStore;
