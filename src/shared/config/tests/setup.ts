import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global Mocks
vi.stubGlobal(
  'ResizeObserver',
  vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
)
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Clean up after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock ResizeObserver (required for some UI components)
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock matchMedia (required for responsive design tests)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
