import type { User } from '@/entities/user/model/types'
import { http, HttpResponse, delay, passthrough } from 'msw'

export const handlers = [
  // Mocking DummyJSON login endpoint
  http.post('https://dummyjson.com/auth/login', async () => {
    // Simulate network delay for realism
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
    if (url.searchParams.get('limit') === '0') {
      return passthrough()
    }

    const response = await fetch('https://dummyjson.com/users?limit=0')

    const data = await response.json()

    const users = data.users.map((user: User) => ({
      ...user,
      role: user.id % 2 === 1 ? 'admin' : 'user',
    }))

    return HttpResponse.json({
      ...data,
      users,
    })
  }),
]
