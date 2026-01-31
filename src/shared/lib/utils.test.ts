import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('c-1', 'c-2')).toBe('c-1 c-2')
    })

    it('should handle conditional classes', () => {
      const show = true
      const hide = false
      expect(cn('c-1', show && 'c-2', hide && 'c-3')).toBe('c-1 c-2')
    })

    it('should merge tailwind classes using tailwind-merge', () => {
      // p-4 overrides p-2
      expect(cn('p-2 p-4')).toBe('p-4')
    })
  })
})
