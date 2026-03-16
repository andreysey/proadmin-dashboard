import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

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

// Global mock for TanStack router to prevent context errors in tests
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    useRouter: () => ({
      navigate: vi.fn(),
      state: { location: { pathname: '/' } },
      ...(typeof actual.useRouter === 'function' ? actual.useRouter() : {}),
    }),
    useSearch: () => ({}),
    useParams: () => ({}),
    useNavigate: () => vi.fn(),
    Link: ({
      children,
      to,
      className,
      ...props
    }: {
      children: React.ReactNode
      to: string
      className?: string
    }) => {
      return React.createElement('a', { href: to, className, ...props }, children)
    },
    Outlet: () => null,
  }
})

// Wrap render from @testing-library/react to provide QueryClientProvider for all tests
vi.mock('@testing-library/react', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  const React = await import('react')
  const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query')

  return {
    ...actual,
    render: (ui: React.ReactElement, options?: Record<string, unknown>) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children)

      // @ts-expect-error - dynamic options for mock render
      return actual.render(ui, {
        wrapper: options?.wrapper || wrapper,
        ...options,
      })
    },
  }
})

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

// Mock react-i18next
vi.mock('react-i18next', () => {
  // Try to load real translations for better test coverage
  // Note: we use require here because it's synchronous and easier in vi.mock
  let enTranslations = {}
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    enTranslations = require('../../locales/en/translation.json')
  } catch {
    // Fallback if file not found
  }

  const getTranslation = (key: string, data?: Record<string, unknown>) => {
    const keys = key.split('.')
    let result: unknown = enTranslations
    for (const k of keys) {
      result = (result as Record<string, unknown>)?.[k]
    }
    if (typeof result === 'string') {
      // Basic interpolation for {{version}}, {{count}} etc.
      if (data) {
        return result.replace(/\{\{(.+?)\}\}/g, (_, p1) => String(data[p1.trim()] || p1))
      }
      return result
    }
    return key
  }

  return {
    useTranslation: () => ({
      t: getTranslation,
      i18n: {
        changeLanguage: () => Promise.resolve(),
        language: 'en',
      },
    }),
    initReactI18next: {
      type: '3rdParty',
      init: () => {},
    },
  }
})
