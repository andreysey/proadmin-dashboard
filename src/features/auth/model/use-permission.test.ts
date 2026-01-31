import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePermission } from './use-permission'
import { useAuthStore } from './auth.store'
import type { User } from '@/entities/user'

const ADMIN_USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  image: '',
}

const REGULAR_USER: User = {
  id: 2,
  username: 'user',
  email: 'user@example.com',
  firstName: 'Regular',
  lastName: 'User',
  role: 'user',
  image: '',
}

describe('usePermission', () => {
  beforeEach(() => {
    // Reset store
    useAuthStore.setState({ user: null })
  })

  it('should return false for unauthenticated user', () => {
    const { result } = renderHook(() => usePermission())
    expect(result.current.hasPermission('users:delete')).toBe(false)
  })

  it('should allow admin to delete users', () => {
    useAuthStore.setState({ user: ADMIN_USER })
    const { result } = renderHook(() => usePermission())
    expect(result.current.hasPermission('users:delete')).toBe(true)
  })

  it('should deny regular user from deleting users', () => {
    useAuthStore.setState({ user: REGULAR_USER })
    const { result } = renderHook(() => usePermission())
    expect(result.current.hasPermission('users:delete')).toBe(false)
  })
})
