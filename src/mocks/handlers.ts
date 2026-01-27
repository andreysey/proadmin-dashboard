import type { User } from '@/entities/user/model/types'
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
  http.post('https://dummyjson.com/auth/login', async () => {
    // ... same as before
    await delay(1000)

    return HttpResponse.json({
      id: 15,
      username: 'andriibutsvin',
      email: 'andreyseynew@gmail.com',
      firstName: 'Andrii',
      lastName: 'Butsvin',
      gender: 'male',
      role: 'user',
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

    return HttpResponse.json({
      id: userId,
      ...updates,
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
