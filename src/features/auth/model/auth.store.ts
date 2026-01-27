import type { User } from '@/entities/user'
import { tokenStorage } from '@/shared/lib/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  // Actions
  setAuth: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      logout: () => {
        set({ user: null })
        tokenStorage.remove()
      },
    }),
    {
      name: 'auth-storage', // Key for LocalStorage
    }
  )
)
