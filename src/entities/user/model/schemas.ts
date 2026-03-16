import { z } from 'zod'

/**
 * Available user roles in the system.
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MODERATOR: 'MODERATOR',
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]
export const ROLE_VALUES = Object.values(ROLES)

export const userRoleSchema = z.preprocess(
  (val) => (typeof val === 'string' ? val.toUpperCase() : val),
  z.enum(ROLE_VALUES as [string, ...string[]])
)

/**
 * User entity schema.
 * This is the "source of truth" - TypeScript type is derived from this schema.
 *
 * Benefits of this approach:
 * 1. Schema and type are always in sync
 * 2. Runtime validation catches API contract changes
 * 3. Detailed error messages when validation fails
 */
export const userSchema = z.object({
  id: z.string(),
  displayId: z.number(),
  username: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().email(),
  role: userRoleSchema,
  image: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Type is inferred from schema - no manual interface needed!
export type User = z.infer<typeof userSchema>

/**
 * Paginated users response schema.
 * Validates the entire API response structure.
 */
export const usersResponseSchema = z.object({
  data: z.array(userSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
})

export type UsersResponse = z.infer<typeof usersResponseSchema>
