import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url(),
})

const env = envSchema.parse(import.meta.env)

export const config = {
  api: {
    baseUrl: env.VITE_API_URL,
  },
} as const
