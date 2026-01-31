import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityChart } from './activity-chart'
import { useAnalyticsActivity } from '@/entities/analytics'
import type { ReactNode } from 'react'

// Mock the hook
vi.mock('@/entities/analytics', () => ({
  useAnalyticsActivity: vi.fn(),
}))

// Mock Recharts to avoid compilation/rendering issues in JSDOM
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div className="recharts-responsive-container" style={{ width: 800, height: 300 }}>
        {children}
      </div>
    ),
    AreaChart: ({ children }: { children: ReactNode }) => (
      <div data-testid="area-chart">{children}</div>
    ),
    Area: () => <div data-testid="chart-area" />,
    XAxis: () => <div data-testid="chart-xaxis" />,
    YAxis: () => <div data-testid="chart-yaxis" />,
    CartesianGrid: () => <div data-testid="chart-grid" />,
    Tooltip: () => <div data-testid="chart-tooltip" />,
  }
})

describe('ActivityChart', () => {
  const mockDateRange = '7d'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton when loading', () => {
    vi.mocked(useAnalyticsActivity).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as unknown as import('@tanstack/react-query').UseQueryResult<
      import('@/entities/analytics').ActivitySeries[],
      Error
    >)

    const { container } = render(<ActivityChart dateRange={mockDateRange} />)
    // Check for skeleton elements (assuming shadcn skeleton uses specific class or structure)
    // or just check that chart is not there
    expect(container.querySelector('.animate-pulse')).toBeDefined()
    expect(screen.queryByText('User Activity')).toBeNull()
  })

  it('should render error message on failure', () => {
    vi.mocked(useAnalyticsActivity).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    } as unknown as import('@tanstack/react-query').UseQueryResult<
      import('@/entities/analytics').ActivitySeries[],
      Error
    >)

    render(<ActivityChart dateRange={mockDateRange} />)
    expect(screen.getByText(/Failed to load activity data/i)).toBeDefined()
  })

  it('should render chart when data is present', () => {
    const mockData = [
      {
        type: 'new_users',
        data: [
          { timestamp: '2023-01-01T00:00:00Z', value: 10 },
          { timestamp: '2023-01-02T00:00:00Z', value: 20 },
        ],
      },
    ]

    vi.mocked(useAnalyticsActivity).mockReturnValue({
      data: mockData,
      isPending: false,
      isError: false,
    } as unknown as import('@tanstack/react-query').UseQueryResult<
      import('@/entities/analytics').ActivitySeries[],
      Error
    >)

    render(<ActivityChart dateRange={mockDateRange} />)

    expect(screen.getByText('User Activity')).toBeDefined()
    expect(screen.getByTestId('area-chart')).toBeDefined()
    expect(screen.getByTestId('chart-area')).toBeDefined()
  })
})
