import { api } from '@/shared/api'
import { tokenStorage } from '@/shared/lib/auth'
import { loginResponseSchema, type LoginFormValues, type LoginResponse } from '../model/schemas'
import type { User } from '@/entities/user'

/**
 * Authenticate user with username and password.
 *
 * This function handles the entire login flow:
 * 1. Sends credentials to API
 * 2. Validates response with Zod schema (network boundary)
 * 3. Stores tokens in tokenStorage
 * 4. Returns User object for state management
 *
 * @throws ZodError if API response doesn't match expected schema
 * @throws AxiosError if authentication fails
 */
export const login = async (credentials: LoginFormValues): Promise<User> => {
  const response = await api.post('/auth/login', credentials)

  // Validate API response at network boundary
  const validated: LoginResponse = loginResponseSchema.parse(response.data)

  // Real DummyJSON uses 'accessToken', MSW mock uses 'token'
  const authToken = validated.accessToken ?? validated.token

  if (!authToken) {
    throw new Error('No authentication token received')
  }

  // Store tokens for future API requests
  tokenStorage.setTokens({
    accessToken: authToken,
    refreshToken: validated.refreshToken,
  })

  // Return User object with role fallback (real API doesn't return role)
  return {
    id: validated.id,
    username: validated.username,
    email: validated.email,
    firstName: validated.firstName,
    lastName: validated.lastName,
    image: validated.image,
    role: validated.role ?? 'user',
  }
}
