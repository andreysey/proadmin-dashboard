import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RevenueStream } from './revenue-stream'
import { useRevenueData } from '@/entities/analytics'
import type { ReactNode } from 'react'

// Mock the hook
vi.mock('@/entities/analytics', () => ({
  useRevenueData: vi.fn(),
}))

// Mock Recharts
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div className="recharts-responsive-container" style={{ width: 800, height: 300 }}>
        {children}
      </div>
    ),
    BarChart: ({ children }: { children: ReactNode }) => (
      <div data-testid="bar-chart">{children}</div>
    ),
    Bar: () => <div data-testid="chart-bar" />,
    XAxis: () => <div data-testid="chart-xaxis" />,
    YAxis: () => <div data-testid="chart-yaxis" />,
    CartesianGrid: () => <div data-testid="chart-grid" />,
    Tooltip: () => <div data-testid="chart-tooltip" />,
  }
})

describe('RevenueStream', () => {
  const mockDateRange = '7d'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton when loading', () => {
    vi.mocked(useRevenueData).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as unknown as import('@tanstack/react-query').UseQueryResult<
      import('@/entities/analytics').RevenueDataPoint[],
      Error
    >)

    const { container } = render(<RevenueStream dateRange={mockDateRange} />)
    // Check for skeleton
    expect(container.querySelector('.animate-pulse')).toBeDefined()
    expect(screen.queryByText('Revenue Stream')).toBeNull()
  })

  it('should render error message on failure', () => {
    vi.mocked(useRevenueData).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    } as unknown as import('@tanstack/react-query').UseQueryResult<
      import('@/entities/analytics').RevenueDataPoint[],
      Error
    >)

    render(<RevenueStream dateRange={mockDateRange} />)
    expect(screen.getByText(/Failed to load revenue data/i)).toBeDefined()
  })

  it('should render chart when data is present', () => {
    const mockData = [
      {
        month: 'Jan',
        revenue: 5000,
        orders: 120,
      },
      {
        month: 'Feb',
        revenue: 7000,
        orders: 150,
      },
    ]

    vi.mocked(useRevenueData).mockReturnValue({
      data: mockData,
      isPending: false,
      isError: false,
    } as unknown as import('@tanstack/react-query').UseQueryResult<
      import('@/entities/analytics').RevenueDataPoint[],
      Error
    >)

    render(<RevenueStream dateRange={mockDateRange} />)

    expect(screen.getAllByText('Revenue Stream')[0]).toBeDefined() // Card Title
    expect(screen.getByTestId('bar-chart')).toBeDefined()
    expect(screen.getByTestId('chart-bar')).toBeDefined()
  })
})
