import type { User } from '@/entities/user/model/types'
import { http, HttpResponse, delay, passthrough } from 'msw'

const deletedUserIds = new Set<number>()

export const handlers = [
  // Mocking DummyJSON login endpoint
  http.post('https://dummyjson.com/auth/login', async () => {
    // ... same as before
    await delay(1000)

    return HttpResponse.json({
      id: 15,
      username: 'kminchelle',
      email: 'kminchelle@qq.com',
      firstName: 'Jeanne',
      lastName: 'Halvorson',
      gender: 'female',
      image: 'https://dummyjson.com/icon/kminchelle/128',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Mock JWT
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
  }),

  http.get('https://dummyjson.com/users', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') ?? '0')
    const limit = parseInt(url.searchParams.get('limit') ?? '10')

    if (url.searchParams.get('limit') === '0') {
      return passthrough()
    }

    const response = await fetch('https://dummyjson.com/users?limit=0')
    const data = await response.json()

    // Enhance and then filter out deleted ones
    const allUsers = data.users
      .map((user: User) => ({
        ...user,
        role: user.id % 2 === 1 ? 'admin' : 'user',
      }))
      .filter((user: User) => !deletedUserIds.has(user.id))

    // Filter by query (q) - using already filtered user list
    const query = url.searchParams.get('q')?.toLowerCase() ?? ''
    const filteredUsers = query
      ? allUsers.filter(
          (user: User) =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        )
      : allUsers

    // Paginate in memory
    const paginatedUsers = filteredUsers.slice(skip, skip + limit)

    return HttpResponse.json({
      users: paginatedUsers,
      total: filteredUsers.length,
      skip,
      limit,
    })
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
]
