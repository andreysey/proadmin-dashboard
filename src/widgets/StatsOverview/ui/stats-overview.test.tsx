import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsOverview } from './stats-overview'
import * as analyticsApi from '@/entities/analytics'

// Mock the entire analytics module
vi.mock('@/entities/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof analyticsApi>()
  return {
    ...actual,
    useAnalyticsStats: vi.fn(),
  }
})

describe('StatsOverview', () => {
  it('should render loading skeleton when data is pending', () => {
    // Setup mock for pending state
    vi.mocked(analyticsApi.useAnalyticsStats).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(<StatsOverview dateRange="7d" />)

    // Check for "Total Users" title in skeleton card structure
    // Since skeleton doesn't have text, we can check for structure or test passed
    // But title "Total Users" might be hardcoded in the component but not rendered if pending?
    // Let's check logic:
    // if (isPending) return <StatsOverviewSkeleton />
    // Skeleton renders Skeletons, no text.
    // So we can check that we DON'T see "Total Users" text yet (or if skeleton has it? No)
    // Actually, looking at code, Skeleton renders generic cards.
    // We can check for a class or aria-busy if we had it.
    // simpler: check if "Total Users" is NOT in document.
    expect(screen.queryByText('Total Users')).not.toBeInTheDocument()
  })

  it('should render stats when data is loaded', () => {
    // Setup mock for success state
    const mockData = {
      totalUsers: 12500,
      activeNow: 123,
      totalRevenue: 54321,
      monthlyGrowth: 12.5,
    }

    vi.mocked(analyticsApi.useAnalyticsStats).mockReturnValue({
      data: mockData,
      isPending: false,
      isError: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(<StatsOverview dateRange="7d" />)

    // Check for rendered values
    expect(screen.getByText('Total Users')).toBeInTheDocument()

    // Check formatted numbers (German locale mocked in setup.ts? No, but Intl works in node/jsdom 16+)
    // 12.500 for 12500
    // We can use regex or exact match if we know how jsdom behaves.
    // Let's approximate or just check for presence.
    expect(screen.getByText('12.500')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()

    // Revenue formatted: 54.321 €
    // Note: Intl implementation differences might exist.
    // Let's try flexible match
    expect(screen.getByText(/54\.321/)).toBeInTheDocument()
  })

  it('should render error state', () => {
    vi.mocked(analyticsApi.useAnalyticsStats).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(<StatsOverview dateRange="7d" />)

    expect(screen.getByText('Failed to load statistics')).toBeInTheDocument()
  })
})
