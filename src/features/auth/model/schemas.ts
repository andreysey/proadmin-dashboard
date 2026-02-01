import { z } from 'zod'
import { userRoleSchema } from '@/entities/user'

/**
 * Login response schema.
 * Validates the API response at the network boundary.
 *
 * Note: We support both 'token' (MSW mock) and 'accessToken' (real DummyJSON API)
 * to handle differences between development and production environments.
 */
export const loginResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.url(),
  // Real API returns 'accessToken', MSW mock returns 'token'
  accessToken: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string(),
  // Role is optional - real API doesn't return it
  role: userRoleSchema.optional(),
})

export type LoginResponse = z.infer<typeof loginResponseSchema>

/**
 * Login form input schema.
 * Used for form validation with react-hook-form.
 */
export const createLoginFormSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(1, t('validation.required')),
    password: z.string().min(1, t('validation.required')),
    role: z.string().optional(),
  })

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>
