import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { tokenStorage } from '@/shared/lib/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock tokenStorage
// Mock page components/widgets to avoid rendering complex widgets/fetching data
vi.mock('@/pages/login', () => ({
  LoginPage: () => <div>Login Page</div>,
}))
vi.mock('@/pages/users', () => ({
  UsersPage: () => <div>Users Page</div>,
}))
vi.mock('@/pages/edit-user', () => ({
  EditUserPage: () => <div>Edit User Page</div>,
}))

vi.mock('@/widgets/PageLayout', () => ({
  DashboardLayout: () => <div>Dashboard Layout</div>,
}))

vi.mock('@/widgets/StatsOverview', () => ({ StatsOverview: () => <div>Stats</div> }))
vi.mock('@/widgets/ActivityChart', () => ({ ActivityChart: () => <div>Chart</div> }))
vi.mock('@/widgets/RecentActivityFeed', () => ({ RecentActivityFeed: () => <div>Feed</div> }))
vi.mock('@/widgets/RevenueStream', () => ({ RevenueStream: () => <div>Revenue</div> }))

// Mock DevTools
vi.mock('@tanstack/router-devtools', () => ({
  TanStackRouterDevtools: () => null,
}))
vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtools: () => null,
}))

vi.mock('@/features/dashboard-filters', () => ({
  DateRangePicker: () => <div>Date</div>,
  AutoRefreshToggle: () => <div>Toggle</div>,
  dashboardSearchSchema: { parse: (s: unknown) => s },
}))

vi.mock('@/features/export-dashboard', () => ({ ExportButton: () => <div>Export</div> }))

vi.mock('@/entities/analytics', () => ({
  useAnalyticsStats: () => ({ data: {} }),
  useRecentEvents: () => ({ data: [] }),
}))

// Mock auth store
vi.mock('@/features/auth', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({ user: { role: 'admin' } })),
  },
}))

// Mock tokenStorage
vi.mock('@/shared/lib/auth', () => ({
  tokenStorage: {
    getAccessToken: vi.fn(),
  },
}))

// Mock ResizeObserver is handled in setup.ts

// Create a real QueryClient for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

function createTestRouter(initialPath: string) {
  const history = createMemoryHistory({ initialEntries: [initialPath] })
  return createRouter({
    routeTree,
    history,
  })
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('Router Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to login if visiting dashboard while unauthenticated', async () => {
    // Mock not authenticated
    vi.mocked(tokenStorage.getAccessToken).mockReturnValue(null)

    const router = createTestRouter('/')
    render(<RouterProvider router={router} />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(router.history.location.pathname).toBe('/login')
    })
  })

  it('should redirect to dashboard if visiting login while authenticated', async () => {
    // Mock authenticated
    vi.mocked(tokenStorage.getAccessToken).mockReturnValue('fake-token')

    const router = createTestRouter('/login')
    render(<RouterProvider router={router} />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(router.history.location.pathname).toBe('/')
    })
  })

  it('should allow access to dashboard if authenticated', async () => {
    vi.mocked(tokenStorage.getAccessToken).mockReturnValue('fake-token')

    const router = createTestRouter('/')
    render(<RouterProvider router={router} />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(router.history.location.pathname).toBe('/')
    })
  })
})
