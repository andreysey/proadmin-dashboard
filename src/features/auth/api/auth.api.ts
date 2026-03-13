import { api } from '@/shared/api'
import { tokenStorage } from '@/shared/lib/auth'
import { loginResponseSchema, type LoginFormValues, type LoginResponse } from '../model/schemas'
import type { User } from '@/entities/user'

/**
 * Get current user profile.
 */
export const getMe = async (): Promise<User> => {
  const response = await api.get('/users/me')
  return response.data
}

/**
 * Register a new user.
 */
export const register = async (data: unknown): Promise<User> => {
  const response = await api.post('/auth/register', data)
  // Support both snake_case and camelCase tokens
  const { user, access_token, accessToken, token, refresh_token, refreshToken } = response.data

  const authToken = accessToken || access_token || token
  const nextRefreshToken = refreshToken || refresh_token || ''

  if (authToken) {
    tokenStorage.setTokens({
      accessToken: authToken,
      refreshToken: nextRefreshToken,
    })
  }

  // If backend returns the user object directly, use it
  if (user) return user

  // Otherwise, we might need to fetch the profile using the new token
  return await getMe()
}

/**
 * Authenticate user with username and password.
 */
export const login = async (credentials: LoginFormValues): Promise<User> => {
  // Strip extra fields like 'role' and 'email' if your backend 400s on unexpected properties
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { role, email, ...payload } = credentials
  const response = await api.post('/auth/login', payload)

  // Validate API response at network boundary
  const validated: LoginResponse = loginResponseSchema.parse(response.data)

  // NestJS/DummyJSON token fallback
  const authToken = validated.accessToken || validated.access_token || validated.token
  const refreshToken = validated.refreshToken || validated.refresh_token || ''

  if (!authToken) {
    throw new Error('No authentication token received')
  }

  // Store tokens for future API requests
  tokenStorage.setTokens({
    accessToken: authToken,
    refreshToken: refreshToken,
  })

  // If the login response doesn't include user details, fetch them separately
  if (!validated.username || !validated.email) {
    return await getMe()
  }

  // Return User object with role fallback
  return {
    id: String(validated.id ?? ''),
    username: validated.username,
    firstName: validated.firstName || '',
    lastName: validated.lastName || '',
    email: validated.email,
    image: validated.image || '',
    role: validated.role ?? 'user',
  }
}
