import { z } from 'zod'

/**
 * Available user roles in the system.
 * Zod enum provides both runtime validation and type inference.
 */
export const ROLES = ['admin', 'user', 'moderator'] as const
export const userRoleSchema = z.enum(ROLES)
export type UserRole = z.infer<typeof userRoleSchema>

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
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  role: userRoleSchema,
  image: z.url(),
})

// Type is inferred from schema - no manual interface needed!
export type User = z.infer<typeof userSchema>

/**
 * Paginated users response schema.
 * Validates the entire API response structure.
 */
export const usersResponseSchema = z.object({
  users: z.array(userSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export type UsersResponse = z.infer<typeof usersResponseSchema>
