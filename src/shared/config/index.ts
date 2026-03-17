import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().min(1).default('https://dummyjson.com'),
  VITE_ENABLE_MOCKS: z
    .preprocess((val) => val === 'true' || val === true || val === '1', z.boolean())
    .default(false),
})

const env = envSchema.parse(import.meta.env)

export const config = {
  api: {
    baseUrl: env.VITE_API_URL,
    enableMocks: env.VITE_ENABLE_MOCKS,
  },
} as const

export * from './links'
