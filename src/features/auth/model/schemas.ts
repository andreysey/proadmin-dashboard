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
  id: z.union([z.string(), z.number()]).optional(),
  username: z.string().optional(),
  email: z.email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().optional().nullable(),
  // Support various token field names
  accessToken: z.string().optional(),
  access_token: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  refresh_token: z.string().optional(),
  role: userRoleSchema.optional(),
})

export type LoginResponse = z.infer<typeof loginResponseSchema>

const authBaseSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    username: z.string().min(1, t('validation.required')),
    password: z.string().min(1, t('validation.required')),
    role: z.string().optional(),
    email: z.string().optional(),
  })

/**
 * Login form schema.
 */
export const createLoginFormSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) => authBaseSchema(t)

/**
 * Registration form schema.
 */
export const createRegisterSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  authBaseSchema(t).extend({
    username: z.string().min(3, t('validation.username_min')),
    email: z.email(t('validation.email')),
    password: z.string().min(6, t('validation.min_length', { count: 6 })),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })

/**
 * Registration response schema.
 */
export const registerResponseSchema = z.object({
  id: z.string().or(z.number()),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  accessToken: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  role: userRoleSchema.optional(),
})

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>
export type RegisterResponse = z.infer<typeof registerResponseSchema>
export type AuthFormValues = RegisterFormValues
