import type { User } from '@/entities/user'
import type { DashboardStats, ActivitySeries, RecentEvent } from '@/entities/analytics'
import { http, HttpResponse, delay, passthrough } from 'msw'

const deletedUserIds = new Set<number>()
const updatedUsers = new Map<number, Partial<User>>()

const propertyAccessor = (obj: User, path: string) => {
  if (path === 'user') return obj.firstName.toLowerCase()
  const key = path as keyof User
  return obj[key]?.toString().toLowerCase() ?? ''
}

export const handlers = [
  // Mocking DummyJSON login endpoint
  http.post('https://dummyjson.com/auth/login', async ({ request }) => {
    const { role = 'admin' } = (await request.json()) as { role?: string }
    await delay(1000)

    return HttpResponse.json({
      id: 15,
      username: 'andriibutsvin',
      email: 'andreyseynew@gmail.com',
      firstName: 'Andrii',
      lastName: 'Butsvin',
      gender: 'male',
      role: role,
      image: 'https://dummyjson.com/icon/kminchelle/128',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Mock JWT
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
  }),

  http.post('https://dummyjson.com/auth/refresh', async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken: string }

    if (!refreshToken) {
      return new HttpResponse(null, { status: 400 })
    }

    await delay(1000)
    return HttpResponse.json({
      token: 'NEW_mock_access_token_' + Date.now(),
      refreshToken: 'NEW_mock_refresh_token_' + Date.now(),
    })
  }),

  http.get('https://dummyjson.com/users', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (authHeader === 'Bearer mock-expired-token') {
      console.log('MSW: Detected poison token, returning 401...')
      return new HttpResponse(null, { status: 401 })
    }

    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') ?? '0')
    const limit = parseInt(url.searchParams.get('limit') ?? '10')

    if (url.searchParams.get('limit') === '0') {
      return passthrough()
    }

    const response = await fetch('https://dummyjson.com/users?limit=0')
    const data = await response.json()

    // Enhance, apply updates, and then filter out deleted ones
    const allUsers = data.users
      .map((user: User) => {
        const enhanced = {
          ...user,
          role: user.id % 2 === 1 ? 'admin' : 'user',
        }
        // Apply local updates if any
        if (updatedUsers.has(user.id)) {
          return { ...enhanced, ...updatedUsers.get(user.id) }
        }
        return enhanced
      })
      .filter((user: User) => !deletedUserIds.has(user.id))

    const query = url.searchParams.get('q')?.toLowerCase() ?? ''
    const sortBy = url.searchParams.get('sortBy')
    const order = url.searchParams.get('order') ?? 'asc'

    const filteredUsers = query
      ? allUsers.filter(
          (user: User) =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        )
      : allUsers

    // Sort in memory
    if (sortBy) {
      filteredUsers.sort((a: User, b: User) => {
        const fieldA = propertyAccessor(a, sortBy)
        const fieldB = propertyAccessor(b, sortBy)

        if (fieldA < fieldB) return order === 'asc' ? -1 : 1
        if (fieldA > fieldB) return order === 'asc' ? 1 : -1
        return 0
      })
    }

    // Paginate in memory
    const paginatedUsers = filteredUsers.slice(skip, skip + limit)

    return HttpResponse.json({
      users: paginatedUsers,
      total: filteredUsers.length,
      skip,
      limit,
    })
  }),

  http.get('https://dummyjson.com/users/:id', async ({ params, request }) => {
    const url = new URL(request.url)
    if (url.searchParams.has('bypass')) return passthrough()

    const { id } = params
    const userId = Number(id)

    if (deletedUserIds.has(userId)) {
      return new HttpResponse(null, { status: 404, statusText: 'User not found' })
    }

    const response = await fetch(`https://dummyjson.com/users/${id}?bypass=true`)
    if (!response.ok) return passthrough()

    const user = await response.json()
    const enhanced = {
      ...user,
      role: userId % 2 === 1 ? 'admin' : 'user',
    }

    // Apply local updates if any
    const finalUser = updatedUsers.has(userId)
      ? { ...enhanced, ...updatedUsers.get(userId) }
      : enhanced

    return HttpResponse.json(finalUser)
  }),

  http.put('https://dummyjson.com/users/:id', async ({ params, request }) => {
    const { id } = params
    const userId = Number(id)
    const updates = (await request.json()) as Partial<User>

    await delay(1000)

    // Store the update locally
    const existingUpdates = updatedUsers.get(userId) ?? {}
    updatedUsers.set(userId, { ...existingUpdates, ...updates })

    // Fetch the original user to return complete object (for Zod validation)
    const response = await fetch(`https://dummyjson.com/users/${id}?bypass=true`)
    const originalUser = await response.json()

    const enhanced = {
      ...originalUser,
      role: userId % 2 === 1 ? 'admin' : 'user',
      ...existingUpdates,
      ...updates,
    }

    return HttpResponse.json(enhanced)
  }),

  http.delete('https://dummyjson.com/users/:id', async ({ params }) => {
    const { id } = params
    deletedUserIds.add(Number(id))
    await delay(1000)

    return HttpResponse.json({
      id: Number(id),
      isDeleted: true,
      deletedOn: new Date().toISOString(),
    })
  }),

  // --- Analytics Dashboard ---

  http.get('https://dummyjson.com/analytics/stats', async ({ request }) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') ?? '7d'
    await delay(800)

    // Vary stats based on dateRange for simulation
    const multiplier = dateRange === '24h' ? 0.1 : dateRange === '7d' ? 1 : 3
    const stats: DashboardStats = {
      totalUsers: Math.floor(12543 * multiplier),
      activeNow: Math.floor(42 * (multiplier > 1 ? 1 : multiplier)),
      totalRevenue: Math.floor(850400.5 * multiplier),
      monthlyGrowth: dateRange === '24h' ? 2.1 : dateRange === '7d' ? 12.5 : 8.3,
    }
    return HttpResponse.json(stats)
  }),

  http.get('https://dummyjson.com/analytics/activity', async ({ request }) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') ?? '7d'
    await delay(1200)

    const now = new Date()
    // Generate different number of data points based on dateRange
    const pointCount = dateRange === '24h' ? 24 : dateRange === '7d' ? 7 : 30
    const intervalMs =
      dateRange === '24h'
        ? 60 * 60 * 1000 // 1 hour
        : 24 * 60 * 60 * 1000 // 1 day

    const activity: ActivitySeries[] = [
      {
        type: 'new_users',
        data: Array.from({ length: pointCount }).map((_, i) => ({
          timestamp: new Date(now.getTime() - (pointCount - 1 - i) * intervalMs).toISOString(),
          value: Math.floor(Math.random() * 100) + 10,
        })),
      },
    ]
    return HttpResponse.json(activity)
  }),

  http.get('https://dummyjson.com/analytics/recent', async ({ request }) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') ?? '7d'
    await delay(500)

    // More events for longer date ranges
    const eventCount = dateRange === '24h' ? 2 : dateRange === '7d' ? 5 : 10
    const eventTypes: RecentEvent['type'][] = [
      'user_signup',
      'system_alert',
      'payment_success',
      'user_delete',
    ]
    const eventTitles: Record<RecentEvent['type'], string> = {
      user_signup: 'New User Registered',
      user_delete: 'User Account Deleted',
      system_alert: 'Server Load High',
      payment_success: 'Payment Received',
    }

    const events: RecentEvent[] = Array.from({ length: eventCount }).map((_, i) => {
      const type = eventTypes[i % eventTypes.length]
      return {
        id: String(i + 1),
        type,
        title: eventTitles[type],
        description: `Event ${i + 1} description`,
        timestamp: new Date(Date.now() - i * 1000 * 60 * 30).toISOString(),
      }
    })
    return HttpResponse.json(events)
  }),

  http.get('https://dummyjson.com/analytics/revenue', async ({ request }) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') ?? '7d'
    await delay(900)

    // Different periods based on dateRange
    const monthCount = dateRange === '24h' ? 1 : dateRange === '7d' ? 3 : 6
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const months = allMonths.slice(0, monthCount)

    const revenueData = months.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 30000,
      orders: Math.floor(Math.random() * 300) + 100,
    }))
    return HttpResponse.json(revenueData)
  }),
]
