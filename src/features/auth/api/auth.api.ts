import { api } from '@/shared/api'
import { tokenStorage } from '@/shared/lib/auth'
import {
  loginResponseSchema,
  registerResponseSchema,
  type LoginFormValues,
  type LoginResponse,
  type RegisterFormValues,
} from '../model/schemas'
import { type User, ROLES } from '@/entities/user'

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
export const register = async (data: RegisterFormValues): Promise<User> => {
  const response = await api.post('/auth/register', data)

  // Validate and normalize response
  const validated = registerResponseSchema.parse(response.data)

  const authToken = validated.accessToken || validated.token
  const refreshToken = validated.refreshToken || ''

  if (authToken) {
    tokenStorage.setTokens({
      accessToken: authToken,
      refreshToken: refreshToken,
    })
  }

  // Return User object with role fallback/normalization
  return {
    id: String(validated.id ?? ''),
    username: validated.username,
    firstName: validated.firstName || '',
    lastName: validated.lastName || '',
    email: validated.email,
    image: '',
    role: validated.role ?? ROLES.USER,
  }
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
    role: validated.role ?? ROLES.USER,
  }
}
