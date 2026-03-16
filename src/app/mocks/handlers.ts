import type { User } from '@/entities/user'
import type { DashboardStats, ActivitySeries, RecentEvent } from '@/entities/analytics'
import { http, HttpResponse, delay, passthrough } from 'msw'
import { config } from '@/shared/config'

const deletedUserIds = new Set<string>()
const updatedUsers = new Map<string, Partial<User>>()
const BASE_URL = config.api.baseUrl

// Static users list for mock mode to avoid backend dependency
const MOCK_USERS_SEED: User[] = [
  {
    id: '1',
    displayId: 1,
    username: 'atuny0',
    email: 'atuny0@sohu.com',
    firstName: 'Terry',
    lastName: 'Medhurst',
    role: 'ADMIN',
    image: 'https://i.pravatar.cc/150?u=1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    displayId: 2,
    username: 'hbingley1',
    email: 'hbingley1@plala.or.jp',
    firstName: 'Sheldon',
    lastName: 'Quigley',
    role: 'USER',
    image: 'https://i.pravatar.cc/150?u=2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    displayId: 3,
    username: 'rshawe2',
    email: 'rshawe2@51.la',
    firstName: 'Terrill',
    lastName: 'Hills',
    role: 'MODERATOR',
    image: 'https://i.pravatar.cc/150?u=3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Add 15 more generic users
for (let i = 4; i <= 20; i++) {
  MOCK_USERS_SEED.push({
    id: String(i),
    displayId: i,
    username: `user_${i}`,
    email: `user${i}@example.com`,
    firstName: `User`,
    lastName: `${i}`,
    role: i % 3 === 0 ? 'ADMIN' : i % 3 === 1 ? 'USER' : 'MODERATOR',
    image: `https://i.pravatar.cc/150?u=${i}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

const propertyAccessor = (obj: User, path: string) => {
  if (path === 'user') return (obj.firstName ?? obj.username).toLowerCase()
  const key = path as keyof User
  return obj[key]?.toString().toLowerCase() ?? ''
}

export const handlers = [
  // Mocking current API baseUrl
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const { role = 'USER' } = (await request.json()) as { role?: string }
    await delay(1000)

    return HttpResponse.json({
      id: '15',
      username: 'andriibutsvin',
      email: 'andreyseynew@gmail.com',
      firstName: 'Andrii',
      lastName: 'Butsvin',
      gender: 'male',
      role: role.toUpperCase(),
      image: `https://github.com/andreysey.png`,
      displayId: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Mock JWT
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
  }),

  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    const data = await request.json()
    await delay(1000)

    return HttpResponse.json({
      ...(data as object),
      id: String(Math.floor(Math.random() * 1000) + 100),
      role: ((data as { role?: string }).role || 'USER').toUpperCase(),
      createdAt: new Date().toISOString(),
    })
  }),

  http.post(`${BASE_URL}/auth/refresh`, async ({ request }) => {
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

  http.get(`${BASE_URL}/users`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (authHeader === 'Bearer mock-expired-token') {
      return new HttpResponse(null, { status: 401 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '1')
    const limit = parseInt(url.searchParams.get('limit') ?? '10')
    const skip = (page - 1) * limit

    // Process from static seed instead of fetching from external API
    const allUsers = MOCK_USERS_SEED.map((user) => {
      // Apply local updates if any
      if (updatedUsers.has(user.id)) {
        return { ...user, ...updatedUsers.get(user.id) }
      }
      return user
    }).filter((user) => !deletedUserIds.has(user.id))

    const query = url.searchParams.get('search')?.toLowerCase() ?? ''
    const sortBy = url.searchParams.get('sortBy')
    const sortOrder = url.searchParams.get('sortOrder') ?? 'asc'

    const filteredUsers = query
      ? allUsers.filter(
          (user: User) =>
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        )
      : allUsers

    // Sort in memory
    if (sortBy) {
      filteredUsers.sort((a: User, b: User) => {
        const fieldA = propertyAccessor(a, sortBy)
        const fieldB = propertyAccessor(b, sortBy)

        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    // Paginate in memory
    const paginatedUsers = filteredUsers.slice(skip, skip + limit)

    return HttpResponse.json({
      data: paginatedUsers,
      meta: {
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    })
  }),

  http.get(`${BASE_URL}/users/export`, async () => {
    await delay(1000)
    const allUsers = MOCK_USERS_SEED.map((user) => {
      if (updatedUsers.has(user.id)) {
        return { ...user, ...updatedUsers.get(user.id) }
      }
      return user
    }).filter((user) => !deletedUserIds.has(user.id))

    return HttpResponse.json(allUsers)
  }),

  http.get(`${BASE_URL}/users/:id`, async ({ params }) => {
    const { id } = params as { id: string }
    if (deletedUserIds.has(id)) {
      return new HttpResponse(null, { status: 404, statusText: 'User not found' })
    }

    const user = MOCK_USERS_SEED.find((u) => u.id === id)
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }

    // Apply local updates if any
    const finalUser = updatedUsers.has(id) ? { ...user, ...updatedUsers.get(id) } : user

    return HttpResponse.json(finalUser)
  }),

  http.get(`${BASE_URL}/users/me`, async () => {
    await delay(500)
    return HttpResponse.json({
      id: '15',
      username: 'andriibutsvin',
      email: 'andreyseynew@gmail.com',
      firstName: 'Andrii',
      lastName: 'Butsvin',
      gender: 'male',
      role: 'ADMIN',
      image: `https://github.com/andreysey.png`,
      displayId: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }),

  http.patch(`${BASE_URL}/users/:id`, async ({ params, request }) => {
    const { id } = params as { id: string }
    const updates = (await request.json()) as Partial<User>

    await delay(1000)

    // Store the update locally
    const existingUpdates = updatedUsers.get(id) ?? {}
    const newUpdates = { ...existingUpdates, ...updates }
    updatedUsers.set(id, newUpdates)

    const originalUser = MOCK_USERS_SEED.find((u) => u.id === id)
    if (!originalUser) return new HttpResponse(null, { status: 404 })

    const finalUser = {
      ...originalUser,
      ...newUpdates,
    }

    return HttpResponse.json(finalUser)
  }),

  http.patch(`${BASE_URL}/users/bulk-update`, async ({ request }) => {
    const { ids, role } = (await request.json()) as { ids: string[]; role: string }
    await delay(1000)

    ids.forEach((id) => {
      const existingUpdates = updatedUsers.get(id) ?? {}
      updatedUsers.set(id, { ...existingUpdates, role })
    })

    return HttpResponse.json({ success: true, count: ids.length })
  }),

  http.delete(`${BASE_URL}/users/:id`, async ({ params, request }) => {
    const url = new URL(request.url)
    if (url.searchParams.has('bypass')) return passthrough()

    const { id } = params as { id: string }
    const user = MOCK_USERS_SEED.find((u) => u.id === id)

    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }

    deletedUserIds.add(id)
    await delay(1000)

    // Return the full user object as the backend does, so the toast can show the name
    return HttpResponse.json({
      ...user,
      isDeleted: true,
      deletedOn: new Date().toISOString(),
    })
  }),

  // --- Analytics Dashboard ---

  http.get(`${BASE_URL}/analytics/stats`, async ({ request }) => {
    const url = new URL(request.url)
    if (url.searchParams.has('bypass')) return passthrough()

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

  http.get(`${BASE_URL}/analytics/activity`, async ({ request }) => {
    const url = new URL(request.url)
    if (url.searchParams.has('bypass')) return passthrough()

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
      {
        type: 'revenue',
        data: Array.from({ length: pointCount }).map((_, i) => ({
          timestamp: new Date(now.getTime() - (pointCount - 1 - i) * intervalMs).toISOString(),
          value: Math.floor(Math.random() * 5000) + 1000,
        })),
      },
    ]
    return HttpResponse.json(activity)
  }),

  http.get(`${BASE_URL}/analytics/recent`, async ({ request }) => {
    const url = new URL(request.url)
    if (url.searchParams.has('bypass')) return passthrough()

    const dateRange = url.searchParams.get('dateRange') ?? '7d'
    await delay(500)

    // More events for longer date ranges
    const eventCount = dateRange === '24h' ? 2 : dateRange === '7d' ? 5 : 10
    const eventTypes: RecentEvent['type'][] = [
      'user_signup',
      'system_alert',
      'payment_success',
      'user_delete',
      'user_login',
      'user_updated',
    ]
    const eventTitles: Record<RecentEvent['type'], string> = {
      user_signup: 'New User Registered',
      user_delete: 'User Account Deleted',
      system_alert: 'Server Load High',
      payment_success: 'Payment Received',
      user_login: 'User Logged In',
      user_updated: 'User Profile Updated',
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

  http.get(`${BASE_URL}/analytics/revenue`, async ({ request }) => {
    const url = new URL(request.url)
    if (url.searchParams.has('bypass')) return passthrough()

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

  http.get(`${BASE_URL}/activity-log`, async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') ?? '0')
    const take = parseInt(url.searchParams.get('take') ?? '50')

    await delay(800)

    const eventTypes = [
      'user_signup',
      'system_alert',
      'payment_success',
      'user_delete',
      'user_login',
      'user_updated',
    ] as const

    const eventTitles: Record<string, string> = {
      user_signup: 'New User Registered',
      user_delete: 'User Account Deleted',
      system_alert: 'Server Load High',
      payment_success: 'Payment Received',
      user_login: 'User Logged In',
      user_updated: 'User Profile Updated',
    }

    // Generate 100 historical events
    const allEvents = Array.from({ length: 100 }).map((_, i) => {
      const type = eventTypes[i % eventTypes.length]
      return {
        id: `log-${i + 1}`,
        type,
        title: eventTitles[type],
        description: `Detailed audit trail entry for event ${i + 1}. System automatically verified the transaction.`,
        timestamp: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(), // One event per hour
        userId: String((i % 20) + 1),
        metadata: {
          ip: `192.168.1.${i % 255}`,
          userAgent: 'Mozilla/5.0 (Mock Agent)',
        },
      }
    })

    const paginatedEvents = allEvents.slice(skip, skip + take)

    return HttpResponse.json({
      items: paginatedEvents,
      total: allEvents.length,
    })
  }),
]
