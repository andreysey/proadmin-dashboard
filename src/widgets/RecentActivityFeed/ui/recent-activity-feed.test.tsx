import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecentActivityFeed } from './recent-activity-feed'
import * as analyticsApi from '@/entities/analytics'

// Mock dependencies
vi.mock('@/entities/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof analyticsApi>()
  return {
    ...actual,
    useRecentEvents: vi.fn(),
  }
})

describe('RecentActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton when loading', () => {
    vi.mocked(analyticsApi.useRecentEvents).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof analyticsApi.useRecentEvents>)

    render(<RecentActivityFeed dateRange="7d" />)
    // Check for skeleton specific elements or structure
    // The skeleton renders 5 items with "flex items-start gap-3"
    // We can check if "Recent Activity" title is NOT present because loading skeleton replaces the whole card content?
    // Wait, looking at code: <RecentActivityFeedSkeleton /> renders a Card with Header and Content.
    // But the Title is inside Skeleton? No, Skeleton header has a Skeleton line.
    // So "Recent Activity" text is NOT in the skeleton.
    expect(screen.queryByText('Recent Activity')).not.toBeInTheDocument()
  })

  it('should show error message', () => {
    vi.mocked(analyticsApi.useRecentEvents).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    } as unknown as ReturnType<typeof analyticsApi.useRecentEvents>)

    render(<RecentActivityFeed dateRange="7d" />)
    expect(screen.getByText('Failed to load recent activity')).toBeInTheDocument()
  })

  it('should render empty state', () => {
    vi.mocked(analyticsApi.useRecentEvents).mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof analyticsApi.useRecentEvents>)

    render(<RecentActivityFeed dateRange="7d" />)
    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })

  it('should render events', () => {
    const now = new Date()
    const mockEvents = [
      {
        id: '1',
        type: 'user_signup',
        title: 'New User Registered',
        description: 'User John Doe has joined',
        timestamp: now.toISOString(), // Just now
      },
      {
        id: '2',
        type: 'payment_success',
        title: 'Payment Received',
        description: '$50.00 from Jane',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
      },
    ]

    vi.mocked(analyticsApi.useRecentEvents).mockReturnValue({
      data: mockEvents,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof analyticsApi.useRecentEvents>)

    render(<RecentActivityFeed dateRange="7d" />)
    expect(screen.getByText('New User Registered')).toBeInTheDocument()
    expect(screen.getByText('Just now')).toBeInTheDocument()
    expect(screen.getByText('Payment Received')).toBeInTheDocument()
    expect(screen.getByText('2h ago')).toBeInTheDocument()
  })
})
